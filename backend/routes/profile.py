from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'profile': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch profile'}), 500


@profile_bp.route('', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        if 'name' in data and data['name'].strip():
            user.name = data['name'].strip()
        if 'phone' in data:
            user.phone = data['phone'].strip()

        if user.role == 'patient' and user.patient:
            if 'age' in data:
                user.patient.age = int(data['age'])
            if 'gender' in data:
                user.patient.gender = data['gender'].strip()
            if 'emergency_contact' in data:
                user.patient.emergency_contact = data['emergency_contact'].strip()
        elif user.role == 'doctor' and user.doctor:
            if 'specialization' in data:
                user.doctor.specialization = data['specialization'].strip()
            if 'hospital' in data:
                user.doctor.hospital = data['hospital'].strip()

        db.session.commit()
        return jsonify({'message': 'Profile updated', 'profile': user.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500
