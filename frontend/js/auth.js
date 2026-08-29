/* Auth state management */
const Auth = {
  isLoggedIn() {
    return !!localStorage.getItem('access_token');
  },
  getToken() {
    return localStorage.getItem('access_token');
  },
  getUser() {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  },
  getRole() {
    const u = this.getUser();
    return u ? u.role : null;
  },
  setSession(token, user) {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.hash = '#/login';
      return false;
    }
    return true;
  },
  requireRole(role) {
    if (!this.requireAuth()) return false;
    if (this.getRole() !== role) {
      window.location.hash = '#/dashboard';
      return false;
    }
    return true;
  }
};
export default Auth;
