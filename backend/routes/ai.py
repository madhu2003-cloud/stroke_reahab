import os
import requests
import re
from flask import Blueprint, request, jsonify

ai_bp = Blueprint('ai', __name__)

SYSTEM_PROMPT = (
    "You are AURA AI, a dedicated clinical Stroke Rehabilitation & Neuro-Physiotherapy AI Coach.\n\n"
    "CRITICAL DOMAIN GUARDRAIL:\n"
    "You must ONLY answer questions related to stroke recovery, physical therapy, motor relearning exercises, "
    "hand/arm stiffness, Range of Motion (ROM), tremor reduction, speech therapy, facial therapy, fatigue management, "
    "F.A.S.T. stroke warning signs, and patient wellness.\n\n"
    "If the user asks ANY off-topic or unrelated question (such as geography, distance between cities, general knowledge, "
    "trivia, movies, coding, math, politics, weather, recipes, travel, or random topics like 'distance from here to coimbatore'), "
    "you MUST NOT answer the trivia or off-topic question. Instead, reply politely:\n"
    "'I am your dedicated Stroke Rehabilitation & Clinical Recovery AI Coach. I am specialized strictly in stroke recovery, physical therapy exercises, motor relearning, and wellness. Please ask a question related to your rehabilitation!'\n\n"
    "For all stroke and recovery questions, give a clear, direct, and empathetic answer specifically addressing what the user asked."
)

REHAB_KEYWORDS = [
    'stroke', 'rehab', 'recovery', 'physio', 'therapy', 'exercise', 'game', 'module', 'hand', 'arm',
    'finger', 'wrist', 'shoulder', 'elbow', 'leg', 'walk', 'mobility', 'stiff', 'spastic', 'tremor',
    'ataxia', 'shake', 'fast', 'symptom', 'warning', 'pain', 'fatigue', 'tired', 'rest', 'sleep',
    'speech', 'voice', 'aphasia', 'dysarthria', 'face', 'droop', 'smile', 'swallow', 'rom', 'angle',
    'motion', 'pegboard', 'piano', 'shelf', 'window', 'knob', 'routine', 'plan', 'schedule', 'doctor',
    'patient', 'neuroplasticity', 'brain', 'muscle', 'clench', 'fist', 'pinch', 'grip', 'stretch',
    'improve', 'progress', 'score', 'streak', 'help', 'hi', 'hello', 'hey', 'thank', 'who are you',
    'what can you do', 'what do you have', 'what are the exercises', 'list', 'show', 'all'
]

def is_rehab_related(query):
    q = query.lower().strip()
    if q in ['hi', 'hello', 'hey', 'thanks', 'thank you', 'ok', 'okay']:
        return True
    return any(k in q for k in REHAB_KEYWORDS)

