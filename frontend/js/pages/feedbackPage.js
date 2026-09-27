/* Patient & Tester Experience Feedback Survey Page */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderFeedbackPage() {
  const user = Auth.getUser() || {};

  return `
    <div class="page-container" style="max-width:960px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="welcome-section" style="margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <h1 style="display:flex;align-items:center;gap:10px;">
              <span>⭐</span> Share Your Experience & Feedback
            </h1>
            <p class="welcome-date">Help us evaluate and improve the AURA AI Stroke Telerehabilitation platform</p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
            <span class="badge" id="fb-total-badge" style="background:rgba(79,70,229,0.12);color:var(--primary,#4f46e5);font-weight:700;padding:8px 16px;border-radius:20px;font-size:13px">
              <i class="fas fa-comments"></i> <span id="fb-count-text">Loading reviews...</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Feedback Form Card -->
      <div class="card" style="padding:32px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.06);margin-bottom:36px;background:#ffffff;border:1px solid #e2e8f0;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(79,70,229,0.1);display:flex;align-items:center;justify-content:center;color:var(--primary,#4f46e5);font-size:1.2rem;">
            <i class="fas fa-edit"></i>
          </div>
          <div>
            <h3 style="margin:0;font-size:1.2rem;color:#1e293b;">Submit Your Feedback & Ratings</h3>
            <p style="margin:0;font-size:0.85rem;color:#64748b;">All submissions are displayed publicly on the review wall below and preserved permanently.</p>
          </div>
        </div>

        <form id="feedback-form">
          <!-- Tester Name -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:0.95rem;color:#1e293b;margin-bottom:8px;">
              Your Name / Evaluator Title <span style="font-size:0.82rem;color:#64748b;font-weight:400;">(Optional)</span>
            </label>
            <input type="text" id="fb-name" class="inp" placeholder="e.g. Dr. Akhil, Evaluator, Sarah..." value="${user.name || ''}" style="width:100%;max-width:420px;padding:12px 16px;border-radius:10px;font-size:0.95rem;border:1.5px solid #cbd5e1;" />
          </div>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />

          <!-- MCQ 1: Overall Rating -->
          <div class="mcq-group" id="group-q1" style="margin-bottom:28px;padding:14px;border-radius:14px;transition:all 0.3s;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              1. How would you rate your overall experience with the platform? ⭐ <span class="req-star" style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q1_rating" value="5 Stars - Excellent" style="accent-color:var(--primary,#4f46e5);" />
                <span>⭐⭐⭐⭐⭐ <strong>Excellent (5/5)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q1_rating" value="4 Stars - Good" style="accent-color:var(--primary,#4f46e5);" />
                <span>⭐⭐⭐⭐ <strong>Good (4/5)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q1_rating" value="3 Stars - Average" style="accent-color:var(--primary,#4f46e5);" />
                <span>⭐⭐⭐ <strong>Average (3/5)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q1_rating" value="2 Stars - Needs Improvement" style="accent-color:var(--primary,#4f46e5);" />
                <span>⭐⭐ <strong>Needs Work (2/5)</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 2: Vision Tracking -->
          <div class="mcq-group" id="group-q2" style="margin-bottom:28px;padding:14px;border-radius:14px;transition:all 0.3s;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              2. How smooth and responsive was the AI Camera Vision hand tracking? 📷 <span class="req-star" style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q2_tracking" value="Very smooth & responsive" style="accent-color:var(--primary,#4f46e5);" />
                <span>🟢 <strong>Very Smooth & Fast</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q2_tracking" value="Good (slight delay occasionally)" style="accent-color:var(--primary,#4f46e5);" />
                <span>🟡 <strong>Good (slight delay)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q2_tracking" value="Laggy or camera issues" style="accent-color:var(--primary,#4f46e5);" />
                <span>🔴 <strong>Laggy / Camera issue</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q2_tracking" value="Used Mouse / Touch mode" style="accent-color:var(--primary,#4f46e5);" />
                <span>⚪ <strong>Used Mouse / Touch</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 3: Favorite Rehab Module -->
          <div class="mcq-group" id="group-q3" style="margin-bottom:28px;padding:14px;border-radius:14px;transition:all 0.3s;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              3. Which clinical rehabilitation module did you find most engaging? 🎮 <span class="req-star" style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q3_module" value="Virtual Piano Finger Independence" style="accent-color:var(--primary,#4f46e5);" />
                <span>🎹 <strong>Piano Finger Independence</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q3_module" value="Forearm Knob & Key Turning" style="accent-color:var(--primary,#4f46e5);" />
                <span>🔐 <strong>Forearm Knob & Rotation</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q3_module" value="9-Hole Pegboard Pincer Test" style="accent-color:var(--primary,#4f46e5);" />
                <span>📌 <strong>9-Hole Pegboard Pinch</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q3_module" value="Shelf Reaching & Stacking" style="accent-color:var(--primary,#4f46e5);" />
                <span>🗄️ <strong>Shelf Reaching & Stacking</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q3_module" value="Planar Window & Surface Sweep" style="accent-color:var(--primary,#4f46e5);" />
                <span>🪟 <strong>Planar Window Sweep</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q3_module" value="Facial Symmetry & Speech Lab" style="accent-color:var(--primary,#4f46e5);" />
                <span>🪞 <strong>Facial Symmetry & Speech</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 4: AI Recovery Coach -->
          <div class="mcq-group" id="group-q4" style="margin-bottom:28px;padding:14px;border-radius:14px;transition:all 0.3s;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              4. How helpful was the 24/7 AI Recovery Coach & Recovery Planner? 🤖 <span class="req-star" style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q4_ai_coach" value="Extremely helpful with clear medical tips" style="accent-color:var(--primary,#4f46e5);" />
                <span>🌟 <strong>Extremely Helpful & Clear</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q4_ai_coach" value="Good for daily exercise routines" style="accent-color:var(--primary,#4f46e5);" />
                <span>👍 <strong>Good for Daily Planning</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q4_ai_coach" value="Neutral / Okay" style="accent-color:var(--primary,#4f46e5);" />
                <span>💡 <strong>Neutral / Okay</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q4_ai_coach" value="Did not use it yet" style="accent-color:var(--primary,#4f46e5);" />
                <span>❌ <strong>Did Not Try It Yet</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 5: Usability -->
          <div class="mcq-group" id="group-q5" style="margin-bottom:28px;padding:14px;border-radius:14px;transition:all 0.3s;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              5. How easy was it to navigate and use the website interface? 📱 <span class="req-star" style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q5_usability" value="Super easy & intuitive" style="accent-color:var(--primary,#4f46e5);" />
                <span>🚀 <strong>Super Easy & Clean</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q5_usability" value="Easy to understand" style="accent-color:var(--primary,#4f46e5);" />
                <span>👍 <strong>Easy to Understand</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q5_usability" value="A bit confusing at first" style="accent-color:var(--primary,#4f46e5);" />
                <span>🧐 <strong>A Bit Confusing</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q5_usability" value="Difficult to navigate" style="accent-color:var(--primary,#4f46e5);" />
                <span>⚠️ <strong>Difficult to Navigate</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 6: Recommendation -->
          <div class="mcq-group" id="group-q6" style="margin-bottom:28px;padding:14px;border-radius:14px;transition:all 0.3s;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              6. Would you recommend this platform for stroke patients doing home recovery? 🏥 <span class="req-star" style="color:#ef4444;">*</span>
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q6_recommend" value="Definitely Yes (Highly Recommended)" style="accent-color:var(--primary,#4f46e5);" />
                <span>💯 <strong>Definitely Yes (Highly Recommend)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q6_recommend" value="Yes, with minor additions" style="accent-color:var(--primary,#4f46e5);" />
                <span>👍 <strong>Yes, With Small Updates</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q6_recommend" value="Maybe / Unsure" style="accent-color:var(--primary,#4f46e5);" />
                <span>🤔 <strong>Maybe / Unsure</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;background:#ffffff;">
                <input type="radio" name="q6_recommend" value="No" style="accent-color:var(--primary,#4f46e5);" />
                <span>👎 <strong>No</strong></span>
              </label>
            </div>
          </div>

          <!-- Suggestion Text Box -->
          <div style="margin-bottom:32px;padding:14px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:8px;">
              📝 Any Changes, New Features, or Suggestions You Want Us to Add?
            </label>
            <p style="font-size:0.85rem;color:#64748b;margin-bottom:12px;">Tell us what you liked, what changes we should make, or any new games/features you'd love to see:</p>
            <textarea id="fb-comments" class="inp" rows="4" placeholder="Write your suggestions, requested changes, or thoughts here..." style="width:100%;padding:14px;border-radius:12px;font-size:0.95rem;line-height:1.6;border:1.5px solid #cbd5e1;"></textarea>
          </div>

          <!-- Submit Button -->
          <div style="display:flex;justify-content:center;">
            <button type="submit" class="btn btn-primary btn-lg" id="submit-fb-btn" style="padding:14px 44px;font-size:1.1rem;border-radius:14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 20px rgba(79,70,229,0.3);cursor:pointer;border:none;">
              <span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Testimonials / Submitted Reviews Wall -->
      <div class="welcome-section" style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <h2 style="font-size:1.4rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:10px;margin:0;">
          <i class="fas fa-comments" style="color:var(--primary,#4f46e5);"></i> Community & Tester Reviews Wall
        </h2>
        <button id="refresh-fb-btn" class="btn btn-sm" style="background:#f1f5f9;color:#475569;border:1px solid #cbd5e1;padding:6px 14px;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:6px;">
          <i class="fas fa-sync-alt"></i> Refresh Wall
        </button>
      </div>

      <!-- Reviews Wall Container -->
      <div id="feedbacks-wall" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px;">
        <!-- Loaded via JS -->
      </div>
    </div>
  `;
}

