/* Chart.js wrapper functions */
const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) { chartInstances[id].destroy(); delete chartInstances[id]; }
}

export function createLineChart(canvasId, labels, datasets, options = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const defaultColors = ['#6C63FF', '#00D2FF', '#FF6584'];
  const ds = datasets.map((d, i) => ({
    label: d.label,
    data: d.data,
    borderColor: d.color || defaultColors[i % defaultColors.length],
    backgroundColor: (d.color || defaultColors[i % defaultColors.length]) + '20',
    borderWidth: 2.5,
    tension: 0.4,
    fill: d.fill !== undefined ? d.fill : true,
    pointRadius: 3,
    pointHoverRadius: 6,
    ...d,
  }));
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: ds },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: { legend: { labels: { usePointStyle: true, padding: 16, font: { family: 'Inter', size: 12 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' } },
      },
      ...options,
    },
  });
  return chartInstances[canvasId];
}

export function createBarChart(canvasId, labels, datasets, options = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  const defaultColors = ['#6C63FF', '#00D2FF', '#FF6584'];
  const ds = datasets.map((d, i) => ({
    label: d.label,
    data: d.data,
    backgroundColor: (d.color || defaultColors[i % defaultColors.length]) + 'CC',
    borderRadius: 6,
    borderSkipped: false,
    ...d,
  }));
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: ds },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { usePointStyle: true, padding: 16, font: { family: 'Inter', size: 12 } } } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' } },
        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { family: 'Inter', size: 11 }, color: '#9CA3AF' } },
      },
      ...options,
    },
  });
  return chartInstances[canvasId];
}

export function createDoughnutChart(canvasId, data, options = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;
  chartInstances[canvasId] = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: { legend: { display: false } },
      ...options,
    },
  });
  return chartInstances[canvasId];
}
