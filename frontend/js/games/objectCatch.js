import GameBase from './gameBase.js';

export default class ObjectCatchGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.objects = [];
    this.particles = [];
    this.popups = [];
    
    this.basketWidth = 120;
    this.basketHeight = 20;
    this.basketY = 0; // set in update
    
    this.combo = 0;
    this.maxCombo = 0;
    this.spawnTimer = 0;
    
    this.baseSpeed = 0.2; // pixels per ms
    this.spawnRate = 1500; // ms
  }
  
  update(deltaTime) {
    this.basketY = this.canvas.height - 40;
    
    // Progression
    const elapsed = this.getElapsedTime();
    const currentSpeed = this.baseSpeed + (Math.floor(elapsed / 10) * 0.05);
    const currentSpawnRate = Math.max(500, this.spawnRate - (Math.floor(elapsed / 10) * 100));
    
    // Spawn objects
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > currentSpawnRate) {
      this.spawnTimer = 0;
      this.spawnObject();
    }
    
    // Update basket position
    let bx = this.canvas.width / 2;
    if (this.cursorPosition) {
      bx = this.cursorPosition.x;
    }
    // Clamp
    bx = Math.max(this.basketWidth / 2, Math.min(this.canvas.width - this.basketWidth / 2, bx));
    
    // Update objects
    for (let i = this.objects.length - 1; i >= 0; i--) {
      const obj = this.objects[i];
      obj.y += currentSpeed * deltaTime;
      
      // Check collision with basket
      if (obj.y + obj.radius >= this.basketY && obj.y - obj.radius <= this.basketY + this.basketHeight) {
        if (Math.abs(obj.x - bx) < this.basketWidth / 2 + obj.radius) {
          // Caught
          this.handleCatch(obj);
          this.objects.splice(i, 1);
          continue;
        }
      }
      
      // Missed
      if (obj.y > this.canvas.height + obj.radius) {
        if (obj.isGood) {
          this.recordFail();
          this.combo = 0;
        }
        this.objects.splice(i, 1);
      }
    }
    
    // Update particles and popups
    this.updateEffects(deltaTime);
  }
  
  spawnObject() {
    const isGood = Math.random() > 0.3; // 70% good, 30% bad
    this.objects.push({
      x: 40 + Math.random() * (this.canvas.width - 80),
      y: -20,
      radius: 15 + Math.random() * 10,
      isGood: isGood,
      color: isGood ? '#10b981' : '#ef4444',
      type: Math.floor(Math.random() * 3),
      spawnTime: performance.now()
    });
  }
  
  handleCatch(obj) {
    if (obj.isGood) {
      const reactionTime = performance.now() - obj.spawnTime;
      this.recordSuccess(reactionTime);
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      
      const points = 10 + Math.floor(this.combo / 5) * 5;
      this.score += points;
      this.createParticles(obj.x, this.basketY, obj.color);
      this.createPopup(obj.x, this.basketY - 20, `+${points}`);
    } else {
      this.recordFail();
      this.combo = 0;
      this.score = Math.max(0, this.score - 5);
      this.createParticles(obj.x, this.basketY, obj.color);
      this.createPopup(obj.x, this.basketY - 20, '-5', '#ef4444');
      
      // Flash screen red effect
      this.flashTimer = 200;
    }
  }
  
  updateEffects(deltaTime) {
    if (this.flashTimer > 0) this.flashTimer -= deltaTime;
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime * 0.05;
      p.y += p.vy * deltaTime * 0.05;
      p.life -= deltaTime;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i];
      p.y -= deltaTime * 0.05;
      p.life -= deltaTime;
      if (p.life <= 0) this.popups.splice(i, 1);
    }
  }
  
  createParticles(x, y, color) {
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      this.particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        life: 500 + Math.random() * 500,
        maxLife: 1000
      });
    }
  }
  
  createPopup(x, y, text, color = '#10b981') {
    this.popups.push({
      x, y, text, color,
      life: 800,
      maxLife: 800
    });
  }
  
  render() {
    // Background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#fdf4ff');
    gradient.addColorStop(1, '#f3e8ff');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.flashTimer > 0) {
      this.ctx.fillStyle = `rgba(239, 68, 68, ${this.flashTimer / 400})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Draw objects
    for (const obj of this.objects) {
      this.ctx.save();
      this.ctx.fillStyle = obj.color;
      this.ctx.shadowColor = obj.color;
      this.ctx.shadowBlur = 10;
      
      this.ctx.beginPath();
      if (obj.type === 0) { // Circle
        this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
      } else if (obj.type === 1) { // Square
        this.ctx.roundRect(obj.x - obj.radius, obj.y - obj.radius, obj.radius * 2, obj.radius * 2, 4);
      } else { // Triangle
        this.ctx.moveTo(obj.x, obj.y - obj.radius);
        this.ctx.lineTo(obj.x + obj.radius, obj.y + obj.radius);
        this.ctx.lineTo(obj.x - obj.radius, obj.y + obj.radius);
        this.ctx.closePath();
      }
      this.ctx.fill();
      this.ctx.restore();
    }
    
    // Draw basket
    let bx = this.canvas.width / 2;
    if (this.cursorPosition) bx = this.cursorPosition.x;
    bx = Math.max(this.basketWidth / 2, Math.min(this.canvas.width - this.basketWidth / 2, bx));
    
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.roundRect(bx - this.basketWidth/2, this.basketY, this.basketWidth, this.basketHeight, 10);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
    
    // Draw particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }
    
    // Draw popups
    for (const p of this.popups) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.fillStyle = p.color;
      this.ctx.font = 'bold 20px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.text, p.x, p.y);
      this.ctx.restore();
    }
    
    // Combo
    if (this.combo > 1) {
      this.ctx.save();
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`Combo x${this.combo}`, this.canvas.width - 20, 80);
      this.ctx.restore();
    }
  }
}
