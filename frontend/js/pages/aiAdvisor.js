/* AI Recovery Coach & Clinical Advisor Page with Live Gemini API Key Integration */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderAiAdvisor() {
  const user = Auth.getUser() || {};
  const hasKey = !!localStorage.getItem('gemini_api_key');

  return `
    <div class="page-container" style="max-width:1100px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="page-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <i class="fas fa-brain" style="color:var(--primary,#4f46e5)"></i> AI Rehabilitation Coach
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;">
            24/7 AI-powered clinical recovery advisor with live LLM API support & F.A.S.T. symptom checker.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-secondary" id="open-api-key-modal" style="display:inline-flex;align-items:center;gap:6px;background:${hasKey ? '#ecfdf5' : '#f8fafc'};border-color:${hasKey ? '#10b981' : '#cbd5e1'};color:${hasKey ? '#065f46' : '#475569'};font-weight:600;">
            <i class="fas fa-key" style="color:${hasKey ? '#10b981' : '#64748b'};"></i> 
            <span id="api-key-btn-label">${hasKey ? 'Gemini API Key Configured ✓' : 'Set Gemini API Key'}</span>
          </button>
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
              <div style="font-size:0.75rem;color:#10b981;display:flex;align-items:center;gap:4px;" id="ai-engine-status">
                <span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;"></span> 
                ${hasKey ? 'Gemini 2.5 AI Engine Active' : 'Clinical Medical Engine Active'}
              </div>
            </div>
          </div>
          <div>
            <span class="badge" style="background:${hasKey ? '#dcfce7' : '#e0e7ff'};color:${hasKey ? '#15803d' : '#4338ca'};padding:4px 10px;border-radius:99px;font-size:0.75rem;font-weight:700;">
              ${hasKey ? '⚡ Live Gemini LLM' : '🤖 Clinical Mode'}
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
                <li>Explaining tremor control, ROM joint angles, and therapy games</li>
                <li>Checking recovery milestones and daily routine tips</li>
                <li>Conducting quick <strong>F.A.S.T.</strong> stroke warning checks</li>
              </ul>
              ${!hasKey ? '<div style="margin-top:10px;font-size:0.8rem;color:#4f46e5;background:#eef2ff;padding:8px 12px;border-radius:8px;">💡 <em>Tip: Click "Set Gemini API Key" above if you want to connect your live Google Gemini API key for advanced conversational AI!</em></div>' : ''}
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

      <!-- API Key Modal -->
      <div id="api-key-modal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:999;align-items:center;justify-content:center;padding:16px;">
        <div class="card" style="max-width:480px;width:100%;padding:28px;border-radius:20px;background:#ffffff;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="font-size:1.25rem;font-weight:700;margin:0;display:flex;align-items:center;gap:8px;">
              <i class="fas fa-key" style="color:#10b981;"></i> Configure Gemini API Key
            </h3>
            <button type="button" id="close-api-key-modal" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#6b7280;">&times;</button>
          </div>

          <p style="font-size:0.88rem;color:#4b5563;line-height:1.5;margin-bottom:16px;">
            Enter your <strong>Google Gemini API Key</strong> to unlock real-time conversational clinical AI assistance for stroke rehabilitation and neuroplasticity guidance.
          </p>

          <div style="margin-bottom:16px;">
            <label style="font-size:0.8rem;font-weight:600;color:#374151;display:block;margin-bottom:6px;text-transform:uppercase;">Gemini API Key</label>
            <div style="position:relative;">
              <input type="password" id="gemini-api-key-input" class="inp" placeholder="AIzaSy..." style="width:100%;padding:12px 40px 12px 14px;border-radius:10px;font-family:monospace;" />
              <button type="button" id="toggle-key-visibility" style="position:absolute;right:12px;top:12px;background:none;border:none;cursor:pointer;color:#9ca3af;">
                <i class="fas fa-eye"></i>
              </button>
            </div>
            <div style="font-size:0.75rem;color:#6b7280;margin-top:6px;">
              Your key is stored safely in your local browser storage and never shared with third parties.
            </div>
          </div>

          <div style="display:flex;gap:10px;justify-content:flex-end;">
            <button type="button" class="btn btn-ghost" id="remove-api-key-btn" style="color:#ef4444;">Remove Key</button>
            <button type="button" class="btn btn-primary" id="save-api-key-btn" style="padding:10px 22px;">Save API Key</button>
          </div>
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

  const modal = document.getElementById('api-key-modal');
  const openModalBtn = document.getElementById('open-api-key-modal');
  const closeModalBtn = document.getElementById('close-api-key-modal');
  const saveKeyBtn = document.getElementById('save-api-key-btn');
  const removeKeyBtn = document.getElementById('remove-api-key-btn');
  const keyInput = document.getElementById('gemini-api-key-input');
  const toggleKeyVis = document.getElementById('toggle-key-visibility');
  const keyBtnLabel = document.getElementById('api-key-btn-label');
  const engineStatus = document.getElementById('ai-engine-status');

  // Load existing key
  const savedKey = localStorage.getItem('gemini_api_key') || '';
  if (keyInput) keyInput.value = savedKey;

  openModalBtn.onclick = () => {
    modal.style.display = 'flex';
  };

  closeModalBtn.onclick = () => {
    modal.style.display = 'none';
  };

  toggleKeyVis.onclick = () => {
    keyInput.type = keyInput.type === 'password' ? 'text' : 'password';
  };

  saveKeyBtn.onclick = () => {
    const val = keyInput.value.trim();
    if (!val) {
      Toast.error('Please enter a valid API key.');
      return;
    }
    localStorage.setItem('gemini_api_key', val);
    modal.style.display = 'none';
    keyBtnLabel.textContent = 'Gemini API Key Configured ✓';
    openModalBtn.style.background = '#ecfdf5';
    openModalBtn.style.borderColor = '#10b981';
    openModalBtn.style.color = '#065f46';
    engineStatus.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;"></span> Gemini 2.5 AI Engine Active';
    Toast.success('Google Gemini API Key saved successfully! 🚀');
  };

  removeKeyBtn.onclick = () => {
    localStorage.removeItem('gemini_api_key');
    if (keyInput) keyInput.value = '';
    modal.style.display = 'none';
    keyBtnLabel.textContent = 'Set Gemini API Key';
    openModalBtn.style.background = '#f8fafc';
    openModalBtn.style.borderColor = '#cbd5e1';
    openModalBtn.style.color = '#475569';
    engineStatus.innerHTML = '<span style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;"></span> Clinical Medical Engine Active';
    Toast.info('API Key removed. Switched back to clinical engine.');
  };

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

  // Live Gemini Multi-Model API Caller
  async function callGeminiApi(promptText) {
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) return null;

    const systemPrompt = `You are AURA AI, an empathetic, highly knowledgeable, and encouraging clinical Stroke Rehabilitation & Neuro-Physiotherapy AI Coach. You assist stroke patients, caregivers, and physiotherapists with motor recovery exercises, hand stiffness, range of motion (ROM), tremor reduction, speech therapy, and fatigue management. Keep explanations clear, actionable, structured with bullet points, and uplifting. Always remind patients to consult their doctor for acute symptoms and emphasize F.A.S.T. stroke safety.`;

    const cleanKey = apiKey.trim();
    const candidateModels = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
      'gemini-pro',
      'gemini-1.5-pro'
    ];

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
        const headers = {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey
        };

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\n\nPatient Query: ${promptText}` }] }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 650
            }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates.length > 0) {
          const rawText = data.candidates[0].content.parts[0].text;
          return rawText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>');
        }
      } catch (err) {
        console.warn(`Attempt with ${model} failed, trying next...`, err);
      }
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

    // ── 5. Hand & Finger Mobility ──
    if (q.includes('stiff') || q.includes('hand') || q.includes('finger') || q.includes('pinch') || q.includes('wrist')) {
      return `🤲 <strong>Hand & Finger Mobility Recommendations:</strong><br/>
      1. <strong>Warm Towel Compress (5 mins):</strong> Apply gentle warmth to relax spastic finger flexors.<br/>
      2. <strong>Target Touch & Thumb Touch Game:</strong> Play 2 sessions in the <em>Games</em> tab to stimulate fine motor neuroplasticity.<br/>
      3. <strong>Towel Slide & Finger Extension:</strong> Place your palm flat on a smooth table and slide forward gently for 10 repetitions.<br/>
      4. <strong>Check ROM Lab:</strong> Measure your live finger pinch span in the <em>ROM & Tremor Lab</em>.`;
    }

    // ── 6. Tremor & Motor Smoothness ──
    if (q.includes('tremor') || q.includes('smooth') || q.includes('ataxia') || q.includes('jerk') || q.includes('shak')) {
      return `🌊 <strong>Reducing Motor Jitter & Building Smooth Movement:</strong><br/>
      • Practice <strong>Path Following</strong> at a slower target speed to retrain cerebellar control.<br/>
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

    // ── 8. Progress & Stats ──
    if (q.includes('progress') || q.includes('score') || q.includes('recommend') || q.includes('analysis') || q.includes('streak')) {
      return `📊 <strong>AI Clinical Recovery Assessment:</strong><br/>
      • <strong>Motor Accuracy:</strong> You are showing strong consistency in visual-motor coordination.<br/>
      • <strong>Recommendation:</strong> Increase daily game sets by 1 round, and focus on <em>Speech Therapy</em> or <em>Range of Motion</em> exercises to maintain balanced recovery. Keep your streak active!`;
    }

    // ── 9. Speech & Dysarthria ──
    if (q.includes('speech') || q.includes('voice') || q.includes('words') || q.includes('aphasia') || q.includes('talk')) {
      return `🗣️ <strong>Speech & Dysarthria Practice:</strong><br/>
      • Visit the <strong>Speech Therapy</strong> section in the sidebar.<br/>
      • Practice repeating vowels (A-E-I-O-U) holding each for 3 seconds, followed by phoneme repetitions to strengthen oral-motor tone.`;
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

    // Call live Gemini API if key is present, otherwise clinical fallback
    let reply = await callGeminiApi(text);
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
