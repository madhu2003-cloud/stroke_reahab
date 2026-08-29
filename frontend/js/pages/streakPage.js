/* Streak Page */
import API from '../api.js';
import { StatCard } from '../components/cards.js';

export default function renderStreakPage() {
  return `
    <div class="welcome-section">
      <h1>Streak Tracker</h1>
      <p class="welcome-date">Consistency is key to recovery</p>
    </div>
    
    <div class="dashboard-grid">
      <div class="glass-card text-center" style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;">
        <div class="streak-fire" style="font-size:6rem;margin-bottom:16px;">🔥</div>
        <h2 style="font-size:3rem;margin-bottom:8px;color:var(--text-primary);" id="streak-large-curr">0</h2>
        <p style="font-size:1.2rem;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:var(--warning);">Day Streak</p>
        <p id="streak-msg" style="margin-top:24px;color:var(--text-secondary);max-width:300px;">Keep it up! Playing daily accelerates your rehabilitation progress.</p>
      </div>
      
      <div>
        <div class="stats-row" style="grid-template-columns:1fr;margin-bottom:24px;" id="streak-stats"></div>
        <div class="glass-card">
          <h3 style="margin-bottom:16px;">Last 30 Days Activity</h3>
          <div class="activity-calendar" id="month-calendar" style="grid-template-columns:repeat(7,1fr);gap:8px;"></div>
        </div>
      </div>
    </div>
  `;
}

export async function initStreakPage() {
  try {
    const sData = await API.getStreak();
    const cData = await API.getActivityCalendar(28); // 4 weeks
    
    document.getElementById('streak-large-curr').textContent = sData.current_streak;
    
    let msg = "Start playing today to build your streak!";
    if (sData.current_streak > 0 && sData.current_streak < 3) msg = "Great start! Keep the momentum going.";
    else if (sData.current_streak >= 3 && sData.current_streak < 7) msg = "You're on fire! Consistency is key.";
    else if (sData.current_streak >= 7) msg = "Incredible dedication! You are a rehabilitation rockstar.";
    document.getElementById('streak-msg').textContent = msg;
    
    document.getElementById('streak-stats').innerHTML = `
      ${StatCard({ icon: 'fa-trophy', title: 'Longest Streak', value: sData.longest_streak + ' Days', colorClass: 'primary' })}
    `;
    
    const calHtml = cData.calendar.map(d => {
      const activeCls = d.completed ? 'active' : 'inactive';
      const dayName = new Date(d.date).toLocaleDateString('en-US', {weekday:'short'}).charAt(0);
      return `<div class="cal-day ${activeCls}" title="${d.date}: ${d.sessions_count} sessions" style="aspect-ratio:auto;height:40px;border-radius:4px;">${dayName}</div>`;
    }).join('');
    document.getElementById('month-calendar').innerHTML = calHtml;
    
  } catch (err) {
    console.error(err);
  }
}
