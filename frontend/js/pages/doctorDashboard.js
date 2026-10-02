/* Doctor Dashboard */
import API from '../api.js';
import Loader from '../components/loader.js';
import { StatCard, PatientCard } from '../components/cards.js';
import Toast from '../components/toast.js';

export default function renderDoctorDashboard() {
  return `
    <div class="welcome-section">
      <h1>Doctor Dashboard</h1>
      <p class="welcome-date">Overview of your assigned patients</p>
    </div>

    <div style="background:linear-gradient(135deg,#4f46e5,#3b82f6);color:#ffffff;padding:16px 22px;border-radius:16px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;box-shadow:0 6px 18px rgba(79,70,229,0.25);">
      <div>
        <div style="font-weight:700;font-size:1rem;display:flex;align-items:center;gap:8px;">
          <i class="fas fa-microscope" style="color:#a5b4fc;"></i> 15-Patient Clinical Benchmark & Kinematic Validation Lab
        </div>
        <div style="font-size:0.86rem;opacity:0.95;margin-top:2px;">
          Evaluate FMA-UE scores, test video datasets against Brunnstrom recovery stages, & export verification sheets.
        </div>
      </div>
      <a href="#/benchmark" class="btn" style="background:#ffffff;color:#4f46e5;font-weight:700;border-radius:10px;padding:9px 18px;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        Open Benchmark Lab 🔬
      </a>
    </div>
    
    <div id="stats-container" class="stats-row"></div>
    
    <div class="dashboard-grid">
      <div class="glass-card full-width">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:12px;">
          <h3 style="margin:0">Assigned Patients</h3>
          <div style="display:flex;gap:12px;">
            <input type="email" id="assign-email" class="form-input" placeholder="Patient Email" style="width:250px;padding:8px 12px;">
            <button class="btn btn-primary btn-sm" id="assign-btn">Assign</button>
          </div>
        </div>
        
        <div id="patients-list" style="display:grid;gap:16px;grid-template-columns:1fr;"></div>
      </div>
    </div>
  `;
}

export async function initDoctorDashboard() {
  Loader.skeleton('stats-container', 4);
  const pList = document.getElementById('patients-list');
  pList.innerHTML = Loader.inlineSpinner();
  
  try {
    const data = await API.getDoctorDashboard();
    
    document.getElementById('stats-container').innerHTML = `
      ${StatCard({ icon: 'fa-users', title: 'Total Patients', value: data.total_patients, colorClass: 'primary' })}
      ${StatCard({ icon: 'fa-user-check', title: 'Active (7 days)', value: data.active_patients, colorClass: 'success' })}
      ${StatCard({ icon: 'fa-exclamation-triangle', title: 'Needs Attention', value: data.needs_attention, colorClass: 'error' })}
      ${StatCard({ icon: 'fa-chart-line', title: 'Avg Progress Score', value: data.avg_progress, colorClass: 'secondary' })}
    `;
    
    if (data.patients && data.patients.length > 0) {
      pList.innerHTML = data.patients.map(p => PatientCard({ patient: p })).join('');
    } else {
      pList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-users-slash"></i>
          <h3>No Patients Assigned</h3>
          <p>Use the form above to assign patients via their email address.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error("Doc Dash error", err);
    pList.innerHTML = '<div class="form-error">Failed to load patients.</div>';
  }
  
  const assignBtn = document.getElementById('assign-btn');
  if (assignBtn) {
    assignBtn.onclick = async () => {
      const email = document.getElementById('assign-email').value.trim();
      if (!email) return Toast.error('Enter patient email');
      
      assignBtn.disabled = true;
      assignBtn.innerHTML = Loader.inlineSpinner();
      
      try {
        await API.assignPatient(email);
        Toast.success('Patient assigned!');
        document.getElementById('assign-email').value = '';
        initDoctorDashboard(); // Reload
      } catch (err) {
        Toast.error(err.message || 'Failed to assign patient');
      } finally {
        assignBtn.disabled = false;
        assignBtn.innerHTML = 'Assign';
      }
    };
  }
}
