from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Patient
from services.streak import get_streak, get_activity_calendar
from services.analytics import get_weekly_progress, get_monthly_progress, get_clinical_report_summary

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('/clinical-report', methods=['GET'])
@jwt_required()
def clinical_report():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        patient_id = None
        if user.role == 'patient' and user.patient:
            patient_id = user.patient.id
        elif user.role == 'parent' and user.parent:
            patient_id = request.args.get('patient_id', type=int) or user.parent.patient_id
        elif user.role == 'doctor' and user.doctor:
            patient_id = request.args.get('patient_id', type=int)
            if not patient_id and user.doctor.patients:
                patient_id = user.doctor.patients[0].id

        if not patient_id:
            return jsonify({'error': 'No patient profile identified'}), 400

        target_patient = Patient.query.get(patient_id)
        if not target_patient:
            return jsonify({'error': 'Patient not found'}), 404

        streak_data = get_streak(patient_id)
        report_data = get_clinical_report_summary(patient_id)

        if not report_data:
            return jsonify({'error': 'Failed to compile clinical report'}), 500

        return jsonify({
            'patient': {
                'id': target_patient.id,
                'name': target_patient.user.name,
                'email': target_patient.user.email,
                'age': target_patient.age,
                'gender': target_patient.gender,
                'emergency_contact': target_patient.emergency_contact,
                'member_since': target_patient.user.created_at.strftime('%B %Y') if target_patient.user.created_at else 'Recent'
            },
            'streak': streak_data,
            'report': report_data
        }), 200

    except Exception as e:
        return jsonify({'error': f'Failed to generate clinical report: {str(e)}'}), 500


@progress_bp.route('/streak', methods=['GET'])
@jwt_required()
def streak():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.patient:
            return jsonify({'error': 'Patient profile required'}), 403

        data = get_streak(user.patient.id)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch streak'}), 500


@progress_bp.route('/weekly', methods=['GET'])
@jwt_required()
def weekly():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.patient:
            return jsonify({'error': 'Patient profile required'}), 403

        data = get_weekly_progress(user.patient.id)
        return jsonify({'weekly': data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch weekly progress'}), 500


@progress_bp.route('/monthly', methods=['GET'])
@jwt_required()
def monthly():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.patient:
            return jsonify({'error': 'Patient profile required'}), 403

        data = get_monthly_progress(user.patient.id)
        return jsonify({'monthly': data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch monthly progress'}), 500


@progress_bp.route('/activity-calendar', methods=['GET'])
@jwt_required()
def activity_calendar():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.patient:
            return jsonify({'error': 'Patient profile required'}), 403

        days = int(request.args.get('days', 30))
        data = get_activity_calendar(user.patient.id, days)
        return jsonify({'calendar': data}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to fetch activity calendar'}), 500

