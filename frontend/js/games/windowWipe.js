import GameBase from './gameBase.js';

export default class WindowWipeGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    
    this.gridCols = 24;
    this.gridRows = 16;
    this.steamGrid = [];
    this.totalCells = this.gridCols * this.gridRows;
    this.clearedCells = 0;
    this.audioCtx = null;
    this.spongeRadius = 55;
    this.particles = [];
    this.lastWipeTime = 0;
  }

  async init() {
    await super.init();
    this.resetSteam();
  }

  resetSteam() {
    this.steamGrid = [];
    for (let r = 0; r < this.gridRows; r++) {
      for (let c = 0; c < this.gridCols; c++) {
        this.steamGrid.push({
          r, c,
          alpha: 0.90 + Math.random() * 0.08,
          cleared: false
        });
      }
    }
    this.clearedCells = 0;
  }

  playSqueakSound() {
    const now = Date.now();
    if (now - this.lastWipeTime < 180) return;
    this.lastWipeTime = now;

    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  playLevelClearSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.2, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch(e) {}
  }

  update(deltaTime) {
    if (!this.cursorPosition) return;
    const cx = this.cursorPosition.x;
    const cy = this.cursorPosition.y;

    const cellW = this.canvas.width / this.gridCols;
    const cellH = this.canvas.height / this.gridRows;

    let newlyCleared = 0;

    this.steamGrid.forEach(cell => {
      if (!cell.cleared) {
        const cellCenterX = cell.c * cellW + cellW / 2;
        const cellCenterY = cell.r * cellH + cellH / 2;

        if (Math.hypot(cellCenterX - cx, cellCenterY - cy) < this.spongeRadius) {
          cell.cleared = true;
          newlyCleared++;
          this.clearedCells++;

          // Spawn water droplet particles
          if (Math.random() > 0.6) {
            this.particles.push({
              x: cellCenterX,
              y: cellCenterY,
              vx: (Math.random() - 0.5) * 4,
              vy: Math.random() * 3 + 1,
              size: Math.random() * 4 + 2,
              color: '#bae6fd',
              alpha: 0.8
            });
          }
        }
      }
    });

    if (newlyCleared > 0) {
      this.score += newlyCleared * 2;
      this.playSqueakSound();
    }

    // Check if 92% cleared -> complete window and reset
    const percentage = (this.clearedCells / this.totalCells) * 100;
    if (percentage >= 92) {
      this.score += 300;
      this.recordSuccess(Date.now());
      this.playLevelClearSound();

      for (let i = 0; i < 40; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.5) * 12,
          size: Math.random() * 8 + 4,
          color: ['#38bdf8', '#34d399', '#facc15', '#f472b6'][Math.floor(Math.random() * 4)],
          alpha: 1.0
        });
      }

      setTimeout(() => this.resetSteam(), 800);
    }

    // Update particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;
      p.size = Math.max(0, p.size - 0.1);
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // 1. Beautiful Background Vista behind the glass (Sunrise Mountain)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(0.5, '#fed7aa');
    skyGrad.addColorStop(1, '#15803d');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Sun
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fef08a';
    ctx.shadowBlur = 40;
    ctx.beginPath();
    ctx.arc(w * 0.75, h * 0.35, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Mountains
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h);
    ctx.lineTo(w * 0.35, h * 0.45);
    ctx.lineTo(w * 0.65, h);
    ctx.fill();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(w * 0.45, h);
    ctx.lineTo(w * 0.75, h * 0.50);
    ctx.lineTo(w, h);
    ctx.fill();

    // 2. Render Frost / Steam Grid Layer
    const cellW = w / this.gridCols;
    const cellH = h / this.gridRows;

    this.steamGrid.forEach(cell => {
      if (!cell.cleared) {
        ctx.fillStyle = `rgba(241, 245, 249, ${cell.alpha})`;
        ctx.fillRect(cell.c * cellW, cell.r * cellH, cellW + 1, cellH + 1);
      }
    });

    // Window Frame Grid Lines
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // 3. Clinical Instruction Banner
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.roundRect(30, 60, w - 60, 90, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACTIVE PLANAR SWEEPING & SPASTICITY STRETCH (BICEPS / PECTORALIS)', w / 2, 85);

    const clearPct = Math.round((this.clearedCells / this.totalCells) * 100);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText(`Perform wide sweeping motions to wipe the window! Cleared: ${clearPct}%`, w / 2, 120);
    ctx.restore();

    // 4. Render Droplets / Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 5. Render Cleaning Sponge Hand Cursor
    if (this.cursorPosition) {
      const cx = this.cursorPosition.x;
      const cy = this.cursorPosition.y;

      ctx.save();
      // Sponge Bubble Area
      ctx.beginPath();
      ctx.arc(cx, cy, this.spongeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Sponge Icon
      ctx.font = '32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧽', cx, cy);
      ctx.restore();
    }
  }

  getResults() {
    return {
      score: Math.floor(this.score),
      accuracy: Math.floor(this.getAccuracy()),
      repetitions: this.repetitions,
      reaction_time: Math.floor(this.getAverageReactionTime()),
      duration: this.duration,
      game_type: 'window_wipe'
    };
  }
}
