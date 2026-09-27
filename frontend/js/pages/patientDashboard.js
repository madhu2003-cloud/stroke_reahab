/* Patient Dashboard */
import API from '../api.js';
import Loader from '../components/loader.js';
import { StatCard, ActivityTable } from '../components/cards.js';
import { createLineChart, createBarChart } from '../components/charts.js';
import { getGreeting } from '../utils.js';

export default function renderPatientDashboard() {
  return `
    <div class="welcome-section">
      <h1 id="dash-greeting">Hello! 👋</h1>
      <p class="welcome-date" id="dash-date">Ready for today's rehabilitation session?</p>
    </div>
    
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#ffffff;padding:18px 24px;border-radius:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px;box-shadow:0 8px 20px rgba(79,70,229,0.25);">
      <div>
        <div style="font-weight:700;font-size:1.05rem;display:flex;align-items:center;gap:8px;">
          <i class="fas fa-star" style="color:#facc15;"></i> Testing our Platform? Share Your Experience!
        </div>
        <div style="font-size:0.88rem;opacity:0.9;margin-top:2px;">
          Answer 6 quick multiple-choice questions & tell us what changes you want us to add!
        </div>
      </div>
      <a href="#/feedback" class="btn" style="background:#ffffff;color:#4f46e5;font-weight:700;border-radius:10px;padding:10px 20px;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
        Give Feedback ⭐
      </a>
    </div>
    
    <div id="dash-content">
      <div id="stats-container" class="stats-row"></div>
      
      <div class="dashboard-grid">
        <div class="glass-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3 style="margin:0"><i class="fas fa-bullseye" style="color:var(--primary);margin-right:8px;"></i> Today's Progress</h3>
            <span class="badge badge-primary" id="today-percent">0%</span>
          </div>
          <div class="progress-bar mb-3">
            <div class="progress-bar-fill" id="today-progress-bar" style="width:0%"></div>
          </div>
          <div style="display:flex;justify-content:space-between;color:var(--text-secondary);font-size:0.9rem;">
            <span id="today-text">0 / 3 exercises completed</span>
            <a href="#/games" style="font-weight:600">Play Now <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
        
        <div class="glass-card">
          <h3 style="margin-bottom:16px;"><i class="fas fa-fire" style="color:var(--warning);margin-right:8px;"></i> Streak Tracker</h3>
          <div class="streak-display">
            <div class="streak-fire">🔥</div>
            <div>
              <div class="streak-number" id="streak-current">0</div>
              <div class="streak-label">Day Streak</div>
            </div>
            <div style="margin-left:auto;text-align:right;">
              <div style="font-size:1.2rem;font-weight:700;color:var(--text-primary);" id="streak-longest">0</div>
              <div class="streak-label">Longest</div>
            </div>
          </div>
          <div class="activity-calendar" id="mini-calendar" style="margin-top:16px;"></div>
        </div>
        
        <div class="chart-container full-width">
          <h3>Weekly Progress</h3>
          <canvas id="weekly-chart"></canvas>
        </div>
        
        <div class="glass-card full-width">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <h3>Recent Activity</h3>
            <a href="#/history" class="btn btn-ghost btn-sm">View All</a>
          </div>
          <div id="recent-activity-container"></div>
        </div>
      </div>
    </div>
  `;
}

export async function initPatientDashboard() {
  Loader.skeleton('stats-container', 4);
  document.getElementById('dash-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  try {
    const data = await API.getPatientDashboard();
    
    if (data.user) {
      document.getElementById('dash-greeting').textContent = `${getGreeting()}, ${data.user.name.split(' ')[0]} 👋`;
    }
    
    // Stats row
    const statsContainer = document.getElementById('stats-container');
    statsContainer.innerHTML = `
      ${StatCard({ icon: 'fa-gamepad', title: 'Total Sessions', value: data.total_sessions, colorClass: 'primary' })}
      ${StatCard({ icon: 'fa-star', title: 'Avg Score', value: data.avg_score, colorClass: 'warning' })}
      ${StatCard({ icon: 'fa-bullseye', title: 'Avg Accuracy', value: data.avg_accuracy + '%', colorClass: 'success' })}
      ${StatCard({ icon: 'fa-clock', title: 'Total Time', value: Math.floor(data.total_time/60)+' min', colorClass: 'secondary' })}
    `;
    
    // Today's Progress
    const tp = data.today_progress;
    document.getElementById('today-percent').textContent = tp.percentage + '%';
    document.getElementById('today-progress-bar').style.width = tp.percentage + '%';
    document.getElementById('today-text').textContent = `${tp.completed} / ${tp.total} exercises completed`;
    
    // Streak
    const st = data.streak;
    document.getElementById('streak-current').textContent = st.current_streak;
    document.getElementById('streak-longest').textContent = st.longest_streak;
    
    // Mini Calendar (last 7 days)
    const cal = await API.getActivityCalendar(7);
    const calHtml = cal.calendar.map(d => {
      const isToday = d.date === new Date().toISOString().slice(0, 10);
      const activeCls = d.completed ? 'active' : 'inactive';
      const todayCls = isToday ? 'today' : '';
      const dayName = new Date(d.date).toLocaleDateString('en-US', {weekday:'short'}).charAt(0);
      return `<div class="cal-day ${activeCls} ${todayCls}">${dayName}</div>`;
    }).join('');
    document.getElementById('mini-calendar').innerHTML = calHtml;
    
    // Chart
    const wp = data.weekly_progress;
    if (wp && wp.length > 0) {
      const labels = wp.map(d => {
        const date = new Date(d.date);
        return `${date.getMonth()+1}/${date.getDate()}`;
      });
      createLineChart('weekly-chart', labels, [
        { label: 'Avg Score', data: wp.map(d => d.score), color: '#6C63FF' },
        { label: 'Accuracy %', data: wp.map(d => d.accuracy), color: '#00C853' }
      ]);
    } else {
      document.getElementById('weekly-chart').parentElement.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><p>No data for this week yet.</p></div>';
    }
    
    // Activity
    document.getElementById('recent-activity-container').innerHTML = ActivityTable(data.recent_activity.slice(0,5));
    
  } catch (err) {
    console.error("Dashboard load failed", err);
  }
}
