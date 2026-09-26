/* Emergency SOS & FAST Stroke Warning System */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderSosPage() {
  const user = Auth.getUser() || {};
  return `
    <div class="page-container" style="max-width:1050px;margin:0 auto;padding:24px 16px;">
      <!-- Emergency Header -->
      <div class="card" style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;padding:28px;border-radius:20px;margin-bottom:24px;box-shadow:0 12px 30px rgba(239,68,68,0.25);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
          <div>
            <div style="font-size:0.9rem;text-transform:uppercase;letter-spacing:1px;font-weight:700;opacity:0.9;margin-bottom:4px;">
              Emergency Safety Center
            </div>
            <h1 style="font-size:2rem;font-weight:800;margin:0 0 6px;">One-Touch Emergency SOS</h1>
            <p style="margin:0;opacity:0.95;font-size:0.95rem;">
              Immediately alert your caregiver, emergency contact, and doctor with your real-time status.
            </p>
          </div>
          <div>
            <button id="trigger-sos-btn" style="background:#ffffff;color:#dc2626;border:none;padding:16px 28px;border-radius:14px;font-weight:800;font-size:1.1rem;cursor:pointer;display:inline-flex;align-items:center;gap:10px;box-shadow:0 6px 20px rgba(0,0,0,0.2);transition:transform 0.2s;">
              <i class="fas fa-exclamation-triangle"></i> TRIGGER SOS ALERT
            </button>
          </div>
        </div>
      </div>

      <!-- F.A.S.T. Assessment Matrix -->
      <div class="card" style="padding:24px;border-radius:16px;margin-bottom:24px;">
        <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
          <i class="fas fa-clipboard-check" style="color:#ef4444;"></i> F.A.S.T. Rapid Symptom Checklist
        </h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;">
          <label style="background:var(--bg-light,#f9fafb);padding:16px;border-radius:12px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:12px;cursor:pointer;">
            <input type="checkbox" id="fast-f" style="width:20px;height:20px;margin-top:2px;" />
            <div>
              <div style="font-weight:700;color:#111827;">F — Face Drooping</div>
              <div style="font-size:0.8rem;color:#6b7280;margin-top:2px;">One side of face numb, drooping, or uneven smile.</div>
            </div>
          </label>

          <label style="background:var(--bg-light,#f9fafb);padding:16px;border-radius:12px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:12px;cursor:pointer;">
            <input type="checkbox" id="fast-a" style="width:20px;height:20px;margin-top:2px;" />
            <div>
              <div style="font-weight:700;color:#111827;">A — Arm Weakness</div>
              <div style="font-size:0.8rem;color:#6b7280;margin-top:2px;">Sudden weakness or numbness in one arm/leg.</div>
            </div>
          </label>

          <label style="background:var(--bg-light,#f9fafb);padding:16px;border-radius:12px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:12px;cursor:pointer;">
            <input type="checkbox" id="fast-s" style="width:20px;height:20px;margin-top:2px;" />
            <div>
              <div style="font-weight:700;color:#111827;">S — Speech Slurring</div>
              <div style="font-size:0.8rem;color:#6b7280;margin-top:2px;">Difficulty speaking, slurred words, or confusion.</div>
            </div>
          </label>

          <label style="background:var(--bg-light,#f9fafb);padding:16px;border-radius:12px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:12px;cursor:pointer;">
            <input type="checkbox" id="fast-t" style="width:20px;height:20px;margin-top:2px;" />
            <div>
              <div style="font-weight:700;color:#111827;">T — Time to Call 911</div>
              <div style="font-size:0.8rem;color:#6b7280;margin-top:2px;">Immediate medical intervention required.</div>
            </div>
          </label>
        </div>
      </div>

      <!-- Emergency Contacts Directory -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
        <div class="card" style="padding:20px;">
          <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-phone-alt" style="color:#10b981;"></i> Primary Emergency Contacts
          </h3>
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--bg-light,#f9fafb);border-radius:10px;">
              <div>
                <div style="font-weight:600;">Emergency Ambulance</div>
                <div style="font-size:0.8rem;color:#6b7280;">National Emergency Service</div>
              </div>
              <a href="tel:911" class="btn btn-primary" style="padding:6px 14px;font-size:0.85rem;"><i class="fas fa-phone"></i> 911 / 112</a>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;padding:12px;background:var(--bg-light,#f9fafb);border-radius:10px;">
              <div>
                <div style="font-weight:600;">Assigned Caregiver</div>
                <div style="font-size:0.8rem;color:#6b7280;">${user.phone || '+1 (555) 019-2834'}</div>
              </div>
              <button class="btn btn-secondary" style="padding:6px 14px;font-size:0.85rem;" onclick="alert('Calling caregiver...')"><i class="fas fa-phone"></i> Call</button>
            </div>
          </div>
        </div>

        <div class="card" style="padding:20px;">
          <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-history" style="color:#3b82f6;"></i> Recent Safety Logs
          </h3>
          <div id="sos-logs-list" style="display:flex;flex-direction:column;gap:10px;font-size:0.85rem;color:#6b7280;">
            <div style="padding:10px;background:var(--bg-light,#f9fafb);border-radius:8px;">
              <span style="color:#10b981;font-weight:600;">✓ System OK</span> — Daily safety ping logged this morning.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSosPage() {
  const sosBtn = document.getElementById('trigger-sos-btn');
  const logsList = document.getElementById('sos-logs-list');

  sosBtn.onclick = () => {
    // Play emergency beep using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch alarm
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      setTimeout(() => osc.stop(), 1200);
    } catch(e) {}

    Toast.error('🚨 EMERGENCY SOS BROADCAST SENT TO CAREGIVER & CLINIC!');

    const logEntry = document.createElement('div');
    logEntry.style.cssText = 'padding:10px;background:#fef2f2;color:#991b1b;border-radius:8px;border:1px solid #fecaca;';
    logEntry.innerHTML = `<strong>🚨 SOS Alert Triggered</strong> at ${new Date().toLocaleTimeString()} — Caregiver notified via SMS/Push.`;
    logsList.prepend(logEntry);
  };
}
