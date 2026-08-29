/* Parent Dashboard */
import API from '../api.js';
import Loader from '../components/loader.js';
import { StatCard, ActivityTable } from '../components/cards.js';
import { createLineChart } from '../components/charts.js';

export default function renderParentDashboard() {
  return `
    <div class="welcome-section">
      <h1>Caregiver Dashboard</h1>
      <p class="welcome-date" id="parent-pat-name">Monitoring progress</p>
    </div>
    
    <div id="parent-content">
      <div id="stats-container" class="stats-row"></div>
      
      <div class="dashboard-grid">
        <div class="chart-container full-width">
          <h3>Weekly Progress</h3>
          <canvas id="parent-weekly-chart"></canvas>
        </div>
        
        <div class="glass-card full-width">
          <h3>Recent Activity</h3>
          <div id="parent-activity-container"></div>
        </div>
      </div>
    </div>
  `;
}

export async function initParentDashboard() {
  Loader.skeleton('stats-container', 4);
  const c = document.getElementById('parent-content');
  
  try {
    const data = await API.getParentDashboard();
    
    if (data.message === 'No patient linked yet') {
      document.getElementById('parent-pat-name').textContent = '';
      c.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-link"></i>
          <h3>No Patient Linked</h3>
          <p>Please update your profile settings with the patient's email code to link accounts.</p>
        </div>
      `;
      return;
    }
    
    document.getElementById('parent-pat-name').textContent = `Monitoring ${data.patient.name}'s progress`;
    
    document.getElementById('stats-container').innerHTML = `
      ${StatCard({ icon: 'fa-fire', title: 'Current Streak', value: data.streak.current_streak + ' Days', colorClass: 'warning' })}
      ${StatCard({ icon: 'fa-gamepad', title: 'Total Sessions', value: data.total_sessions, colorClass: 'primary' })}
      ${StatCard({ icon: 'fa-bullseye', title: 'Avg Accuracy', value: data.avg_accuracy + '%', colorClass: 'success' })}
      ${StatCard({ icon: 'fa-arrow-up', title: 'Weekly Improvement', value: (data.weekly_improvement>0?'+':'') + data.weekly_improvement + '%', colorClass: 'secondary' })}
    `;
    
    const wp = data.weekly_progress;
    if (wp && wp.length > 0) {
      const labels = wp.map(d => {
        const dt = new Date(d.date);
        return `${dt.getMonth()+1}/${dt.getDate()}`;
      });
      createLineChart('parent-weekly-chart', labels, [
        { label: 'Avg Score', data: wp.map(d => d.score), color: '#6C63FF' },
        { label: 'Accuracy %', data: wp.map(d => d.accuracy), color: '#00C853' }
      ]);
    } else {
      document.getElementById('parent-weekly-chart').parentElement.innerHTML = '<div class="empty-state"><p>No data for this week yet.</p></div>';
    }
    
    document.getElementById('parent-activity-container').innerHTML = ActivityTable(data.recent_activity.slice(0,10));
    
  } catch (err) {
    console.error(err);
    c.innerHTML = '<div class="form-error">Failed to load patient data.</div>';
  }
}
