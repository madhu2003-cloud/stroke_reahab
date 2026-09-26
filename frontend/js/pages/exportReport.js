/* Clinical PDF & Print-ready Hospital Recovery Report */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderExportReport() {
  const user = Auth.getUser() || {};
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `
    <div class="page-container" style="max-width:1050px;margin:0 auto;padding:24px 16px;">
      <!-- Action Bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin:0 0 4px;">
            <i class="fas fa-file-pdf" style="color:#ef4444;"></i> Clinical Rehabilitation Report
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;margin:0;">
            Printable medical progress document formatted for hospital consultations & insurance verification.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="download-pdf-btn" style="display:inline-flex;align-items:center;gap:8px;padding:12px 22px;font-size:0.95rem;background:#ef4444;border-color:#ef4444;">
            <i class="fas fa-file-pdf"></i> Download PDF Report
          </button>
          <button class="btn btn-secondary" id="print-report-btn" style="display:inline-flex;align-items:center;gap:8px;padding:12px 20px;font-size:0.95rem;">
            <i class="fas fa-print"></i> Print Report
          </button>
        </div>
      </div>

      <!-- Printable Clinical Sheet -->
      <div id="printable-clinical-report" class="card" style="padding:40px;background:#ffffff;color:#111827;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.08);border:1px solid #e5e7eb;">
        <!-- Header -->
        <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #4f46e5;padding-bottom:20px;margin-bottom:24px;">
          <div>
            <h2 style="font-size:1.6rem;font-weight:800;color:#4f46e5;margin:0 0 4px;">AURA StrokeRehab Clinical Report</h2>
            <div style="font-size:0.85rem;color:#6b7280;">Digital Neuro-Rehabilitation & Kinematic Tracking Platform</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:0.85rem;font-weight:700;">Date: ${today}</div>
            <div style="font-size:0.8rem;color:#6b7280;">Report Ref: #SR-${Date.now().toString().slice(-6)}</div>
          </div>
        </div>

        <!-- Patient Demographics Summary -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;background:#f8fafc;padding:16px 20px;border-radius:12px;margin-bottom:28px;border:1px solid #e2e8f0;">
          <div>
            <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:600;display:block;">Patient Name</span>
            <strong style="font-size:1rem;color:#0f172a;">${user.name || 'Alex Rivers'}</strong>
          </div>
          <div>
            <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:600;display:block;">Role / Patient ID</span>
            <strong style="font-size:1rem;color:#0f172a;">PAT-${user.id || '2026-042'}</strong>
          </div>
          <div>
            <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:600;display:block;">Current Daily Streak</span>
            <strong style="font-size:1rem;color:#10b981;">7 Consecutive Days 🔥</strong>
          </div>
          <div>
            <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:600;display:block;">Overall Recovery Index</span>
            <strong style="font-size:1rem;color:#4f46e5;">88.4% (Advanced)</strong>
          </div>
        </div>

        <!-- Metric Table -->
        <h3 style="font-size:1.15rem;font-weight:700;margin-bottom:12px;color:#1e293b;">Functional & Kinematic Assessment Summary</h3>
        <table style="width:100%;border-collapse:collapse;margin-bottom:28px;font-size:0.9rem;">
          <thead>
            <tr style="background:#f1f5f9;border-bottom:2px solid #cbd5e1;text-align:left;">
              <th style="padding:10px 14px;">Therapy Domain</th>
              <th style="padding:10px 14px;">Baseline</th>
              <th style="padding:10px 14px;">Current Value</th>
              <th style="padding:10px 14px;">Improvement Rate</th>
              <th style="padding:10px 14px;">Clinical Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:12px 14px;font-weight:600;">Elbow Flexion ROM</td>
              <td style="padding:12px 14px;">85°</td>
              <td style="padding:12px 14px;font-weight:700;color:#0f172a;">132°</td>
              <td style="padding:12px 14px;color:#16a34a;">+55.2%</td>
              <td style="padding:12px 14px;"><span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:6px;font-size:0.8rem;font-weight:700;">Normal Band</span></td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:12px 14px;font-weight:600;">Fine Motor Reaction Time</td>
              <td style="padding:12px 14px;">1.42s</td>
              <td style="padding:12px 14px;font-weight:700;color:#0f172a;">0.68s</td>
              <td style="padding:12px 14px;color:#16a34a;">+52.1%</td>
              <td style="padding:12px 14px;"><span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:6px;font-size:0.8rem;font-weight:700;">Rapid Progress</span></td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:12px 14px;font-weight:600;">Path Following Smoothness</td>
              <td style="padding:12px 14px;">1.85 Jerk</td>
              <td style="padding:12px 14px;font-weight:700;color:#0f172a;">0.74 Jerk</td>
              <td style="padding:12px 14px;color:#16a34a;">+60.0%</td>
              <td style="padding:12px 14px;"><span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:6px;font-size:0.8rem;font-weight:700;">Low Tremor</span></td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:12px 14px;font-weight:600;">Speech Pronunciation Clarity</td>
              <td style="padding:12px 14px;">58%</td>
              <td style="padding:12px 14px;font-weight:700;color:#0f172a;">86%</td>
              <td style="padding:12px 14px;color:#16a34a;">+48.2%</td>
              <td style="padding:12px 14px;"><span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:6px;font-size:0.8rem;font-weight:700;">Cleared Target</span></td>
            </tr>
          </tbody>
        </table>

        <!-- Doctor Remarks & Verification Section -->
        <div style="border-top:1px solid #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-end;">
          <div>
            <div style="font-weight:700;font-size:0.9rem;margin-bottom:4px;">Supervising Physiotherapist / Neurologist:</div>
            <div style="font-size:0.85rem;color:#64748b;">Dr. Sarah Vance, MD (Neuro-Rehabilitation Specialist)</div>
          </div>
          <div style="text-align:right;">
            <div style="width:160px;border-bottom:1px solid #000;margin-bottom:4px;"></div>
            <div style="font-size:0.8rem;color:#64748b;">Authorized Clinical Signature</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initExportReport() {
  const printBtn = document.getElementById('print-report-btn');
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  const reportElement = document.getElementById('printable-clinical-report');

  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
      Toast.info('Opening print dialog...');
    };
  }

  if (downloadPdfBtn) {
    downloadPdfBtn.onclick = () => {
      Toast.info('Generating PDF document...');
      if (window.html2pdf && reportElement) {
        const opt = {
          margin: [10, 10, 10, 10],
          filename: `StrokeRehab_Clinical_Report_${Date.now().toString().slice(-6)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        window.html2pdf().set(opt).from(reportElement).save().then(() => {
          Toast.success('PDF Report downloaded successfully! 📄');
        }).catch((err) => {
          console.error(err);
          window.print();
        });
      } else {
        window.print();
      }
    };
  }
}
