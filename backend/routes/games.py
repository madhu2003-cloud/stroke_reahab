from datetime import date, timedelta
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func
from models import db, User, ExerciseResult
from services.streak import update_streak
from services.analytics import get_game_performance

games_bp = Blueprint('games', __name__)

VALID_GAME_TYPES = [
    'piano_tap', 'knob_turn', 'pegboard_pinch', 'shelf_reach', 'window_wipe', 'facial_mirror',
    'target_touch', 'object_catch', 'path_following', 'bubble_pop', 'number_show', 'thumb_touch'
]


@games_bp.route('/result', methods=['POST'])
@jwt_required()
def save_result():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or user.role != 'patient' or not user.patient:
            return jsonify({'error': 'Only patients can save game results'}), 403

        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body is required'}), 400

        game_type = data.get('game_type', '').strip()
        if game_type not in VALID_GAME_TYPES:
            return jsonify({'error': f'Invalid game type. Must be one of: {", ".join(VALID_GAME_TYPES)}'}), 400

        result = ExerciseResult(
            patient_id=user.patient.id,
            game_type=game_type,
            score=int(data.get('score', 0)),
            accuracy=float(data.get('accuracy', 0)),
            repetitions=int(data.get('repetitions', 0)),
            reaction_time=float(data.get('reaction_time')) if data.get('reaction_time') is not None else None,
            duration=int(data.get('duration', 0)),
            smoothness=float(data.get('smoothness')) if data.get('smoothness') is not None else None,
        )
        db.session.add(result)
        db.session.commit()

        update_streak(user.patient.id)

        return jsonify({
            'message': 'Result saved successfully',
            'result': result.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to save game result'}), 500


@games_bp.route('/history', methods=['GET'])
@jwt_required()
def game_history():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.patient:
            return jsonify({'error': 'Patient profile required'}), 403

        period = request.args.get('period', 'all')
        game_type = request.args.get('game_type', None)

        query = ExerciseResult.query.filter_by(patient_id=user.patient.id)

        today = date.today()
        if period == 'today':
            query = query.filter(func.date(ExerciseResult.created_at) == today)
        elif period == 'week':
            week_start = today - timedelta(days=6)
            query = query.filter(func.date(ExerciseResult.created_at) >= week_start)
        elif period == 'month':
            month_start = today - timedelta(days=29)
            query = query.filter(func.date(ExerciseResult.created_at) >= month_start)

        if game_type and game_type in VALID_GAME_TYPES:
            query = query.filter_by(game_type=game_type)

        results = query.order_by(ExerciseResult.created_at.desc()).limit(100).all()
        return jsonify({'history': [r.to_dict() for r in results]}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch history'}), 500


@games_bp.route('/performance', methods=['GET'])
@jwt_required()
def game_performance():
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user or not user.patient:
            return jsonify({'error': 'Patient profile required'}), 403

        perf = get_game_performance(user.patient.id)
        return jsonify({'performance': perf}), 200

    except Exception as e:
        return jsonify({'error': 'Failed to fetch performance data'}), 500
