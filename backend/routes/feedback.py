import os
import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify

feedback_bp = Blueprint('feedback', __name__)

FEEDBACK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance', 'feedbacks.json')

def load_feedbacks():
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_feedbacks(feedbacks):
    os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
    with open(FEEDBACK_FILE, 'w', encoding='utf-8') as f:
        json.dump(feedbacks, f, indent=2)

@feedback_bp.route('/', methods=['GET'])
def get_feedbacks():
    feedbacks = load_feedbacks()
    return jsonify({
        'total': len(feedbacks),
        'feedbacks': feedbacks
    }), 200

@feedback_bp.route('/', methods=['POST'])
def submit_feedback():
    data = request.get_json() or {}
    
    name = data.get('name', 'Anonymous Reviewer').strip() or 'Anonymous Reviewer'
    q1_rating = data.get('q1_rating', '5 Stars - Excellent')
    q2_tracking = data.get('q2_tracking', 'Very smooth & responsive')
    q3_module = data.get('q3_module', 'Virtual Piano Tapping')
    q4_ai_coach = data.get('q4_ai_coach', 'Very helpful with clear medical tips')
    q5_usability = data.get('q5_usability', 'Super easy & intuitive')
    q6_recommend = data.get('q6_recommend', 'Definitely Yes (Highly Recommended)')
    comments = data.get('comments', '').strip()

    feedback_entry = {
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

    feedbacks = load_feedbacks()
    feedbacks.insert(0, feedback_entry)
    save_feedbacks(feedbacks)

    return jsonify({
        'message': 'Thank you! Your feedback has been submitted successfully.',
        'feedback': feedback_entry
    }), 201
