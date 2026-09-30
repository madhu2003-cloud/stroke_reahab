/* Clinical PDF & Print-ready Hospital Recovery Report - Fully Dynamic */
import API from '../api.js';
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderExportReport() {
  return `
    <div class="page-container" style="max-width:1100px;margin:0 auto;padding:24px 16px;">
      <!-- Action Bar -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin:0 0 4px;">
            <i class="fas fa-file-pdf" style="color:#ef4444;"></i> Clinical Rehabilitation Report
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;margin:0;">
            Evidence-based medical progress document generated dynamically from real patient sensor & exercise kinematics.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          <div id="patient-selector-container" style="display:none;"></div>
          <button class="btn btn-primary" id="download-pdf-btn" style="display:inline-flex;align-items:center;gap:8px;padding:12px 22px;font-size:0.95rem;background:#ef4444;border-color:#ef4444;">
            <i class="fas fa-file-pdf"></i> Download PDF Report
          </button>
          <button class="btn btn-secondary" id="print-report-btn" style="display:inline-flex;align-items:center;gap:8px;padding:12px 20px;font-size:0.95rem;">
            <i class="fas fa-print"></i> Print Report
          </button>
        </div>
      </div>

      <!-- Report Container -->
      <div id="report-content-wrapper">
        <div class="card" style="padding:60px 20px;text-align:center;background:#fff;border-radius:16px;">
          <i class="fas fa-circle-notch fa-spin" style="font-size:2rem;color:#4f46e5;margin-bottom:12px;"></i>
          <p style="color:#64748b;font-weight:500;">Compiling dynamic clinical recovery report...</p>
        </div>
      </div>
    </div>
  `;
}

