import re
import socket
from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from models import db, User, Patient, Doctor, Parent, Streak

try:
    import dns.resolver
    HAS_DNS = True
except ImportError:
    HAS_DNS = False

auth_bp = Blueprint('auth', __name__)

EMAIL_RE = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
PHONE_RE = re.compile(r'^\+?[1-9]\d{9,14}$')


def verify_real_email_domain(email: str):
    """
    Verifies that the email has a valid structure and that the 
    domain actually exists on the internet with active DNS/MX records.
    """
    if not email or not EMAIL_RE.match(email):
        return False, "Invalid email format. Please provide a valid email address (e.g. name@gmail.com)."

    domain = email.split('@')[-1].strip().lower()
    
    # Check if domain has basic valid format
    if '.' not in domain or len(domain.split('.')[-1]) < 2:
        return False, f"The domain '@{domain}' is invalid."

    # Verify domain exists via DNS MX or A record resolution
    if HAS_DNS:
        try:
            # First try MX records
            dns.resolver.resolve(domain, 'MX', lifetime=3.0)
            return True, None
        except (dns.resolver.NoAnswer, dns.resolver.NXDOMAIN):
            # Fallback check for A record if MX is absent
            try:
                dns.resolver.resolve(domain, 'A', lifetime=3.0)
                return True, None
            except Exception:
                return False, f"The email domain '@{domain}' does not exist on the internet."
        except Exception:
            # Fallback to standard socket resolution on DNS timeout/network limit
            pass

    try:
        socket.gethostbyname(domain)
        return True, None
    except socket.gaierror:
        return False, f"The email domain '@{domain}' does not exist or cannot receive mail."
    except Exception:
        return True, None


def verify_phone_format(phone: str):
    """
    Validates phone numbers (10 to 15 digits, optional leading +).
    """
    cleaned = re.sub(r'[\s\-\(\)]', '', phone)
    if not PHONE_RE.match(cleaned):
        return False, "Invalid phone number. Please enter a valid 10-15 digit phone number (e.g. +1234567890 or 9876543210)."
    return True, None


@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        role = data.get('role', '').lower()
        if role not in ('patient', 'parent', 'doctor'):
            return jsonify({'error': 'Invalid role. Must be patient, parent, or doctor'}), 400

        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        phone = data.get('phone', '').strip()

        if not name:
            return jsonify({'error': 'Full name is required'}), 400

        # Verify that the email actually exists and is not fake
        is_valid_email, email_err = verify_real_email_domain(email)
        if not is_valid_email:
            return jsonify({'error': email_err}), 400

        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        # If phone number is provided, verify its format
        if phone:
            is_valid_phone, phone_err = verify_phone_format(phone)
            if not is_valid_phone:
                return jsonify({'error': phone_err}), 400

        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'An account with this email already exists'}), 409

        if phone:
            existing_phone = User.query.filter_by(phone=phone).first()
            if existing_phone:
                return jsonify({'error': 'An account with this phone number already exists'}), 409

        pw_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(name=name, email=email, password_hash=pw_hash, role=role, phone=phone)
        db.session.add(user)
        db.session.flush()

        if role == 'patient':
            age = data.get('age')
            gender = data.get('gender', '').strip()
            emergency_contact = data.get('emergency_contact', '').strip()
            patient = Patient(user_id=user.id, age=age, gender=gender, emergency_contact=emergency_contact)
            db.session.add(patient)
            db.session.flush()
            streak = Streak(patient_id=patient.id, current_streak=0, longest_streak=0)
            db.session.add(streak)

        elif role == 'doctor':
            specialization = data.get('specialization', '').strip()
            reg_number = data.get('registration_number', '').strip()
            hospital = data.get('hospital', '').strip()
            if not reg_number:
                return jsonify({'error': 'Medical registration number is required'}), 400
            dup = Doctor.query.filter_by(registration_number=reg_number).first()
            if dup:
                return jsonify({'error': 'Registration number already exists'}), 409
            doctor = Doctor(user_id=user.id, specialization=specialization,
                            registration_number=reg_number, hospital=hospital)
            db.session.add(doctor)

        elif role == 'parent':
            patient_code = data.get('patient_code', '').strip().lower()
            parent_obj = Parent(user_id=user.id, patient_id=None)
            if patient_code:
                pat_user = User.query.filter_by(email=patient_code, role='patient').first()
                if pat_user and pat_user.patient:
                    parent_obj.patient_id = pat_user.patient.id
                else:
                    db.session.rollback()
                    return jsonify({'error': 'No patient found with that email'}), 404
            db.session.add(parent_obj)

        db.session.commit()

        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
        return jsonify({
            'message': 'Registration successful',
            'token': token,
            'user': user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Registration failed. Please try again.'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        # Can be email or phone number
        identifier = data.get('email', '').strip() or data.get('identifier', '').strip()
        password = data.get('password', '')

        if not identifier or not password:
            return jsonify({'error': 'Email / Phone number and password are required'}), 400

        user = None
        # If user entered an email address
        if '@' in identifier:
            email = identifier.lower()
            # Verify that the email is syntactically valid & domain exists
            is_valid, domain_err = verify_real_email_domain(email)
            if not is_valid:
                return jsonify({'error': domain_err or 'This email address does not exist.'}), 400

            user = User.query.filter_by(email=email).first()
            if not user:
                return jsonify({'error': f'No registered account found for email "{email}". Please check your email or register.'}), 404

        # If user entered a phone number
        else:
            phone_cleaned = re.sub(r'[\s\-\(\)]', '', identifier)
            is_valid_phone, phone_err = verify_phone_format(phone_cleaned)
            if not is_valid_phone:
                return jsonify({'error': phone_err}), 400

            user = User.query.filter(
                (User.phone == phone_cleaned) | (User.phone == identifier)
            ).first()
            if not user:
                return jsonify({'error': f'No registered account found for phone number "{identifier}". Please register first.'}), 404

        # Verify Password
        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Incorrect password. Please try again.'}), 401

        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': 'Login failed. Please try again.'}), 500


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch user info'}), 500

