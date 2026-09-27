/* Patient & Tester Experience Feedback Survey Page */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderFeedbackPage() {
  const user = Auth.getUser() || {};

  return `
    <div class="page-container" style="max-width:900px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="welcome-section" style="margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
          <div>
            <h1>⭐ Share Your Experience & Feedback</h1>
            <p class="welcome-date">Help us evaluate and improve our AI Stroke Telerehabilitation platform</p>
          </div>
          <span class="badge" style="background:rgba(79,70,229,0.12);color:var(--primary,#4f46e5);font-weight:700;padding:8px 16px;border-radius:20px;font-size:13px">
            <i class="fas fa-clipboard-check"></i> 6 Quick MCQs + 1 Suggestion
          </span>
        </div>
      </div>

      <!-- Feedback Form Card -->
      <div class="card" style="padding:32px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.06);margin-bottom:32px;background:#ffffff;">
        <form id="feedback-form">
          <!-- Tester Name -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1rem;color:#1e293b;margin-bottom:8px;">
              Your Name / Tester ID <span style="font-size:0.85rem;color:#64748b;font-weight:400;">(Optional)</span>
            </label>
            <input type="text" id="fb-name" class="inp" placeholder="e.g. Rahul, Dr. Priya, Group Member..." value="${user.name || ''}" style="width:100%;max-width:400px;padding:12px 16px;border-radius:10px;font-size:0.95rem;" />
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
            <textarea id="fb-comments" class="inp" rows="4" placeholder="Write your suggestions, requested changes, or thoughts here..." style="width:100%;padding:14px;border-radius:12px;font-size:0.95rem;line-height:1.6;"></textarea>
          </div>

          <!-- Submit Button -->
          <div style="display:flex;justify-content:center;">
            <button type="submit" class="btn btn-primary btn-lg" id="submit-fb-btn" style="padding:14px 40px;font-size:1.1rem;border-radius:14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 20px rgba(79,70,229,0.3);cursor:pointer;">
              <span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Testimonials / Submitted Reviews Wall -->
      <div class="welcome-section" style="margin-bottom:16px;">
        <h2 style="font-size:1.35rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:8px;">
          <i class="fas fa-comments" style="color:var(--primary,#4f46e5);"></i> Recent Tester Reviews & Feedbacks
        </h2>
      </div>
      <div id="feedbacks-wall" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">
        <!-- Loaded via JS -->
      </div>
    </div>
  `;
}

export async function initFeedbackPage() {
  const form = document.getElementById('feedback-form');
  const wall = document.getElementById('feedbacks-wall');
  const submitBtn = document.getElementById('submit-fb-btn');

  // Handle radio selection styling
  document.querySelectorAll('.mcq-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const name = radio.name;
      // Reset outline on the question group if previously highlighted in red
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
      if (!radio.checked) {
        option.style.borderColor = '#94a3b8';
        option.style.background = '#f8fafc';
      }
    });
    option.addEventListener('mouseleave', () => {
      const radio = option.querySelector('input[type="radio"]');
      if (!radio.checked) {
        option.style.borderColor = '#cbd5e1';
        option.style.background = '#ffffff';
      }
    });
  });

  async function loadFeedbacks() {
    try {
      const resp = await fetch('/api/feedback');
      if (resp.ok) {
        const data = await resp.json();
        renderFeedbackCards(data.feedbacks || []);
        return;
      }
    } catch (e) {}

    // Fallback to localStorage
    const local = JSON.parse(localStorage.getItem('user_feedbacks') || '[]');
    renderFeedbackCards(local);
  }

  function renderFeedbackCards(list) {
    if (!list || list.length === 0) {
      wall.innerHTML = `
        <div style="grid-column:1/-1;background:#f8fafc;padding:32px;border-radius:16px;text-align:center;color:#64748b;border:1px dashed #cbd5e1;">
          <i class="fas fa-comment-dots" style="font-size:2rem;margin-bottom:8px;color:#94a3b8;"></i>
          <p style="margin:0;font-weight:600;">No feedbacks submitted yet. Be the first to share your experience above!</p>
        </div>
      `;
      return;
    }

    wall.innerHTML = list.map(item => `
      <div class="card" style="padding:20px;border-radius:16px;box-shadow:0 4px 12px rgba(0,0,0,0.04);background:#ffffff;border-left:4px solid var(--primary,#4f46e5);">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div style="font-weight:700;color:#1e293b;font-size:1rem;">${item.name || 'Anonymous Reviewer'}</div>
          <span style="font-size:0.75rem;color:#94a3b8;">${item.created_at || 'Recent'}</span>
        </div>
        <div style="color:#f59e0b;font-weight:700;font-size:0.9rem;margin-bottom:8px;">
          ${item.q1_rating || '⭐⭐⭐⭐⭐'}
        </div>
        <div style="font-size:0.85rem;color:#475569;margin-bottom:6px;">
          <strong>Favorite:</strong> ${item.q3_module || 'Rehab Games'}
        </div>
        <div style="font-size:0.85rem;color:#475569;margin-bottom:8px;">
          <strong>Vision Tracking:</strong> ${item.q2_tracking || 'Smooth'}
        </div>
        ${item.comments ? `
          <div style="background:#f1f5f9;padding:10px 14px;border-radius:10px;font-size:0.88rem;color:#334155;font-style:italic;line-height:1.5;margin-top:10px;">
            "${item.comments}"
          </div>
        ` : ''}
      </div>
    `).join('');
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

    // Validation: Check if any MCQ is not selected
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
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

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

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {}

    // Save locally
    const local = JSON.parse(localStorage.getItem('user_feedbacks') || '[]');
    payload.created_at = 'Just now';
    local.unshift(payload);
    localStorage.setItem('user_feedbacks', JSON.stringify(local));

    Toast.success('Thank you so much for your feedback! ⭐');
    
    // Reset form
    document.getElementById('fb-comments').value = '';
    document.querySelectorAll('.mcq-option input[type="radio"]').forEach(r => {
      r.checked = false;
      const opt = r.closest('.mcq-option');
      opt.style.borderColor = '#cbd5e1';
      opt.style.background = '#ffffff';
      opt.style.boxShadow = 'none';
    });

    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>';

    await loadFeedbacks();
  };

  await loadFeedbacks();
}
