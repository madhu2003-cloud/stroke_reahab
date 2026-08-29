/* Reusable Card UI components */
import { formatTime, formatDate, gameTypeIcon, gameTypeName } from '../utils.js';

export function StatCard({ icon, title, value, subtitle, colorClass = 'primary' }) {
  return `
    <div class="stat-card">
      <div class="stat-icon badge-${colorClass}">
        <i class="fas ${icon}"></i>
      </div>
      <div>
        <div class="stat-value">${value}</div>
        <div class="stat-label">${title}</div>
        ${subtitle ? `<div style="font-size:0.75rem;color:var(--text-light);margin-top:2px;">${subtitle}</div>` : ''}
      </div>
    </div>
  `;
}

export function GameCard({ type, name, description, icon, lastScore, onClickPath }) {
  const vClass = type === 'target_touch' ? 'v1' : type === 'object_catch' ? 'v2' : 'v3';
  return `
    <div class="game-select-card" onclick="window.location.hash='${onClickPath}'">
      <div class="game-select-visual ${vClass}">${icon}</div>
      <div class="game-select-body">
        <div class="game-select-meta">
          <span><i class="far fa-clock"></i> 60s</span>
          ${lastScore ? `<span><i class="fas fa-trophy" style="color:var(--warning)"></i> ${lastScore}</span>` : ''}
        </div>
        <h3>${name}</h3>
        <p>${description}</p>
        <button class="btn btn-primary btn-block">Play Now</button>
      </div>
    </div>
  `;
}

export function PatientCard({ patient }) {
  const { id, name, email, current_streak, latest_score, weekly_improvement, last_activity } = patient;
  const init = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  const imp = weekly_improvement || 0;
  const impColor = imp > 0 ? 'var(--success)' : imp < 0 ? 'var(--error)' : 'var(--text-light)';
  const impIcon = imp > 0 ? 'fa-arrow-up' : imp < 0 ? 'fa-arrow-down' : 'fa-minus';
  
  return `
    <div class="patient-card" onclick="window.location.hash='#/patients/${id}'">
      <div class="patient-card-info">
        <div class="patient-card-avatar">${init}</div>
        <div>
          <h4 style="margin:0;font-size:1rem;">${name}</h4>
          <span style="font-size:0.8rem;color:var(--text-secondary);">${email}</span>
        </div>
      </div>
      <div class="patient-card-stats">
        <div class="patient-card-stat">
          <div class="stat-val"><i class="fas fa-fire" style="color:var(--warning)"></i> ${current_streak}</div>
          <div class="stat-lbl">Streak</div>
        </div>
        <div class="patient-card-stat">
          <div class="stat-val">${latest_score}</div>
          <div class="stat-lbl">Last Score</div>
        </div>
        <div class="patient-card-stat">
          <div class="stat-val" style="color:${impColor}"><i class="fas ${impIcon}"></i> ${Math.abs(imp)}%</div>
          <div class="stat-lbl">Weekly</div>
        </div>
        <div class="patient-card-stat">
          <button class="btn btn-ghost btn-sm"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </div>
  `;
}

export function ActivityTable(activities) {
  if (!activities || activities.length === 0) {
    return `<div class="empty-state">
      <i class="fas fa-history"></i>
      <h3>No Recent Activity</h3>
      <p>Start playing games to see your history here.</p>
    </div>`;
  }
  
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Game</th>
          <th>Score</th>
          <th>Accuracy</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
        ${activities.map(a => `
          <tr>
            <td>${formatDate(a.created_at)}</td>
            <td>
              <span class="badge badge-primary" style="background:transparent;padding:0">
                ${gameTypeIcon(a.game_type)} ${gameTypeName(a.game_type)}
              </span>
            </td>
            <td style="font-weight:600">${a.score}</td>
            <td>${a.accuracy}%</td>
            <td>${formatTime(a.duration)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
