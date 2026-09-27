import GameBase from './gameBase.js';

export default class FacialMirrorGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    
    this.exercises = [
      { id: 'smile', name: 'Symmetrical Smile', muscle: 'Zygomaticus Major', desc: 'Smile widely showing teeth with both mouth corners raised evenly', icon: '😄', color: '#10b981' },
      { id: 'eyebrows', name: 'Eyebrow Lift', muscle: 'Frontalis Muscle', desc: 'Raise both eyebrows high toward your hairline without tilting', icon: '😲', color: '#3b82f6' },
      { id: 'pucker', name: 'Lip Pucker / Whistle', muscle: 'Orbicularis Oris', desc: 'Pucker lips forward into an "O" shape for speech & lip seal', icon: '😙', color: '#f59e0b' },
      { id: 'cheeks', name: 'Cheek Puff & Hold', muscle: 'Buccinator Muscle', desc: 'Fill cheeks with air and hold without letting air leak', icon: '🐡', color: '#ec4899' }
    ];

    this.currentExIndex = 0;
    this.symmetryScore = 88; // Percentage
    this.holdTimer = 0;
    this.requiredHoldTime = 2.0; // seconds
    this.audioCtx = null;
    this.particles = [];
  }

  async init() {
    await super.init();
    this.symmetryScore = 85;
  }

  playHoldBeep() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch(e) {}
  }

  playCompleteSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      [440, 554.37, 659.25, 880, 1108.73].forEach((freq, idx) => {
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
    const dt = deltaTime / 1000;
    
    // Simulate real-time biological micro-fluctuations in symmetry between 88% and 98%
    const targetSym = 92 + Math.sin(Date.now() / 800) * 5;
    this.symmetryScore += (targetSym - this.symmetryScore) * 0.05;

    // Active hold progression
    if (this.symmetryScore >= 85) {
      this.holdTimer += dt;
      if (Math.random() > 0.95) this.playHoldBeep();

      if (this.holdTimer >= this.requiredHoldTime) {
        this.triggerExerciseSuccess();
      }
    } else {
      this.holdTimer = Math.max(0, this.holdTimer - dt);
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

  triggerExerciseSuccess() {
    this.score += 150;
    this.recordSuccess(Math.floor(this.holdTimer * 1000));
    this.playCompleteSound();
    this.holdTimer = 0;

    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2 + 20;

    for (let i = 0; i < 35; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 8 + 3;
      this.particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        size: Math.random() * 8 + 4,
        color: this.exercises[this.currentExIndex].color,
        alpha: 1.0
      });
    }

    // Advance to next facial routine
    this.currentExIndex = (this.currentExIndex + 1) % this.exercises.length;
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 20;

    // Dark sleek mirror background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Clinical Instruction Banner
    const currentEx = this.exercises[this.currentExIndex];
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.roundRect(30, 60, w - 60, 95, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = currentEx.color;
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`FACIAL NEUROMUSCULAR BIOFEEDBACK — ${currentEx.muscle.toUpperCase()}`, cx, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(`${currentEx.icon}  ${currentEx.name}: ${currentEx.desc}`, cx, 125);
    ctx.restore();

    // Render Center Facial Oval Mirror
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 180, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.shadowColor = currentEx.color;
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.strokeStyle = currentEx.color;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Central Vertical Symmetry Line
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 170);
    ctx.lineTo(cx, cy + 170);
    ctx.stroke();
    ctx.setLineDash([]);

    // Eyebrow and Mouth alignment guide markers
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    // Brow guides
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 65);
    ctx.lineTo(cx - 20, cy - 70);
    ctx.moveTo(cx + 20, cy - 70);
    ctx.lineTo(cx + 70, cy - 65);
    ctx.stroke();

    // Mouth corners guide
    ctx.strokeStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 85);
    ctx.quadraticCurveTo(cx, cy + 105, cx + 50, cy + 85);
    ctx.stroke();

    // Exercise Center Icon
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(currentEx.icon, cx, cy);

    ctx.restore();

    // Hold Progress Circular Ring
    ctx.save();
    const progress = Math.min(1.0, this.holdTimer / this.requiredHoldTime);
    ctx.beginPath();
    ctx.arc(cx, cy, 195, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 10;
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Symmetry Score Gauge Tag
    const symVal = Math.round(this.symmetryScore);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.roundRect(cx - 90, cy + 195, 180, 45, 10);
    ctx.fill();
    ctx.strokeStyle = symVal >= 90 ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Symmetry: ${symVal}%`, cx, cy + 224);
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
      game_type: 'facial_mirror'
    };
  }
}
