/* AI Recovery Coach & Clinical Advisor Page - Domain Guardrailed Clinical AI */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderAiAdvisor() {
  const user = Auth.getUser() || {};

  return `
    <div class="page-container" style="max-width:1100px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="page-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <i class="fas fa-brain" style="color:var(--primary,#4f46e5)"></i> AI Rehabilitation Coach
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;">
            Specialized clinical AI assistant dedicated strictly to stroke motor recovery, speech therapy, and rehabilitation wellness.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary" id="fast-check-btn" style="display:inline-flex;align-items:center;gap:6px;">
            <i class="fas fa-heartbeat" style="color:#ef4444;"></i> F.A.S.T. Assessment
          </button>
          <button class="btn btn-primary" id="clear-chat-btn" style="display:inline-flex;align-items:center;gap:6px;">
            <i class="fas fa-redo"></i> New Session
          </button>
        </div>
      </div>

      <!-- Quick Tips Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:24px;">
        <div class="card" style="padding:16px;border-left:4px solid #3b82f6;cursor:pointer;" onclick="window.sendQuickPrompt('What exercises should I do today for hand stiffness?')">
          <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px;color:#1e40af;"><i class="fas fa-hand-sparkles"></i> Hand Stiffness Relief</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Ask for personalized finger and wrist mobility routines.</div>
        </div>
        <div class="card" style="padding:16px;border-left:4px solid #10b981;cursor:pointer;" onclick="window.sendQuickPrompt('How can I improve my movement smoothness and reduce tremors?')">
          <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px;color:#065f46;"><i class="fas fa-wave-square"></i> Tremor & Smoothness</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Techniques for ataxia, spasticity, and coordination.</div>
        </div>
        <div class="card" style="padding:16px;border-left:4px solid #8b5cf6;cursor:pointer;" onclick="window.sendQuickPrompt('Give me a personalized daily recovery plan')">
          <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px;color:#5b21b6;"><i class="fas fa-calendar-alt"></i> Daily Recovery Plan</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Get morning, afternoon, and evening therapy routines.</div>
        </div>
        <div class="card" style="padding:16px;border-left:4px solid #f59e0b;cursor:pointer;" onclick="window.sendQuickPrompt('What are signs of physical fatigue during stroke rehab?')">
          <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px;color:#92400e;"><i class="fas fa-battery-half"></i> Fatigue Monitoring</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Identify when to rest and prevent overexertion.</div>
        </div>
      </div>

      <!-- Main Chat Card -->
      <div class="card" style="padding:0;display:flex;flex-direction:column;height:550px;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.06);">
        <!-- Chat Header -->
        <div style="padding:16px 20px;border-bottom:1px solid var(--border-color,rgba(0,0,0,0.08));background:var(--card-header-bg,rgba(79,70,229,0.04));display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#8b5cf6);display:flex;align-items:center;justify-content:center;color:#fff;">
              <i class="fas fa-robot"></i>
            </div>
            <div>
              <div style="font-weight:600;font-size:0.95rem;">AURA Medical Recovery AI</div>
              <div style="font-size:0.75rem;color:#10b981;display:flex;align-items:center;gap:4px;">
                <span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;"></span> 
                Online & Ready
              </div>
            </div>
          </div>
          <div>
            <span class="badge" style="background:#dcfce7;color:#15803d;padding:4px 12px;border-radius:99px;font-size:0.78rem;font-weight:700;">
              🩺 Clinical AI Guardrails Active
            </span>
          </div>
        </div>

        <!-- Chat Message Area -->
        <div id="ai-chat-messages" style="flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:16px;background:var(--bg-light,#f9fafb);">
          <!-- AI Welcome Bubble -->
          <div class="chat-msg ai" style="display:flex;gap:12px;align-items:flex-start;max-width:85%;">
            <div style="width:32px;height:32px;border-radius:50%;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;">
              <i class="fas fa-robot"></i>
            </div>
            <div style="background:#ffffff;padding:14px 18px;border-radius:16px;border:1px solid var(--border-color,#e5e7eb);box-shadow:0 2px 6px rgba(0,0,0,0.04);font-size:0.92rem;line-height:1.6;color:var(--text-primary,#111827);">
              Hello ${user.name || 'there'}! 👋 I am your dedicated <strong>AI Stroke Rehabilitation Coach</strong>. I am strictly specialized to help you with:
              <ul style="margin:8px 0 0 16px;padding:0;">
                <li>Personalized motor, speech, and finger mobility exercises</li>
                <li>Daily and weekly stroke recovery routines & schedules</li>
                <li>Explaining tremor control, ROM joint angles, and clinical games</li>
                <li>Conducting quick <strong>F.A.S.T.</strong> stroke warning checks</li>
              </ul>
              <em>(Note: I strictly answer stroke and physical rehabilitation questions.)</em><br/><br/>
              How can I assist your rehabilitation today?
            </div>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div style="padding:16px;border-top:1px solid var(--border-color,rgba(0,0,0,0.08));background:#ffffff;">
          <form id="ai-chat-form" style="display:flex;gap:10px;">
            <input type="text" id="ai-chat-input" class="inp" placeholder="Ask about stroke exercises, stiffness, recovery plan, ROM, fatigue..." style="flex:1;padding:12px 16px;border-radius:12px;font-size:0.92rem;" autocomplete="off" />
            <button type="submit" class="btn btn-primary" style="border-radius:12px;padding:0 20px;display:flex;align-items:center;gap:6px;">
              <span>Send</span> <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initAiAdvisor() {
  const form = document.getElementById('ai-chat-form');
  const input = document.getElementById('ai-chat-input');
  const messagesBox = document.getElementById('ai-chat-messages');
  const clearBtn = document.getElementById('clear-chat-btn');
  const fastBtn = document.getElementById('fast-check-btn');

  const scrollToBottom = () => {
    messagesBox.scrollTop = messagesBox.scrollHeight;
  };

  const appendMessage = (sender, text) => {
    const isAi = sender === 'ai';
    const bubble = document.createElement('div');
    bubble.className = `chat-msg ${sender}`;
    bubble.style.cssText = `display:flex;gap:12px;align-items:flex-start;max-width:85%;${isAi ? '' : 'align-self:flex-end;flex-direction:row-reverse;'}`;

    bubble.innerHTML = `
      <div style="width:32px;height:32px;border-radius:50%;background:${isAi ? '#4f46e5' : '#10b981'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;">
        <i class="fas ${isAi ? 'fa-robot' : 'fa-user'}"></i>
      </div>
      <div style="background:${isAi ? '#ffffff' : '#4f46e5'};color:${isAi ? '#111827' : '#ffffff'};padding:14px 18px;border-radius:16px;border:1px solid ${isAi ? '#e5e7eb' : 'transparent'};box-shadow:0 2px 6px rgba(0,0,0,0.04);font-size:0.92rem;line-height:1.6;">
        ${text}
      </div>
    `;
    messagesBox.appendChild(bubble);
    scrollToBottom();
  };

  // Domain Relevance Classifier
  const REHAB_TOPICS = [
    'stroke', 'rehab', 'recovery', 'physio', 'therapy', 'exercise', 'hand', 'arm', 'finger', 'wrist',
    'shoulder', 'elbow', 'leg', 'walk', 'mobility', 'stiff', 'spastic', 'tremor', 'ataxia', 'shake',
    'fast', 'symptom', 'warning', 'pain', 'fatigue', 'tired', 'rest', 'sleep', 'speech', 'voice',
    'aphasia', 'dysarthria', 'face', 'droop', 'smile', 'swallow', 'rom', 'angle', 'motion', 'game',
    'pegboard', 'piano', 'shelf', 'window', 'knob', 'routine', 'plan', 'schedule', 'doctor', 'patient',
    'neuroplasticity', 'brain', 'muscle', 'clench', 'fist', 'pinch', 'grip', 'stretch', 'improve',
    'progress', 'score', 'streak', 'help', 'hi', 'hello', 'hey', 'thank', 'who are you', 'what can you do'
  ];

  function isDomainRelated(query) {
    const q = query.toLowerCase().trim();
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'thanks' || q === 'thank you') return true;
    return REHAB_TOPICS.some(t => q.includes(t));
  }

  // Call Server or Client AI with Guardrail
  async function queryAiAdvisor(promptText) {
    // 1. Client Guardrail Check
    if (!isDomainRelated(promptText) && promptText.trim().split(/\s+/).length > 2) {
      return `I am your dedicated <strong>Stroke Rehabilitation & Clinical Recovery AI Coach</strong>. I am specialized strictly in stroke recovery, physical therapy exercises, motor relearning, and wellness.<br/><br/>
      Please ask a question related to your stroke rehabilitation, exercises, or recovery routine! 🩺`;
    }

    // 2. Query Server Endpoint
    try {
      const resp = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptText })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.reply) {
          return data.reply
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
        }
      }
    } catch (e) {
      // Backend failed, fallback to contextual clinical resolver
    }

    return getContextualClinicalResponse(promptText);
  }

  function getContextualClinicalResponse(query) {
    const q = query.trim().toLowerCase();

    // Off-topic check
    if (!isDomainRelated(query)) {
      return `I am your dedicated <strong>Stroke Rehabilitation & Clinical Recovery AI Coach</strong>. I am specialized strictly in stroke recovery, physical therapy exercises, motor relearning, and wellness.<br/><br/>
      Please ask a question related to your stroke rehabilitation, exercises, or recovery routine! 🩺`;
    }

    // Greetings
    if (/^(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))\b/.test(q)) {
      return `👋 Hello! I am your <strong>AURA AI Rehabilitation Coach</strong>. I am ready to guide your physical therapy, recommend exercises, or explain your recovery metrics. How can I help your recovery today?`;
    }

    // Recovery Plan / Routine
    if (q.includes('plan') || q.includes('routine') || q.includes('schedule') || q.includes('program') || (q.includes('how') && q.includes('recovery'))) {
      return `📅 <strong>Your Personalized Daily Stroke Recovery Plan:</strong><br/><br/>
      Physiotherapists recommend <strong>3 short sessions of 15 minutes</strong> daily to drive neuroplasticity without muscle exhaustion:<br/><br/>
      🌅 <strong>Morning (15 mins) — Fine Motor Control:</strong><br/>
      • <em>Piano Finger Independence:</em> 2 sets to isolate single fingers and overcome clenched fists.<br/>
      • <em>9-Hole Pegboard Pinch:</em> 2 sets to strengthen thumb-index pincer grip.<br/><br/>
      ☀️ <strong>Afternoon (15 mins) — Arm & Shoulder Reach:</strong><br/>
      • <em>Forearm Knob Turning:</em> 2 sets to restore wrist rotation for door handles and faucets.<br/>
      • <em>Shelf Reaching:</em> 2 sets of overhead reaching to stretch tight bicep muscles.<br/>
      • <em>Planar Window Sweep:</em> 1 set for wide, smooth arm sweeps.<br/><br/>
      🌙 <strong>Evening (15 mins) — Speech & Facial Therapy:</strong><br/>
      • <em>Facial Symmetry Mirror:</em> 1 set of smile, brow, and lip pucker exercises.<br/>
      • <em>Speech Therapy Lab:</em> 5 mins of vowel and word pronunciation practice.<br/>
      • <em>ROM & Tremor Lab:</em> Test your joint angles to log your progress!`;
    }

    // Hand Stiffness / Fingers / Wrist
    if (q.includes('stiff') || q.includes('hand') || q.includes('finger') || q.includes('pinch') || q.includes('wrist') || q.includes('grip') || q.includes('fist')) {
      return `🤲 <strong>Hand & Finger Mobility Recommendations:</strong><br/>
      1. <strong>Warm Towel Compress (5 mins):</strong> Relaxes tight, spastic hand muscles.<br/>
      2. <strong>Piano Finger Independence:</strong> Play in the <em>Rehab Games</em> tab to practice opening one finger at a time.<br/>
      3. <strong>9-Hole Pegboard Pinch:</strong> Practice picking up and releasing pegs to rebuild fine grip for spoons and buttons.<br/>
      4. <strong>Forearm Knob Turn:</strong> Rebuild wrist rotation to turn keys and open bottle caps.`;
    }

    // Arm / Shoulder / Reaching
    if (q.includes('arm') || q.includes('shoulder') || q.includes('elbow') || q.includes('reach') || q.includes('lift')) {
      return `💪 <strong>Upper Limb & Shoulder Strengthening:</strong><br/>
      • <strong>Shelf Reaching & Stacking:</strong> Practice overhead arm elevation to counter bicep contractures.<br/>
      • <strong>Planar Window Sweep:</strong> Wide sweeping motions stretch stiff chest and shoulder muscles.<br/>
      • <strong>Bilateral Mirroring:</strong> Use your unaffected arm to guide your recovering arm in synchronized reaches.`;
    }

    // Tremor / Jitter / Smoothness
    if (q.includes('tremor') || q.includes('smooth') || q.includes('shake') || q.includes('jerk') || q.includes('ataxia')) {
      return `🌊 <strong>Tremor Reduction & Motor Smoothness:</strong><br/>
      • Practice slow, rhythmic arm sweeps in <em>Planar Window Sweep</em> to retrain cerebellar coordination.<br/>
      • Open the <strong>ROM & Tremor Lab</strong> tab to measure your tremor frequency and spectral power.<br/>
      • Rest if muscle fatigue sets in, as fatigue increases motor tremor.`;
    }

    // Speech / Facial droop
    if (q.includes('speech') || q.includes('face') || q.includes('droop') || q.includes('talk') || q.includes('voice') || q.includes('smile')) {
      return `🗣️ <strong>Speech & Facial Neuromuscular Re-education:</strong><br/>
      • Play <strong>Facial Symmetry Biofeedback</strong> in the <em>Rehab Games</em> tab to strengthen facial nerve control.<br/>
      • Visit the <strong>Speech Therapy Lab</strong> in the sidebar to practice vocal articulation and vowel sustainment.`;
    }

    // F.A.S.T. Stroke Warning
    if (q.includes('fast') || q.includes('symptom') || q.includes('warning') || q.includes('emergency')) {
      return `🚨 <strong>F.A.S.T. Emergency Stroke Warning Checklist:</strong><br/>
      • <strong>F (Face Drooping):</strong> One side of face droops when smiling.<br/>
      • <strong>A (Arm Weakness):</strong> One arm drifts downward when raised.<br/>
      • <strong>S (Speech Difficulty):</strong> Speech is slurred or strange.<br/>
      • <strong>T (Time to Call Emergency):</strong> Call 911 / 112 immediately if present!`;
    }

    // Fatigue / Rest
    if (q.includes('fatigue') || q.includes('tired') || q.includes('rest') || q.includes('sleep') || q.includes('exhaust')) {
      return `⚡ <strong>Managing Therapy Fatigue:</strong><br/>
      • High frequency, short duration (three 15-min sessions) is far more effective than one long tiring session.<br/>
      • Rest 30 minutes and hydrate if movements become shaky or uncoordinated.<br/>
      • Ensure 7-8 hours of nighttime sleep for brain neuroplastic consolidation.`;
    }

    // Generic stroke question
    return `🩺 <strong>Clinical Recovery Insight:</strong> For your stroke rehabilitation, maintaining consistent daily repetitions re-wires damaged neural circuits. You can practice fine motor exercises in the <strong>Rehab Games</strong> tab, check joint angles in the <strong>ROM & Tremor Lab</strong>, or ask me for specific guidance on any symptom!`;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    appendMessage('user', text);

    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'ai-typing-indicator';
    typingIndicator.style.cssText = 'display:flex;gap:8px;align-items:center;padding:10px 16px;color:#6b7280;font-size:0.85rem;';
    typingIndicator.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> AI Coach is analyzing...';
    messagesBox.appendChild(typingIndicator);
    scrollToBottom();

    const reply = await queryAiAdvisor(text);

    const indicator = document.getElementById('ai-typing-indicator');
    if (indicator) indicator.remove();
    appendMessage('ai', reply);
  };

  window.sendQuickPrompt = (promptText) => {
    input.value = promptText;
    form.dispatchEvent(new Event('submit'));
  };

  clearBtn.onclick = () => {
    messagesBox.innerHTML = '';
    appendMessage('ai', 'Session refreshed. How can I support your rehabilitation routine now?');
    Toast.info('New chat session started.');
  };

  fastBtn.onclick = () => {
    window.sendQuickPrompt('FAST stroke check');
  };
}
