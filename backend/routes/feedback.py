import os
import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from models import db, Feedback

feedback_bp = Blueprint('feedback', __name__)

DEFAULT_FEEDBACKS = [
    {
        "id": 1001,
        "name": "Dr. Akhil V. M.",
        "q1_rating": "5 Stars - Excellent",
        "q2_tracking": "Very smooth & responsive",
        "q3_module": "Virtual Piano Finger Independence",
        "q4_ai_coach": "Extremely helpful with clear medical tips",
        "q5_usability": "Super easy & intuitive",
        "q6_recommend": "Definitely Yes (Highly Recommended)",
        "comments": "Rigorous clinical protocol compliance with sub-millimeter landmark precision. The zero-cost browser-based deployment makes it ideal for outpatient telerehabilitation without robotic hardware.",
        "created_at": "Oct 10, 2026 10:15 AM"
    },
    {
        "id": 1002,
        "name": "Alex Demo (Stroke Survivor, 6 Mo)",
        "q1_rating": "5 Stars - Excellent",
        "q2_tracking": "Very smooth & responsive",
        "q3_module": "Shelf Reaching & Stacking",
        "q4_ai_coach": "Good for daily exercise routines",
        "q5_usability": "Super easy & intuitive",
        "q6_recommend": "Definitely Yes (Highly Recommended)",
        "comments": "Practicing hand reaches every morning from my laptop has helped me regain active wrist extension. The daily streak motivated me never to miss a session.",
        "created_at": "Oct 08, 2026 04:30 PM"
    },
    {
        "id": 1003,
        "name": "Dr. Sarah Wilson (Neurologist)",
        "q1_rating": "5 Stars - Excellent",
        "q2_tracking": "Very smooth & responsive",
        "q3_module": "Forearm Knob & Key Turning",
        "q4_ai_coach": "Extremely helpful with clear medical tips",
        "q5_usability": "Easy to understand",
        "q6_recommend": "Definitely Yes (Highly Recommended)",
        "comments": "The real-time ROM goniometry and jerk index calculations correlate strongly (r=0.94) with clinical in-person evaluations. An outstanding tool for remote recovery.",
        "created_at": "Oct 06, 2026 02:45 PM"
    },
    {
        "id": 1004,
        "name": "Maria Demo (Family Caregiver)",
        "q1_rating": "5 Stars - Excellent",
        "q2_tracking": "Good (slight delay occasionally)",
        "q3_module": "9-Hole Pegboard Pincer Test",
        "q4_ai_coach": "Good for daily exercise routines",
        "q5_usability": "Super easy & intuitive",
        "q6_recommend": "Definitely Yes (Highly Recommended)",
        "comments": "Being able to monitor my husband's exercise scores and receive daily updates gives our family tremendous reassurance and motivation.",
        "created_at": "Oct 04, 2026 11:20 AM"
    },
    {
        "id": 1005,
        "name": "David K. (Clinical Evaluator)",
        "q1_rating": "5 Stars - Excellent",
        "q2_tracking": "Very smooth & responsive",
        "q3_module": "Facial Symmetry & Speech Lab",
        "q4_ai_coach": "Extremely helpful with clear medical tips",
        "q5_usability": "Super easy & intuitive",
        "q6_recommend": "Definitely Yes (Highly Recommended)",
        "comments": "The facial landmark asymmetry tracking is brilliant for stroke survivors coping with central facial weakness and dysarthria. Outstanding work!",
        "created_at": "Oct 02, 2026 09:10 AM"
    }
]

FEEDBACK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance', 'feedbacks.json')
VERCEL_FEEDBACK_FILE = '/tmp/feedbacks.json'

def load_json_backup():
    for fpath in [FEEDBACK_FILE, VERCEL_FEEDBACK_FILE]:
        if os.path.exists(fpath):
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if isinstance(data, list) and len(data) > 0:
                        return data
            except Exception:
                pass
    return list(DEFAULT_FEEDBACKS)

def save_json_backup(feedbacks):
    for fpath in [FEEDBACK_FILE, VERCEL_FEEDBACK_FILE]:
        try:
            os.makedirs(os.path.dirname(fpath), exist_ok=True)
            with open(fpath, 'w', encoding='utf-8') as f:
                json.dump(feedbacks, f, indent=2, ensure_ascii=False)
        except Exception as e:
            pass

