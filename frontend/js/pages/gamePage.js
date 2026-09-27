/* Game Play Wrapper - Clinically Targeted Motor Relearning */
import { gameTypeName, gameTypeIcon } from '../utils.js';
import Toast from '../components/toast.js';

export default function renderGamePage(params) {
  const { gameType } = params;
  return `
    <div class="game-play-page">
      <div class="game-toolbar">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:24px">${gameTypeIcon(gameType)}</span>
          <h3 id="game-title">${gameTypeName(gameType)}</h3>
        </div>
        <div class="game-toolbar-actions">
          <label class="game-mode-toggle">
            <input type="checkbox" id="hand-tracking-toggle" class="toggle-input" style="accent-color:var(--primary)" checked>
            <span style="font-weight:600">AI Vision Tracking</span>
          </label>
          <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/games'"><i class="fas fa-times"></i> Exit</button>
        </div>
      </div>
      <div class="game-canvas-container" id="game-container">
        <canvas id="game-canvas"></canvas>
        <video id="game-video" class="game-video-feed" playsinline style="display:none"></video>
        
        <div class="game-prestart" id="game-prestart">
          <div class="game-prestart-card">
            <div class="game-icon" style="font-size:48px;margin-bottom:12px">${gameTypeIcon(gameType)}</div>
            <h2 id="prestart-title">${gameTypeName(gameType)}</h2>
            <p id="prestart-desc">Position yourself comfortably in front of your camera. Maintain good posture for optimal biomechanical tracking.</p>
            <button class="btn btn-primary btn-lg" id="start-game-btn" disabled>Start Clinical Exercise</button>
            <button class="btn btn-ghost btn-lg" onclick="window.location.hash='#/games'" style="margin-top:16px;display:block;width:100%">Back to Modules</button>
          </div>
        </div>
        
        <div class="game-results-overlay" id="game-results" style="display:none">
          <div class="game-results-card">
            <div class="results-icon">🎉</div>
            <h2>Exercise Session Complete!</h2>
            <p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px">Your motor kinematics and repetition data have been logged.</p>
            <div class="results-stats" id="results-stats-container"></div>
            <div class="game-results-actions" style="margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="btn btn-primary" id="play-again-btn"><i class="fas fa-redo"></i> Repeat Exercise</button>
              <button class="btn btn-secondary" onclick="window.location.hash='#/feedback'" style="background:#fef3c7;color:#b45309;border-color:#fde68a;font-weight:700;"><i class="fas fa-star" style="color:#f59e0b;"></i> Give Your Feedback</button>
              <button class="btn btn-ghost" onclick="window.location.hash='#/games'">Choose Next Module</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function initGamePage(params) {
  const { gameType } = params;
  const modMap = {
    piano_tap: 'pianoTap.js',
    knob_turn: 'knobTurn.js',
    pegboard_pinch: 'pegboardPinch.js',
    shelf_reach: 'shelfReach.js',
    window_wipe: 'windowWipe.js',
    facial_mirror: 'facialMirror.js',
    target_touch: 'targetTouch.js',
    object_catch: 'objectCatch.js',
    path_following: 'pathFollowing.js'
  };
  
  const modFile = modMap[gameType];
  if (!modFile) {
    Toast.error('Invalid game type');
    window.location.hash = '#/games';
    return;
  }
  
  const startBtn = document.getElementById('start-game-btn');
  const toggle = document.getElementById('hand-tracking-toggle');
  let gameInstance = null;
  
  window.removeEventListener('gameComplete', handleGameComplete);
  window.addEventListener('gameComplete', handleGameComplete);
  
  function handleGameComplete(e) {
    const results = e.detail;
    document.getElementById('game-results').style.display = 'flex';
    document.getElementById('results-stats-container').innerHTML = `
      <div class="result-stat"><div class="result-val">${results.score}</div><div class="result-lbl">Score</div></div>
      <div class="result-stat"><div class="result-val">${results.accuracy}%</div><div class="result-lbl">Kinematic Accuracy</div></div>
      <div class="result-stat"><div class="result-val">${results.repetitions}</div><div class="result-lbl">Repetitions</div></div>
      <div class="result-stat"><div class="result-val">${results.reaction_time || 0}ms</div><div class="result-lbl">Reaction / Hold</div></div>
    `;
  }
  
  try {
    const defaultHt = localStorage.getItem('handTracking') !== 'false';
    toggle.checked = defaultHt;
    
    // Dynamic import
    const module = await import(`../games/${modFile}`);
    const GameClass = module.default;
    
    const initGame = async () => {
      if (gameInstance) {
        if (gameInstance.state !== 'completed') gameInstance.exit();
      }
      gameInstance = new GameClass('game-canvas', {
        duration: 60,
        handTracking: toggle.checked,
        videoElementId: 'game-video'
      });
      await gameInstance.init();
      return gameInstance;
    };
    
    await initGame();
    
    startBtn.disabled = false;
    startBtn.textContent = 'Start Clinical Exercise';
    startBtn.onclick = () => {
      document.getElementById('game-prestart').style.display = 'none';
      gameInstance.startCountdown();
    };
    
    document.getElementById('play-again-btn').onclick = async () => {
      document.getElementById('game-results').style.display = 'none';
      await initGame();
      gameInstance.startCountdown();
    };
    
    toggle.onchange = async () => {
      if (gameInstance && gameInstance.state !== 'playing' && gameInstance.state !== 'countdown') {
        startBtn.disabled = true;
        startBtn.innerHTML = '<span class="spinner"></span> Reloading Tracker...';
        await initGame();
        startBtn.disabled = false;
        startBtn.innerHTML = 'Start Clinical Exercise';
      }
    };
    
  } catch (err) {
    console.error(err);
    document.getElementById('prestart-title').textContent = "Error Loading Exercise";
    document.getElementById('prestart-desc').textContent = err.message || "Failed to load the rehabilitation module.";
  }
}