def generate_clinical_response(query):
    q = query.strip().lower()

    # Off-topic check
    if not is_rehab_related(query) and len(query.split()) > 2:
        return (
            "I am your dedicated <strong>Stroke Rehabilitation & Clinical Recovery AI Coach</strong>. "
            "I am specialized strictly in stroke recovery, physical therapy exercises, motor relearning, "
            "and wellness.<br/><br/>"
            "Please ask a question related to your stroke rehabilitation, exercises, or recovery routine! 🩺"
        )

    # 1. List Exercises / What exercises do you have
    if (
        (any(w in q for w in ['what', 'list', 'show', 'all', 'which']) and any(w in q for w in ['exercise', 'game', 'module', 'have', 'available']))
        or q in ['exercises', 'games', 'what exercises you have', 'what are the exercises you have', 'what do you have']
    ):
        return (
            "🏋️ <strong>We Have 6 Evidence-Based Clinical Rehabilitation Modules:</strong><br/><br/>"
            "1. 🎹 <strong>Virtual Piano Finger Independence</strong> (Hand & Fingers)<br/>"
            "• <em>Goal:</em> Forces you to press 1 finger at a time (Thumb to Pinky) to overcome clenched-fist synergy.<br/><br/>"
            "2. 🔐 <strong>Forearm Pronation & Supination Lab</strong> (Wrist & Forearm)<br/>"
            "• <em>Goal:</em> Rotate your wrist left and right to turn a 3D vault knob (helps opening doors and bottle caps).<br/><br/>"
            "3. 📌 <strong>9-Hole Pegboard Pincer Test</strong> (Fine Dexterity)<br/>"
            "• <em>Goal:</em> Pinch small pegs with thumb & index finger to transfer into target holes (helps buttoning shirts and holding pens).<br/><br/>"
            "4. 🗄️ <strong>Shelf Reaching & Stacking</strong> (Shoulder & Elbow)<br/>"
            "• <em>Goal:</em> Reach down and lift items overhead onto high shelves (stretches tight bicep contractures).<br/><br/>"
            "5. 🪟 <strong>Planar Window & Surface Sweep</strong> (Arm Coordination)<br/>"
            "• <em>Goal:</em> Perform wide circular and horizontal sweeping strokes to wipe away steam (loosens stiff chest & shoulder muscles).<br/><br/>"
            "6. 🪞 <strong>Facial Symmetry Biofeedback</strong> (Facial Droop & Speech)<br/>"
            "• <em>Goal:</em> Guides symmetrical smiles, brow raises, and lip puckers in the camera mirror to rebuild facial nerve tone.<br/><br/>"
            "👉 <em>You can access all of them anytime by clicking <strong>Rehab Games</strong> in the sidebar!</em>"
        )

    # 2. How Exercises Help in Real Life
    if 'how' in q and any(w in q for w in ['help', 'work', 'cure', 'benefit', 'improve']):
        return (
            "🌟 <strong>How These Exercises Help You In Real Daily Life:</strong><br/><br/>"
            "After a stroke, repeating these exercises forces the brain to build <strong>new neural wiring</strong> (neuroplasticity):<br/><br/>"
            "• <strong>Piano Tapping:</strong> Helps you open your fingers to <strong>type on a phone</strong> and <strong>hold a spoon</strong>.<br/>"
            "• <strong>Knob Turning:</strong> Rebuilds wrist twist to <strong>turn door keys</strong> and <strong>open water taps</strong>.<br/>"
            "• <strong>Pegboard Pinch:</strong> Restores pincer grip to <strong>button your shirt</strong> and <strong>hold a pen</strong>.<br/>"
            "• <strong>Shelf Reach:</strong> Stretches tight arms to <strong>reach cupboard cups</strong> and <strong>comb your hair</strong>.<br/>"
            "• <strong>Window Sweep:</strong> Relieves shoulder stiffness to <strong>wipe tables</strong> and <strong>bathe comfortably</strong>.<br/>"
            "• <strong>Facial Mirror:</strong> Rebuilds facial strength to <strong>speak clearly</strong> and <strong>drink without spilling</strong>."
        )

    # 3. Recovery Plan & Schedule
    if any(w in q for w in ['plan', 'schedule', 'routine', 'program', 'regimen', 'daily']):
        return (
            "📅 <strong>Your Personalized Daily Stroke Recovery Plan:</strong><br/><br/>"
            "Physiotherapists recommend <strong>3 short sessions of 15 minutes</strong> daily to drive neuroplasticity without muscle exhaustion:<br/><br/>"
            "🌅 <strong>Morning (15 mins) — Fine Motor & Fingers:</strong><br/>"
            "• 5 mins warm towel compress on your hand.<br/>"
            "• 2 rounds of <em>Piano Finger Independence</em>.<br/>"
            "• 2 rounds of <em>9-Hole Pegboard Pincer Test</em>.<br/><br/>"
            "☀️ <strong>Afternoon (15 mins) — Arm & Shoulder Reach:</strong><br/>"
            "• 2 rounds of <em>Forearm Knob & Key Turning</em>.<br/>"
            "• 2 rounds of <em>Shelf Reaching & Stacking</em>.<br/>"
            "• 1 round of <em>Planar Window Sweep</em>.<br/><br/>"
            "🌙 <strong>Evening (15 mins) — Speech, Face & Progress Test:</strong><br/>"
            "• 1 round of <em>Facial Symmetry Biofeedback</em>.<br/>"
            "• 5 mins in the <em>Speech Therapy Lab</em>.<br/>"
            "• Test joint angles in <em>ROM & Tremor Lab</em> to log your recovery streak! 🔥"
        )

    # 4. Hand / Fingers / Stiffness
    if any(w in q for w in ['stiff', 'hand', 'finger', 'clench', 'fist', 'pinch', 'wrist', 'grip']):
        return (
            "🤲 <strong>Hand & Finger Mobility Recommendations:</strong><br/>"
            "1. <strong>Warm Towel Compress (5 mins):</strong> Relaxes tight spastic finger flexors.<br/>"
            "2. <strong>Piano Finger Independence:</strong> Play in the <em>Rehab Games</em> tab to practice opening one finger at a time.<br/>"
            "3. <strong>9-Hole Pegboard Pinch:</strong> Practice picking up and releasing pegs to rebuild fine grip.<br/>"
            "4. <strong>Forearm Knob Turn:</strong> Rebuild wrist rotation to turn keys and open bottle caps."
        )

    # 5. Arm / Shoulder / Reaching
    if any(w in q for w in ['arm', 'shoulder', 'elbow', 'reach', 'lift']):
        return (
            "💪 <strong>Upper Limb & Shoulder Strengthening:</strong><br/>"
            "• <strong>Shelf Reaching & Stacking:</strong> Practice overhead arm elevation to counter bicep contractures.<br/>"
            "• <strong>Planar Window Sweep:</strong> Wide sweeping motions stretch stiff chest and shoulder muscles.<br/>"
            "• <strong>Bilateral Mirroring:</strong> Use your unaffected arm to guide your recovering arm in synchronized reaches."
        )

    # 6. Tremor / Shaking
    if any(w in q for w in ['tremor', 'smooth', 'shake', 'jerk', 'ataxia']):
        return (
            "🌊 <strong>Tremor Reduction & Motor Smoothness:</strong><br/>"
            "• Practice slow, rhythmic arm sweeps in <em>Planar Window Sweep</em> to retrain cerebellar coordination.<br/>"
            "• Open the <strong>ROM & Tremor Lab</strong> tab to measure your tremor frequency and spectral power.<br/>"
            "• Rest if muscle fatigue sets in, as fatigue increases motor tremor."
        )

    # 7. Speech / Face
    if any(w in q for w in ['speech', 'face', 'droop', 'talk', 'voice', 'smile', 'swallow']):
        return (
            "🗣️ <strong>Speech & Facial Neuromuscular Re-education:</strong><br/>"
            "• Play <strong>Facial Symmetry Biofeedback</strong> in the <em>Rehab Games</em> tab to strengthen facial nerve control.<br/>"
            "• Visit the <strong>Speech Therapy Lab</strong> in the sidebar to practice vocal articulation and vowel sustainment."
        )

    # 8. F.A.S.T. Stroke Warning
    if any(w in q for w in ['fast', 'symptom', 'warning', 'emergency']):
        return (
            "🚨 <strong>F.A.S.T. Emergency Stroke Warning Checklist:</strong><br/>"
            "• <strong>F (Face Drooping):</strong> One side of face droops when smiling.<br/>"
            "• <strong>A (Arm Weakness):</strong> One arm drifts downward when raised.<br/>"
            "• <strong>S (Speech Difficulty):</strong> Speech is slurred or strange.<br/>"
            "• <strong>T (Time to Call Emergency):</strong> Call 911 / 112 immediately if present!"
        )

    # 9. Fatigue
    if any(w in q for w in ['fatigue', 'tired', 'rest', 'sleep', 'exhaust']):
        return (
            "⚡ <strong>Managing Therapy Fatigue:</strong><br/>"
            "• High frequency, short duration (three 15-min sessions) is far more effective than one long tiring session.<br/>"
            "• Rest 30 minutes and hydrate if movements become shaky or uncoordinated.<br/>"
            "• Ensure 7-8 hours of nighttime sleep for brain neuroplastic consolidation."
        )

    # 10. Greetings
    if q in ['hi', 'hello', 'hey', 'greetings'] or q.startswith('good '):
        return "👋 Hello! I am your <strong>AURA AI Rehabilitation Coach</strong>. I am ready to guide your physical therapy, recommend exercises, or explain your recovery metrics. How can I help your recovery today?"

    if 'thank' in q or 'great' in q or 'good' in q:
        return "🙏 You are very welcome! Keep up your wonderful dedication to daily therapy. Is there any other exercise or symptom you would like help with?"

    return (
        "🩺 <strong>Clinical Rehabilitation Guide:</strong><br/>"
        "For your stroke recovery, you can:<br/>"
        "1. Practice motor exercises in the <strong>Rehab Games</strong> tab (Piano Tapping, Pegboard, Knob Turn, Shelf Reach).<br/>"
        "2. Check your joint angles and tremors in the <strong>ROM & Tremor Lab</strong>.<br/>"
        "3. Practice speech clarity in the <strong>Speech Therapy Lab</strong>.<br/>"
        "4. Ask me specifically about: <em>available exercises, daily recovery plan, hand stiffness, or tremors!</em>"
    )

