/* Doctor Prescriptions & Therapy Regimen Builder */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderPrescriptionsPage() {
  const user = Auth.getUser() || {};
  const isDoctor = user.role === 'doctor';

  return `
    <div class="page-container" style="max-width:1150px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="page-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <i class="fas fa-file-medical-alt" style="color:var(--primary,#4f46e5)"></i> Therapy Regimens & Prescriptions
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;">
            ${isDoctor ? 'Prescribe custom exercise schedules, set repetitions, and track patient compliance.' : 'Your clinical therapy assignments and daily prescribed exercise goals.'}
          </p>
        </div>
        ${isDoctor ? `
          <button class="btn btn-primary" id="open-prescribe-modal" style="display:inline-flex;align-items:center;gap:6px;">
            <i class="fas fa-plus"></i> New Prescription
          </button>
        ` : ''}
      </div>

      <!-- Prescriptions List -->
      <div class="card" style="padding:24px;border-radius:16px;margin-bottom:24px;">
        <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:16px;">Active Therapy Regimens</h2>
        <div id="prescriptions-list" style="display:flex;flex-direction:column;gap:16px;">
          <!-- Item 1 -->
          <div style="background:var(--bg-light,#f9fafb);padding:18px 20px;border-radius:14px;border:1px solid var(--border-color,#e5e7eb);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
            <div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
                <span style="font-weight:700;font-size:1.05rem;color:var(--text-primary,#111827);">Fine Motor Finger Dexterity Plan</span>
                <span class="badge" style="background:#dcfce7;color:#15803d;padding:3px 8px;border-radius:99px;font-size:0.75rem;font-weight:700;">Active</span>
              </div>
              <div style="font-size:0.85rem;color:var(--text-secondary,#6b7280);">
                <strong>Prescribed by:</strong> Dr. Sarah Vance • <strong>Daily Target:</strong> 3 Sets Target Touch + 2 Sets Path Following
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:16px;">
              <div style="text-align:right;">
                <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Today's Compliance:</div>
                <div style="font-weight:800;color:#10b981;font-size:1.1rem;">100% (Completed)</div>
              </div>
              <a href="#/games" class="btn btn-secondary" style="padding:8px 16px;font-size:0.85rem;">Play Exercises</a>
            </div>
          </div>

          <!-- Item 2 -->
          <div style="background:var(--bg-light,#f9fafb);padding:18px 20px;border-radius:14px;border:1px solid var(--border-color,#e5e7eb);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;">
            <div>
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px;">
                <span style="font-weight:700;font-size:1.05rem;color:var(--text-primary,#111827);">Range of Motion & Speech Cadence</span>
                <span class="badge" style="background:#e0e7ff;color:#4338ca;padding:3px 8px;border-radius:99px;font-size:0.75rem;font-weight:700;">In Progress</span>
              </div>
              <div style="font-size:0.85rem;color:var(--text-secondary,#6b7280);">
                <strong>Prescribed by:</strong> Dr. Sarah Vance • <strong>Daily Target:</strong> 10 mins ROM Joint Lab + 5 Vocal Phrases
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:16px;">
              <div style="text-align:right;">
                <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Today's Compliance:</div>
                <div style="font-weight:800;color:#f59e0b;font-size:1.1rem;">60% (1 Set Left)</div>
              </div>
              <a href="#/speech-therapy" class="btn btn-primary" style="padding:8px 16px;font-size:0.85rem;">Start Speech</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initPrescriptionsPage() {
  const modalBtn = document.getElementById('open-prescribe-modal');
  if (modalBtn) {
    modalBtn.onclick = () => {
      Toast.info('Doctor Prescription Form opened.');
    };
  }
}
