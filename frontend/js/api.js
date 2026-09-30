/* Centralized API service */
import Auth from './auth.js';
import Toast from './components/toast.js';

const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const url = this.baseUrl + endpoint;
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    try {
      const resp = await fetch(url, { ...options, headers });
      const data = await resp.json().catch(() => ({}));

      if (resp.status === 401) {
        Auth.clearSession();
        window.location.hash = '#/login';
        Toast.error('Session expired. Please login again.');
        throw new Error('Unauthorized');
      }
      if (!resp.ok) {
        throw new Error(data.error || `Request failed (${resp.status})`);
      }
      return data;
    } catch (err) {
      if (err.message === 'Unauthorized') throw err;
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        Toast.error('Network error. Please check your connection.');
      }
      throw err;
    }
  },

  get(endpoint) { return this.request(endpoint); },
  post(endpoint, data) { return this.request(endpoint, { method: 'POST', body: JSON.stringify(data) }); },
  put(endpoint, data) { return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }); },

  // Auth
  register(data) { return this.post('/auth/register', data); },
  login(email, password) { return this.post('/auth/login', { email, password }); },
  logout() { return this.post('/auth/logout', {}); },
  getMe() { return this.get('/auth/me'); },

  // Dashboard
  getPatientDashboard() { return this.get('/dashboard/patient'); },
  getParentDashboard() { return this.get('/dashboard/parent'); },
  getDoctorDashboard() { return this.get('/dashboard/doctor'); },

  // Games
  saveGameResult(data) { return this.post('/games/result', data); },
  getGameHistory(period = 'all', gameType = '') {
    let q = `?period=${period}`;
    if (gameType) q += `&game_type=${gameType}`;
    return this.get('/games/history' + q);
  },
  getGamePerformance() { return this.get('/games/performance'); },

  // Progress
  getStreak() { return this.get('/progress/streak'); },
  getWeeklyProgress() { return this.get('/progress/weekly'); },
  getMonthlyProgress() { return this.get('/progress/monthly'); },
  getActivityCalendar(days = 30) { return this.get('/progress/activity-calendar?days=' + days); },
  getClinicalReport(patientId = null) {
    const q = patientId ? `?patient_id=${patientId}` : '';
    return this.get('/progress/clinical-report' + q);
  },

  // Patients
  getPatients() { return this.get('/patients'); },
  getPatientDetail(id) { return this.get('/patients/' + id); },
  getPatientProgress(id) { return this.get('/patients/' + id + '/progress'); },
  getPatientHistory(id) { return this.get('/patients/' + id + '/history'); },
  assignPatient(email) { return this.post('/patients/assign', { patient_email: email }); },

  // Profile
  getProfile() { return this.get('/profile'); },
  updateProfile(data) { return this.put('/profile', data); },
};

export default API;
