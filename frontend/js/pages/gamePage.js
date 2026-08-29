/* Game Play Wrapper */
import { gameTypeName } from '../utils.js';
import Toast from '../components/toast.js';

export default function renderGamePage(params) {
  const { gameType } = params;
  return `
    <div class="game-play-page">
      <div class="game-toolbar">
        <h3 id="game-title">${gameTypeName(gameType)}</h3>
        <div class="game-toolbar-actions">
          <label class="game-mode-toggle">
            <input type="checkbox" id="hand-tracking-toggle" class="toggle-input" style="accent-color:var(--primary)" checked>
            <span style="font-weight:600">Hand Tracking</span>
          </label>
          <button class="btn btn-ghost btn-sm" onclick="window.location.hash='#/games'"><i class="fas fa-times"></i> Exit</button>
        </div>
      </div>
      <div class="game-canvas-container" id="game-container">
        <canvas id="game-canvas"></canvas>
        <video id="game-video" class="game-video-feed" playsinline style="display:none"></video>
        
        <div class="game-prestart" id="game-prestart">
          <div class="game-prestart-card">
            <div class="game-icon">Loading...</div>
            <h2 id="prestart-title">Loading Game Module</h2>
            <p id="prestart-desc">Please wait while the exercise loads.</p>
            <button class="btn btn-primary btn-lg" id="start-game-btn" disabled>Start Exercise</button>
            <button class="btn btn-ghost btn-lg" onclick="window.location.hash='#/games'" style="margin-top:16px;display:block;width:100%">Cancel</button>
          </div>
        </div>
        
        <div class="game-results-overlay" id="game-results" style="display:none">
          <div class="game-results-card">
            <div class="results-icon">🎉</div>
            <h2>Exercise Complete!</h2>
            <div class="results-stats" id="results-stats-container"></div>
            <div class="game-results-actions">
              <button class="btn btn-primary" id="play-again-btn">Play Again</button>
              <button class="btn btn-secondary" onclick="window.location.hash='#/games'">Next Exercise</button>
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
    target_touch: 'targetTouch.js',
    object_catch: 'objectCatch.js',
    path_following: 'pathFollowing.js',
    bubble_pop: 'bubblePop.js',
    number_show: 'numberShow.js',
    thumb_touch: 'thumbTouch.js'
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
  
  // Clean up previous event listeners if any
  window.removeEventListener('gameComplete', handleGameComplete);
  window.addEventListener('gameComplete', handleGameComplete);
  
  function handleGameComplete(e) {
    const results = e.detail;
    document.getElementById('game-results').style.display = 'flex';
    document.getElementById('results-stats-container').innerHTML = `
      <div class="result-stat"><div class="result-val">${results.score}</div><div class="result-lbl">Score</div></div>
      <div class="result-stat"><div class="result-val">${results.accuracy}%</div><div class="result-lbl">Accuracy</div></div>
      <div class="result-stat"><div class="result-val">${results.repetitions}</div><div class="result-lbl">Repetitions</div></div>
      <div class="result-stat"><div class="result-val">${results.reaction_time || 0}ms</div><div class="result-lbl">Reaction</div></div>
    `;
  }
  
  try {
    const defaultHt = localStorage.getItem('handTracking') !== 'false';
    toggle.checked = defaultHt;
    
    // Dynamic import
    const module = await import(`../games/${modFile}`);
    const GameClass = module.default;
    
    document.querySelector('.game-icon').innerHTML = gameType === 'target_touch' ? '🎯' : gameType === 'object_catch' ? '🧺' : '✏️';
    document.getElementById('prestart-title').textContent = gameTypeName(gameType);
    document.getElementById('prestart-desc').textContent = "Get ready! Make sure your webcam is uncovered if using hand tracking.";
    
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
    startBtn.textContent = 'Start Exercise';
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
        startBtn.innerHTML = '<span class="spinner"></span> Reloading...';
        await initGame();
        startBtn.disabled = false;
        startBtn.innerHTML = 'Start Exercise';
      }
    };
    
  } catch (err) {
    console.error(err);
    document.getElementById('prestart-title').textContent = "Error Loading Game";
    document.getElementById('prestart-desc').textContent = err.message || "Failed to load the game module.";
  }
}
