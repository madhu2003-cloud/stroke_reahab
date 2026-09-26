/* Caregiver Motivation & Milestone Cheering Hub */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderCheeringPage() {
  const user = Auth.getUser() || {};
  return `
    <div class="page-container" style="max-width:1050px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="page-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <i class="fas fa-heart" style="color:#ec4899;"></i> Family & Caregiver Cheering Hub
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;">
            Celebrate daily recovery milestones, send encouraging notes, and boost neuroplasticity morale.
          </p>
        </div>
      </div>

      <!-- Send Cheer Card -->
      <div class="card" style="padding:24px;border-radius:16px;margin-bottom:24px;">
        <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:12px;">Send an Encouraging Note or Badge</h2>
        <form id="cheer-form" style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn btn-secondary cheer-tag-btn" data-text="🌟 So proud of your 7-day streak! Keep going!">🌟 7-Day Streak</button>
            <button type="button" class="btn btn-secondary cheer-tag-btn" data-text="💪 You're getting stronger and faster every single day!">💪 Super Strong</button>
            <button type="button" class="btn btn-secondary cheer-tag-btn" data-text="🏆 Great job completing your morning therapy session!">🏆 Session Complete</button>
            <button type="button" class="btn btn-secondary cheer-tag-btn" data-text="❤️ We love you and we are with you every step of the way!">❤️ Love & Support</button>
          </div>
          <textarea id="cheer-msg-input" class="inp" rows="3" placeholder="Write a heartwarming message for your loved one..." style="padding:14px;border-radius:12px;"></textarea>
          <div style="display:flex;justify-content:flex-end;">
            <button type="submit" class="btn btn-primary" style="padding:10px 24px;">
              <i class="fas fa-paper-plane"></i> Send Cheer
            </button>
          </div>
        </form>
      </div>

      <!-- Feed List -->
      <div class="card" style="padding:24px;border-radius:16px;">
        <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:16px;">Cheering Wall & Milestones</h2>
        <div id="cheers-feed-list" style="display:flex;flex-direction:column;gap:16px;">
          <!-- Item 1 -->
          <div style="background:var(--bg-light,#f9fafb);padding:18px;border-radius:14px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:14px;align-items:flex-start;">
            <div style="width:40px;height:40px;border-radius:50%;background:#ec4899;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">
              ❤️
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <strong style="color:var(--text-primary,#111827);">Emma (Daughter)</strong>
                <span style="font-size:0.75rem;color:var(--text-secondary,#6b7280);">2 hours ago</span>
              </div>
              <div style="font-size:0.92rem;color:var(--text-primary,#111827);line-height:1.5;">
                "Dad, seeing your finger mobility improve in the Path Following game made my day! Keep up the amazing work! 🎉"
              </div>
            </div>
          </div>

          <!-- Item 2 -->
          <div style="background:var(--bg-light,#f9fafb);padding:18px;border-radius:14px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:14px;align-items:flex-start;">
            <div style="width:40px;height:40px;border-radius:50%;background:#f59e0b;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">
              🏆
            </div>
            <div>
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                <strong style="color:var(--text-primary,#111827);">Dr. Sarah Vance</strong>
                <span style="font-size:0.75rem;color:var(--text-secondary,#6b7280);">Yesterday</span>
              </div>
              <div style="font-size:0.92rem;color:var(--text-primary,#111827);line-height:1.5;">
                "Excellent accuracy improvement on your Target Touch session! Your neural recovery trajectory is right on schedule."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initCheeringPage() {
  const form = document.getElementById('cheer-form');
  const input = document.getElementById('cheer-msg-input');
  const feedList = document.getElementById('cheers-feed-list');
  const tagBtns = document.querySelectorAll('.cheer-tag-btn');

  tagBtns.forEach(btn => {
    btn.onclick = () => {
      input.value = btn.dataset.text;
    };
  });

  form.onsubmit = (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    const user = Auth.getUser() || {};
    const item = document.createElement('div');
    item.style.cssText = 'background:var(--bg-light,#f9fafb);padding:18px;border-radius:14px;border:1px solid var(--border-color,#e5e7eb);display:flex;gap:14px;align-items:flex-start;';
    item.innerHTML = `
      <div style="width:40px;height:40px;border-radius:50%;background:#10b981;color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;">
        🌟
      </div>
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <strong style="color:var(--text-primary,#111827);">${user.name || 'Caregiver'}</strong>
          <span style="font-size:0.75rem;color:var(--text-secondary,#6b7280);">Just now</span>
        </div>
        <div style="font-size:0.92rem;color:var(--text-primary,#111827);line-height:1.5;">
          "${text}"
        </div>
      </div>
    `;
    feedList.prepend(item);
    input.value = '';
    Toast.success('Cheering note posted to the wall! 🎉');
  };
}
