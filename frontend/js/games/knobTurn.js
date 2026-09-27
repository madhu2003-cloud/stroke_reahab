import GameBase from './gameBase.js';

export default class KnobTurnGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.currentAngle = 0; // current wrist/knob angle in degrees (-180 to 180)
    this.targetAngle = 60; // target angle to hit
    this.holdTimer = 0;
    this.requiredHoldTime = 1.0; // seconds
    this.tolerance = 12; // degrees tolerance
    this.audioCtx = null;
    this.particles = [];
    this.vaultUnlocked = false;
    this.lastBeepAngle = 0;
  }

  async init() {
    await super.init();
    
    // Listen for hand landmarks to calculate forearm pronation/supination angle
    this.tracker.onLandmarksUpdate((landmarks) => {
      if (!landmarks || landmarks.length < 21) return;
      
      // Wrist landmark is 0, Index MCP is 5, Pinky MCP is 17
      const wrist = landmarks[0];
      const indexMcp = landmarks[5];
      const pinkyMcp = landmarks[17];
      
      if (indexMcp && pinkyMcp) {
        // Calculate the vector from index MCP to pinky MCP or wrist to middle MCP
        const dx = (1 - pinkyMcp.x) - (1 - indexMcp.x);
        const dy = pinkyMcp.y - indexMcp.y;
        
        let rad = Math.atan2(dy, dx);
        let deg = rad * (180 / Math.PI);
        this.currentAngle = Math.round(deg);
      }
    });

    this.selectNextTarget();
  }

  playClickSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  playUnlockSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      
      const now = this.audioCtx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.2, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.4);
      });
    } catch(e) {}
  }

  selectNextTarget() {
    // Generate practical clinical pronation/supination target angles: -90, -60, -30, 30, 60, 90, 120
    const possibleAngles = [-80, -50, -25, 30, 60, 90, 120, -110];
    let next;
    do {
      next = possibleAngles[Math.floor(Math.random() * possibleAngles.length)];
    } while (Math.abs(next - this.targetAngle) < 30);

    this.targetAngle = next;
    this.holdTimer = 0;
    this.vaultUnlocked = false;
  }

  update(deltaTime) {
    const dt = deltaTime / 1000;

    // Mouse fallback: rotate knob using mouse X relative to center
    if (this.tracker.mouseFallbackEnabled && this.cursorPosition) {
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2 + 30;
      const dx = this.cursorPosition.x - cx;
      const dy = this.cursorPosition.y - cy;
      let rad = Math.atan2(dy, dx);
      this.currentAngle = Math.round(rad * (180 / Math.PI));
    }

    // Check angle difference
    let diff = Math.abs(this.currentAngle - this.targetAngle);
    if (diff > 180) diff = 360 - diff;

    if (diff <= this.tolerance) {
      this.holdTimer += dt;
      if (Math.abs(this.currentAngle - this.lastBeepAngle) > 5) {
        this.playClickSound();
        this.lastBeepAngle = this.currentAngle;
      }

      if (this.holdTimer >= this.requiredHoldTime && !this.vaultUnlocked) {
        this.triggerUnlock();
      }
    } else {
      this.holdTimer = Math.max(0, this.holdTimer - dt * 1.5);
    }

    // Update particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.025;
      p.size = Math.max(0, p.size - 0.2);
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  triggerUnlock() {
    this.vaultUnlocked = true;
    this.score += 150;
    this.recordSuccess(Math.floor(this.holdTimer * 1000));
    this.playUnlockSound();

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 30;

    for (let i = 0; i < 35; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 9 + 3;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: Math.random() * 8 + 4,
        color: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 4)],
        alpha: 1.0
      });
    }

    setTimeout(() => {
      this.selectNextTarget();
    }, 1200);
  }

  render() {
    const ctx = this.ctx;
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 30;
    const radius = Math.min(this.canvas.width, this.canvas.height) * 0.28;

    // Dark high-tech background
    const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, this.canvas.width);
    bgGrad.addColorStop(0, '#1e293b');
    bgGrad.addColorStop(1, '#0b0f19');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Clinical Instruction Banner
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.roundRect(30, 60, this.canvas.width - 60, 95, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOREARM ROTATION & PRONATION / SUPINATION LAB (ARAT CLINICAL SCALE)', cx, 85);

    let directionText = this.targetAngle > 0 ? 'Rotate Hand Clockwise (Supination)' : 'Rotate Hand Counter-Clockwise (Pronation)';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(`Target Angle: ${this.targetAngle}°  —  ${directionText}`, cx, 125);
    ctx.restore();

    // Render Outer Dial Plate
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 25, 0, Math.PI * 2);
    ctx.fillStyle = '#334155';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 30;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();

    // Degree Ticks around dial
    for (let deg = -180; deg < 180; deg += 15) {
      const rad = deg * (Math.PI / 180);
      const isMajor = (deg % 45 === 0);
      const innerR = isMajor ? radius - 5 : radius + 5;
      const outerR = radius + 18;

      ctx.strokeStyle = isMajor ? '#94a3b8' : '#475569';
      ctx.lineWidth = isMajor ? 2.5 : 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rad) * innerR, cy + Math.sin(rad) * innerR);
      ctx.lineTo(cx + Math.cos(rad) * outerR, cy + Math.sin(rad) * outerR);
      ctx.stroke();

      if (isMajor) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${deg}°`, cx + Math.cos(rad) * (outerR + 15), cy + Math.sin(rad) * (outerR + 15));
      }
    }

    // Render Target Arc / Zone
    const targetRad = this.targetAngle * (Math.PI / 180);
    const tolRad = this.tolerance * (Math.PI / 180);
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, targetRad - tolRad, targetRad + tolRad);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 14;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.restore();

    // Render Inner Rotatable Knob
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.currentAngle * (Math.PI / 180));

    // Metallic Knob Gradient
    const knobGrad = ctx.createLinearGradient(-radius + 20, -radius + 20, radius - 20, radius - 20);
    knobGrad.addColorStop(0, '#64748b');
    knobGrad.addColorStop(0.5, '#334155');
    knobGrad.addColorStop(1, '#0f172a');
    
    ctx.fillStyle = knobGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pointer notch on knob
    ctx.fillStyle = this.vaultUnlocked ? '#10b981' : '#38bdf8';
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(radius - 20, 0);
    ctx.lineTo(radius - 45, -12);
    ctx.lineTo(radius - 45, 12);
    ctx.closePath();
    ctx.fill();

    // Center Vault Icon / Cap
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();

    // Render Center Hold Progress Indicator
    ctx.save();
    const progress = Math.min(1.0, this.holdTimer / this.requiredHoldTime);
    if (progress > 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, 38, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${this.currentAngle}°`, cx, cy);
    ctx.restore();

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
  }

  getResults() {
    return {
      score: Math.floor(this.score),
      accuracy: Math.floor(this.getAccuracy()),
      repetitions: this.repetitions,
      reaction_time: Math.floor(this.getAverageReactionTime()),
      duration: this.duration,
      game_type: 'knob_turn'
    };
  }
}
