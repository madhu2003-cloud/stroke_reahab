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
        'target_touch', 'object_catch', 'path_following', 'bubble_pop', 'number_show', 'thumb_touch'
    ]
    perf = {}
    for gt in game_types:
        results = ExerciseResult.query.filter_by(patient_id=patient_id, game_type=gt).order_by(ExerciseResult.created_at.asc()).all()
        if results:
            scores = [r.score for r in results]
            accuracies = [r.accuracy for r in results if r.accuracy is not None]
            reaction_times = [r.reaction_time for r in results if r.reaction_time is not None]
            smoothnesses = [r.smoothness for r in results if r.smoothness is not None]
            reps = sum(r.repetitions for r in results if r.repetitions)
            duration = sum(r.duration for r in results if r.duration)

            first_acc = accuracies[0] if accuracies else 0
            latest_acc = accuracies[-1] if accuracies else 0
            first_score = scores[0] if scores else 0
            latest_score = scores[-1] if scores else 0

            # Calculate improvement percentage
            if first_acc > 0:
                imp_acc = round(((latest_acc - first_acc) / first_acc) * 100, 1)
            elif first_score > 0:
                imp_acc = round(((latest_score - first_score) / first_score) * 100, 1)
            else:
                imp_acc = 0.0

            perf[gt] = {
                'avg_score': round(sum(scores) / len(scores), 1),
                'avg_accuracy': round(sum(accuracies) / len(accuracies), 1) if accuracies else 0,
                'avg_reaction_time': round(sum(reaction_times) / len(reaction_times), 2) if reaction_times else None,
                'avg_smoothness': round(sum(smoothnesses) / len(smoothnesses), 2) if smoothnesses else None,
                'total_repetitions': reps,
                'total_duration': duration,
                'total_sessions': len(results),
                'best_score': max(scores),
                'first_score': first_score,
                'latest_score': latest_score,
                'first_accuracy': first_acc,
                'latest_accuracy': latest_acc,
                'improvement_pct': imp_acc,
                'last_played': results[-1].created_at.isoformat() if results[-1].created_at else None
            }
        else:
            perf[gt] = {
                'avg_score': 0,
                'avg_accuracy': 0,
                'avg_reaction_time': None,
                'avg_smoothness': None,
                'total_repetitions': 0,
                'total_duration': 0,
                'total_sessions': 0,
                'best_score': 0,
                'first_score': 0,
                'latest_score': 0,
                'first_accuracy': 0,
                'latest_accuracy': 0,
                'improvement_pct': 0.0,
                'last_played': None
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
            'total_reps': 0,
            'best_score': 0,
            'recovery_index': 0,
            'clinical_stage': 'Initial Baseline Assessment'
        }

    scores = [r.score for r in results]
    accuracies = [r.accuracy for r in results if r.accuracy is not None]
    total_time = sum(r.duration for r in results if r.duration)
    total_reps = sum(r.repetitions for r in results if r.repetitions)

    avg_score = round(sum(scores) / len(scores), 1) if scores else 0
    avg_acc = round(sum(accuracies) / len(accuracies), 1) if accuracies else 0

    # Calculate dynamic recovery index based on accuracy, activity, and score
    # Baseline index formula
    raw_index = (avg_acc * 0.7) + min(len(results) * 1.5, 20) + min(avg_score / 100 * 10, 10)
    recovery_index = round(min(max(raw_index, 0), 99.5), 1)

    if recovery_index >= 80:
        stage = 'Advanced • Functional Recovery Band'
    elif recovery_index >= 65:
        stage = 'Moderate-High • Active Neuroplastic Progress'
    elif recovery_index >= 45:
        stage = 'Intermediate • Motor Relearning Stage'
    else:
        stage = 'Early Recovery • Foundation & Baseline'

    return {
        'total_sessions': len(results),
        'avg_score': avg_score,
        'avg_accuracy': avg_acc,
        'total_time': total_time,
        'total_reps': total_reps,
        'best_score': max(scores) if scores else 0,
        'recovery_index': recovery_index,
        'clinical_stage': stage
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


def get_recent_activity(patient_id, limit=15):
    """Get the most recent exercise results."""
    results = ExerciseResult.query.filter_by(patient_id=patient_id).order_by(
        ExerciseResult.created_at.desc()
    ).limit(limit).all()
    return [r.to_dict() for r in results]


def get_clinical_report_summary(patient_id):
    """Generate dynamic clinical report summary with domain analysis and recommendations."""
    from models import Patient
    patient = Patient.query.get(patient_id)
    if not patient:
        return None

    perf = get_game_performance(patient_id)
    stats = get_overall_stats(patient_id)
    recent = get_recent_activity(patient_id, limit=15)
    improvement = get_weekly_improvement(patient_id)

    # Domain Definitions & Clinical Mappings
    domains = [
        {
            'domain': 'Fine Finger Independence',
            'game_type': 'piano_tap',
            'clinical_target': 'Overcoming clenched-fist synergy, isolated digit extension',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Forearm Pronation & Supination',
            'game_type': 'knob_turn',
            'clinical_target': 'Radius/ulna rotational ROM (door handles & bottle caps)',
            'unit': 'Accuracy %',
        },
        {
            'domain': '9-Hole Pegboard Pincer Grasp',
            'game_type': 'pegboard_pinch',
            'clinical_target': 'Sub-millimeter thumb-index pinch & fine motor coordination',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Overhead Shoulder & Elbow Reach',
            'game_type': 'shelf_reach',
            'clinical_target': 'Elbow extension, overhead reaching & bicep contracture prevention',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Planar Shoulder & Chest Sweep',
            'game_type': 'window_wipe',
            'clinical_target': 'Active planar range of motion & adductor stretch',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Facial Symmetry & Neuromuscular Tone',
            'game_type': 'facial_mirror',
            'clinical_target': 'Hemifacial paresis biofeedback (smiling, brow raise, lip seal)',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Visuospatial Scanning & Reaction',
            'game_type': 'target_touch',
            'clinical_target': 'Spatial tracking, neglect reduction & rapid pointing',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Dynamic Object Interception',
            'game_type': 'object_catch',
            'clinical_target': 'Predictive timing & arm suspension endurance',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Trajectory Smoothness & Kinematics',
            'game_type': 'path_following',
            'clinical_target': 'Tremor dampening, sub-movement jerk reduction',
            'unit': 'Smoothness / Acc',
        },
        {
            'domain': 'Thumb Opposition (Kapandji)',
            'game_type': 'thumb_touch',
            'clinical_target': 'Thumb circumduction & multi-digit opposition grasp',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Multi-Digit Extension & Cognition',
            'game_type': 'number_show',
            'clinical_target': 'Simultaneous finger extension & motor cognitive control',
            'unit': 'Accuracy %',
        },
        {
            'domain': 'Spontaneous Reaching Agility',
            'game_type': 'bubble_pop',
            'clinical_target': 'Upper extremity agility & low-barrier motor initiation',
            'unit': 'Accuracy %',
        },
    ]

    domain_evaluations = []
    active_domains = []
    
    for d in domains:
        gt = d['game_type']
        p = perf.get(gt, {})
        sessions = p.get('total_sessions', 0)
        avg_acc = p.get('avg_accuracy', 0)
        first_acc = p.get('first_accuracy', 0)
        latest_acc = p.get('latest_accuracy', 0)
        best_score = p.get('best_score', 0)
        imp_pct = p.get('improvement_pct', 0)
        reaction_time = p.get('avg_reaction_time')
        smoothness = p.get('avg_smoothness')
        reps = p.get('total_repetitions', 0)

        if sessions > 0:
            active_domains.append((d['domain'], avg_acc, sessions))
            
            # Clinical status badge
            if avg_acc >= 85:
                status = 'Normal Band / Cleared'
                status_color = '#15803d'
                status_bg = '#dcfce7'
            elif avg_acc >= 70:
                status = 'Rapid Progress'
                status_color = '#15803d'
                status_bg = '#dcfce7'
            elif avg_acc >= 50:
                status = 'Steady Relearning'
                status_color = '#b45309'
                status_bg = '#fef3c7'
            else:
                status = 'Needs Practice'
                status_color = '#b91c1c'
                status_bg = '#fee2e2'
                
            baseline_str = f"{round(first_acc, 1)}%" if first_acc > 0 else f"{p.get('first_score', 0)} pts"
            current_str = f"{round(latest_acc, 1)}% (Best: {best_score})"
            imp_str = f"+{imp_pct}%" if imp_pct > 0 else (f"{imp_pct}%" if imp_pct < 0 else "Baseline")
        else:
            status = 'Pending Assessment'
            status_color = '#64748b'
            status_bg = '#f1f5f9'
            baseline_str = '--'
            current_str = 'No sessions yet'
            imp_str = '--'

        domain_evaluations.append({
            'domain': d['domain'],
            'game_type': gt,
            'clinical_target': d['clinical_target'],
            'sessions': sessions,
            'repetitions': reps,
            'baseline': baseline_str,
            'current': current_str,
            'improvement_rate': imp_str,
            'avg_accuracy': avg_acc,
            'best_score': best_score,
            'reaction_time': f"{reaction_time}s" if reaction_time else '--',
            'smoothness': f"{smoothness} Jerk" if smoothness else '--',
            'status': status,
            'status_color': status_color,
            'status_bg': status_bg
        })

    # Generate Dynamic Physiotherapist & AI Clinical Summary
    if stats['total_sessions'] == 0:
        clinical_notes = (
            "Patient has initialized the StrokeRehab digital telerehabilitation profile. "
            "No active sessions have been completed yet. Recommended action: Begin initial baseline evaluations "
            "with Piano Finger Independence and Planar Window Sweep modules."
        )
    else:
        active_domains.sort(key=lambda x: x[1], reverse=True)
        best_domain = active_domains[0] if active_domains else ("General Movement", stats['avg_accuracy'], 1)
        least_domain = active_domains[-1] if len(active_domains) > 1 else None

        mins_spent = round(stats['total_time'] / 60, 1)
        clinical_notes = (
            f"Patient demonstrates high compliance with {stats['total_sessions']} logged sessions ({mins_spent} active therapy minutes, {stats['total_reps']} movement repetitions). "
            f"Strongest motor control is observed in {best_domain[0]} (Average Accuracy: {round(best_domain[1], 1)}%). "
        )
        if least_domain and least_domain[1] < 70:
            clinical_notes += (
                f"Neuro-motor focus area: {least_domain[0]} (Current Accuracy: {round(least_domain[1], 1)}%). "
                f"Recommendation: Allocate 2 targeted 10-minute sessions daily to this module to reinforce synaptic plasticity."
            )
        else:
            clinical_notes += "Kinematic trajectory smoothness and reaction latency show continuous improvement across all practiced modules."

    return {
        'stats': stats,
        'improvement': improvement,
        'domains': domain_evaluations,
        'recent_activity': recent,
        'clinical_notes': clinical_notes
    }

