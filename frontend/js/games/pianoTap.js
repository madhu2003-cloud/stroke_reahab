import GameBase from './gameBase.js';

export default class PianoTapGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.keys = [
      { id: 0, finger: 'Thumb', note: 'C4', freq: 261.63, color: '#3b82f6', active: false, x: 0, w: 0 },
      { id: 1, finger: 'Index', note: 'D4', freq: 293.66, color: '#10b981', active: false, x: 0, w: 0 },
      { id: 2, finger: 'Middle', note: 'E4', freq: 329.63, color: '#f59e0b', active: false, x: 0, w: 0 },
      { id: 3, finger: 'Ring', note: 'F4', freq: 349.23, color: '#ec4899', active: false, x: 0, w: 0 },
      { id: 4, finger: 'Pinky', note: 'G4', freq: 392.00, color: '#8b5cf6', active: false, x: 0, w: 0 }
    ];
    
    this.targetKeyIndex = 1;
    this.targetChangeTimer = 0;
    this.particles = [];
    this.audioCtx = null;
    this.targetPromptTime = Date.now();
    this.hitCooldown = 0;
    
    // Landmark tracking for 5 fingers: Thumb(4), Index(8), Middle(12), Ring(16), Pinky(20)
    this.fingerTips = [
      { id: 0, landmarkIdx: 4, x: 0, y: 0, down: false, name: 'Thumb' },
      { id: 1, landmarkIdx: 8, x: 0, y: 0, down: false, name: 'Index' },
      { id: 2, landmarkIdx: 12, x: 0, y: 0, down: false, name: 'Middle' },
      { id: 3, landmarkIdx: 16, x: 0, y: 0, down: false, name: 'Ring' },
      { id: 4, landmarkIdx: 20, x: 0, y: 0, down: false, name: 'Pinky' }
    ];
  }

  async init() {
    await super.init();
    
    // Listen to hand landmarks for multi-finger detection
    this.tracker.onLandmarksUpdate((landmarks) => {
      if (!landmarks || landmarks.length < 21) return;
      const rect = this.canvas.getBoundingClientRect();
      
      this.fingerTips.forEach(f => {
        const lm = landmarks[f.landmarkIdx];
        if (lm) {
          f.x = (1 - lm.x) * this.canvas.width;
          f.y = lm.y * this.canvas.height;
        }
      });
    });

    this.selectNextTarget();
  }

  playTone(freq) {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.5);
    } catch (e) {
      // audio disabled or blocked
    }
  }

  selectNextTarget() {
    // Pick next target finger, avoiding repeating same finger consecutively
    let next;
    do {
      next = Math.floor(Math.random() * this.keys.length);
    } while (next === this.targetKeyIndex);
    
    this.targetKeyIndex = next;
    this.targetPromptTime = Date.now();
  }

  update(deltaTime) {
    this.hitCooldown = Math.max(0, this.hitCooldown - deltaTime);
    
    // Update key dimensions
    const keyWidth = (this.canvas.width - 60) / this.keys.length;
    const keyHeight = this.canvas.height * 0.45;
    const startY = this.canvas.height - keyHeight - 30;

    this.keys.forEach((k, i) => {
      k.x = 30 + i * keyWidth;
      k.w = keyWidth - 10;
      k.y = startY;
      k.h = keyHeight;
    });

    // Check finger hits against target key
    const targetKey = this.keys[this.targetKeyIndex];
    let triggered = false;

    // 1. Check multi-finger positions
    for (const f of this.fingerTips) {
      if (f.x > targetKey.x && f.x < targetKey.x + targetKey.w && f.y > targetKey.y && f.y < targetKey.y + targetKey.h) {
        if (this.hitCooldown === 0) {
          this.triggerSuccess(f.id, targetKey);
          triggered = true;
          break;
        }
      }
    }

    // 2. Cursor/Mouse Fallback Check
    if (!triggered && this.cursorPosition && this.hitCooldown === 0) {
      const cx = this.cursorPosition.x;
      const cy = this.cursorPosition.y;
      if (cx > targetKey.x && cx < targetKey.x + targetKey.w && cy > targetKey.y && cy < targetKey.y + targetKey.h) {
        this.triggerSuccess(this.targetKeyIndex, targetKey);
      }
    }

    // Update particle effects
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      p.size = Math.max(0, p.size - 0.2);
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  triggerSuccess(fingerId, key) {
    this.hitCooldown = 600; // ms cooldown
    const reaction = Date.now() - this.targetPromptTime;
    
    this.score += 100;
    this.recordSuccess(reaction);
    this.playTone(key.freq);
    
    // Visual flash on key
    key.active = true;
    setTimeout(() => { key.active = false; }, 300);

    // Spawn burst particles
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: key.x + key.w / 2,
        y: key.y + 40,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 3,
        size: Math.random() * 8 + 4,
        color: key.color,
        alpha: 1.0
      });
    }

    this.selectNextTarget();
  }

  render() {
    const ctx = this.ctx;
    
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
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

    const targetKey = this.keys[this.targetKeyIndex];
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CLINICAL FINGER INDEPENDENCE TRAINING (FUGL-MEYER PART C)', this.canvas.width / 2, 85);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(`Target: Tap with `, this.canvas.width / 2 - 80, 125);
    
    ctx.fillStyle = targetKey.color;
    ctx.fillText(`${targetKey.finger.toUpperCase()} FINGER [${targetKey.note}]`, this.canvas.width / 2 + 70, 125);
    ctx.restore();

    // Render Piano Keys
    this.keys.forEach((k, i) => {
      const isTarget = (i === this.targetKeyIndex);
      
      ctx.save();
      
      // Shadow & Key background
      ctx.shadowColor = isTarget ? k.color : 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = isTarget ? 25 : 8;
      
      const keyGrad = ctx.createLinearGradient(k.x, k.y, k.x, k.y + k.h);
      if (k.active) {
        keyGrad.addColorStop(0, '#ffffff');
        keyGrad.addColorStop(1, k.color);
      } else if (isTarget) {
        keyGrad.addColorStop(0, '#ffffff');
        keyGrad.addColorStop(0.3, '#f1f5f9');
        keyGrad.addColorStop(1, k.color + '44');
      } else {
        keyGrad.addColorStop(0, '#f8fafc');
        keyGrad.addColorStop(1, '#cbd5e1');
      }

      ctx.fillStyle = keyGrad;
      ctx.strokeStyle = isTarget ? k.color : '#94a3b8';
      ctx.lineWidth = isTarget ? 4 : 1.5;
      
      ctx.beginPath();
      ctx.roundRect(k.x, k.y, k.w, k.h, [10, 10, 16, 16]);
      ctx.fill();
      ctx.stroke();

      // Top colored indicator tag
      ctx.fillStyle = k.color;
      ctx.beginPath();
      ctx.roundRect(k.x + 8, k.y + 8, k.w - 16, 16, 6);
      ctx.fill();

      // Finger & Note Label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(k.finger, k.x + k.w / 2, k.y + k.h - 55);

      ctx.fillStyle = '#475569';
      ctx.font = '600 14px Inter, sans-serif';
      ctx.fillText(`Note ${k.note}`, k.x + k.w / 2, k.y + k.h - 28);

      if (isTarget) {
        // Target pulse ring
        ctx.fillStyle = k.color;
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText('PRESS HERE', k.x + k.w / 2, k.y + 55);
      }
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

    // Render Hand Cursor & Finger Indicators
    this.fingerTips.forEach(f => {
      if (f.x > 0 && f.y > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(f.name[0], f.x, f.y + 3);
        ctx.restore();
      }
    });

    // Fallback cursor if no multi-landmarks
    if (this.cursorPosition) {
      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.cursorPosition.x, this.cursorPosition.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
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
      game_type: 'piano_tap'
    };
  }
}
