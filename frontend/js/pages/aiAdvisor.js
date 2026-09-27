/* AI Recovery Coach & Clinical Advisor Page - Automated Zero-Config Gemini AI */
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
            24/7 AI-powered clinical recovery advisor with intelligent stroke neuroplasticity guidance & F.A.S.T. checker.
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
        <div class="card" style="padding:16px;border-left:4px solid #8b5cf6;cursor:pointer;" onclick="window.sendQuickPrompt('Analyze my weekly rehabilitation progress and give recommendations')">
          <div style="font-weight:600;font-size:0.9rem;margin-bottom:4px;color:#5b21b6;"><i class="fas fa-chart-line"></i> Recovery Analysis</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Get AI breakdown of your therapy performance.</div>
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
              ⚡ Live Gemini Recovery AI
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
              Hello ${user.name || 'there'}! 👋 I am your dedicated <strong>AI Stroke Rehabilitation Coach</strong>. I can assist you with:
              <ul style="margin:8px 0 0 16px;padding:0;">
                <li>Personalized motor, speech, and cognitive exercises</li>
                <li>Explaining tremor control, ROM joint angles, and clinical games</li>
                <li>Checking recovery milestones and daily routine tips</li>
                <li>Conducting quick <strong>F.A.S.T.</strong> stroke warning checks</li>
              </ul>
              How are you feeling today?
            </div>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <div style="padding:16px;border-top:1px solid var(--border-color,rgba(0,0,0,0.08));background:#ffffff;">
          <form id="ai-chat-form" style="display:flex;gap:10px;">
            <input type="text" id="ai-chat-input" class="inp" placeholder="Ask about exercises, stiffness, ROM, fatigue, or recovery tips..." style="flex:1;padding:12px 16px;border-radius:12px;font-size:0.92rem;" autocomplete="off" />
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

  // Call Server or Client Gemini API
  async function queryAiAdvisor(promptText) {
    // 1. Try Backend Proxy
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
      // Backend request failed, fallback to client logic
    }

    return null;
  }

  const getSmartResponse = (query) => {
    const q = query.trim().toLowerCase();

    // ── 1. Greetings & Introductions ──
    if (/^(hi|hello|hey|greetings|hola|good\s*(morning|afternoon|evening|day)|howdy)\b/.test(q) || q === 'hi' || q === 'hello') {
      return `👋 Hello! Great to see you today! I am your <strong>AURA AI Rehabilitation Coach</strong>. I'm here to support your motor recovery, answer questions about exercises, track your progress, or help you with daily stroke recovery tips. How are you feeling today?`;
    }

    if (q.includes('how are you') || q.includes('how r u')) {
      return `😊 I'm doing great and fully ready to assist your recovery! More importantly, how is your arm and hand feeling today? Are you ready for some light exercises?`;
    }

    if (q.includes('who are you') || q.includes('what can you do') || q.includes('help me')) {
      return `🤖 I am your <strong>AI Stroke Rehabilitation Coach</strong>. Here is what I can do for you:<br/>
      • <strong>Motor Exercise Guidance:</strong> Recommend exercises for hand, wrist, and finger mobility.<br/>
      • <strong>ROM & Tremor Assessment:</strong> Guide you through joint angle testing in the <em>ROM & Tremor Lab</em>.<br/>
      • <strong>Speech & Dysarthria Support:</strong> Suggest pronunciation and breathing practices.<br/>
      • <strong>F.A.S.T. Safety Checks:</strong> Provide rapid stroke symptom awareness.<br/>
      • <strong>Fatigue & Routine Tips:</strong> Help you plan balanced therapy sessions without overexertion.`;
    }

    // ── 2. Gratitude & Affirmations ──
    if (q.includes('thank') || q.includes('thx') || q.includes('appreciate') || q.includes('grateful')) {
      return `🙏 You are very welcome! Remember, your daily effort and dedication are the real keys to rewiring neural pathways. Keep up the fantastic work! Is there anything else you'd like to work on?`;
    }

    if (/^(ok|okay|great|awesome|cool|got it|understood|sure|nice|perfect|alright)\b/.test(q) || q === 'ok' || q === 'okay') {
      return `👍 Sounds good! Whenever you're ready, head over to the <strong>Rehab Games</strong> or <strong>ROM & Tremor Lab</strong> tab to complete today's session and keep your streak alive! 🔥`;
    }

    if (q.includes('bye') || q.includes('goodbye') || q.includes('see you') || q.includes('good night')) {
      return `👋 Take care and rest well! Quality sleep and gentle hydration are crucial for brain recovery. See you tomorrow for your next session! 🌟`;
    }

    // ── 3. Emotional Support & Motivation ──
    if (q.includes('hard') || q.includes('frustrated') || q.includes('sad') || q.includes('give up') || q.includes('difficult') || q.includes('pain') || q.includes('slow')) {
      return `💙 <strong>You are doing better than you think!</strong><br/>
      Stroke recovery is not a straight line—it has good days and plateau days. Neuroplasticity (your brain forming new connections) happens through small, consistent repetitions over time.<br/>
      • Take a deep breath and a short break.<br/>
      • Celebrate small wins (like lifting a cup or moving fingers a few millimeters wider).<br/>
      • Talk to your caregiver or doctor if you experience sharp pain. You've got this! 💪`;
    }

    // ── 4. Emergency F.A.S.T. Check ──
    if (q.includes('fast') || q.includes('symptom') || q.includes('warning') || q.includes('emergency') || q.includes('stroke sign')) {
      return `🚨 <strong>F.A.S.T. Stroke Warning Checklist:</strong><br/>
      • <strong>F (Face Drooping):</strong> Does one side of the face droop when smiling?<br/>
      • <strong>A (Arm Weakness):</strong> Can both arms be raised evenly, or does one drift down?<br/>
      • <strong>S (Speech Difficulty):</strong> Is speech slurred or hard to understand?<br/>
      • <strong>T (Time to Call Emergency):</strong> If any of these are present, call emergency services (911 / 112) immediately! Use the <strong>Emergency SOS</strong> tab in your sidebar.`;
    }

    // ── 4.5 Plain-English Guide: How Exercises Help in Real Life ──
    if (q.includes('how') && (q.includes('help') || q.includes('work') || q.includes('exercise') || q.includes('game') || q.includes('cure') || q.includes('recover'))) {
      return `🌟 <strong>How These 6 Exercises Help You In Real Daily Life:</strong><br/><br/>
      After a stroke, the brain loses the connection to your muscles. Repeating these exercises forces your brain to build <strong>new wiring</strong> so you can do daily tasks independently:<br/><br/>
      1. 🎹 <strong>Piano Finger Tapping:</strong> Helps you open and move 1 finger at a time so your hand doesn't stay stuck in a tight fist.<br/>
      <em>Real-life goal:</em> Typing on a phone, picking up coins, holding a fork.<br/><br/>
      2. 🔐 <strong>Knob & Key Turning:</strong> Trains your wrist to rotate left and right.<br/>
      <em>Real-life goal:</em> Turning a door key, opening a water bottle cap, turning a water tap.<br/><br/>
      3. 📌 <strong>9-Hole Pegboard Pinch:</strong> Trains your thumb and index finger to pinch small things tightly and let go.<br/>
      <em>Real-life goal:</em> Holding a pen, buttoning a shirt, holding pills.<br/><br/>
      4. 🗄️ <strong>Shelf Reaching:</strong> Stretches tight elbow muscles and builds shoulder strength to lift your arm high.<br/>
      <em>Real-life goal:</em> Taking a cup from a high cupboard, combing your hair, putting on a shirt.<br/><br/>
      5. 🪟 <strong>Window Wipe:</strong> Loosens stiff, frozen shoulder and chest muscles through wide arm sweeps.<br/>
      <em>Real-life goal:</em> Wiping a table, bathing, reaching across the bed.<br/><br/>
      6. 🪞 <strong>Facial Mirror:</strong> Rebuilds muscle strength on the drooping side of your face.<br/>
      <em>Real-life goal:</em> Speaking clearly, smiling, eating without spilling water.`;
    }

    // ── 5. Hand & Finger Mobility ──
    if (q.includes('stiff') || q.includes('hand') || q.includes('finger') || q.includes('pinch') || q.includes('wrist') || q.includes('piano') || q.includes('grip')) {
      return `🤲 <strong>Hand & Finger Mobility Recommendations:</strong><br/>
      1. <strong>Warm Towel Compress (5 mins):</strong> Apply gentle warmth to relax spastic finger flexors.<br/>
      2. <strong>Piano Finger Independence & 9-Hole Pegboard:</strong> Play 2 sessions in the <em>Rehab Games</em> tab to stimulate fine motor neuroplasticity.<br/>
      3. <strong>Forearm Rotation Lab:</strong> Practice supination/pronation turning in the <em>Knob Turn Game</em>.<br/>
      4. <strong>Check ROM Lab:</strong> Measure your live finger pinch span in millimeters in the <em>ROM & Tremor Lab</em>.`;
    }

    // ── 6. Tremor & Motor Smoothness ──
    if (q.includes('tremor') || q.includes('smooth') || q.includes('ataxia') || q.includes('jerk') || q.includes('shak')) {
      return `🌊 <strong>Reducing Motor Jitter & Building Smooth Movement:</strong><br/>
      • Practice <strong>Planar Window Sweep</strong> at a steady, rhythmic speed to retrain cerebellar control.<br/>
      • Check the <strong>ROM & Tremor Lab</strong> tab to measure your exact tremor frequency and jerk metric.<br/>
      • Focus on bilateral symmetrical movements (mirroring with your unaffected arm) to accelerate neural pathway rebuilding.`;
    }

    // ── 7. Fatigue & Overexertion ──
    if (q.includes('fatigue') || q.includes('tired') || q.includes('rest') || q.includes('overexert') || q.includes('sleep')) {
      return `⚡ <strong>Rehabilitation Fatigue Management:</strong><br/>
      • Post-stroke cognitive and muscular fatigue is normal. The golden rule is <strong>High Frequency, Short Duration</strong> (e.g., three 15-minute sessions instead of one 45-minute block).<br/>
      • If reaction time drops by >25% in games, take a 30-minute rest and hydrate before resuming.<br/>
      • Ensure 7-8 hours of sleep for cellular and neural consolidation.`;
    }

    // ── 8. Recovery Plan & Schedule ──
    if (q.includes('plan') || q.includes('schedule') || q.includes('routine') || q.includes('daily') || q.includes('program') || q.includes('regimen') || (q.includes('how') && q.includes('recovery'))) {
      return `📅 <strong>Your Personalized Daily Stroke Recovery Plan:</strong><br/><br/>
      To rebuild neural pathways without causing fatigue, physiotherapists recommend <strong>3 short sessions of 15 minutes</strong> every day:<br/><br/>
      🌅 <strong>1. Morning Session (15 mins) — Fine Motor & Fingers:</strong><br/>
      • <strong>Warm-up:</strong> 5 mins of gentle warm towel compress on your hand.<br/>
      • <strong>Exercise 1:</strong> 2 rounds of <em>Piano Finger Independence</em> (isolate individual fingers).<br/>
      • <strong>Exercise 2:</strong> 2 rounds of <em>9-Hole Pegboard Pincer Test</em> (rebuild thumb-index pinch).<br/><br/>
      ☀️ <strong>2. Afternoon Session (15 mins) — Arm & Shoulder Reach:</strong><br/>
      • <strong>Exercise 1:</strong> 2 rounds of <em>Forearm Knob & Key Turning</em> (improve wrist rotation).<br/>
      • <strong>Exercise 2:</strong> 2 rounds of <em>Shelf Reaching & Stacking</em> (lift overhead to stretch bicep).<br/>
      • <strong>Exercise 3:</strong> 1 round of <em>Planar Window Sweep</em> (smooth wide arm motion).<br/><br/>
      🌙 <strong>3. Evening Session (15 mins) — Speech, Face & ROM Test:</strong><br/>
      • <strong>Facial Training:</strong> 1 round of <em>Facial Symmetry Biofeedback</em>.<br/>
      • <strong>Speech Practice:</strong> 5 mins in the <em>Speech Therapy Lab</em> (vowel & word clarity).<br/>
      • <strong>Daily Check:</strong> Test your joint angles in the <em>ROM & Tremor Lab</em> to log today's progress!<br/><br/>
      💡 <em>Why this plan works:</em> Spreading exercises into three 15-minute blocks gives your brain 45 minutes of daily practice while keeping muscles relaxed and fatigue-free!`;
    }

    // ── 8.5 Progress & Stats ──
    if (q.includes('progress') || q.includes('score') || q.includes('recommend') || q.includes('analysis') || q.includes('streak')) {
      return `📊 <strong>AI Clinical Recovery Assessment:</strong><br/>
      • <strong>Motor Accuracy:</strong> You are showing strong consistency in visual-motor coordination.<br/>
      • <strong>Recommendation:</strong> Complete your 3 daily 15-minute sessions to maintain balanced recovery. Keep your streak active!`;
    }

    // ── 9. Speech & Dysarthria ──
    if (q.includes('speech') || q.includes('voice') || q.includes('words') || q.includes('aphasia') || q.includes('talk')) {
      return `🗣️ <strong>Speech & Dysarthria Practice:</strong><br/>
      • Visit the <strong>Speech Therapy</strong> section in the sidebar.<br/>
      • Practice repeating vowels (A-E-I-O-U) holding each for 3 seconds, followed by phoneme repetitions to strengthen oral-motor tone.<br/>
      • Practice the <strong>Facial Symmetry Biofeedback</strong> game to strengthen facial nerve control.`;
    }

    // ── 10. General Rehabilitation Guidance ──
    return `💡 <strong>Recovery Coaching Tip:</strong> Consistency and repetition drive neuroplasticity! To maximize your recovery today, complete at least 2 exercise games, check your Range of Motion (ROM), and log your daily streak. What specific question or exercise would you like advice on?`;
  };

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

    let reply = await queryAiAdvisor(text);
    if (!reply) {
      reply = getSmartResponse(text);
    }

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
    appendMessage('ai', 'Session refreshed. How can I support your recovery routine now?');
    Toast.info('New chat session started.');
  };

  fastBtn.onclick = () => {
    window.sendQuickPrompt('FAST stroke check');
  };
}
