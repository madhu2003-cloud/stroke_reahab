import GameBase from './gameBase.js';

export default class ShelfReachGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    
    this.shelves = [];
    this.items = [];
    this.activeItem = null;
    this.targetShelfId = 'top';
    this.particles = [];
    this.audioCtx = null;
    this.armAngle = 45;
  }

  async init() {
    await super.init();
    
    this.tracker.onLandmarksUpdate((landmarks) => {
      if (!landmarks || landmarks.length < 21) return;
      // Track wrist and palm height
      const wrist = landmarks[0];
      const middleTip = landmarks[12];
      if (wrist && middleTip) {
        // Arm vertical elevation angle approximation from canvas Y
        const normY = wrist.y;
        this.armAngle = Math.round((1 - normY) * 140 + 20); // 20 deg (low) to 160 deg (high overhead)
      }
    });

    this.setupShelvesAndItems();
  }

  setupShelvesAndItems() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 3 Shelves: Top, Middle, Bottom Counter
    this.shelves = [
      { id: 'top', name: 'High Overhead Shelf (120°-160°)', y: h * 0.28, h: 18, color: '#38bdf8' },
      { id: 'middle', name: 'Middle Level Shelf (80°-110°)', y: h * 0.50, h: 18, color: '#f59e0b' },
      { id: 'bottom', name: 'Bottom Counter (20°-50°)', y: h * 0.78, h: 24, color: '#94a3b8' }
    ];

    this.spawnNewItem();
  }

  spawnNewItem() {
    const bottomShelf = this.shelves.find(s => s.id === 'bottom');
    const itemTypes = [
      { name: 'Water Bottle', icon: '🧴', color: '#0ea5e9', w: 40, h: 70 },
      { name: 'Recovery Mug', icon: '☕', color: '#f97316', w: 46, h: 50 },
      { name: 'Medicine Box', icon: '📦', color: '#10b981', w: 52, h: 48 },
      { name: 'Therapy Ball', icon: '🎾', color: '#eab308', w: 44, h: 44 }
    ];

    const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const spawnX = this.canvas.width * (0.25 + Math.random() * 0.5);

    this.activeItem = {
      ...type,
      x: spawnX,
      y: bottomShelf.y - type.h,
      homeX: spawnX,
      homeY: bottomShelf.y - type.h,
      isHeld: false,
      placed: false
    };

    // Alternate target shelf between top and middle
    this.targetShelfId = Math.random() > 0.4 ? 'top' : 'middle';
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
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.1);
    } catch(e) {}
  }

  playSuccessSound() {
    try {
      if (!this.audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
      }
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.3);
      });
    } catch(e) {}
  }

  update(deltaTime) {
    if (!this.cursorPosition || !this.activeItem) return;
    const cx = this.cursorPosition.x;
    const cy = this.cursorPosition.y;
    const item = this.activeItem;

    // 1. Grab item if close
    if (!item.isHeld && !item.placed) {
      if (Math.hypot(item.x + item.w / 2 - cx, item.y + item.h / 2 - cy) < 55) {
        item.isHeld = true;
        this.playGrabSound();
      }
    }

    // 2. Move held item with hand
    if (item.isHeld) {
      item.x = cx - item.w / 2;
      item.y = cy - item.h / 2;

      // Check if reached target shelf
      const targetShelf = this.shelves.find(s => s.id === this.targetShelfId);
      if (targetShelf && cy < targetShelf.y + 40 && cy > targetShelf.y - 40) {
        // Successfully placed on shelf!
        item.isHeld = false;
        item.placed = true;
        item.y = targetShelf.y - item.h;
        
        this.score += 130;
        this.recordSuccess(Date.now());
        this.playSuccessSound();

        for (let i = 0; i < 30; i++) {
          this.particles.push({
            x: item.x + item.w / 2,
            y: item.y + item.h / 2,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: Math.random() * 8 + 4,
            color: targetShelf.color,
            alpha: 1.0
          });
        }

        setTimeout(() => this.spawnNewItem(), 1000);
      }
    }

    // Update particles
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
      p.size = Math.max(0, p.size - 0.2);
    });
    this.particles = this.particles.filter(p => p.alpha > 0);
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Kitchen / Pantry gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Clinical Instruction Banner
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.roundRect(30, 60, w - 60, 95, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SHOULDER ELEVATION & ELBOW EXTENSION TRAINING (FUGL-MEYER PART A)', w / 2, 85);

    const targetShelf = this.shelves.find(s => s.id === this.targetShelfId);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText(`Reach down to grab item ➔ Lift overhead to the `, w / 2 - 130, 125);
    
    ctx.fillStyle = targetShelf.color;
    ctx.fillText(`${targetShelf.name.toUpperCase()}`, w / 2 + 180, 125);
    ctx.restore();

    // Render Shelves
    this.shelves.forEach(shelf => {
      const isTarget = (shelf.id === this.targetShelfId);
      
      ctx.save();
      // Wooden Shelf Plank
      ctx.fillStyle = isTarget ? '#1e293b' : '#334155';
      ctx.strokeStyle = isTarget ? shelf.color : '#475569';
      ctx.lineWidth = isTarget ? 4 : 2;
      ctx.shadowColor = isTarget ? shelf.color : 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = isTarget ? 20 : 5;
      
      ctx.roundRect(50, shelf.y, w - 100, shelf.h, 6);
      ctx.fill();
      ctx.stroke();

      // Shelf Label Tag
      ctx.fillStyle = isTarget ? shelf.color : '#94a3b8';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(shelf.name, 65, shelf.y - 10);

      if (isTarget) {
        ctx.fillStyle = shelf.color;
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('▼ TARGET PLACEMENT ZONE ▼', w - 65, shelf.y - 10);
      }
      ctx.restore();
    });

    // Render Active Item
    if (this.activeItem) {
      const item = this.activeItem;
      ctx.save();
      ctx.fillStyle = item.color;
      ctx.shadowColor = item.color;
      ctx.shadowBlur = item.isHeld ? 25 : 10;
      ctx.roundRect(item.x, item.y, item.w, item.h, 8);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Item Icon
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon, item.x + item.w / 2, item.y + item.h / 2);
      ctx.restore();
    }

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

    // Render Hand Cursor & Arm Elevation Angle Meter
    if (this.cursorPosition) {
      const cx = this.cursorPosition.x;
      const cy = this.cursorPosition.y;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.stroke();

      // Elevation Angle Floating Tag
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.roundRect(cx - 55, cy - 38, 110, 22, 6);
      ctx.fill();

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`ARM ELEVATION: ${this.armAngle}°`, cx, cy - 23);
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
      game_type: 'shelf_reach'
    };
  }
}
