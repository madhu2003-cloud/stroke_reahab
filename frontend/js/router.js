/* Router Implementation */
import Auth from './auth.js';
import renderLanding, { initLanding } from './pages/landing.js?v=8.0';
import renderLogin, { initLogin } from './pages/login.js?v=8.0';
import renderRegister, { initRegister } from './pages/register.js?v=8.0';
import renderPatientDashboard, { initPatientDashboard } from './pages/patientDashboard.js?v=8.0';
import renderParentDashboard, { initParentDashboard } from './pages/parentDashboard.js?v=8.0';
import renderDoctorDashboard, { initDoctorDashboard } from './pages/doctorDashboard.js?v=8.0';
import renderGamesPage, { initGamesPage } from './pages/gamesPage.js?v=8.0';
import renderGamePage, { initGamePage } from './pages/gamePage.js?v=8.0';
import renderProgress, { initProgress } from './pages/progress.js?v=8.0';
import renderHistory, { initHistory } from './pages/history.js?v=8.0';
import renderStreakPage, { initStreakPage } from './pages/streakPage.js?v=8.0';
import renderProfile, { initProfile } from './pages/profile.js?v=8.0';
import renderSettings, { initSettings } from './pages/settings.js?v=8.0';
import renderPatientDetail, { initPatientDetail } from './pages/patientDetail.js?v=8.0';
import renderAiAdvisor, { initAiAdvisor } from './pages/aiAdvisor.js?v=8.0';
import renderRomAnalyzer, { initRomAnalyzer } from './pages/romAnalyzer.js?v=8.0';
import renderSpeechTherapy, { initSpeechTherapy } from './pages/speechTherapy.js?v=8.0';
import renderPrescriptionsPage, { initPrescriptionsPage } from './pages/prescriptionsPage.js?v=8.0';
import renderExportReport, { initExportReport } from './pages/exportReport.js?v=8.0';
import renderCheeringPage, { initCheeringPage } from './pages/cheeringPage.js?v=8.0';
import renderFeedbackPage, { initFeedbackPage } from './pages/feedbackPage.js?v=8.0';
import renderBenchmarkSuite, { initBenchmarkSuite } from './pages/benchmarkSuite.js?v=8.0';
import { renderSidebar, initSidebar } from './components/sidebar.js?v=8.0';

export default class Router {
  constructor(rootId) {
    this.root = document.getElementById(rootId);
    this.routes = [];
  }

  addRoute(path, renderFn, initFn, options = {}) {
    this.routes.push({ path, renderFn, initFn, ...options });
  }

  start() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  }

  getCurrentPath() {
    let hash = window.location.hash || '#/';
    if (hash.includes('?')) hash = hash.split('?')[0];
    return hash;
  }

  navigate(path) {
    window.location.hash = path;
  }

  async handleRoute() {
    const path = this.getCurrentPath();
    
    // Exact match or dynamic match
    let match = this.routes.find(r => r.path === path);
    let params = {};

    if (!match) {
      // Dynamic route matching (e.g. #/games/:id or #/patients/:id)
      for (let r of this.routes) {
        if (r.path.includes(':')) {
          const routeParts = r.path.split('/');
          const pathParts = path.split('/');
          if (routeParts.length === pathParts.length) {
            let isMatch = true;
            for (let i = 0; i < routeParts.length; i++) {
              if (routeParts[i].startsWith(':')) {
                params[routeParts[i].substring(1)] = pathParts[i];
              } else if (routeParts[i] !== pathParts[i]) {
                isMatch = false;
                break;
              }
            }
            if (isMatch) {
              match = r;
              break;
            }
          }
        }
      }
    }

    if (!match) match = this.routes.find(r => r.path === '#/');

    if (match.protected && !Auth.isLoggedIn()) {
      return this.navigate('#/login');
    }

    if (match.role && Auth.getRole() !== match.role) {
      return this.navigate('#/dashboard');
    }
    
    if (path === '#/dashboard') {
        const role = Auth.getRole();
        if (role === 'patient') match = this.routes.find(r => r.path === '#/dashboard/patient');
        else if (role === 'parent') match = this.routes.find(r => r.path === '#/dashboard/parent');
        else if (role === 'doctor') match = this.routes.find(r => r.path === '#/dashboard/doctor');
        else return this.navigate('#/login');
    }

    let layoutHtml = '';
    
    if (match.withSidebar) {
      layoutHtml = `
        <div class="dashboard-layout">
          ${renderSidebar()}
          <main class="dashboard-main">
            <div class="dashboard-main-inner" id="page-content">
               <!-- Content will be injected here if it's async -->
            </div>
          </main>
        </div>
      `;
      this.root.innerHTML = layoutHtml;
      const contentRoot = document.getElementById('page-content');
      contentRoot.innerHTML = match.renderFn(params);
      initSidebar();
    } else {
      this.root.innerHTML = match.renderFn(params);
    }
    
    if (match.initFn) {
      window.scrollTo(0,0);
      try {
        await match.initFn(params);
      } catch (e) {
        console.error("Initialization error:", e);
      }
    }
  }
}

