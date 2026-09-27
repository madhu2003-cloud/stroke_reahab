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
    'stroke', 'rehab', 'recovery', 'physio', 'therapy', 'exercise', 'hand', 'arm', 'finger', 'wrist',
    'shoulder', 'elbow', 'leg', 'walk', 'mobility', 'stiff', 'spastic', 'tremor', 'ataxia', 'shake',
    'fast', 'symptom', 'warning', 'pain', 'fatigue', 'tired', 'rest', 'sleep', 'speech', 'voice',
    'aphasia', 'dysarthria', 'face', 'droop', 'smile', 'swallow', 'rom', 'angle', 'motion', 'game',
    'pegboard', 'piano', 'shelf', 'window', 'knob', 'routine', 'plan', 'schedule', 'doctor', 'patient',
    'neuroplasticity', 'brain', 'muscle', 'clench', 'fist', 'pinch', 'grip', 'stretch', 'improve',
    'progress', 'score', 'streak', 'help', 'hi', 'hello', 'hey', 'thank', 'who are you', 'what can you do'
]

def is_rehab_related(query):
    q = query.lower()
    return any(k in q for k in REHAB_KEYWORDS)

@ai_bp.route('/chat', methods=['POST'])
def ai_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    client_key = data.get('api_key', '').strip()
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400

    # 1. Quick Guardrail Check
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
                    timeout=10
                )
                if resp.status_code == 200:
                    r_json = resp.json()
                    candidates = r_json.get('candidates', [])
                    if candidates:
                        text = candidates[0]['content']['parts'][0]['text']
                        return jsonify({'reply': text, 'source': 'gemini_llm'}), 200
            except Exception as e:
                continue

    return jsonify({
        'reply': None,
        'source': 'fallback'
    }), 200
