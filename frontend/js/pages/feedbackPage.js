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
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              1. How would you rate your overall experience with the platform? ⭐
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;">
                <input type="radio" name="q1_rating" value="5 Stars - Excellent" checked style="accent-color:var(--primary);" />
                <span>⭐⭐⭐⭐⭐ <strong>Excellent (5/5)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;">
                <input type="radio" name="q1_rating" value="4 Stars - Good" style="accent-color:var(--primary);" />
                <span>⭐⭐⭐⭐ <strong>Good (4/5)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;">
                <input type="radio" name="q1_rating" value="3 Stars - Average" style="accent-color:var(--primary);" />
                <span>⭐⭐⭐ <strong>Average (3/5)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;transition:all 0.2s;">
                <input type="radio" name="q1_rating" value="2 Stars - Needs Improvement" style="accent-color:var(--primary);" />
                <span>⭐⭐ <strong>Needs Work (2/5)</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 2: Vision Tracking -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              2. How smooth and responsive was the AI Camera Vision hand tracking? 📷
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q2_tracking" value="Very smooth & responsive" checked style="accent-color:var(--primary);" />
                <span>🟢 <strong>Very Smooth & Fast</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q2_tracking" value="Good (slight delay occasionally)" style="accent-color:var(--primary);" />
                <span>🟡 <strong>Good (slight delay)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q2_tracking" value="Laggy or camera issues" style="accent-color:var(--primary);" />
                <span>🔴 <strong>Laggy / Lighting issue</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q2_tracking" value="Used Mouse / Touch mode" style="accent-color:var(--primary);" />
                <span>⚪ <strong>Used Mouse / Touch</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 3: Favorite Rehab Module -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              3. Which clinical rehabilitation module did you find most engaging? 🎮
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q3_module" value="Virtual Piano Finger Independence" checked style="accent-color:var(--primary);" />
                <span>🎹 <strong>Piano Finger Independence</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q3_module" value="Forearm Knob & Key Turning" style="accent-color:var(--primary);" />
                <span>🔐 <strong>Forearm Knob & Rotation</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q3_module" value="9-Hole Pegboard Pincer Test" style="accent-color:var(--primary);" />
                <span>📌 <strong>9-Hole Pegboard Pinch</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q3_module" value="Shelf Reaching & Stacking" style="accent-color:var(--primary);" />
                <span>🗄️ <strong>Shelf Reaching & Stacking</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q3_module" value="Planar Window & Surface Sweep" style="accent-color:var(--primary);" />
                <span>🪟 <strong>Planar Window Sweep</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q3_module" value="Facial Symmetry & Speech Lab" style="accent-color:var(--primary);" />
                <span>🪞 <strong>Facial Symmetry & Speech</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 4: AI Recovery Coach -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              4. How helpful was the 24/7 AI Recovery Coach & Recovery Planner? 🤖
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q4_ai_coach" value="Extremely helpful with clear medical tips" checked style="accent-color:var(--primary);" />
                <span>🌟 <strong>Extremely Helpful & Clear</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q4_ai_coach" value="Good for daily exercise routines" style="accent-color:var(--primary);" />
                <span>👍 <strong>Good for Daily Planning</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q4_ai_coach" value="Neutral / Okay" style="accent-color:var(--primary);" />
                <span>💡 <strong>Neutral / Okay</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q4_ai_coach" value="Did not use it yet" style="accent-color:var(--primary);" />
                <span>❌ <strong>Did Not Try It Yet</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 5: Usability -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              5. How easy was it to navigate and use the website interface? 📱
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q5_usability" value="Super easy & intuitive" checked style="accent-color:var(--primary);" />
                <span>🚀 <strong>Super Easy & Clean</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q5_usability" value="Easy to understand" style="accent-color:var(--primary);" />
                <span>👍 <strong>Easy to Understand</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q5_usability" value="A bit confusing at first" style="accent-color:var(--primary);" />
                <span>🧐 <strong>A Bit Confusing</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q5_usability" value="Difficult to navigate" style="accent-color:var(--primary);" />
                <span>⚠️ <strong>Difficult to Navigate</strong></span>
              </label>
            </div>
          </div>

          <!-- MCQ 6: Recommendation -->
          <div style="margin-bottom:28px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:12px;">
              6. Would you recommend this platform for stroke patients doing home recovery? 🏥
            </label>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;">
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q6_recommend" value="Definitely Yes (Highly Recommended)" checked style="accent-color:var(--primary);" />
                <span>💯 <strong>Definitely Yes (Highly Recommend)</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q6_recommend" value="Yes, with minor additions" style="accent-color:var(--primary);" />
                <span>👍 <strong>Yes, With Small Updates</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q6_recommend" value="Maybe / Unsure" style="accent-color:var(--primary);" />
                <span>🤔 <strong>Maybe / Unsure</strong></span>
              </label>
              <label class="mcq-option" style="display:flex;align-items:center;gap:10px;padding:14px;border:1.5px solid #cbd5e1;border-radius:12px;cursor:pointer;">
                <input type="radio" name="q6_recommend" value="No" style="accent-color:var(--primary);" />
                <span>👎 <strong>No</strong></span>
              </label>
            </div>
          </div>

          <!-- Suggestion Text Box -->
          <div style="margin-bottom:32px;">
            <label style="display:block;font-weight:700;font-size:1.05rem;color:#1e293b;margin-bottom:8px;">
              📝 Any Changes, New Features, or Suggestions You Want Us to Add?
            </label>
            <p style="font-size:0.85rem;color:#64748b;margin-bottom:12px;">Tell us what you liked, what changes we should make, or any new games/features you'd love to see:</p>
            <textarea id="fb-comments" class="inp" rows="4" placeholder="Write your suggestions, requested changes, or thoughts here..." style="width:100%;padding:14px;border-radius:12px;font-size:0.95rem;line-height:1.6;"></textarea>
          </div>

          <!-- Submit Button -->
          <div style="display:flex;justify-content:center;">
            <button type="submit" class="btn btn-primary btn-lg" id="submit-fb-btn" style="padding:14px 40px;font-size:1.1rem;border-radius:14px;display:flex;align-items:center;gap:10px;box-shadow:0 8px 20px rgba(79,70,229,0.3);">
              <span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>

      <!-- Testimonials / Submitted Reviews Wall -->
      <div class="welcome-section" style="margin-bottom:16px;">
        <h2 style="font-size:1.35rem;font-weight:700;color:#1e293b;display:flex;align-items:center;gap:8px;">
          <i class="fas fa-comments" style="color:var(--primary);"></i> Recent Tester Reviews & Feedbacks
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

  // Highlight active radio boxes
  document.querySelectorAll('.mcq-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const name = radio.name;
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.closest('.mcq-option').style.borderColor = r.checked ? 'var(--primary,#4f46e5)' : '#cbd5e1';
        r.closest('.mcq-option').style.background = r.checked ? 'rgba(79,70,229,0.06)' : '#ffffff';
      });
    });
    if (radio.checked) {
      radio.closest('.mcq-option').style.borderColor = 'var(--primary,#4f46e5)';
      radio.closest('.mcq-option').style.background = 'rgba(79,70,229,0.06)';
    }
  });

  async function loadFeedbacks() {
    try {
      const resp = await fetch('/api/feedback/');
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
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

    const getRadioVal = (name) => {
      const el = document.querySelector(`input[name="${name}"]:checked`);
      return el ? el.value : '';
    };

    const payload = {
      name: document.getElementById('fb-name').value.trim() || 'Anonymous Reviewer',
      q1_rating: getRadioVal('q1_rating'),
      q2_tracking: getRadioVal('q2_tracking'),
      q3_module: getRadioVal('q3_module'),
      q4_ai_coach: getRadioVal('q4_ai_coach'),
      q5_usability: getRadioVal('q5_usability'),
      q6_recommend: getRadioVal('q6_recommend'),
      comments: document.getElementById('fb-comments').value.trim()
    };

    try {
      await fetch('/api/feedback/', {
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
    document.getElementById('fb-comments').value = '';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>';

    await loadFeedbacks();
  };

  await loadFeedbacks();
}
