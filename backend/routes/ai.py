import os
import requests
from flask import Blueprint, request, jsonify

ai_bp = Blueprint('ai', __name__)

SYSTEM_PROMPT = (
    "You are AURA AI, an empathetic, highly knowledgeable, and encouraging clinical Stroke "
    "Rehabilitation & Neuro-Physiotherapy AI Coach. You assist stroke patients, caregivers, and "
    "physiotherapists with motor recovery exercises, hand stiffness, range of motion (ROM), "
    "tremor reduction, speech therapy, and fatigue management. Keep explanations clear, actionable, "
    "structured with bullet points, and uplifting. Always remind patients to consult their doctor for acute symptoms "
    "and emphasize F.A.S.T. stroke safety."
)

@ai_bp.route('/chat', methods=['POST'])
def ai_chat():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    client_key = data.get('api_key', '').strip()
    
    if not message:
        return jsonify({'error': 'Message is required'}), 400

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
                            "temperature": 0.7,
                            "maxOutputTokens": 650
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

    # Fallback to smart clinical reasoning if external API is unreachable or key not set
    return jsonify({
        'reply': None,
        'source': 'fallback'
    }), 200
