/* Register page */
import API from '../api.js';
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderRegister() {
  return `
  <div class="auth-page">
    <div class="auth-card" style="max-width:600px;">
      <div class="auth-logo"><span class="logo-icon">🧠</span><h1>StrokeRehab</h1></div>
      <div class="auth-header"><h2>Create Account</h2><p>Join the rehabilitation platform</p></div>
      
      <div class="role-selector" id="role-selector">
        <button type="button" class="role-btn active" data-role="patient">
          <span class="role-icon">👤</span> Patient
        </button>
        <button type="button" class="role-btn" data-role="parent">
          <span class="role-icon">👨‍👩‍👦</span> Parent / Caregiver
        </button>
        <button type="button" class="role-btn" data-role="doctor">
          <span class="role-icon">👨‍⚕️</span> Doctor
        </button>
      </div>

      <form id="register-form" class="auth-form" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <div class="input-icon-wrap">
              <i class="fas fa-user"></i>
              <input type="text" class="form-input" id="reg-name" placeholder="John Doe" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-icon-wrap">
              <i class="fas fa-envelope"></i>
              <input type="email" class="form-input" id="reg-email" placeholder="you@example.com" required>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Password</label>
            <div class="input-icon-wrap">
              <i class="fas fa-lock"></i>
              <input type="password" class="form-input" id="reg-password" placeholder="Min 6 chars" required>
              <button type="button" class="toggle-pw" data-target="reg-password"><i class="fas fa-eye"></i></button>
            </div>
            <div class="pw-strength"><div class="pw-strength-bar" id="pw-strength-bar" style="width:0%"></div></div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirm Password</label>
            <div class="input-icon-wrap">
              <i class="fas fa-lock"></i>
              <input type="password" class="form-input" id="reg-confirm" placeholder="Repeat password" required>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Phone Number (Optional)</label>
          <div class="input-icon-wrap">
            <i class="fas fa-phone"></i>
            <input type="text" class="form-input" id="reg-phone" placeholder="Contact number">
          </div>
        </div>

        <div id="dynamic-fields"></div>

        <div id="reg-error" class="form-error" style="margin-bottom:12px;display:none"></div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" id="reg-btn">Create Account</button>
      </form>
      <div class="auth-footer">Already have an account? <a href="#/login">Login</a></div>
    </div>
  </div>`;
}

function getDynamicFields(role) {
  if (role === 'patient') {
    return `
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Age</label>
          <input type="number" class="form-input" id="reg-age" placeholder="Years" required min="1" max="120">
        </div>
        <div class="form-group">
          <label class="form-label">Gender</label>
          <select class="form-select" id="reg-gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Emergency Contact Name (Optional)</label>
        <div class="input-icon-wrap">
          <i class="fas fa-heartbeat"></i>
          <input type="text" class="form-input" id="reg-emergency" placeholder="Emergency contact">
        </div>
      </div>`;
  } else if (role === 'doctor') {
    return `
      <div class="form-group">
        <label class="form-label">Medical Registration Number</label>
        <div class="input-icon-wrap">
          <i class="fas fa-id-card"></i>
          <input type="text" class="form-input" id="reg-med-id" placeholder="License or Registration ID" required>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Specialization</label>
          <input type="text" class="form-input" id="reg-spec" placeholder="Neurology, Physical Therapy..." required>
        </div>
        <div class="form-group">
          <label class="form-label">Hospital / Clinic</label>
          <input type="text" class="form-input" id="reg-hospital" placeholder="Workplace" required>
        </div>
      </div>`;
  } else if (role === 'parent') {
    return `
      <div class="form-group">
        <label class="form-label">Patient Email Code</label>
        <div class="input-icon-wrap">
          <i class="fas fa-link"></i>
          <input type="email" class="form-input" id="reg-patient-code" placeholder="Email of the patient to link" required>
        </div>
        <p style="font-size:0.8rem;color:var(--text-light);margin-top:4px;">Enter the patient's registered email to link your account to theirs.</p>
      </div>`;
  }
  return '';
}

export function initRegister() {
  const roleBtns = document.querySelectorAll('.role-btn');
  const dynamicContainer = document.getElementById('dynamic-fields');
  let currentRole = 'patient';

  dynamicContainer.innerHTML = getDynamicFields(currentRole);

  roleBtns.forEach(btn => {
    btn.onclick = () => {
      roleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRole = btn.dataset.role;
      dynamicContainer.innerHTML = getDynamicFields(currentRole);
    };
  });

  const pwInput = document.getElementById('reg-password');
  const pwBar = document.getElementById('pw-strength-bar');
  if (pwInput) {
    pwInput.oninput = () => {
      const v = pwInput.value;
      if (v.length === 0) { pwBar.style.width = '0%'; pwBar.style.background = 'transparent'; }
      else if (v.length < 6) { pwBar.style.width = '33%'; pwBar.style.background = 'var(--error)'; }
      else if (v.length < 10) { pwBar.style.width = '66%'; pwBar.style.background = 'var(--warning)'; }
      else { pwBar.style.width = '100%'; pwBar.style.background = 'var(--success)'; }
    };
  }

  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.onclick = () => {
      const input = document.getElementById(btn.dataset.target);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    };
  });

  const form = document.getElementById('register-form');
  const errEl = document.getElementById('reg-error');

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      errEl.style.display = 'none';
      
      const data = {
        role: currentRole,
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value,
        phone: document.getElementById('reg-phone').value.trim(),
      };

      if (!data.name || !data.email || !data.password) {
        errEl.textContent = 'Please fill all required fields.';
        errEl.style.display = 'block';
        return;
      }
      
      const confirmPw = document.getElementById('reg-confirm').value;
      if (data.password !== confirmPw) {
        errEl.textContent = 'Passwords do not match.';
        errEl.style.display = 'block';
        return;
      }

      if (currentRole === 'patient') {
        data.age = parseInt(document.getElementById('reg-age').value);
        data.gender = document.getElementById('reg-gender').value;
        data.emergency_contact = document.getElementById('reg-emergency').value.trim();
        if (!data.age) { errEl.textContent = 'Age is required for patients.'; errEl.style.display = 'block'; return; }
      } else if (currentRole === 'doctor') {
        data.registration_number = document.getElementById('reg-med-id').value.trim();
        data.specialization = document.getElementById('reg-spec').value.trim();
        data.hospital = document.getElementById('reg-hospital').value.trim();
        if (!data.registration_number) { errEl.textContent = 'Medical registration number is required.'; errEl.style.display = 'block'; return; }
      } else if (currentRole === 'parent') {
        data.patient_code = document.getElementById('reg-patient-code').value.trim();
        if (!data.patient_code) { errEl.textContent = 'Patient email code is required.'; errEl.style.display = 'block'; return; }
      }

      const btn = document.getElementById('reg-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Creating Account...';

      try {
        const resp = await API.register(data);
        Auth.setSession(resp.token, resp.user);
        Toast.success('Account created successfully!');
        window.location.hash = '#/dashboard';
      } catch (err) {
        errEl.textContent = err.message || 'Registration failed';
        errEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Create Account';
      }
    };
  }
}
