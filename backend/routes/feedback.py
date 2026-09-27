import os
import json
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from models import db, Feedback

feedback_bp = Blueprint('feedback', __name__)

FEEDBACK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'instance', 'feedbacks.json')

def load_json_backup():
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data if isinstance(data, list) else []
        except Exception:
            return []
    return []

def save_json_backup(feedbacks):
    try:
        os.makedirs(os.path.dirname(FEEDBACK_FILE), exist_ok=True)
        with open(FEEDBACK_FILE, 'w', encoding='utf-8') as f:
            json.dump(feedbacks, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Warning: Could not save json backup: {e}")

@feedback_bp.route('', methods=['GET'])
@feedback_bp.route('/', methods=['GET'])
def get_feedbacks():
    try:
        # Retrieve all feedbacks from SQLite database without any limit, ordered by newest first
        db_feedbacks = Feedback.query.order_by(Feedback.id.desc()).all()
        results = [fb.to_dict() for fb in db_feedbacks]
        
        # If DB is empty but JSON backup has entries, sync them into DB
        if not results:
            json_list = load_json_backup()
            if json_list:
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
        # Resilient fallback to JSON file
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