export function setupRouter() {
  const router = new Router('app');
  
  // Public routes
  router.addRoute('#/', renderLanding, initLanding);
  router.addRoute('#/login', renderLogin, initLogin);
  router.addRoute('#/register', renderRegister, initRegister);
  
  // Dashboards (the #/dashboard route redirects inside the router)
  router.addRoute('#/dashboard/patient', renderPatientDashboard, initPatientDashboard, { protected: true, role: 'patient', withSidebar: true });
  router.addRoute('#/dashboard/parent', renderParentDashboard, initParentDashboard, { protected: true, role: 'parent', withSidebar: true });
  router.addRoute('#/dashboard/doctor', renderDoctorDashboard, initDoctorDashboard, { protected: true, role: 'doctor', withSidebar: true });
  
  // Games
  router.addRoute('#/games', renderGamesPage, initGamesPage, { protected: true, role: 'patient', withSidebar: true });
  router.addRoute('#/games/:gameType', renderGamePage, initGamePage, { protected: true, role: 'patient', withSidebar: false });
  
  // Shared protected
  router.addRoute('#/progress', renderProgress, initProgress, { protected: true, withSidebar: true });
  router.addRoute('#/history', renderHistory, initHistory, { protected: true, withSidebar: true });
  router.addRoute('#/profile', renderProfile, initProfile, { protected: true, withSidebar: true });
  router.addRoute('#/settings', renderSettings, initSettings, { protected: true, withSidebar: true });
  
  // Streak & Patient Detail
  router.addRoute('#/streak', renderStreakPage, initStreakPage, { protected: true, role: 'patient', withSidebar: true });
  router.addRoute('#/my-patient', () => '<div id="parent-pat-content"></div>', initParentDashboard, { protected: true, role: 'parent', withSidebar: true });
  router.addRoute('#/patients', renderDoctorDashboard, initDoctorDashboard, { protected: true, role: 'doctor', withSidebar: true });
  router.addRoute('#/patients/:id', renderPatientDetail, initPatientDetail, { protected: true, withSidebar: true });

  // New Advanced Clinical & Recovery Features
  router.addRoute('#/ai-advisor', renderAiAdvisor, initAiAdvisor, { protected: true, withSidebar: true });
  router.addRoute('#/rom-analyzer', renderRomAnalyzer, initRomAnalyzer, { protected: true, withSidebar: true });
  router.addRoute('#/speech-therapy', renderSpeechTherapy, initSpeechTherapy, { protected: true, withSidebar: true });
  router.addRoute('#/prescriptions', renderPrescriptionsPage, initPrescriptionsPage, { protected: true, withSidebar: true });
  router.addRoute('#/export-report', renderExportReport, initExportReport, { protected: true, withSidebar: true });
  router.addRoute('#/cheering', renderCheeringPage, initCheeringPage, { protected: true, withSidebar: true });
  router.addRoute('#/feedback', renderFeedbackPage, initFeedbackPage, { protected: false, withSidebar: true });
  router.addRoute('#/benchmark', renderBenchmarkSuite, initBenchmarkSuite, { protected: false, withSidebar: true });

  return router;
}
