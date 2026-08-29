from datetime import date, timedelta
from models import db, Streak, ExerciseResult


def update_streak(patient_id):
    """Update the streak after a new exercise is completed."""
    streak = Streak.query.filter_by(patient_id=patient_id).first()
    if not streak:
        streak = Streak(patient_id=patient_id, current_streak=1, longest_streak=1, last_activity_date=date.today())
        db.session.add(streak)
        db.session.commit()
        return streak

    today = date.today()
    if streak.last_activity_date == today:
        return streak

    if streak.last_activity_date == today - timedelta(days=1):
        streak.current_streak += 1
    elif streak.last_activity_date is None or streak.last_activity_date < today - timedelta(days=1):
        streak.current_streak = 1

    if streak.current_streak > streak.longest_streak:
        streak.longest_streak = streak.current_streak

    streak.last_activity_date = today
    db.session.commit()
    return streak


def get_streak(patient_id):
    """Get streak data for a patient."""
    streak = Streak.query.filter_by(patient_id=patient_id).first()
    if not streak:
        return {'current_streak': 0, 'longest_streak': 0, 'last_activity': None}
    return streak.to_dict()


def get_activity_calendar(patient_id, days=30):
    """Get activity calendar for last N days."""
    today = date.today()
    start = today - timedelta(days=days - 1)

    results = db.session.query(
        db.func.date(ExerciseResult.created_at).label('day'),
        db.func.count(ExerciseResult.id).label('cnt')
    ).filter(
        ExerciseResult.patient_id == patient_id,
        db.func.date(ExerciseResult.created_at) >= start,
        db.func.date(ExerciseResult.created_at) <= today
    ).group_by(
        db.func.date(ExerciseResult.created_at)
    ).all()

    activity_map = {str(r.day): r.cnt for r in results}
    calendar = []
    for i in range(days):
        d = start + timedelta(days=i)
        ds = d.isoformat()
        calendar.append({
            'date': ds,
            'completed': ds in activity_map,
            'sessions_count': activity_map.get(ds, 0)
        })
    return calendar
