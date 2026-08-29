/* Landing page */
import Auth from '../auth.js';

export default function renderLanding() {
  return `
  <nav class="landing-nav">
    <div class="nav-inner">
      <a href="#/" class="logo"><span>🧠</span> StrokeRehab</a>
      <ul class="nav-links">
        <li><a href="#/">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#games-preview">Games</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <div class="nav-auth">
        ${Auth.isLoggedIn()
          ? '<a href="#/dashboard" class="btn btn-primary btn-sm">Dashboard</a>'
          : '<a href="#/login" class="btn btn-ghost btn-sm">Login</a><a href="#/register" class="btn btn-primary btn-sm">Register</a>'
        }
      </div>
      <button class="nav-hamburger" id="nav-hamburger"><i class="fas fa-bars"></i></button>
    </div>
  </nav>
  <div class="mobile-nav" id="mobile-nav">
    <a href="#/">Home</a>
    <a href="#features">Features</a>
    <a href="#games-preview">Games</a>
    <a href="#contact">Contact</a>
    <div class="nav-auth" style="display:flex;gap:12px;margin-top:16px;">
      ${Auth.isLoggedIn()
        ? '<a href="#/dashboard" class="btn btn-primary btn-sm btn-block">Dashboard</a>'
        : '<a href="#/login" class="btn btn-ghost btn-sm">Login</a><a href="#/register" class="btn btn-primary btn-sm">Register</a>'
      }
    </div>
  </div>

  <section class="hero">
    <div class="hero-inner">
      <div class="hero-text fade-in">
        <h1>Recover. Practice.<br><span class="gradient-text">Progress.</span></h1>
        <p>Interactive hand rehabilitation exercises powered by AI gesture tracking. Monitor your progress, maintain your streak, and recover at your own pace.</p>
        <div class="hero-actions">
          <a href="${Auth.isLoggedIn() ? '#/games' : '#/register'}" class="btn btn-primary btn-lg">Start Rehabilitation</a>
          <a href="#/login" class="btn btn-secondary btn-lg">Login</a>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-illustration">
          <span class="hand-icon">✋</span>
        </div>
      </div>
    </div>
  </section>

  <section class="features-section" id="features">
    <div class="section-header">
      <h2>Why StrokeRehab?</h2>
      <p>A comprehensive platform designed to make rehabilitation effective, engaging, and trackable.</p>
    </div>
    <div class="features-grid">
      ${[
        ['🎯','Interactive Rehabilitation','Engage in fun, interactive exercises designed by rehabilitation specialists.'],
        ['✋','Hand Gesture Tracking','Advanced AI-powered hand tracking monitors your movements in real-time.'],
        ['📊','Daily Progress','Track your daily rehabilitation progress with detailed analytics and insights.'],
        ['🔥','Streak Tracking','Build healthy rehabilitation habits with our motivating streak system.'],
        ['👨‍⚕️','Doctor Monitoring','Your doctor can monitor your progress and adjust your rehabilitation plan.'],
        ['👨‍👩‍👦','Family Monitoring','Parents and caregivers can stay informed about rehabilitation progress.'],
      ].map(([icon,title,desc]) => `
        <div class="feature-card">
          <span class="feature-icon">${icon}</span>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="games-section" id="games-preview">
    <div class="section-header">
      <h2>Rehabilitation Games</h2>
      <p>Three carefully designed exercises to improve hand coordination, precision, and motor control.</p>
    </div>
    <div class="games-grid">
      ${[
        ['🎯','game-1','Target Touch','Improve precision by touching targets that appear on screen. Targets get progressively smaller as you improve.','target-touch'],
        ['🧺','game-2','Object Catch','Enhance reaction time and hand coordination by catching falling objects. Avoid the obstacles!','object-catch'],
        ['✏️','game-3','Path Following','Build fine motor control by following guided paths. Paths become more complex as you progress.','path-following'],
      ].map(([icon,cls,name,desc,route]) => `
        <div class="game-preview-card">
          <div class="game-preview-visual ${cls}">${icon}</div>
          <div class="game-preview-content">
            <h3>${name}</h3>
            <p>${desc}</p>
            <a href="#/games/${route}" class="btn btn-primary btn-sm btn-block">Try Now</a>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <section class="stats-section">
    <h2>Trusted by Rehabilitation Professionals</h2>
    <div class="stats-grid">
      ${[['500+','Patients'],['10,000+','Sessions'],['95%','Satisfaction'],['50+','Doctors']].map(([n,l]) => `
        <div class="stat-item"><div class="stat-number">${n}</div><div class="stat-desc">${l}</div></div>
      `).join('')}
    </div>
  </section>

  <footer class="landing-footer" id="contact">
    <div class="footer-inner">
      <div class="footer-brand">
        <div class="logo"><span>🧠</span> StrokeRehab</div>
        <p>A comprehensive stroke rehabilitation platform providing interactive exercises and progress monitoring for patients, caregivers, and doctors.</p>
      </div>
      <div class="footer-col"><h4>Quick Links</h4><a href="#/">Home</a><a href="#features">Features</a><a href="#games-preview">Games</a></div>
      <div class="footer-col"><h4>Legal</h4><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
      <div class="footer-col"><h4>Contact</h4><a href="#">support@strokerehab.com</a><a href="#">+1 (555) 123-4567</a></div>
    </div>
    <div class="footer-bottom">&copy; 2024 StrokeRehab. All rights reserved.</div>
  </footer>`;
}

export function initLanding() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.onclick = () => mobileNav.classList.toggle('active');
  }
}
