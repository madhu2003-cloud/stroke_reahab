/* Utility functions */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatTime(seconds) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatTimeMinutes(seconds) {
  if (!seconds) return '0 min';
  const m = Math.floor(seconds / 60);
  return m <= 0 ? `${seconds}s` : `${m} min`;
}

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function gameTypeName(type) {
  const m = { 
    piano_tap: 'Virtual Piano Finger Independence',
    knob_turn: 'Forearm Pronation / Supination Lab',
    pegboard_pinch: '9-Hole Pegboard Pincer Test',
    shelf_reach: 'Shelf Reaching & Stacking',
    window_wipe: 'Planar Window & Surface Sweep',
    facial_mirror: 'Facial Symmetry Biofeedback',
    target_touch: 'Target Touch', 
    object_catch: 'Object Catch', 
    path_following: 'Path Following'
  };
  return m[type] || type.replace('_', ' ').toUpperCase();
}

export function gameTypeIcon(type) {
  const m = { 
    piano_tap: '🎹',
    knob_turn: '🔐',
    pegboard_pinch: '📌',
    shelf_reach: '🗄️',
    window_wipe: '🪟',
    facial_mirror: '🪞',
    target_touch: '🎯', 
    object_catch: '🧺', 
    path_following: '✏️'
  };
  return m[type] || '🎮';
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
