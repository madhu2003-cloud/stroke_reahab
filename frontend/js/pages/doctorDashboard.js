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
