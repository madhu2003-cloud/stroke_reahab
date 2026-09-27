from datetime import date, datetime, timedelta, timezone
from sqlalchemy import func
from models import db, ExerciseResult


def get_daily_progress(patient_id, target_date=None):
    """Get progress for a specific day."""
    if target_date is None:
        target_date = date.today()

    results = ExerciseResult.query.filter(
        ExerciseResult.patient_id == patient_id,
        func.date(ExerciseResult.created_at) == target_date
    ).all()

    if not results:
        return {
            'completed': 0,
            'total': 3,
            'percentage': 0,
            'exercise_time': 0,
            'best_score': 0,
            'avg_score': 0,
        }

    game_types_done = set(r.game_type for r in results)
    scores = [r.score for r in results]
    total_time = sum(r.duration for r in results)

    return {
        'completed': len(game_types_done),
        'total': 3,
        'percentage': round(len(game_types_done) / 3 * 100, 1),
        'exercise_time': total_time,
        'best_score': max(scores) if scores else 0,
        'avg_score': round(sum(scores) / len(scores), 1) if scores else 0,
    }


def get_weekly_progress(patient_id):
    """Get last 7 days of aggregated progress data."""
    today = date.today()
    days = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        results = ExerciseResult.query.filter(
            ExerciseResult.patient_id == patient_id,
            func.date(ExerciseResult.created_at) == d
        ).all()

        if results:
            scores = [r.score for r in results]
            accuracies = [r.accuracy for r in results if r.accuracy]
            game_types = set(r.game_type for r in results)
            days.append({
                'date': d.isoformat(),
                'score': round(sum(scores) / len(scores), 1),
                'accuracy': round(sum(accuracies) / len(accuracies), 1) if accuracies else 0,
                'completion': round(len(game_types) / 3 * 100, 1),
                'sessions': len(results),
            })
        else:
            days.append({
                'date': d.isoformat(),
                'score': 0,
                'accuracy': 0,
                'completion': 0,
                'sessions': 0,
            })
    return days


def get_monthly_progress(patient_id):
    """Get last 30 days of aggregated progress data."""
    today = date.today()
    days = []
    for i in range(29, -1, -1):
        d = today - timedelta(days=i)
        results = ExerciseResult.query.filter(
            ExerciseResult.patient_id == patient_id,
            func.date(ExerciseResult.created_at) == d
        ).all()

        if results:
            scores = [r.score for r in results]
            accuracies = [r.accuracy for r in results if r.accuracy]
            days.append({
                'date': d.isoformat(),
                'score': round(sum(scores) / len(scores), 1),
                'accuracy': round(sum(accuracies) / len(accuracies), 1) if accuracies else 0,
                'sessions': len(results),
            })
        else:
            days.append({
                'date': d.isoformat(),
                'score': 0,
                'accuracy': 0,
                'sessions': 0,
            })
    return days


def get_game_performance(patient_id):
    """Get per-game performance statistics."""
    game_types = [
        'piano_tap', 'knob_turn', 'pegboard_pinch', 'shelf_reach', 'window_wipe', 'facial_mirror',
        'target_touch', 'object_catch', 'path_following'
    ]
    perf = {}
    for gt in game_types:
        results = ExerciseResult.query.filter_by(patient_id=patient_id, game_type=gt).all()
        if results:
            scores = [r.score for r in results]
            accuracies = [r.accuracy for r in results if r.accuracy]
            perf[gt] = {
                'avg_score': round(sum(scores) / len(scores), 1),
                'avg_accuracy': round(sum(accuracies) / len(accuracies), 1) if accuracies else 0,
                'total_sessions': len(results),
                'best_score': max(scores),
            }
        else:
            perf[gt] = {
                'avg_score': 0,
                'avg_accuracy': 0,
                'total_sessions': 0,
                'best_score': 0,
            }
    return perf


def get_overall_stats(patient_id):
    """Get overall patient statistics."""
    results = ExerciseResult.query.filter_by(patient_id=patient_id).all()
    if not results:
        return {
            'total_sessions': 0,
            'avg_score': 0,
            'avg_accuracy': 0,
            'total_time': 0,
            'best_score': 0,
        }

    scores = [r.score for r in results]
    accuracies = [r.accuracy for r in results if r.accuracy]
    total_time = sum(r.duration for r in results)

    return {
        'total_sessions': len(results),
        'avg_score': round(sum(scores) / len(scores), 1) if scores else 0,
        'avg_accuracy': round(sum(accuracies) / len(accuracies), 1) if accuracies else 0,
        'total_time': total_time,
        'best_score': max(scores) if scores else 0,
    }


def get_weekly_improvement(patient_id):
    """Compare this week's average score to last week's."""
    today = date.today()
    this_week_start = today - timedelta(days=6)
    last_week_start = this_week_start - timedelta(days=7)
    last_week_end = this_week_start - timedelta(days=1)

    this_week = ExerciseResult.query.filter(
        ExerciseResult.patient_id == patient_id,
        func.date(ExerciseResult.created_at) >= this_week_start,
        func.date(ExerciseResult.created_at) <= today
    ).all()

    last_week = ExerciseResult.query.filter(
        ExerciseResult.patient_id == patient_id,
        func.date(ExerciseResult.created_at) >= last_week_start,
        func.date(ExerciseResult.created_at) <= last_week_end
    ).all()

    this_avg = sum(r.score for r in this_week) / len(this_week) if this_week else 0
    last_avg = sum(r.score for r in last_week) / len(last_week) if last_week else 0

    if last_avg == 0:
        return 0
    return round((this_avg - last_avg) / last_avg * 100, 1)


def get_recent_activity(patient_id, limit=10):
    """Get the most recent exercise results."""
    results = ExerciseResult.query.filter_by(patient_id=patient_id).order_by(
        ExerciseResult.created_at.desc()
    ).limit(limit).all()
    return [r.to_dict() for r in results]
