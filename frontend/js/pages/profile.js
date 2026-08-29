/* Profile Page */
import API from '../api.js';
import Auth from '../auth.js';
import Toast from '../components/toast.js';
import { getInitials } from '../utils.js';

export default function renderProfile() {
  return `
    <div class="welcome-section">
      <h1>My Profile</h1>
    </div>
    
    <div class="dashboard-grid">
      <div class="glass-card" style="text-align:center;align-self:start;">
        <div style="width:100px;height:100px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;display:flex;align-items:center;justify-content:center;font-size:2.5rem;font-weight:700;margin:0 auto 24px;" id="prof-avatar"></div>
        <h2 id="prof-name-disp">User Name</h2>
        <p class="role-badge" id="prof-role-disp" style="display:inline-block;padding:4px 12px;border-radius:12px;background:rgba(108,99,255,0.1);color:var(--primary);font-weight:600;margin:8px 0;text-transform:capitalize;"></p>
        <p style="color:var(--text-light);font-size:0.9rem;" id="prof-joined"></p>
      </div>
      
      <div class="glass-card">
        <h3 style="margin-bottom:24px;">Profile Details</h3>
        <form id="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="prof-name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email (Read Only)</label>
              <input type="email" class="form-input" id="prof-email" readonly style="background:#F3F4F6">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-input" id="prof-phone">
          </div>
          
          <div id="prof-dynamic-fields"></div>
          
          <div style="margin-top:24px;display:flex;gap:12px;justify-content:flex-end;">
            <button type="submit" class="btn btn-primary" id="prof-save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export async function initProfile() {
  try {
    const { profile } = await API.getProfile();
    
    document.getElementById('prof-avatar').textContent = getInitials(profile.name);
    document.getElementById('prof-name-disp').textContent = profile.name;
    document.getElementById('prof-role-disp').textContent = profile.role;
    if (profile.created_at) {
      const d = new Date(profile.created_at);
      document.getElementById('prof-joined').textContent = `Member since ${d.toLocaleDateString()}`;
    }
    
    document.getElementById('prof-name').value = profile.name;
    document.getElementById('prof-email').value = profile.email;
    document.getElementById('prof-phone').value = profile.phone || '';
    
    const dynContainer = document.getElementById('prof-dynamic-fields');
    if (profile.role === 'patient') {
      dynContainer.innerHTML = `
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Age</label>
            <input type="number" class="form-input" id="prof-age" value="${profile.age || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select class="form-select" id="prof-gender">
              <option value="male" ${profile.gender==='male'?'selected':''}>Male</option>
              <option value="female" ${profile.gender==='female'?'selected':''}>Female</option>
              <option value="other" ${profile.gender==='other'?'selected':''}>Other</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Emergency Contact</label>
          <input type="text" class="form-input" id="prof-emergency" value="${profile.emergency_contact || ''}">
        </div>
      `;
    } else if (profile.role === 'doctor') {
      dynContainer.innerHTML = `
        <div class="form-group">
          <label class="form-label">Medical Reg. Number (Read Only)</label>
          <input type="text" class="form-input" value="${profile.registration_number || ''}" readonly style="background:#F3F4F6">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Specialization</label>
            <input type="text" class="form-input" id="prof-spec" value="${profile.specialization || ''}">
          </div>
          <div class="form-group">
            <label class="form-label">Hospital</label>
            <input type="text" class="form-input" id="prof-hospital" value="${profile.hospital || ''}">
          </div>
        </div>
      `;
    }
    
    document.getElementById('profile-form').onsubmit = async (e) => {
      e.preventDefault();
      const btn = document.getElementById('prof-save-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Saving...';
      
      const data = {
        name: document.getElementById('prof-name').value,
        phone: document.getElementById('prof-phone').value,
      };
      
      if (profile.role === 'patient') {
        data.age = document.getElementById('prof-age').value;
        data.gender = document.getElementById('prof-gender').value;
        data.emergency_contact = document.getElementById('prof-emergency').value;
      } else if (profile.role === 'doctor') {
        data.specialization = document.getElementById('prof-spec').value;
        data.hospital = document.getElementById('prof-hospital').value;
      }
      
      try {
        const resp = await API.updateProfile(data);
        Toast.success('Profile updated successfully');
        // Update local session
        const sess = Auth.getUser();
        Auth.setSession(Auth.getToken(), { ...sess, name: resp.profile.name });
        initProfile(); // Reload
      } catch(err) {
        Toast.error('Failed to update profile');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Save Changes';
      }
    };
    
  } catch(err) {
    console.error(err);
  }
}
