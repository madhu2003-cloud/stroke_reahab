/* Sidebar navigation component */
import Auth from '../auth.js';
import Toast from './toast.js';
import { getInitials } from '../utils.js';

const navItems = {
  patient: [
    { icon: 'fa-chart-line', label: 'Dashboard', route: '#/dashboard' },
    { icon: 'fa-gamepad', label: 'Rehab Games', route: '#/games' },
    { icon: 'fa-ruler-combined', label: 'ROM & Tremor Lab', route: '#/rom-analyzer' },
    { icon: 'fa-microphone-alt', label: 'Speech Therapy', route: '#/speech-therapy' },
    { icon: 'fa-brain', label: 'AI Recovery Coach', route: '#/ai-advisor' },
    { icon: 'fa-file-medical-alt', label: 'Prescriptions', route: '#/prescriptions' },
    { icon: 'fa-chart-bar', label: 'Progress', route: '#/progress' },
    { icon: 'fa-fire', label: 'Streak', route: '#/streak' },
    { icon: 'fa-clipboard-list', label: 'History', route: '#/history' },
    { icon: 'fa-file-pdf', label: 'Clinical Report', route: '#/export-report' },
    { icon: 'fa-exclamation-triangle', label: 'Emergency SOS', route: '#/sos' },
    { icon: 'fa-star', label: 'Give Feedback', route: '#/feedback' },
    { icon: 'fa-user', label: 'Profile', route: '#/profile' },
    { icon: 'fa-cog', label: 'Settings', route: '#/settings' },
  ],
  parent: [
    { icon: 'fa-chart-line', label: 'Dashboard', route: '#/dashboard' },
    { icon: 'fa-user', label: 'My Patient', route: '#/my-patient' },
    { icon: 'fa-heart', label: 'Cheering Wall', route: '#/cheering' },
    { icon: 'fa-brain', label: 'AI Recovery Coach', route: '#/ai-advisor' },
    { icon: 'fa-chart-bar', label: 'Progress', route: '#/progress' },
    { icon: 'fa-file-pdf', label: 'Clinical Report', route: '#/export-report' },
    { icon: 'fa-exclamation-triangle', label: 'Emergency Safety', route: '#/sos' },
    { icon: 'fa-clipboard-list', label: 'Activity Logs', route: '#/history' },
    { icon: 'fa-user-circle', label: 'Profile', route: '#/profile' },
    { icon: 'fa-cog', label: 'Settings', route: '#/settings' },
  ],
  doctor: [
    { icon: 'fa-chart-line', label: 'Dashboard', route: '#/dashboard' },
    { icon: 'fa-users', label: 'Patients', route: '#/patients' },
    { icon: 'fa-file-medical-alt', label: 'Prescribe Regimens', route: '#/prescriptions' },
    { icon: 'fa-ruler-combined', label: 'ROM Biomechanics', route: '#/rom-analyzer' },
    { icon: 'fa-brain', label: 'AI Clinical Advisor', route: '#/ai-advisor' },
    { icon: 'fa-file-pdf', label: 'Export Reports', route: '#/export-report' },
    { icon: 'fa-chart-bar', label: 'Analytics', route: '#/progress' },
    { icon: 'fa-user-circle', label: 'Profile', route: '#/profile' },
    { icon: 'fa-cog', label: 'Settings', route: '#/settings' },
  ],
};

export function renderSidebar() {
  const user = Auth.getUser();
  if (!user) return '';
  const role = user.role || 'patient';
  const items = navItems[role] || navItems.patient;
  const current = window.location.hash || '#/dashboard';

  return `
    <button class="sidebar-toggle" id="sidebar-toggle"><i class="fas fa-bars"></i></button>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-avatar">${getInitials(user.name)}</div>
        <div class="sidebar-user-info">
          <h4>${user.name || 'User'}</h4>
          <span class="role-badge">${role}</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${items.map(item => `
          <a href="${item.route}" class="sidebar-nav-item ${current.startsWith(item.route) ? 'active' : ''}">
            <i class="fas ${item.icon}"></i> ${item.label}
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <button class="sidebar-nav-item" id="logout-btn" style="color:var(--error)">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>`;
}

export function initSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const logoutBtn = document.getElementById('logout-btn');

  if (toggle && sidebar && overlay) {
    toggle.onclick = () => { sidebar.classList.toggle('open'); overlay.classList.toggle('active'); };
    overlay.onclick = () => { sidebar.classList.remove('open'); overlay.classList.remove('active'); };
  }

  if (logoutBtn) {
    logoutBtn.onclick = () => {
      Auth.clearSession();
      Toast.success('Logged out successfully');
      window.location.hash = '#/login';
    };
  }
}
