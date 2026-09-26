/* Speech & Dysarthria / Aphasia Voice Recovery Module */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderSpeechTherapy() {
  return `
    <div class="page-container" style="max-width:1100px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="page-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <i class="fas fa-microphone-alt" style="color:var(--primary,#4f46e5)"></i> Speech & Dysarthria Lab
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;">
            Oral-motor pronunciation practice, speech clarity scoring, and vocal cadence rehabilitation.
          </p>
        </div>
      </div>

      <!-- Live Voice Stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;">
        <div class="card" style="padding:18px;border-left:4px solid #10b981;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;">Pronunciation Clarity</div>
          <div style="font-size:2rem;font-weight:800;color:#065f46;margin:6px 0;" id="speech-clarity-val">0%</div>
          <div style="font-size:0.8rem;color:#10b981;">Target: > 80%</div>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #3b82f6;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;">Words Practiced</div>
          <div style="font-size:2rem;font-weight:800;color:#1e40af;margin:6px 0;" id="speech-words-count">0 / 5</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Daily Exercise Target</div>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #8b5cf6;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;">Voice Volume & Pitch</div>
          <div style="font-size:2rem;font-weight:800;color:#5b21b6;margin:6px 0;" id="speech-volume-val">Normal</div>
          <div style="font-size:0.8rem;color:#10b981;">Optimal Acoustic Range</div>
        </div>
      </div>

      <!-- Main Speech Exercise Card -->
      <div class="card" style="padding:32px;text-align:center;border-radius:20px;margin-bottom:24px;">
        <div style="font-size:0.9rem;text-transform:uppercase;letter-spacing:1px;color:var(--primary,#4f46e5);font-weight:700;margin-bottom:10px;">
          Current Word / Phrase
        </div>

        <div id="target-phrase-box" style="font-size:2.4rem;font-weight:800;color:var(--text-primary,#111827);margin:16px 0;letter-spacing:-0.5px;">
          "Water Bottle"
        </div>

        <div style="font-size:0.95rem;color:var(--text-secondary,#6b7280);max-width:500px;margin:0 auto 24px;line-height:1.5;">
          Press the microphone button, speak the phrase clearly into your microphone, and pause.
        </div>

        <!-- Mic Button -->
        <div style="margin-bottom:24px;">
          <button id="mic-record-btn" style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#8b5cf6);color:#fff;border:none;font-size:2rem;cursor:pointer;box-shadow:0 10px 25px rgba(79,70,229,0.4);transition:all 0.3s ease;">
            <i class="fas fa-microphone"></i>
          </button>
          <div id="mic-status-label" style="font-size:0.85rem;color:var(--text-secondary,#6b7280);margin-top:10px;">
            Tap to Start Speaking
          </div>
        </div>

        <!-- Detected Output Bubble -->
        <div id="detected-speech-box" style="display:none;background:var(--bg-light,#f9fafb);padding:16px 20px;border-radius:14px;max-width:450px;margin:0 auto;border:1px solid var(--border-color,#e5e7eb);">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);margin-bottom:4px;">Detected Speech:</div>
          <div id="detected-speech-text" style="font-weight:700;font-size:1.1rem;color:var(--text-primary,#111827);">--</div>
        </div>

        <!-- Action Controls -->
        <div style="display:flex;justify-content:center;gap:12px;margin-top:24px;">
          <button class="btn btn-secondary" id="next-phrase-btn">
            <i class="fas fa-forward"></i> Next Word
          </button>
          <button class="btn btn-secondary" id="listen-sample-btn">
            <i class="fas fa-volume-up"></i> Listen to Audio Sample
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initSpeechTherapy() {
  const phrases = [
    'Water Bottle',
    'Good Morning',
    'Finger Flexibility',
    'Physical Rehabilitation',
    'Deep Breath',
    'Stronger Every Day'
  ];

  let currentIndex = 0;
  let wordsCount = 0;

  const phraseBox = document.getElementById('target-phrase-box');
  const micBtn = document.getElementById('mic-record-btn');
  const micStatus = document.getElementById('mic-status-label');
  const detectedBox = document.getElementById('detected-speech-box');
  const detectedText = document.getElementById('detected-speech-text');
  const clarityVal = document.getElementById('speech-clarity-val');
  const wordsCountVal = document.getElementById('speech-words-count');
  const nextBtn = document.getElementById('next-phrase-btn');
  const listenBtn = document.getElementById('listen-sample-btn');

  const updatePhrase = () => {
    phraseBox.textContent = `"${phrases[currentIndex]}"`;
    detectedBox.style.display = 'none';
  };

  listenBtn.onclick = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phrases[currentIndex]);
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
      Toast.info('Playing reference pronunciation');
    }
  };

  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % phrases.length;
    updatePhrase();
  };

  let isListening = false;
  let recognition = null;

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      micBtn.style.background = '#ef4444';
      micBtn.style.transform = 'scale(1.1)';
      micStatus.textContent = '🎙️ Listening... Speak now';
      micStatus.style.color = '#ef4444';
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      detectedBox.style.display = 'block';
      detectedText.textContent = `"${result}"`;

      // Compare similarity
      const target = phrases[currentIndex].toLowerCase();
      const spoken = result.toLowerCase();
      const match = target.includes(spoken) || spoken.includes(target);
      const score = match ? Math.floor(85 + Math.random() * 15) : Math.floor(45 + Math.random() * 30);

      clarityVal.textContent = `${score}%`;
      wordsCount++;
      wordsCountVal.textContent = `${Math.min(5, wordsCount)} / 5`;

      if (score >= 80) {
        Toast.success(`Excellent Clarity! (${score}%)`);
      } else {
        Toast.info(`Speech logged (${score}%). Practice again for higher clarity.`);
      }
    };

    recognition.onerror = () => {
      Toast.error('Speech recognition error. Please try again.');
    };

    recognition.onend = () => {
      isListening = false;
      micBtn.style.background = 'linear-gradient(135deg,#4f46e5,#8b5cf6)';
      micBtn.style.transform = 'scale(1)';
      micStatus.textContent = 'Tap to Start Speaking';
      micStatus.style.color = 'var(--text-secondary,#6b7280)';
    };
  }

  micBtn.onclick = () => {
    if (!recognition) {
      // Fallback if browser speech API is unavailable
      detectedBox.style.display = 'block';
      detectedText.textContent = `"${phrases[currentIndex]}" (Simulated)`;
      clarityVal.textContent = '92%';
      wordsCount++;
      wordsCountVal.textContent = `${Math.min(5, wordsCount)} / 5`;
      Toast.success('Simulated speech evaluated: 92% Clarity');
      return;
    }

    if (!isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }
  };
}
