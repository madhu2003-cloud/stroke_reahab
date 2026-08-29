from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Patient, Doctor, Parent
from services.analytics import (
    get_daily_progress, get_weekly_progress, get_game_performance,
    get_overall_stats, get_weekly_improvement, get_recent_activity
)
from services.streak import get_streak

dashboard_bp = Blueprint('dashboard', __name__)


def _get_patient_dashboard_data(patient_id):
    """Build dashboard data for a given patient."""
    today_prog = get_daily_progress(patient_id)
    streak_data = get_streak(patient_id)
    weekly = get_weekly_progress(patient_id)
    recent = get_recent_activity(patient_id, limit=10)
    stats = get_overall_stats(patient_id)
    improvement = get_weekly_improvement(patient_id)
    performance = get_game_performance(patient_id)

    return {
        'today_progress': today_prog,
        'streak': streak_data,
        'weekly_progress': weekly,
        'recent_activity': recent,
        'total_sessions': stats['total_sessions'],
        'avg_score': stats['avg_score'],
        'avg_accuracy': stats['avg_accuracy'],
        'total_time': stats['total_time'],
        'best_score': stats['best_score'],
        'weekly_improvement': improvement,
        'game_performance': performance,
    }


@dashboard_bp.route('/patient', methods=['GET'])
@jwt_required()
def patient_dashboard():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'patient':
            return jsonify({'error': 'Unauthorized'}), 403

        patient = user.patient
        if not patient:
            return jsonify({'error': 'Patient profile not found'}), 404

        data = _get_patient_dashboard_data(patient.id)
        data['user'] = {'name': user.name, 'email': user.email}
        return jsonify(data), 200

    except Exception as e:
        return jsonify({'error': 'Failed to load dashboard'}), 500


@dashboard_bp.route('/parent', methods=['GET'])
@jwt_required()
def parent_dashboard():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'parent':
            return jsonify({'error': 'Unauthorized'}), 403

        parent_obj = user.parent
        if not parent_obj or not parent_obj.patient_id:
            return jsonify({
                'error': None,
                'message': 'No patient linked yet',
                'patient': None,
            }), 200

        patient = Patient.query.get(parent_obj.patient_id)
        if not patient:
            return jsonify({'error': 'Linked patient not found'}), 404

        data = _get_patient_dashboard_data(patient.id)
        data['patient'] = {
            'id': patient.id,
            'name': patient.user.name,
            'email': patient.user.email,
            'age': patient.age,
            'gender': patient.gender,
        }
        return jsonify(data), 200

    except Exception as e:
        return jsonify({'error': 'Failed to load dashboard'}), 500


@dashboard_bp.route('/doctor', methods=['GET'])
@jwt_required()
def doctor_dashboard():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'doctor':
            return jsonify({'error': 'Unauthorized'}), 403

        doctor = user.doctor
        if not doctor:
            return jsonify({'error': 'Doctor profile not found'}), 404

        patients_data = []
        active_count = 0
        needs_attention = 0
        total_progress = 0

        for p in doctor.patients:
            streak_data = get_streak(p.id)
            stats = get_overall_stats(p.id)
            improvement = get_weekly_improvement(p.id)
            recent = get_recent_activity(p.id, limit=1)
            last_activity = recent[0]['date'] if recent else None

            from datetime import date, timedelta
            is_active = False
            need_attn = False
            if last_activity:
                from datetime import datetime
                last_date = datetime.fromisoformat(recent[0]['created_at']).date() if recent else None
                if last_date:
                    days_since = (date.today() - last_date).days
                    is_active = days_since <= 7
                    need_attn = days_since > 7

            if is_active:
                active_count += 1
            if need_attn:
                needs_attention += 1
            total_progress += stats['avg_score']

            patients_data.append({
                'id': p.id,
                'name': p.user.name,
                'email': p.user.email,
                'current_streak': streak_data['current_streak'],
                'latest_score': recent[0]['score'] if recent else 0,
                'weekly_improvement': improvement,
                'last_activity': last_activity,
                'total_sessions': stats['total_sessions'],
                'avg_score': stats['avg_score'],
            })

        avg_progress = round(total_progress / len(doctor.patients), 1) if doctor.patients else 0

        return jsonify({
            'total_patients': len(doctor.patients),
            'active_patients': active_count,
            'needs_attention': needs_attention,
            'avg_progress': avg_progress,
            'patients': patients_data,
        }), 200

    except Exception as e:
        return jsonify({'error': 'Failed to load dashboard'}), 500
