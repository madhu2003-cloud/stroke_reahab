/* Games Selection Page - Clinically-Grounded Rehabilitation Modules */
import API from '../api.js';
import { GameCard } from '../components/cards.js';

export default function renderGamesPage() {
  return `
    <div class="welcome-section">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">
        <div>
          <h1>Clinical Rehabilitation Modules</h1>
          <p class="welcome-date">Evidence-based motor relearning exercises designed for neuroplasticity and stroke recovery</p>
        </div>
        <span class="badge" style="background:rgba(16,185,129,0.15);color:#10b981;font-weight:700;padding:6px 14px;border-radius:20px;font-size:13px">
          <i class="fas fa-check-circle"></i> FMA & ARAT Aligned
        </span>
      </div>
    </div>
    <div id="games-grid-container" class="game-select-grid">
      <!-- Loading games -->
    </div>
  `;
}

export async function initGamesPage() {
  const container = document.getElementById('games-grid-container');
  try {
    const perfData = await API.getGamePerformance();
    const perf = perfData.performance || {};
    
    container.innerHTML = `
      ${GameCard({
        type: 'piano_tap',
        name: 'Piano Finger Independence',
        description: 'Isolate individual finger flexor/extensor control (Thumb to Pinky) to overcome abnormal post-stroke flexor synergy.',
        icon: '🎹',
        lastScore: perf.piano_tap?.best_score ? 'Best: ' + perf.piano_tap.best_score : null,
        onClickPath: '#/games/piano_tap'
      })}
      ${GameCard({
        type: 'knob_turn',
        name: 'Forearm Pronation & Supination',
        description: 'Rebuild forearm rotational range of motion to restore everyday independence (opening door knobs, taps, and bottle caps).',
        icon: '🔐',
        lastScore: perf.knob_turn?.best_score ? 'Best: ' + perf.knob_turn.best_score : null,
        onClickPath: '#/games/knob_turn'
      })}
      ${GameCard({
        type: 'pegboard_pinch',
        name: '9-Hole Pegboard Pincer Test',
        description: 'Gold-standard clinical dexterity training. Practice sub-millimeter thumb & index pincer grasp and release control.',
        icon: '📌',
        lastScore: perf.pegboard_pinch?.best_score ? 'Best: ' + perf.pegboard_pinch.best_score : null,
        onClickPath: '#/games/pegboard_pinch'
      })}
      ${GameCard({
        type: 'shelf_reach',
        name: 'Shelf Reaching & Stacking',
        description: 'Overhead shoulder elevation and elbow extension exercises to counteract post-stroke bicep flexion contractures.',
        icon: '🗄️',
        lastScore: perf.shelf_reach?.best_score ? 'Best: ' + perf.shelf_reach.best_score : null,
        onClickPath: '#/games/shelf_reach'
      })}
      ${GameCard({
        type: 'window_wipe',
        name: 'Planar Window & Surface Sweep',
        description: 'Continuous active planar sweeping motions to stretch spastic bicep & pectoralis muscle groups across wide bounds.',
        icon: '🪟',
        lastScore: perf.window_wipe?.best_score ? 'Best: ' + perf.window_wipe.best_score : null,
        onClickPath: '#/games/window_wipe'
      })}
      ${GameCard({
        type: 'facial_mirror',
        name: 'Facial Symmetry Biofeedback',
        description: 'Neuromuscular biofeedback for hemifacial droop (smile, brow lift, lip pucker, and cheek puff) to aid facial recovery.',
        icon: '🪞',
        lastScore: perf.facial_mirror?.best_score ? 'Best: ' + perf.facial_mirror.best_score : null,
        onClickPath: '#/games/facial_mirror'
      })}
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="form-error">Failed to load game data.</div>';
  }
}
