/* History Page */
import API from '../api.js';
import { ActivityTable } from '../components/cards.js';

export default function renderHistory() {
  return `
    <div class="welcome-section">
      <h1>Exercise History</h1>
      <p class="welcome-date">Complete record of your rehabilitation sessions</p>
    </div>
    
    <div class="glass-card full-width">
      <div class="filter-bar">
        <select class="form-select" id="history-period" style="width:200px">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <select class="form-select" id="history-game" style="width:200px">
          <option value="">All Games</option>
          <option value="target_touch">Target Touch</option>
          <option value="object_catch">Object Catch</option>
          <option value="path_following">Path Following</option>
        </select>
      </div>
      <div id="history-table-container"></div>
    </div>
  `;
}

export async function initHistory(params) {
  const periodSel = document.getElementById('history-period');
  const gameSel = document.getElementById('history-game');
  const container = document.getElementById('history-table-container');
  
  const loadHistory = async () => {
    container.innerHTML = '<div style="padding:40px;text-align:center"><span class="spinner"></span></div>';
    try {
      const data = await API.getGameHistory(periodSel.value, gameSel.value);
      container.innerHTML = ActivityTable(data.history);
    } catch (err) {
      container.innerHTML = '<div class="form-error">Failed to load history</div>';
    }
  };
  
  periodSel.onchange = loadHistory;
  gameSel.onchange = loadHistory;
  
  await loadHistory();
}
