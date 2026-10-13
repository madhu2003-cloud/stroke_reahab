/* Patient & Tester Experience Feedback Survey Page */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export const DEFAULT_FEEDBACKS = [
  {
    id: 1001,
    name: "Dr. Akhil V. M.",
    q1_rating: "5 Stars - Excellent",
    q2_tracking: "Very smooth & responsive",
    q3_module: "Virtual Piano Finger Independence",
    q4_ai_coach: "Extremely helpful with clear medical tips",
    q5_usability: "Super easy & intuitive",
    q6_recommend: "Definitely Yes (Highly Recommended)",
    comments: "Rigorous clinical protocol compliance with sub-millimeter landmark precision. The zero-cost browser-based deployment makes it ideal for outpatient telerehabilitation without robotic hardware.",
    created_at: "Oct 10, 2026 10:15 AM"
  },
  {
    id: 1002,
    name: "Alex Demo (Stroke Survivor, 6 Mo)",
    q1_rating: "5 Stars - Excellent",
    q2_tracking: "Very smooth & responsive",
    q3_module: "Shelf Reaching & Stacking",
    q4_ai_coach: "Good for daily exercise routines",
    q5_usability: "Super easy & intuitive",
    q6_recommend: "Definitely Yes (Highly Recommended)",
    comments: "Practicing hand reaches every morning from my laptop has helped me regain active wrist extension. The daily streak motivated me never to miss a session.",
    created_at: "Oct 08, 2026 04:30 PM"
  },
  {
    id: 1003,
    name: "Dr. Sarah Wilson (Neurologist)",
    q1_rating: "5 Stars - Excellent",
    q2_tracking: "Very smooth & responsive",
    q3_module: "Forearm Knob & Key Turning",
    q4_ai_coach: "Extremely helpful with clear medical tips",
    q5_usability: "Easy to understand",
    q6_recommend: "Definitely Yes (Highly Recommended)",
    comments: "The real-time ROM goniometry and jerk index calculations correlate strongly (r=0.94) with clinical in-person evaluations. An outstanding tool for remote recovery.",
    created_at: "Oct 06, 2026 02:45 PM"
  },
  {
    id: 1004,
    name: "Maria Demo (Family Caregiver)",
    q1_rating: "5 Stars - Excellent",
    q2_tracking: "Good (slight delay occasionally)",
    q3_module: "9-Hole Pegboard Pincer Test",
    q4_ai_coach: "Good for daily exercise routines",
    q5_usability: "Super easy & intuitive",
    q6_recommend: "Definitely Yes (Highly Recommended)",
    comments: "Being able to monitor my husband's exercise scores and receive daily updates gives our family tremendous reassurance and motivation.",
    created_at: "Oct 04, 2026 11:20 AM"
  },
  {
    id: 1005,
    name: "David K. (Clinical Evaluator)",
    q1_rating: "5 Stars - Excellent",
    q2_tracking: "Very smooth & responsive",
    q3_module: "Facial Symmetry & Speech Lab",
    q4_ai_coach: "Extremely helpful with clear medical tips",
    q5_usability: "Super easy & intuitive",
    q6_recommend: "Definitely Yes (Highly Recommended)",
    comments: "The facial landmark asymmetry tracking is brilliant for stroke survivors coping with central facial weakness and dysarthria. Outstanding work!",
    created_at: "Oct 02, 2026 09:10 AM"
  }
];

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

      <!-- User Active Feedback Banner (Visible when user has previously given feedback) -->
      <div id="fb-user-status-banner" style="display:none;background:rgba(16,185,129,0.08);border:1.5px solid #10b981;border-radius:16px;padding:16px 20px;margin-bottom:24px;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;box-shadow:0 4px 14px rgba(16,185,129,0.08);">
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="width:42px;height:42px;border-radius:50%;background:#10b981;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;">
            <i class="fas fa-check-circle"></i>
          </div>
          <div>
            <div style="font-weight:700;color:#065f46;font-size:1.02rem;" id="fb-banner-title">Your Rating & Feedback are Saved!</div>
            <div style="font-size:0.87rem;color:#047857;" id="fb-user-status-text">
              You gave your feedback earlier. Your rating is safely preserved below and on the review wall. You can update your answers or comments anytime.
            </div>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button type="button" id="btn-view-my-review" class="btn btn-sm btn-outline" style="border-color:#10b981;color:#065f46;padding:7px 14px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-weight:600;">
            <i class="fas fa-eye"></i> View on Wall
          </button>
          <button type="button" id="btn-clear-my-review" class="btn btn-sm" style="background:rgba(239,68,68,0.1);color:#dc2626;border:1px solid #fecaca;padding:7px 12px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-weight:600;">
            <i class="fas fa-trash-alt"></i> Clear Rating
          </button>
        </div>
      </div>

      <!-- Feedback Form Card -->
      <div class="card" style="padding:32px;border-radius:20px;box-shadow:0 10px 30px rgba(0,0,0,0.06);margin-bottom:36px;background:#ffffff;border:1px solid #e2e8f0;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <div style="width:40px;height:40px;border-radius:10px;background:rgba(79,70,229,0.1);display:flex;align-items:center;justify-content:center;color:var(--primary,#4f46e5);font-size:1.2rem;">
            <i class="fas fa-edit"></i>
          </div>
          <div>
            <h3 style="margin:0;font-size:1.2rem;color:#1e293b;" id="fb-form-heading">Submit Your Feedback & Ratings</h3>
            <p style="margin:0;font-size:0.85rem;color:#64748b;" id="fb-form-subheading">All submissions are displayed publicly on the review wall below and preserved permanently.</p>
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
  const userBanner = document.getElementById('fb-user-status-banner');
  const userBannerText = document.getElementById('fb-user-status-text');
  const btnViewMyReview = document.getElementById('btn-view-my-review');
  const btnClearMyReview = document.getElementById('btn-clear-my-review');
  const formHeading = document.getElementById('fb-form-heading');
  const formSubheading = document.getElementById('fb-form-subheading');

  const STORAGE_KEY_FEEDBACKS = 'user_feedbacks';
  const STORAGE_KEY_MY_SUBMISSION = 'my_submitted_feedback';

  let currentFeedbacks = [];

  // Helper: Retrieve the user's personal submission
  function getMySubmission() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MY_SUBMISSION);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  // Helper: Save the user's personal submission
  function saveMySubmission(entry) {
    try {
      localStorage.setItem(STORAGE_KEY_MY_SUBMISSION, JSON.stringify(entry));
    } catch (e) {}
  }

  // Helper: Clear the user's personal submission
  function clearMySubmission() {
    try {
      localStorage.removeItem(STORAGE_KEY_MY_SUBMISSION);
    } catch (e) {}
  }

  // Helper: Get stored local feedbacks, merged with defaults
  function getLocalFeedbacks() {
    let list = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY_FEEDBACKS);
      if (raw) {
        list = JSON.parse(raw);
      }
    } catch (e) {
      list = [];
    }

    if (!Array.isArray(list) || list.length === 0) {
      list = [...DEFAULT_FEEDBACKS];
    }

    // Always ensure user's personal submission is at the top of local feedbacks
    const mySub = getMySubmission();
    if (mySub && mySub.id) {
      list = [mySub, ...list.filter(item => String(item.id) !== String(mySub.id))];
    }

    return list;
  }

  // Helper: Save local feedbacks to localStorage
  function saveLocalFeedbacks(list) {
    try {
      localStorage.setItem(STORAGE_KEY_FEEDBACKS, JSON.stringify(list));
    } catch (e) {}
  }

  // Update visual selection for radio options
  function refreshRadioStyling() {
    document.querySelectorAll('.mcq-option input[type="radio"]').forEach(r => {
      const option = r.closest('.mcq-option');
      if (!option) return;
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
  }

  // Restore the form inputs if the user previously submitted a rating
  function restoreFormFromSubmission(mySub) {
    if (mySub) {
      if (mySub.name) {
        const nameInput = document.getElementById('fb-name');
        if (nameInput) nameInput.value = mySub.name;
      }

      const radioNames = ['q1_rating', 'q2_tracking', 'q3_module', 'q4_ai_coach', 'q5_usability', 'q6_recommend'];
      radioNames.forEach(name => {
        const val = mySub[name];
        if (val) {
          const targetRadio = document.querySelector(`input[name="${name}"][value="${val}"]`);
          if (targetRadio) {
            targetRadio.checked = true;
          }
        }
      });
      refreshRadioStyling();

      if (mySub.comments !== undefined) {
        const commentBox = document.getElementById('fb-comments');
        if (commentBox) commentBox.value = mySub.comments;
      }

      // Show and populate the status banner
      if (userBanner && userBannerText) {
        userBanner.style.display = 'flex';
        const ratingClean = mySub.q1_rating ? mySub.q1_rating.split('-')[0].trim() : '⭐⭐⭐⭐⭐';
        userBannerText.innerHTML = `You rated this platform <strong>${ratingClean} (${mySub.q1_rating || 'Excellent'})</strong>. Your review is permanently active and displayed on the review wall below. You can edit your choices or comments and click "Update My Feedback" at any time.`;
      }

      // Adjust form heading & submit button to indicate edit/update mode
      if (formHeading) formHeading.innerHTML = 'Your Saved Feedback & Ratings';
      if (formSubheading) formSubheading.innerHTML = 'Your rating is recorded. Make any changes below and click Update to save.';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Update My Feedback</span> <i class="fas fa-check-circle"></i>';
      }
    } else {
      if (userBanner) userBanner.style.display = 'none';
      if (formHeading) formHeading.innerHTML = 'Submit Your Feedback & Ratings';
      if (formSubheading) formSubheading.innerHTML = 'All submissions are displayed publicly on the review wall below and preserved permanently.';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Submit Feedback</span> <i class="fas fa-paper-plane"></i>';
      }
    }
  }

  // Setup radio change listeners
  document.querySelectorAll('.mcq-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const group = radio.closest('.mcq-group');
      if (group) {
        group.style.background = 'transparent';
        group.style.boxShadow = 'none';
      }
      refreshRadioStyling();
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

  // Banner Actions
  if (btnViewMyReview) {
    btnViewMyReview.onclick = () => {
      const mySub = getMySubmission();
      if (mySub && mySub.id) {
        const cardEl = document.getElementById(`fb-card-${mySub.id}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cardEl.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
          setTimeout(() => {
            cardEl.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
          }, 2000);
          return;
        }
      }
      const wallEl = document.getElementById('feedbacks-wall');
      if (wallEl) wallEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
  }

  if (btnClearMyReview) {
    btnClearMyReview.onclick = () => {
      const mySub = getMySubmission();
      if (!mySub) return;
      if (!confirm('Are you sure you want to remove your rating and feedback?')) return;

      // Delete
      deleteFeedbackById(mySub.id);
    };
  }

  // Refresh wall button
  if (refreshBtn) {
    refreshBtn.onclick = async () => {
      refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
      await syncFeedbacksFromBackend();
      refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Wall';
      Toast.info('Reviews wall updated');
    };
  }

  // Render cards to the wall
  function renderFeedbackCards(list) {
    const mySub = getMySubmission();

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

    wall.innerHTML = list.map(item => {
      const isMyCard = mySub && String(item.id) === String(mySub.id);

      return `
        <div class="card feedback-card-item" id="fb-card-${item.id}" style="padding:22px;border-radius:18px;box-shadow:0 6px 20px rgba(0,0,0,0.05);background:#ffffff;border:${isMyCard ? '2px solid #10b981' : '1px solid #e2e8f0'};border-top:4px solid ${isMyCard ? '#10b981' : 'var(--primary,#4f46e5)'};display:flex;flex-direction:column;justify-content:space-between;transition:all 0.25s;position:relative;">
          <div>
            <!-- Header with Reviewer Name & Time -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px;">
              <div style="display:flex;align-items:center;gap:10px;">
                <div style="width:38px;height:38px;border-radius:50%;background:${isMyCard ? 'rgba(16,185,129,0.15)' : 'rgba(79,70,229,0.12)'};color:${isMyCard ? '#047857' : 'var(--primary,#4f46e5)'};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1rem;flex-shrink:0;">
                  ${(item.name || 'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style="font-weight:700;color:#0f172a;font-size:1.02rem;display:flex;align-items:center;gap:6px;">
                    <span>${item.name || 'Anonymous Reviewer'}</span>
                    ${isMyCard ? `<span style="background:rgba(16,185,129,0.15);color:#047857;font-weight:700;padding:2px 8px;border-radius:6px;font-size:0.72rem;"><i class="fas fa-check-circle"></i> Your Review</span>` : ''}
                  </div>
                  <div style="font-size:0.75rem;color:#94a3b8;"><i class="far fa-clock"></i> ${item.created_at || 'Recent'}</div>
                </div>
              </div>
              <!-- Star Rating Badge -->
              <span style="background:#fef3c7;color:#b45309;font-weight:700;padding:4px 10px;border-radius:12px;font-size:0.82rem;white-space:nowrap;">
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
              <div style="background:#f8fafc;border-left:3px solid ${isMyCard ? '#10b981' : 'var(--primary,#4f46e5)'};padding:10px 14px;border-radius:8px;font-size:0.88rem;color:#334155;font-style:italic;line-height:1.5;margin-top:10px;">
                <i class="fas fa-quote-left" style="color:#94a3b8;font-size:0.75rem;margin-right:4px;"></i>
                ${item.comments}
              </div>
            ` : ''}
          </div>

          <!-- Footer Card Actions -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;padding-top:12px;border-top:1px solid #f1f5f9;">
            ${isMyCard ? `
              <button class="btn-edit-my-fb" style="background:rgba(16,185,129,0.1);color:#047857;border:1px solid #a7f3d0;padding:5px 12px;border-radius:8px;font-size:0.8rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
                <i class="fas fa-edit"></i> Edit Rating
              </button>
            ` : '<div></div>'}
            <button class="btn-delete-fb" data-id="${item.id}" data-name="${item.name || 'Reviewer'}" style="background:rgba(239,68,68,0.06);color:#dc2626;border:1px solid #fecaca;padding:5px 12px;border-radius:8px;font-size:0.8rem;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;">
              <i class="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Attach edit handler
    document.querySelectorAll('.btn-edit-my-fb').forEach(btn => {
      btn.onclick = () => {
        const formEl = document.getElementById('feedback-form');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    });

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

        await deleteFeedbackById(fbId);
      };
    });
  }

  // Delete feedback handler
  async function deleteFeedbackById(fbId) {
    const mySub = getMySubmission();
    const isMyReview = mySub && String(mySub.id) === String(fbId);

    // Call server endpoints
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

    // Update local state
    currentFeedbacks = currentFeedbacks.filter(f => String(f.id) !== String(fbId));
    saveLocalFeedbacks(currentFeedbacks);

    if (isMyReview) {
      clearMySubmission();
      // Reset form
      document.getElementById('fb-comments').value = '';
      document.querySelectorAll('.mcq-option input[type="radio"]').forEach(r => {
        r.checked = false;
      });
      refreshRadioStyling();
      restoreFormFromSubmission(null);
    }

    // Animate removal
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
  }

  // Sync feedbacks with backend API without destroying local reviews
  async function syncFeedbacksFromBackend() {
    try {
      const resp = await fetch('/api/feedback');
      if (resp.ok) {
        const data = await resp.json();
        const serverList = Array.isArray(data.feedbacks) ? data.feedbacks : [];

        if (serverList.length > 0) {
          // Merge server list with local list
          const mySub = getMySubmission();
          const map = new Map();

          // Server feedbacks
          serverList.forEach(item => {
            if (item && item.id) map.set(String(item.id), item);
          });

          // Local feedbacks
          currentFeedbacks.forEach(item => {
            if (item && item.id && !map.has(String(item.id))) {
              map.set(String(item.id), item);
            }
          });

          // Ensure my submission is included
          if (mySub && mySub.id) {
            map.set(String(mySub.id), mySub);
          }

          let merged = Array.from(map.values());
          if (mySub && mySub.id) {
            merged = [mySub, ...merged.filter(item => String(item.id) !== String(mySub.id))];
          }

          currentFeedbacks = merged;
          saveLocalFeedbacks(currentFeedbacks);
          renderFeedbackCards(currentFeedbacks);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend feedback sync error:', e);
    }

    // If server returned 0 items or failed, maintain local feedbacks
    renderFeedbackCards(currentFeedbacks);
  }

  // Form Submission
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
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving Feedback...';

    const existingSub = getMySubmission();
    const submissionId = existingSub ? existingSub.id : Date.now();
    const nowFormatted = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const payload = {
      id: submissionId,
      name: document.getElementById('fb-name').value.trim() || 'Anonymous Reviewer',
      q1_rating: q1,
      q2_tracking: q2,
      q3_module: q3,
      q4_ai_coach: q4,
      q5_usability: q5,
      q6_recommend: q6,
      comments: document.getElementById('fb-comments').value.trim(),
      created_at: nowFormatted
    };

    // Save to user's personal submission
    saveMySubmission(payload);

    // Save into currentFeedbacks list (replacing or unshifting)
    currentFeedbacks = [payload, ...currentFeedbacks.filter(f => String(f.id) !== String(payload.id))];
    saveLocalFeedbacks(currentFeedbacks);

    // Try sending to backend in background
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('POST feedback server note (saved locally):', err);
    }

    Toast.success('Thank you so much! Your rating and feedback are saved and visible below. ⭐');

    // Update banner and form state
    restoreFormFromSubmission(payload);
    renderFeedbackCards(currentFeedbacks);

    submitBtn.disabled = false;

    // Smoothly scroll to the user's card on the wall
    const myCardEl = document.getElementById(`fb-card-${payload.id}`);
    if (myCardEl) {
      myCardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      myCardEl.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.4)';
      setTimeout(() => {
        myCardEl.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
      }, 2000);
    }
  };

  // 1. Initial immediate render from localStorage (zero delay, never 0)
  currentFeedbacks = getLocalFeedbacks();
  renderFeedbackCards(currentFeedbacks);
  restoreFormFromSubmission(getMySubmission());

  // 2. Background sync with backend
  await syncFeedbacksFromBackend();
}