export async function initExportReport() {
  const wrapper = document.getElementById('report-content-wrapper');
  const user = Auth.getUser() || {};
  const isDoctor = user.role === 'doctor';
  const selectorContainer = document.getElementById('patient-selector-container');

  async function loadReport(patientId = null) {
    try {
      wrapper.innerHTML = `
        <div class="card" style="padding:60px 20px;text-align:center;background:#fff;border-radius:16px;">
          <i class="fas fa-circle-notch fa-spin" style="font-size:2rem;color:#4f46e5;margin-bottom:12px;"></i>
          <p style="color:#64748b;font-weight:500;">Retrieving patient kinematics & exercise metrics...</p>
        </div>
      `;

      const res = await API.getClinicalReport(patientId);
      const patient = res.patient || {};
      const streak = res.streak || {};
      const rep = res.report || {};
      const stats = rep.stats || {};
      const domains = rep.domains || [];
      const recent = rep.recent_activity || [];
      const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const refCode = `SR-${(patient.id || 1).toString().padStart(3, '0')}-${Date.now().toString().slice(-4)}`;

      // Active minutes calculation
      const activeMinutes = Math.round((stats.total_time || 0) / 60);

      wrapper.innerHTML = `
        <!-- Printable Clinical Sheet -->
        <div id="printable-clinical-report" class="card" style="padding:40px;background:#ffffff;color:#111827;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.08);border:1px solid #e5e7eb;">
          
          <!-- Header -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #4f46e5;padding-bottom:20px;margin-bottom:24px;flex-wrap:wrap;gap:12px;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <i class="fas fa-heartbeat" style="color:#4f46e5;font-size:1.6rem;"></i>
                <h2 style="font-size:1.6rem;font-weight:800;color:#4f46e5;margin:0;">StrokeRehab Clinical Recovery Report</h2>
              </div>
              <div style="font-size:0.85rem;color:#6b7280;">Evidence-Based Telerehabilitation & Kinematic Assessment • FMA & ARAT Aligned</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.88rem;font-weight:700;color:#0f172a;">Generated: ${today}</div>
              <div style="font-size:0.8rem;color:#6b7280;">Report Ref: <strong>#${refCode}</strong></div>
            </div>
          </div>

          <!-- Patient Demographics & Key Recovery Indices -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:16px;background:#f8fafc;padding:18px 20px;border-radius:12px;margin-bottom:28px;border:1px solid #e2e8f0;">
            <div>
              <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:700;display:block;margin-bottom:2px;">Patient Name</span>
              <strong style="font-size:1.05rem;color:#0f172a;">${patient.name || 'Anonymous Patient'}</strong>
              <div style="font-size:0.8rem;color:#64748b;">${patient.email || ''}</div>
            </div>
            <div>
              <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:700;display:block;margin-bottom:2px;">Patient ID / Profile</span>
              <strong style="font-size:1rem;color:#0f172a;">PAT-${(patient.id || 1).toString().padStart(4, '0')}</strong>
              <div style="font-size:0.8rem;color:#64748b;">Age: ${patient.age || 'N/A'} • ${patient.gender || 'Not specified'}</div>
            </div>
            <div>
              <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:700;display:block;margin-bottom:2px;">Adherence & Streak</span>
              <strong style="font-size:1.05rem;color:#10b981;">${streak.current_streak || 0} Consecutive Days 🔥</strong>
              <div style="font-size:0.8rem;color:#64748b;">Longest Streak: ${streak.longest_streak || 0} Days</div>
            </div>
            <div>
              <span style="font-size:0.75rem;color:#64748b;text-transform:uppercase;font-weight:700;display:block;margin-bottom:2px;">Clinical Recovery Index</span>
              <strong style="font-size:1.05rem;color:#4f46e5;">${stats.recovery_index || 0}%</strong>
              <div style="font-size:0.78rem;font-weight:600;color:#3b82f6;">${stats.clinical_stage || 'Baseline Assessment'}</div>
            </div>
          </div>

          <!-- Quick Metrics Bar -->
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:28px;">
            <div style="background:#f1f5f9;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-size:0.75rem;color:#64748b;font-weight:600;text-transform:uppercase;">Total Sessions</div>
              <div style="font-size:1.25rem;font-weight:800;color:#0f172a;">${stats.total_sessions || 0}</div>
            </div>
            <div style="background:#f1f5f9;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-size:0.75rem;color:#64748b;font-weight:600;text-transform:uppercase;">Active Therapy</div>
              <div style="font-size:1.25rem;font-weight:800;color:#0f172a;">${activeMinutes} <span style="font-size:0.85rem;font-weight:500;">mins</span></div>
            </div>
            <div style="background:#f1f5f9;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-size:0.75rem;color:#64748b;font-weight:600;text-transform:uppercase;">Total Movements</div>
              <div style="font-size:1.25rem;font-weight:800;color:#0f172a;">${stats.total_reps || 0} <span style="font-size:0.85rem;font-weight:500;">reps</span></div>
            </div>
            <div style="background:#f1f5f9;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-size:0.75rem;color:#64748b;font-weight:600;text-transform:uppercase;">Average Accuracy</div>
              <div style="font-size:1.25rem;font-weight:800;color:#10b981;">${stats.avg_accuracy || 0}%</div>
            </div>
            <div style="background:#f1f5f9;padding:12px 14px;border-radius:10px;text-align:center;">
              <div style="font-size:0.75rem;color:#64748b;font-weight:600;text-transform:uppercase;">Weekly Trend</div>
              <div style="font-size:1.25rem;font-weight:800;color:${(rep.improvement || 0) >= 0 ? '#10b981' : '#ef4444'};">
                ${(rep.improvement || 0) >= 0 ? '+' : ''}${rep.improvement || 0}%
              </div>
            </div>
          </div>

          <!-- Metric Table -->
          <div style="margin-bottom:28px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
              <h3 style="font-size:1.15rem;font-weight:700;color:#1e293b;margin:0;">
                <i class="fas fa-chart-line" style="color:#4f46e5;margin-right:6px;"></i> Functional & Kinematic Assessment Summary
              </h3>
              <span style="font-size:0.8rem;color:#64748b;">(Generated from patient exercise sessions)</span>
            </div>
            <div style="overflow-x:auto;">
              <table style="width:100%;border-collapse:collapse;font-size:0.88rem;">
                <thead>
                  <tr style="background:#f1f5f9;border-bottom:2px solid #cbd5e1;text-align:left;">
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Therapy Domain & Target</th>
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Sessions / Reps</th>
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Baseline</th>
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Current / Best</th>
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Improvement</th>
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Kinematics</th>
                    <th style="padding:10px 14px;font-weight:700;color:#334155;">Clinical Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${domains.map(d => `
                    <tr style="border-bottom:1px solid #e2e8f0;">
                      <td style="padding:12px 14px;">
                        <strong style="color:#0f172a;display:block;">${d.domain}</strong>
                        <span style="font-size:0.75rem;color:#64748b;">${d.clinical_target}</span>
                      </td>
                      <td style="padding:12px 14px;color:#334155;">
                        <strong>${d.sessions}</strong> sess <span style="font-size:0.8rem;color:#64748b;">(${d.repetitions} reps)</span>
                      </td>
                      <td style="padding:12px 14px;color:#64748b;">${d.baseline}</td>
                      <td style="padding:12px 14px;font-weight:700;color:#0f172a;">${d.current}</td>
                      <td style="padding:12px 14px;font-weight:700;color:${d.improvement_rate.startsWith('+') ? '#16a34a' : '#64748b'};">
                        ${d.improvement_rate}
                      </td>
                      <td style="padding:12px 14px;font-size:0.8rem;color:#475569;">
                        ${d.reaction_time !== '--' ? `⚡ ${d.reaction_time}` : ''}
                        ${d.smoothness !== '--' ? `🎯 ${d.smoothness}` : ''}
                        ${d.reaction_time === '--' && d.smoothness === '--' ? `<span style="color:#94a3b8;">--</span>` : ''}
                      </td>
                      <td style="padding:12px 14px;">
                        <span style="background:${d.status_bg};color:${d.status_color};padding:4px 10px;border-radius:6px;font-size:0.75rem;font-weight:700;white-space:nowrap;">
                          ${d.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Dynamic Clinical Notes & AI Recovery Remarks -->
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:18px 20px;margin-bottom:28px;">
            <h4 style="font-size:0.95rem;font-weight:700;color:#1e40af;margin:0 0 8px;display:flex;align-items:center;gap:8px;">
              <i class="fas fa-stethoscope"></i> Neuro-Physiotherapist & AI Clinical Evaluation
            </h4>
            <p style="font-size:0.88rem;color:#1e3a8a;line-height:1.55;margin:0;">
              ${rep.clinical_notes || 'Patient progress is tracked continuously via computer vision biofeedback.'}
            </p>
          </div>

          <!-- Recent Exercise Audit Log -->
          <div style="margin-bottom:30px;">
            <h3 style="font-size:1.1rem;font-weight:700;color:#1e293b;margin:0 0 12px;">
              <i class="fas fa-history" style="color:#4f46e5;margin-right:6px;"></i> Recent Exercise Session History
            </h3>
            ${recent.length > 0 ? `
              <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:0.85rem;">
                  <thead>
                    <tr style="background:#f8fafc;border-bottom:1px solid #cbd5e1;text-align:left;">
                      <th style="padding:8px 12px;color:#475569;">Date / Time</th>
                      <th style="padding:8px 12px;color:#475569;">Module Name</th>
                      <th style="padding:8px 12px;color:#475569;">Score</th>
                      <th style="padding:8px 12px;color:#475569;">Accuracy</th>
                      <th style="padding:8px 12px;color:#475569;">Reps</th>
                      <th style="padding:8px 12px;color:#475569;">Reaction Time</th>
                      <th style="padding:8px 12px;color:#475569;">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recent.slice(0, 10).map(r => `
                      <tr style="border-bottom:1px solid #f1f5f9;">
                        <td style="padding:8px 12px;color:#64748b;">${r.date || (r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent')}</td>
                        <td style="padding:8px 12px;font-weight:600;color:#0f172a;">${r.game_name || r.game_type}</td>
                        <td style="padding:8px 12px;font-weight:700;color:#4f46e5;">${r.score} pts</td>
                        <td style="padding:8px 12px;color:#16a34a;font-weight:600;">${r.accuracy}%</td>
                        <td style="padding:8px 12px;color:#334155;">${r.repetitions || 0}</td>
                        <td style="padding:8px 12px;color:#64748b;">${r.reaction_time ? `${r.reaction_time}s` : '--'}</td>
                        <td style="padding:8px 12px;color:#64748b;">${r.duration || 0}s</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : `
              <div style="background:#f8fafc;border:1px dashed #cbd5e1;padding:24px;border-radius:10px;text-align:center;color:#64748b;font-size:0.9rem;">
                No exercise sessions logged yet for this patient. Start a rehabilitation module to record kinematic telemetry!
              </div>
            `}
          </div>

          <!-- Doctor Remarks & Verification Section -->
          <div style="border-top:1px solid #e2e8f0;padding-top:20px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:16px;">
            <div>
              <div style="font-weight:700;font-size:0.88rem;color:#0f172a;margin-bottom:2px;">Clinical Tele-Rehabilitation System:</div>
              <div style="font-size:0.82rem;color:#64748b;">StrokeRehab AURA Clinical Engine • Vision-Based Kinematic Telemetry</div>
              <div style="font-size:0.78rem;color:#94a3b8;margin-top:2px;">This document certifies patient performance recorded under clinical exercise protocols.</div>
            </div>
            <div style="text-align:right;">
              <div style="width:180px;border-bottom:1.5px solid #334155;margin-bottom:6px;"></div>
              <div style="font-size:0.8rem;color:#475569;font-weight:600;">Authorized Medical Signature / Stamp</div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      console.error(err);
      wrapper.innerHTML = `
        <div class="card" style="padding:40px 20px;text-align:center;background:#fff;border-radius:16px;">
          <i class="fas fa-exclamation-triangle" style="font-size:2rem;color:#ef4444;margin-bottom:12px;"></i>
          <p style="color:#1e293b;font-weight:700;margin-bottom:6px;">Failed to load clinical report data</p>
          <p style="color:#64748b;font-size:0.9rem;margin-bottom:16px;">${err.message || 'Please ensure you have completed exercise sessions.'}</p>
          <button class="btn btn-primary btn-sm" id="retry-report-btn">Retry Loading</button>
        </div>
      `;
      const retryBtn = document.getElementById('retry-report-btn');
      if (retryBtn) retryBtn.onclick = () => loadReport(patientId);
    }
  }

  // Doctor multi-patient dropdown support
  if (isDoctor) {
    try {
      const pRes = await API.getPatients();
      const patients = pRes.patients || [];
      if (patients.length > 0 && selectorContainer) {
        selectorContainer.style.display = 'block';
        selectorContainer.innerHTML = `
          <select id="doc-patient-select" class="form-control" style="padding:8px 12px;font-size:0.9rem;border-radius:8px;border:1px solid #cbd5e1;background:#fff;cursor:pointer;">
            ${patients.map(p => `<option value="${p.id}">${p.name} (PAT-${p.id})</option>`).join('')}
          </select>
        `;
        const select = document.getElementById('doc-patient-select');
        if (select) {
          select.onchange = (e) => loadReport(e.target.value);
          await loadReport(patients[0].id);
        }
      } else {
        await loadReport();
      }
    } catch (e) {
      await loadReport();
    }
  } else {
    await loadReport();
  }

  // Print button handler
  const printBtn = document.getElementById('print-report-btn');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
      Toast.info('Opening print dialog...');
    };
  }

  // Download PDF button handler
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.onclick = () => {
      const reportElement = document.getElementById('printable-clinical-report');
      if (!reportElement) {
        Toast.error('Report is still loading...');
        return;
      }
      Toast.info('Generating PDF document...');
      if (window.html2pdf) {
        const opt = {
          margin: [8, 8, 8, 8],
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
