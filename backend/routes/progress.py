from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User
from services.streak import get_streak, get_activity_calendar
from services.analytics import get_weekly_progress, get_monthly_progress

progress_bp = Blueprint('progress', __name__)


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
