import HandTracker from '../handTracking.js';

export default class GameBase {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) throw new Error(`Canvas with id ${canvasId} not found`);
    this.ctx = this.canvas.getContext('2d');
    
    this.options = {
      duration: 60,
      handTracking: true,
      ...options
    };
    
    // State management
    this.state = 'idle'; // 'idle', 'countdown', 'playing', 'paused', 'completed'
    this.score = 0;
    this.accuracy = 0;
    this.repetitions = 0;
    this.successCount = 0;
    this.failCount = 0;
    this.startTime = 0;
    this.duration = this.options.duration;
    this.reactionTimes = [];
    
    this.animationFrameId = null;
    this.lastTime = 0;
    
    // Resize handler
    this._handleResize = this._handleResize.bind(this);
    window.addEventListener('resize', this._handleResize);
    this._handleResize();
    
    // Keyboard handlers
    this._handleKeyDown = this._handleKeyDown.bind(this);
    window.addEventListener('keydown', this._handleKeyDown);
    
    // Tracker
    this.tracker = new HandTracker(null, this.canvas);
    this.cursorPosition = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
  }
  
  _handleResize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth || 800;
      this.canvas.height = parent.clientHeight || 600;
    }
  }
  
  _handleKeyDown(e) {
    if (e.key === 'p' || e.key === 'P') {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'paused') this.resume();
    } else if (e.key === 'r' || e.key === 'R') {
      this.restart();
    } else if (e.key === 'Escape') {
      this.exit();
    }
  }
  
  async init() {
    this.tracker.onPositionUpdate((x, y) => {
      this.cursorPosition = { x, y };
    });
    
    if (this.options.handTracking) {
      const trackingReady = await this.tracker.init();
      if (!trackingReady) {
        this.tracker.enableMouseFallback();
      }
    } else {
      this.tracker.enableMouseFallback();
    }
    
    this.tracker.start();
    this.renderInitialState();
  }
  
  startCountdown(seconds = 3) {
    this.state = 'countdown';
    let count = seconds;
    
    const countInterval = setInterval(() => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.renderCountdown(count);
      
      count--;
      if (count < 0) {
        clearInterval(countInterval);
        this.start();
      }
    }, 1000);
  }
  
  start() {
    this.state = 'playing';
    this.startTime = Date.now();
    this.lastTime = performance.now();
    this.gameLoop(performance.now());
  }
  
  pause() {
    if (this.state === 'playing') {
      this.state = 'paused';
      cancelAnimationFrame(this.animationFrameId);
      this.renderPauseScreen();
    }
  }
  
  resume() {
    if (this.state === 'paused') {
      this.state = 'playing';
      this.lastTime = performance.now();
      this.gameLoop(performance.now());
    }
  }
  
  restart() {
    cancelAnimationFrame(this.animationFrameId);
    this.score = 0;
    this.successCount = 0;
    this.failCount = 0;
    this.repetitions = 0;
    this.reactionTimes = [];
    this.state = 'idle';
    this.startCountdown();
  }
  
  exit() {
    this.tracker.destroy();
    window.removeEventListener('resize', this._handleResize);
    window.removeEventListener('keydown', this._handleKeyDown);
    cancelAnimationFrame(this.animationFrameId);
    window.location.href = '/dashboard';
  }
  
  gameLoop(timestamp) {
    if (this.state !== 'playing') return;
    
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.render();
    this.renderHUD();
    
    const elapsed = this.getElapsedTime();
    if (elapsed >= this.duration) {
      this.endGame();
    } else {
      this.animationFrameId = requestAnimationFrame((ts) => this.gameLoop(ts));
    }
  }
  
  // Override in subclasses
  update(deltaTime) {}
  render() {}
  renderInitialState() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = '#333';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Ready to start...', this.canvas.width/2, this.canvas.height/2);
  }
  
  recordSuccess(reactionTime) {
    this.successCount++;
    this.repetitions++;
    if (reactionTime) this.reactionTimes.push(reactionTime);
  }
  
  recordFail() {
    this.failCount++;
    this.repetitions++;
  }
  
  getAverageReactionTime() {
    if (this.reactionTimes.length === 0) return 0;
    const sum = this.reactionTimes.reduce((a, b) => a + b, 0);
    return sum / this.reactionTimes.length;
  }
  
  getAccuracy() {
    const total = this.successCount + this.failCount;
    return total === 0 ? 0 : (this.successCount / total) * 100;
  }
  
  endGame() {
    this.state = 'completed';
    this.accuracy = this.getAccuracy();
    this.tracker.stop();
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderGameOver();
    
    this.saveResults();
  }
  
  getResults() {
    // Map class names to snake_case game_type expected by backend
    let gameType = 'target_touch';
    if (this.constructor.name === 'ObjectCatchGame') gameType = 'object_catch';
    if (this.constructor.name === 'PathFollowingGame') gameType = 'path_following';
    
    return {
      score: Math.floor(this.score),
      accuracy: Math.floor(this.accuracy),
      repetitions: this.repetitions,
      reaction_time: Math.floor(this.getAverageReactionTime()),
      duration: this.duration,
      game_type: gameType
    };
  }
  
  async saveResults() {
    const results = this.getResults();
    const token = localStorage.getItem('access_token');
    
    try {
      if (token) {
        await fetch('/api/games/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(results)
        });
      }
      window.dispatchEvent(new CustomEvent('gameComplete', { detail: results }));
    } catch (e) {
      console.error('Failed to save results', e);
    }
  }
  
  renderHUD() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(0, 0, this.canvas.width, 50);
    
    this.ctx.fillStyle = '#333';
    this.ctx.font = '20px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${Math.floor(this.score)}`, 20, 32);
    
    this.ctx.textAlign = 'center';
    const remaining = Math.max(0, this.duration - this.getElapsedTime());
    this.ctx.fillText(`Time: ${this.formatTime(remaining)}`, this.canvas.width / 2, 32);
    
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Accuracy: ${this.getAccuracy().toFixed(1)}%`, this.canvas.width - 20, 32);
    this.ctx.restore();
  }
  
  renderCountdown(count) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 120px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    const text = count === 0 ? 'GO!' : count;
    this.ctx.fillText(text, this.canvas.width/2, this.canvas.height/2);
    this.ctx.restore();
  }
  
  renderPauseScreen() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 40px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('PAUSED', this.canvas.width/2, this.canvas.height/2 - 20);
    
    this.ctx.font = '20px sans-serif';
    this.ctx.fillText('Press P to Resume', this.canvas.width/2, this.canvas.height/2 + 30);
    this.ctx.restore();
  }
  
  renderGameOver() {
    this.ctx.save();
    
    // Glassmorphism effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Backdrop blur (approximate with fill)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    const panelWidth = Math.min(600, this.canvas.width - 40);
    const panelHeight = 400;
    const x = (this.canvas.width - panelWidth) / 2;
    const y = (this.canvas.height - panelHeight) / 2;
    
    // Panel background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.roundRect(x, y, panelWidth, panelHeight, 20);
    this.ctx.fill();
    this.ctx.stroke();
    
    // Text
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    
    this.ctx.font = 'bold 36px sans-serif';
    this.ctx.fillText('Exercise Complete! 🎉', this.canvas.width/2, y + 60);
    
    this.ctx.font = '24px sans-serif';
    this.ctx.fillText(`Final Score: ${Math.floor(this.score)}`, this.canvas.width/2, y + 130);
    this.ctx.fillText(`Accuracy: ${this.accuracy.toFixed(1)}%`, this.canvas.width/2, y + 170);
    this.ctx.fillText(`Repetitions: ${this.repetitions}`, this.canvas.width/2, y + 210);
    this.ctx.fillText(`Avg Reaction Time: ${this.getAverageReactionTime().toFixed(0)} ms`, this.canvas.width/2, y + 250);
    this.ctx.fillText(`Duration: ${this.formatTime(this.duration)}`, this.canvas.width/2, y + 290);
    
    this.ctx.font = '16px sans-serif';
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.fillText('Press R to Play Again or ESC to Dashboard', this.canvas.width/2, y + 360);
    
    this.ctx.restore();
  }
  
  formatTime(seconds) {
    const s = Math.floor(seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }
  
  getElapsedTime() {
    return (Date.now() - this.startTime) / 1000;
  }
}
