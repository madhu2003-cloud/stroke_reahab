/* Settings Page */
import Toast from '../components/toast.js';

export default function renderSettings() {
  return `
    <div class="welcome-section">
      <h1>Settings</h1>
      <p class="welcome-date">Manage your application preferences</p>
    </div>
    
    <div class="dashboard-grid">
      <div class="glass-card full-width" style="max-width:800px">
        
        <div style="padding-bottom:24px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom:24px;">
          <h3>Appearance</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
            <div>
              <div style="font-weight:600">Dark Mode</div>
              <div style="font-size:0.85rem;color:var(--text-secondary)">Switch between light and dark theme</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="setting-theme">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div style="padding-bottom:24px;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom:24px;">
          <h3>Game Preferences</h3>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
            <div>
              <div style="font-weight:600">Default to Hand Tracking</div>
              <div style="font-size:0.85rem;color:var(--text-secondary)">Automatically enable webcam hand tracking when starting a game</div>
            </div>
            <label class="toggle">
              <input type="checkbox" id="setting-ht">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom:16px;">Security</h3>
          <button class="btn btn-secondary">Change Password</button>
        </div>
        
      </div>
    </div>
  `;
}

export function initSettings() {
  const themeToggle = document.getElementById('setting-theme');
  const htToggle = document.getElementById('setting-ht');
  
  themeToggle.checked = localStorage.getItem('theme') === 'dark';
  htToggle.checked = localStorage.getItem('handTracking') !== 'false';
  
  themeToggle.onchange = () => {
    if (themeToggle.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };
  
  htToggle.onchange = () => {
    localStorage.setItem('handTracking', htToggle.checked ? 'true' : 'false');
    Toast.success('Game preference updated');
  };
}
