/* Patient Detail Page (Doctor View) */
import API from '../api.js';
import Loader from '../components/loader.js';
import { StatCard, ActivityTable } from '../components/cards.js';
import { createLineChart } from '../components/charts.js';

export default function renderPatientDetail() {
  return `
    <div class="welcome-section" style="display:flex;justify-content:space-between;align-items:flex-end;">
      <div>
        <a href="#/patients" class="btn btn-ghost btn-sm" style="margin-bottom:12px;padding-left:0;"><i class="fas fa-arrow-left"></i> Back to Patients</a>
        <h1 id="det-name">Loading...</h1>
        <p class="welcome-date" id="det-email"></p>
      </div>
    </div>
    
    <div id="det-content">
      <div id="stats-container" class="stats-row"></div>
      
      <div class="dashboard-grid">
        <div class="chart-container full-width">
          <h3>Progress Overview</h3>
          <canvas id="det-chart"></canvas>
        </div>
        
        <div class="glass-card full-width">
          <h3>Recent Activity</h3>
          <div id="det-activity"></div>
        </div>
      </div>
    </div>
  `;
}

export async function initPatientDetail(params) {
  const patientId = params.id;
  Loader.skeleton('stats-container', 4);
  
  try {
    const data = await API.getPatientDetail(patientId);
    
    document.getElementById('det-name').textContent = data.patient.name;
    document.getElementById('det-email').textContent = `${data.patient.email} • Age: ${data.patient.age||'--'} • ${data.patient.gender||'--'}`;
    
    document.getElementById('stats-container').innerHTML = `
      ${StatCard({ icon: 'fa-fire', title: 'Current Streak', value: data.streak.current_streak, colorClass: 'warning' })}
      ${StatCard({ icon: 'fa-gamepad', title: 'Total Sessions', value: data.stats.total_sessions, colorClass: 'primary' })}
      ${StatCard({ icon: 'fa-bullseye', title: 'Avg Accuracy', value: data.stats.avg_accuracy + '%', colorClass: 'success' })}
      ${StatCard({ icon: 'fa-arrow-up', title: 'Weekly Improvement', value: (data.weekly_improvement>0?'+':'') + data.weekly_improvement + '%', colorClass: 'secondary' })}
    `;
    
    const wp = data.weekly_progress;
    if (wp && wp.length > 0) {
      const labels = wp.map(d => {
        const dt = new Date(d.date);
        return `${dt.getMonth()+1}/${dt.getDate()}`;
      });
      createLineChart('det-chart', labels, [
        { label: 'Avg Score', data: wp.map(d => d.score), color: '#6C63FF' },
        { label: 'Accuracy %', data: wp.map(d => d.accuracy), color: '#00C853' }
      ]);
    } else {
      document.getElementById('det-chart').parentElement.innerHTML = '<div class="empty-state"><p>No data for this week yet.</p></div>';
    }
    
    document.getElementById('det-activity').innerHTML = ActivityTable(data.recent_activity.slice(0,10));
    
  } catch (err) {
    console.error(err);
    document.getElementById('det-content').innerHTML = '<div class="form-error">Failed to load patient details.</div>';
  }
}