export async function initFeedbackPage() {
  const form = document.getElementById('feedback-form');
  const wall = document.getElementById('feedbacks-wall');
  const submitBtn = document.getElementById('submit-fb-btn');
  const countBadge = document.getElementById('fb-count-text');
  const refreshBtn = document.getElementById('refresh-fb-btn');

  let currentFeedbacks = [];

  // Radio selection styling
  document.querySelectorAll('.mcq-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const name = radio.name;
      const group = radio.closest('.mcq-group');
      if (group) {
        group.style.background = 'transparent';
        group.style.boxShadow = 'none';
      }

      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        const option = r.closest('.mcq-option');
        if (r.checked) {
          option.style.borderColor = 'var(--primary,#4f46e5)';
          option.style.background = 'rgba(79,70,229,0.08)';
          option.style.boxShadow = '0 0 0 2px rgba(79,70,229,0.2)';
        } else {
          option.style.borderColor = '#cbd5e1';
          option.style.background = '#ffffff';
          option.style.boxShadow = 'none';
        }
      });
    });
  });

  // Hover effect for MCQ options
  document.querySelectorAll('.mcq-option').forEach(option => {
    option.addEventListener('mouseenter', () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio && !radio.checked) {
        option.style.borderColor = '#94a3b8';
        option.style.background = '#f8fafc';
      }
    });
    option.addEventListener('mouseleave', () => {
      const radio = option.querySelector('input[type="radio"]');
      if (radio && !radio.checked) {
        option.style.borderColor = '#cbd5e1';
        option.style.background = '#ffffff';
      }
    });
  });

  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      await loadFeedbacks();
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Wall';
      Toast.info('Reviews wall updated');
    };
  }

  async function loadFeedbacks() {
    try {
      const resp = await fetch('/api/feedback');
      if (resp.ok) {
        const data = await resp.json();
        currentFeedbacks = data.feedbacks || [];
        renderFeedbackCards(currentFeedbacks);
        return;
      }
    } catch (e) {
      console.warn('Backend feedback fetch error:', e);
    }

    // Fallback to localStorage if offline
    const local = JSON.parse(localStorage.getItem('user_feedbacks') || '[]');
    currentFeedbacks = local;
    renderFeedbackCards(currentFeedbacks);
  }

  function renderFeedbackCards(list) {
    if (countBadge) {
      countBadge.textContent = `${list.length} ${list.length === 1 ? 'Review' : 'Reviews'} Displayed Forever`;
    }

    if (!list || list.length === 0) {
      wall.innerHTML = `
        <div style="grid-column:1/-1;background:#f8fafc;padding:48px 20px;border-radius:18px;text-align:center;color:#64748b;border:2px dashed #cbd5e1;">
          <div style="font-size:2.8rem;margin-bottom:12px;color:#94a3b8;">💬</div>
          <h3 style="margin:0 0 8px;color:#334155;font-size:1.2rem;">No Feedbacks Yet</h3>
          <p style="margin:0;font-size:0.95rem;">Be the very first reviewer to share your experience using the form above!</p>
        </div>
      `;
      return;
    }

    wall.innerHTML = list.map(item => `
      <div class="card feedback-card-item" id="fb-card-${item.id}" style="padding:22px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,0.05);background:#ffffff;border:1px solid #e2e8f0;border-top:4px solid var(--primary,#4f46e5);display:flex;flex-direction:column;justify-content:space-between;transition:transform 0.2s, box-shadow 0.2s;">
        <div>
          <!-- Header with Reviewer Name & Time -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;border-radius:50%;background:rgba(79,70,229,0.12);color:var(--primary,#4f46e5);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.95rem;">
                ${(item.name || 'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style="font-weight:700;color:#0f172a;font-size:1.02rem;">${item.name || 'Anonymous Reviewer'}</div>
                <div style="font-size:0.75rem;color:#94a3b8;"><i class="far fa-clock"></i> ${item.created_at || 'Recent'}</div>
              </div>
            </div>
            <!-- Star Rating Badge -->
            <span style="background:#fef3c7;color:#b45309;font-weight:700;padding:4px 10px;border-radius:12px;font-size:0.8rem;white-space:nowrap;">
              ${item.q1_rating ? item.q1_rating.split('-')[0].trim() : '⭐⭐⭐⭐⭐'}
            </span>
          </div>

          <!-- Feature Badges -->
          <div style="display:flex;flex-direction:column;gap:6px;margin:12px 0;font-size:0.85rem;color:#475569;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-weight:600;color:#1e293b;">🎮 Favorite:</span>
              <span style="background:#f1f5f9;padding:2px 8px;border-radius:6px;color:#334155;">${item.q3_module || 'Rehab Games'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-weight:600;color:#1e293b;">📷 Camera:</span>
              <span style="background:#f1f5f9;padding:2px 8px;border-radius:6px;color:#334155;">${item.q2_tracking || 'Smooth'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-weight:600;color:#1e293b;">🤖 AI Coach:</span>
              <span style="background:#f1f5f9;padding:2px 8px;border-radius:6px;color:#334155;">${item.q4_ai_coach || 'Helpful'}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-weight:600;color:#1e293b;">🏥 Recommend:</span>
              <span style="background:#ecfdf5;color:#047857;font-weight:600;padding:2px 8px;border-radius:6px;">${item.q6_recommend || 'Yes'}</span>
            </div>
          </div>

          <!-- Comments Quote Bubble -->
          ${item.comments ? `
            <div style="background:#f8fafc;border-left:3px solid var(--primary,#4f46e5);padding:10px 14px;border-radius:8px;font-size:0.88rem;color:#334155;font-style:italic;line-height:1.5;margin-top:10px;">
              <i class="fas fa-quote-left" style="color:#94a3b8;font-size:0.75rem;margin-right:4px;"></i>
              ${item.comments}
            </div>
          ` : ''}
        </div>

        <!-- Footer Card Actions (Delete Button) -->
        <div style="display:flex;justify-content:flex-end;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9;">
          <button class="btn-delete-fb" data-id="${item.id}" data-name="${item.name || 'Reviewer'}" style="background:rgba(239,68,68,0.06);color:#dc2626;border:1px solid #fecaca;padding:6px 14px;border-radius:8px;font-size:0.82rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;">
            <i class="fas fa-trash-alt"></i> Delete Feedback
          </button>
        </div>
      </div>
    `).join('');

    // Attach delete handlers
    document.querySelectorAll('.btn-delete-fb').forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        const fbId = btn.getAttribute('data-id');
        const fbName = btn.getAttribute('data-name') || 'this review';
        
        if (!confirm(`Are you sure you want to permanently delete the feedback from "${fbName}"?`)) {
          return;
        }

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        try {
          await fetch(`/api/feedback/${fbId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          try {
            await fetch('/api/feedback/delete', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: fbId })
            });
          } catch (e2) {}
        }

        // Remove from local array
        currentFeedbacks = currentFeedbacks.filter(f => String(f.id) !== String(fbId));
        localStorage.setItem('user_feedbacks', JSON.stringify(currentFeedbacks));

        // Animate card removal
        const cardEl = document.getElementById(`fb-card-${fbId}`);
        if (cardEl) {
          cardEl.style.opacity = '0';
          cardEl.style.transform = 'scale(0.9)';
          setTimeout(() => {
            renderFeedbackCards(currentFeedbacks);
          }, 250);
        } else {
          renderFeedbackCards(currentFeedbacks);
        }

        Toast.success('Feedback deleted successfully');
      };
    });
  }

  form.onsubmit = async (e) => {
    e.preventDefault();

    const getRadioVal = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : '';
    };

    const q1 = getRadioVal('q1_rating');
    const q2 = getRadioVal('q2_tracking');
    const q3 = getRadioVal('q3_module');
    const q4 = getRadioVal('q4_ai_coach');
    const q5 = getRadioVal('q5_usability');
    const q6 = getRadioVal('q6_recommend');

    const questions = [
      { id: 'group-q1', val: q1, num: 1, label: 'Overall Experience Rating' },
      { id: 'group-q2', val: q2, num: 2, label: 'Camera Vision Tracking' },
      { id: 'group-q3', val: q3, num: 3, label: 'Favorite Rehab Module' },
      { id: 'group-q4', val: q4, num: 4, label: 'AI Recovery Coach' },
      { id: 'group-q5', val: q5, num: 5, label: 'Platform Usability' },
      { id: 'group-q6', val: q6, num: 6, label: 'Recommendation' }
    ];

    const unanswered = questions.find(q => !q.val);
    if (unanswered) {
      Toast.error(`Please answer Question ${unanswered.num}: ${unanswered.label}`);
      const groupEl = document.getElementById(unanswered.id);
      if (groupEl) {
        groupEl.style.background = 'rgba(239, 68, 68, 0.08)';
        groupEl.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.4)';
        groupEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Feedback...';

    const payload = {
      name: document.getElementById('fb-name').value.trim() || 'Anonymous Reviewer',
      q1_rating: q1,
      q2_tracking: q2,
      q3_module: q3,
      q4_ai_coach: q4,
      q5_usability: q5,
      q6_recommend: q6,
      comments: document.getElementById('fb-comments').value.trim()
    };

    let submittedEntry = null;

    try {
      const resp = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const resData = await resp.json();
        submittedEntry = resData.feedback;
      }
    } catch (err) {
      console.warn('POST feedback server issue:', err);
    }

    if (!submittedEntry) {
      submittedEntry = {
        id: Date.now(),
        ...payload,
        created_at: 'Just now'
      };
    }

    // Prepend to current feedbacks list
    currentFeedbacks.unshift(submittedEntry);
    localStorage.setItem('user_feedbacks', JSON.stringify(currentFeedbacks));

    Toast.success('Thank you so much! Your feedback has been posted permanently. ⭐');
    
    // Reset form
    document.getElementById('fb-comments').value = '';
    document.querySelectorAll('.mcq-option input[type="radio"]').forEach(r => {
      r.checked = false;
      const opt = r.closest('.mcq-option');
      if (opt) {
        opt.style.borderColor = '#cbd5e1';
        opt.style.background = '#ffffff';
        opt.style.boxShadow = 'none';
      }
    });

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>';

    // Render updated wall and scroll to wall
    renderFeedbackCards(currentFeedbacks);
    const wallTitle = document.querySelector('#feedbacks-wall');
    if (wallTitle) {
      wallTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  await loadFeedbacks();
}
