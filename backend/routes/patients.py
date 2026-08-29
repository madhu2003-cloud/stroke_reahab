from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Patient, Doctor, ExerciseResult
from services.analytics import (
    get_daily_progress, get_weekly_progress, get_monthly_progress,
    get_game_performance, get_overall_stats, get_weekly_improvement,
    get_recent_activity
)
from services.streak import get_streak, get_activity_calendar

patients_bp = Blueprint('patients', __name__)


@patients_bp.route('', methods=['GET'])
@jwt_required()
def list_patients():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'doctor':
            return jsonify({'error': 'Unauthorized'}), 403

        doctor = user.doctor
        if not doctor:
            return jsonify({'error': 'Doctor profile not found'}), 404

        patients_data = []
        for p in doctor.patients:
            streak_data = get_streak(p.id)
            stats = get_overall_stats(p.id)
            recent = get_recent_activity(p.id, limit=1)
            patients_data.append({
                'id': p.id,
                'name': p.user.name,
                'email': p.user.email,
                'age': p.age,
                'gender': p.gender,
                'current_streak': streak_data['current_streak'],
                'latest_score': recent[0]['score'] if recent else 0,
                'total_sessions': stats['total_sessions'],
                'avg_score': stats['avg_score'],
                'last_activity': recent[0]['date'] if recent else None,
            })

        return jsonify({'patients': patients_data}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch patients'}), 500


@patients_bp.route('/<int:patient_id>', methods=['GET'])
@jwt_required()
def patient_detail(patient_id):
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role not in ('doctor', 'parent'):
            return jsonify({'error': 'Unauthorized'}), 403

        patient = Patient.query.get(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404

        if user.role == 'doctor':
            doctor = user.doctor
            if patient not in doctor.patients:
                return jsonify({'error': 'Patient not assigned to you'}), 403
        elif user.role == 'parent':
            parent_obj = user.parent
            if not parent_obj or parent_obj.patient_id != patient_id:
                return jsonify({'error': 'Not your linked patient'}), 403

        streak_data = get_streak(patient_id)
        stats = get_overall_stats(patient_id)
        weekly = get_weekly_progress(patient_id)
        monthly = get_monthly_progress(patient_id)
        performance = get_game_performance(patient_id)
        improvement = get_weekly_improvement(patient_id)
        recent = get_recent_activity(patient_id, limit=20)
        calendar = get_activity_calendar(patient_id)

        return jsonify({
            'patient': {
                'id': patient.id,
                'name': patient.user.name,
                'email': patient.user.email,
                'age': patient.age,
                'gender': patient.gender,
                'created_at': patient.user.created_at.isoformat() if patient.user.created_at else None,
            },
            'streak': streak_data,
            'stats': stats,
            'weekly_progress': weekly,
            'monthly_progress': monthly,
            'game_performance': performance,
            'weekly_improvement': improvement,
            'recent_activity': recent,
            'activity_calendar': calendar,
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch patient details'}), 500


@patients_bp.route('/<int:patient_id>/progress', methods=['GET'])
@jwt_required()
def patient_progress(patient_id):
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role not in ('doctor', 'parent'):
            return jsonify({'error': 'Unauthorized'}), 403

        weekly = get_weekly_progress(patient_id)
        monthly = get_monthly_progress(patient_id)
        performance = get_game_performance(patient_id)

        return jsonify({
            'weekly': weekly,
            'monthly': monthly,
            'performance': performance,
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch progress'}), 500


@patients_bp.route('/<int:patient_id>/history', methods=['GET'])
@jwt_required()
def patient_history(patient_id):
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role not in ('doctor', 'parent'):
            return jsonify({'error': 'Unauthorized'}), 403

        results = ExerciseResult.query.filter_by(patient_id=patient_id).order_by(
            ExerciseResult.created_at.desc()
        ).limit(100).all()

        return jsonify({'history': [r.to_dict() for r in results]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch history'}), 500


@patients_bp.route('/assign', methods=['POST'])
@jwt_required()
def assign_patient():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'doctor':
            return jsonify({'error': 'Only doctors can assign patients'}), 403

        doctor = user.doctor
        data = request.get_json()
        patient_email = data.get('patient_email', '').strip().lower()

        if not patient_email:
            return jsonify({'error': 'Patient email is required'}), 400

        pat_user = User.query.filter_by(email=patient_email, role='patient').first()
        if not pat_user or not pat_user.patient:
            return jsonify({'error': 'No patient found with that email'}), 404

        patient = pat_user.patient
        if patient in doctor.patients:
            return jsonify({'error': 'Patient is already assigned to you'}), 409

        doctor.patients.append(patient)
        db.session.commit()

        return jsonify({'message': f'Patient {pat_user.name} assigned successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to assign patient'}), 500
