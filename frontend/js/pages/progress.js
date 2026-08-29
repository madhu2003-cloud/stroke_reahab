/* Progress Page */
import API from '../api.js';
import Loader from '../components/loader.js';
import { createLineChart, createBarChart } from '../components/charts.js';

export default function renderProgress() {
  return `
    <div class="welcome-section">
      <h1>Progress Analytics</h1>
      <p class="welcome-date">Deep dive into rehabilitation performance</p>
    </div>
    
    <div class="tabs mb-3" id="progress-tabs">
      <button class="tab-btn active" data-period="weekly">This Week</button>
      <button class="tab-btn" data-period="monthly">This Month</button>
    </div>
    
    <div class="dashboard-grid">
      <div class="chart-container full-width">
        <h3>Score Over Time</h3>
        <canvas id="score-chart"></canvas>
      </div>
      
      <div class="chart-container">
        <h3>Accuracy Trend</h3>
        <canvas id="accuracy-chart"></canvas>
      </div>
      
      <div class="chart-container">
        <h3>Game Performance (Avg Score)</h3>
        <canvas id="game-perf-chart"></canvas>
      </div>
    </div>
  `;
}

export async function initProgress(params) {
  const tabs = document.querySelectorAll('#progress-tabs .tab-btn');
  let currentPeriod = 'weekly';
  
  const loadData = async (period) => {
    try {
      const data = period === 'weekly' ? await API.getWeeklyProgress() : await API.getMonthlyProgress();
      const pData = period === 'weekly' ? data.weekly : data.monthly;
      const perf = await API.getGamePerformance();
      
      if (!pData || pData.length === 0) {
        document.getElementById('score-chart').parentElement.innerHTML = '<div class="empty-state"><p>No data available for this period.</p></div>';
        return;
      }
      
      const labels = pData.map(d => {
        const dt = new Date(d.date);
        return `${dt.getMonth()+1}/${dt.getDate()}`;
      });
      
      createLineChart('score-chart', labels, [
        { label: 'Avg Score', data: pData.map(d => d.score), color: '#6C63FF' }
      ]);
      
      createLineChart('accuracy-chart', labels, [
        { label: 'Accuracy %', data: pData.map(d => d.accuracy), color: '#00C853' }
      ]);
      
      if (perf.performance) {
        const gKeys = Object.keys(perf.performance);
        const gLabels = gKeys.map(k => k.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
        const gScores = gKeys.map(k => perf.performance[k].avg_score);
        
        createBarChart('game-perf-chart', gLabels, [
          { label: 'Avg Score', data: gScores, color: '#FF6584' }
        ]);
      }
      
    } catch (err) {
      console.error(err);
    }
  };
  
  await loadData(currentPeriod);
  
  tabs.forEach(btn => {
    btn.onclick = () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPeriod = btn.dataset.period;
      loadData(currentPeriod);
    };
  });
}
