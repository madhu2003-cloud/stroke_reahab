import re
from datetime import timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import bcrypt
from models import db, User, Patient, Doctor, Parent, Streak

auth_bp = Blueprint('auth', __name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


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
        if not email or not EMAIL_RE.match(email):
            return jsonify({'error': 'Valid email is required'}), 400
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400

        existing = User.query.filter_by(email=email).first()
        if existing:
            return jsonify({'error': 'An account with this email already exists'}), 409

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

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401

        if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
            return jsonify({'error': 'Invalid email or password'}), 401

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