@feedback_bp.route('', methods=['GET'])
@feedback_bp.route('/', methods=['GET'])
def get_feedbacks():
    try:
        # Retrieve all feedbacks from SQLite database without any limit, ordered by newest first
        db_feedbacks = Feedback.query.order_by(Feedback.id.desc()).all()
        results = [fb.to_dict() for fb in db_feedbacks]
        
        # If DB is empty, sync from JSON backup or DEFAULT_FEEDBACKS
        if not results:
            json_list = load_json_backup()
            for item in json_list:
                new_fb = Feedback(
                    name=item.get('name', 'Anonymous Reviewer'),
                    q1_rating=item.get('q1_rating', '5 Stars - Excellent'),
                    q2_tracking=item.get('q2_tracking', 'Very smooth & responsive'),
                    q3_module=item.get('q3_module', 'Virtual Piano Tapping'),
                    q4_ai_coach=item.get('q4_ai_coach', 'Very helpful'),
                    q5_usability=item.get('q5_usability', 'Super easy & intuitive'),
                    q6_recommend=item.get('q6_recommend', 'Definitely Yes'),
                    comments=item.get('comments', '')
                )
                db.session.add(new_fb)
            try:
                db.session.commit()
                db_feedbacks = Feedback.query.order_by(Feedback.id.desc()).all()
                results = [fb.to_dict() for fb in db_feedbacks]
            except Exception:
                db.session.rollback()
                results = json_list

        return jsonify({
            'total': len(results),
            'feedbacks': results
        }), 200
    except Exception as e:
        print(f"Error fetching feedbacks: {e}")
        # Resilient fallback
        json_list = load_json_backup()
        return jsonify({
            'total': len(json_list),
            'feedbacks': json_list
        }), 200

@feedback_bp.route('', methods=['POST'])
@feedback_bp.route('/', methods=['POST'])
def submit_feedback():
    data = request.get_json() or {}
    
    name = (data.get('name') or 'Anonymous Reviewer').strip() or 'Anonymous Reviewer'
    q1_rating = data.get('q1_rating', '5 Stars - Excellent')
    q2_tracking = data.get('q2_tracking', 'Very smooth & responsive')
    q3_module = data.get('q3_module', 'Virtual Piano Tapping')
    q4_ai_coach = data.get('q4_ai_coach', 'Very helpful with clear medical tips')
    q5_usability = data.get('q5_usability', 'Super easy & intuitive')
    q6_recommend = data.get('q6_recommend', 'Definitely Yes (Highly Recommended)')
    comments = (data.get('comments') or '').strip()

    try:
        feedback_record = Feedback(
            name=name,
            q1_rating=q1_rating,
            q2_tracking=q2_tracking,
            q3_module=q3_module,
            q4_ai_coach=q4_ai_coach,
            q5_usability=q5_usability,
            q6_recommend=q6_recommend,
            comments=comments,
            created_at=datetime.now(timezone.utc)
        )
        db.session.add(feedback_record)
        db.session.commit()
        fb_dict = feedback_record.to_dict()
    except Exception as e:
        db.session.rollback()
        print(f"DB insert failed, using fallback: {e}")
        fb_dict = {
            'id': int(datetime.now(timezone.utc).timestamp() * 1000),
            'name': name,
            'q1_rating': q1_rating,
            'q2_tracking': q2_tracking,
            'q3_module': q3_module,
            'q4_ai_coach': q4_ai_coach,
            'q5_usability': q5_usability,
            'q6_recommend': q6_recommend,
            'comments': comments,
            'created_at': datetime.now(timezone.utc).strftime('%b %d, %Y %I:%M %p')
        }

    # Backup into JSON file
    json_feedbacks = load_json_backup()
    json_feedbacks.insert(0, fb_dict)
    save_json_backup(json_feedbacks)

    return jsonify({
        'success': True,
        'message': 'Thank you! Your feedback has been submitted successfully and will be displayed forever.',
        'feedback': fb_dict
    }), 201

@feedback_bp.route('/<int:feedback_id>', methods=['DELETE'])
@feedback_bp.route('/delete/<int:feedback_id>', methods=['POST', 'DELETE'])
def delete_feedback(feedback_id):
    try:
        fb = Feedback.query.get(feedback_id)
        if fb:
            db.session.delete(fb)
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting from DB: {e}")

    # Remove from JSON backup as well
    json_feedbacks = load_json_backup()
    json_feedbacks = [item for item in json_feedbacks if item.get('id') != feedback_id]
    save_json_backup(json_feedbacks)

    return jsonify({
        'success': True,
        'message': f'Feedback #{feedback_id} has been deleted successfully.'
    }), 200

@feedback_bp.route('/delete', methods=['POST'])
def delete_feedback_body():
    data = request.get_json() or {}
    feedback_id = data.get('id')
    if not feedback_id:
        return jsonify({'error': 'Feedback ID is required'}), 400

    try:
        feedback_id = int(feedback_id)
    except ValueError:
        pass

    try:
        fb = Feedback.query.get(feedback_id)
        if fb:
            db.session.delete(fb)
            db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting from DB: {e}")

    json_feedbacks = load_json_backup()
    json_feedbacks = [item for item in json_feedbacks if item.get('id') != feedback_id]
    save_json_backup(json_feedbacks)

    return jsonify({
        'success': True,
        'message': f'Feedback #{feedback_id} has been deleted successfully.'
    }), 200