@ai_bp.route('/chat', methods=['POST'])
@ai_bp.route('/chat/', methods=['POST'])
@ai_bp.route('', methods=['POST'])
@ai_bp.route('/', methods=['POST'])
def ai_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    client_key = data.get('api_key', '').strip()
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400

    # 1. Guardrail Check
    if not is_rehab_related(message) and len(message.split()) > 2:
        return jsonify({
            'reply': (
                "I am your dedicated <strong>Stroke Rehabilitation & Clinical Recovery AI Coach</strong>. "
                "I am specialized strictly in stroke recovery, physical therapy exercises, motor relearning, "
                "and wellness.<br/><br/>"
                "Please ask a question related to your rehabilitation, exercises, or recovery routine! 🩺"
            ),
            'source': 'guardrail'
        }), 200

    api_key = client_key or os.environ.get('GEMINI_API_KEY', '')

    candidate_models = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-pro',
        'gemini-1.5-pro'
    ]

    if api_key:
        for model in candidate_models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                resp = requests.post(
                    url,
                    json={
                        "contents": [
                            {"role": "user", "parts": [{"text": f"{SYSTEM_PROMPT}\n\nPatient Query: {message}"}]}
                        ],
                        "generationConfig": {
                            "temperature": 0.6,
                            "maxOutputTokens": 600
                        }
                    },
                    timeout=8
                )
                if resp.status_code == 200:
                    r_json = resp.json()
                    candidates = r_json.get('candidates', [])
                    if candidates:
                        text = candidates[0]['content']['parts'][0]['text']
                        return jsonify({'reply': text, 'source': 'gemini_llm'}), 200
            except Exception:
                continue

    # 2. Complete Server-Side Clinical Engine
    server_reply = generate_clinical_response(message)
    return jsonify({
        'reply': server_reply,
        'source': 'clinical_engine'
    }), 200
