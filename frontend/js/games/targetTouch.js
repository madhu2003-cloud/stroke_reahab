import GameBase from './gameBase.js';

export default class TargetTouchGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.target = null;
    this.targetSpawnTime = 0;
    this.particles = [];
    this.popups = [];
    this.baseTargetRadius = 40;
    this.minTargetRadius = 20;
    this.targetTimeout = 5000; // 5 seconds to hit
  }
  
  spawnTarget() {
    const padding = 60;
    const radius = Math.max(
      this.minTargetRadius,
      this.baseTargetRadius - Math.floor(this.successCount / 5) * 3
    );
    
    this.target = {
      x: padding + Math.random() * (this.canvas.width - padding * 2),
      y: padding + 50 + Math.random() * (this.canvas.height - padding * 2 - 50), // +50 for HUD
      radius: radius,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      pulsePhase: 0,
      baseY: 0,
      moving: this.successCount >= 10
    };
    
    this.target.baseY = this.target.y;
    this.targetSpawnTime = performance.now();
  }
  
  update(deltaTime) {
    if (!this.target) {
      this.spawnTarget();
      return;
    }
    
    const now = performance.now();
    
    // Check timeout
    if (now - this.targetSpawnTime > this.targetTimeout) {
      this.recordFail();
      this.spawnTarget();
    }
    
    // Target animation
    this.target.pulsePhase += deltaTime * 0.005;
    if (this.target.moving) {
      this.target.y = this.target.baseY + Math.sin(now * 0.002) * 20;
    }
    
    // Check collision
    if (this.cursorPosition) {
      const dx = this.cursorPosition.x - this.target.x;
      const dy = this.cursorPosition.y - this.target.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Allow slight margin
      if (distance < this.target.radius + 10) {
        // Hit!
        const reactionTime = now - this.targetSpawnTime;
        this.recordSuccess(reactionTime);
        
        const points = 10 + Math.max(0, Math.floor((3000 - reactionTime)/100));
        this.score += points;
        
        this.createParticles(this.target.x, this.target.y, this.target.color);
        this.createPopup(this.target.x, this.target.y, `+${points}`);
        
        this.spawnTarget();
      }
    }
    
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * deltaTime * 0.05;
      p.y += p.vy * deltaTime * 0.05;
      p.life -= deltaTime;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    
    // Update popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const p = this.popups[i];
      p.y -= deltaTime * 0.05;
      p.life -= deltaTime;
      if (p.life <= 0) this.popups.splice(i, 1);
    }
  }
  
  createParticles(x, y, color) {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
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
  
  createPopup(x, y, text) {
    this.popups.push({
      x, y, text,
      life: 1000,
      maxLife: 1000
    });
  }
  
  render() {
    // Background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(1, '#bae6fd');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Target
    if (this.target) {
      this.ctx.save();
      
      const currentRadius = this.target.radius + Math.sin(this.target.pulsePhase) * 5;
      
      // Glow
      this.ctx.shadowColor = this.target.color;
      this.ctx.shadowBlur = 20;
      
      this.ctx.beginPath();
      this.ctx.arc(this.target.x, this.target.y, currentRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.target.color;
      this.ctx.fill();
      
      // Inner circle
      this.ctx.beginPath();
      this.ctx.arc(this.target.x, this.target.y, currentRadius * 0.6, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.fill();
      
      this.ctx.restore();
    }
    
    // Particles
    for (const p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      this.ctx.restore();
    }
    
    // Popups
    for (const p of this.popups) {
      this.ctx.save();
      this.ctx.globalAlpha = p.life / p.maxLife;
      this.ctx.fillStyle = '#059669';
      this.ctx.font = 'bold 24px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(p.text, p.x, p.y);
      this.ctx.restore();
    }
    
    // Cursor
    if (this.cursorPosition) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(this.cursorPosition.x, this.cursorPosition.y, 10, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      this.ctx.strokeStyle = '#2563eb';
      this.ctx.lineWidth = 2;
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}
