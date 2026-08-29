/* Login page */
import API from '../api.js';
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderLogin() {
  return `
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo"><span class="logo-icon">🧠</span><h1>StrokeRehab</h1></div>
      <div class="auth-header"><h2>Welcome Back</h2><p>Sign in to continue your rehabilitation</p></div>
      <form id="login-form" class="auth-form" novalidate>
        <div class="form-group">
          <label class="form-label">Email</label>
          <div class="input-icon-wrap">
            <i class="fas fa-envelope"></i>
            <input type="email" class="form-input" id="login-email" placeholder="you@example.com" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="input-icon-wrap">
            <i class="fas fa-lock"></i>
            <input type="password" class="form-input" id="login-password" placeholder="Enter your password" required>
            <button type="button" class="toggle-pw" data-target="login-password"><i class="fas fa-eye"></i></button>
          </div>
        </div>
        <div class="auth-options">
          <label class="remember-me"><input type="checkbox"> Remember me</label>
          <a href="#" class="forgot-link">Forgot Password?</a>
        </div>
        <div id="login-error" class="form-error" style="margin-bottom:12px;display:none"></div>
        <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">Login</button>
      </form>
      <div class="auth-footer">Don't have an account? <a href="#/register">Register</a></div>
    </div>
  </div>`;
}

export function initLogin() {
  const form = document.getElementById('login-form');
  const errEl = document.getElementById('login-error');

  document.querySelectorAll('.toggle-pw').forEach(btn => {
    btn.onclick = () => {
      const input = document.getElementById(btn.dataset.target);
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.querySelector('i').className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
    };
  });

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      errEl.style.display = 'none';
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        errEl.textContent = 'Please enter email and password';
        errEl.style.display = 'block';
        return;
      }

      const btn = document.getElementById('login-btn');
      btn.disabled = true;
      btn.innerHTML = '<span class="spinner"></span> Logging in...';

      try {
        const data = await API.login(email, password);
        Auth.setSession(data.token, data.user);
        Toast.success('Welcome back, ' + data.user.name + '!');
        window.location.hash = '#/dashboard';
      } catch (err) {
        errEl.textContent = err.message || 'Invalid email or password';
        errEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Login';
      }
    };
  }
}
