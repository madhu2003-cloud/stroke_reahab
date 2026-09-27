import GameBase from './gameBase.js';

export default class PegboardPinchGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    
    this.holes = [];
    this.pegs = [];
    this.activePeg = null;
    this.pinchDistance = 100;
    this.isPinching = false;
    this.pinchThreshold = 45; // pixels
    this.releaseThreshold = 75; // pixels
    this.particles = [];
    this.audioCtx = null;
    this.activeHoleIndex = 0;
  }

  async init() {
    await super.init();
    
    // Listen for landmarks to measure precision pinch distance (Thumb 4, Index 8)
    this.tracker.onLandmarksUpdate((landmarks) => {
      if (!landmarks || landmarks.length < 21) return;
      
      const thumb = landmarks[4];
      const index = landmarks[8];
      
      if (thumb && index) {
        const tx = (1 - thumb.x) * this.canvas.width;
        const ty = thumb.y * this.canvas.height;
        const ix = (1 - index.x) * this.canvas.width;
        const iy = index.y * this.canvas.height;
        
        const dist = Math.hypot(tx - ix, ty - iy);
        this.pinchDistance = Math.round(dist);
        
        // Midpoint becomes hand cursor
        this.cursorPosition = {
          x: (tx + ix) / 2,
          y: (ty + iy) / 2
        };

        if (this.pinchDistance < this.pinchThreshold) {
          this.isPinching = true;
        } else if (this.pinchDistance > this.releaseThreshold) {
          this.isPinching = false;
        }
      }
    });

    this.setupPegboard();
  }

  setupPegboard() {
    this.holes = [];
    this.pegs = [];
    
    const boardX = this.canvas.width * 0.42;
    const boardY = this.canvas.height * 0.32;
    const spacing = Math.min(this.canvas.width, this.canvas.height) * 0.16;

    // 3x3 Grid of 9 Holes
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.holes.push({
          id: row * 3 + col,
          x: boardX + col * spacing,
          y: boardY + row * spacing,
          radius: 24,
          filled: false,
          color: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'][row * 3 + col]
        });
      }
    }

    // Side Tray with 9 Pegs
    const trayX = this.canvas.width * 0.15;
    const trayY = this.canvas.height * 0.30;
    for (let i = 0; i < 9; i++) {
      this.pegs.push({
        id: i,
        homeX: trayX + (i % 3) * (spacing * 0.7),
        homeY: trayY + Math.floor(i / 3) * (spacing * 0.7),
        x: trayX + (i % 3) * (spacing * 0.7),
        y: trayY + Math.floor(i / 3) * (spacing * 0.7),
        radius: 20,
        placed: false,
        color: this.holes[i].color
      });
    }

    this.activeHoleIndex = 0;
  }

  playGrabSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch(e) {}
  }

  playPlaceSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      [600, 800, 1000].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch(e) {}
  }

  update(deltaTime) {
    if (!this.cursorPosition) return;
    const cx = this.cursorPosition.x;
    const cy = this.cursorPosition.y;

    // In mouse mode, clicking acts as pinch
    if (this.tracker.mouseFallbackEnabled) {
      this.pinchDistance = this.isPinching ? 25 : 85;
    }

    // 1. Pick up peg if pinching over an unplaced peg
    if (this.isPinching && !this.activePeg) {
      for (const peg of this.pegs) {
        if (!peg.placed && Math.hypot(peg.x - cx, peg.y - cy) < peg.radius * 1.8) {
          this.activePeg = peg;
          this.playGrabSound();
          break;
        }
      }
    }

    // 2. Drag active peg
    if (this.activePeg) {
      if (this.isPinching) {
        this.activePeg.x = cx;
        this.activePeg.y = cy;
      } else {
        // Released! Check if over a target hole
        let placed = false;
        for (const hole of this.holes) {
          if (!hole.filled && Math.hypot(hole.x - cx, hole.y - cy) < hole.radius * 1.5) {
            this.activePeg.x = hole.x;
            this.activePeg.y = hole.y;
            this.activePeg.placed = true;
            hole.filled = true;
            placed = true;
            
            this.score += 120;
            this.recordSuccess(Date.now());
            this.playPlaceSound();

            // Spawn celebration particles
            for (let i = 0; i < 25; i++) {
              this.particles.push({
                x: hole.x,
                y: hole.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                size: Math.random() * 6 + 3,
                color: hole.color,
                alpha: 1.0
              });
            }

            // Check if all 9 pegs placed -> reset board with bonus
            if (this.pegs.every(p => p.placed)) {
              this.score += 500;
              setTimeout(() => this.setupPegboard(), 1000);
            }
            break;
          }
        }

        // Return peg to tray if dropped outside hole
        if (!placed) {
          this.activePeg.x = this.activePeg.homeX;
          this.activePeg.y = this.activePeg.homeY;
        }
        this.activePeg = null;
      }
    }

    // Update particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      p.size = Math.max(0, p.size - 0.15);
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  render() {
    const ctx = this.ctx;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Clinical Banner
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.roundRect(30, 60, this.canvas.width - 60, 95, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#10b981';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('9-HOLE PEGBOARD & PINCER GRASP TEST (NHPT CLINICAL PROTOCOL)', this.canvas.width / 2, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('Pinch Thumb & Index to GRAB peg ➔ Drag into matching hole ➔ OPEN hand to RELEASE', this.canvas.width / 2, 125);
    ctx.restore();

    // Pegboard Tray & Wooden Board background
    ctx.save();
    const boardX = this.canvas.width * 0.40;
    const boardY = this.canvas.height * 0.28;
    const boardW = this.canvas.width * 0.55;
    const boardH = this.canvas.height * 0.58;

    // Main Pegboard Box
    ctx.fillStyle = '#292524';
    ctx.strokeStyle = '#78716c';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 20;
    ctx.roundRect(boardX, boardY, boardW, boardH, 16);
    ctx.fill();
    ctx.stroke();

    // Side Supply Tray Box
    const trayX = this.canvas.width * 0.05;
    const trayY = boardY;
    const trayW = this.canvas.width * 0.30;
    const trayH = boardH;
    ctx.fillStyle = '#1c1917';
    ctx.strokeStyle = '#57534e';
    ctx.roundRect(trayX, trayY, trayW, trayH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a8a29e';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PEG SUPPLY TRAY', trayX + trayW / 2, trayY + 30);
    ctx.fillText('TARGET PEGBOARD', boardX + boardW / 2, boardY + 30);
    ctx.restore();

    // Render Holes
    this.holes.forEach(h => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
      ctx.fillStyle = h.filled ? h.color + '44' : '#0c0a09';
      ctx.fill();
      ctx.strokeStyle = h.filled ? h.color : '#78716c';
      ctx.lineWidth = 3;
      ctx.stroke();

      if (!h.filled) {
        ctx.fillStyle = h.color;
        ctx.beginPath();
        ctx.arc(h.x, h.y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // Render Pegs
    this.pegs.forEach(p => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = (this.activePeg === p) ? 25 : 8;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = (this.activePeg === p) ? 4 : 2;
      ctx.stroke();

      // Peg top cap 3D highlight
      ctx.beginPath();
      ctx.arc(p.x - 5, p.y - 5, p.radius * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fill();
      ctx.restore();
    });

    // Render Particles
    this.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Render Real-time Pinch Status & Hand Indicator
    if (this.cursorPosition) {
      const cx = this.cursorPosition.x;
      const cy = this.cursorPosition.y;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = this.isPinching ? '#10b981' : '#f59e0b';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.stroke();

      // Floating Pinch Metric Badge
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.roundRect(cx - 50, cy - 40, 100, 24, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.isPinching ? `PINCHING (${this.pinchDistance}px)` : `OPEN (${this.pinchDistance}px)`, cx, cy - 24);
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
      game_type: 'pegboard_pinch'
    };
  }
}
