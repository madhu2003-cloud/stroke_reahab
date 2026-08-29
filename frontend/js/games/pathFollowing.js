import GameBase from './gameBase.js';

export default class PathFollowingGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    
    this.paths = [];
    this.currentPathIndex = 0;
    this.pathProgress = 0; // 0 to 1
    
    this.guidePos = { x: 0, y: 0 };
    this.trail = [];
    this.maxTrailLength = 50;
    
    this.deviations = [];
    this.pathStartTime = 0;
    
    this.baseSpeed = 0.0005; // progress per ms
  }
  
  start() {
    this.generatePaths();
    this.startNextPath();
    super.start();
  }
  
  generatePaths() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cy = h / 2;
    
    this.paths = [
      // 1. Straight line
      (t) => ({
        x: w * 0.1 + (w * 0.8) * t,
        y: cy
      }),
      // 2. Sine wave
      (t) => ({
        x: w * 0.1 + (w * 0.8) * t,
        y: cy + Math.sin(t * Math.PI * 2) * (h * 0.2)
      }),
      // 3. Zig zag
      (t) => {
        const x = w * 0.1 + (w * 0.8) * t;
        const segment = t * 4;
        const remainder = segment % 1;
        const dir = Math.floor(segment) % 2 === 0 ? 1 : -1;
        const yOffset = dir === 1 ? -0.5 + remainder : 0.5 - remainder;
        return {
          x,
          y: cy + yOffset * (h * 0.4)
        };
      },
      // 4. Circle/Oval
      (t) => ({
        x: w * 0.5 + Math.cos(t * Math.PI * 2 - Math.PI/2) * (w * 0.3),
        y: cy + Math.sin(t * Math.PI * 2 - Math.PI/2) * (h * 0.3)
      })
    ];
  }
  
  startNextPath() {
    this.pathProgress = 0;
    this.trail = [];
    this.deviations = [];
    this.pathStartTime = performance.now();
  }
  
  update(deltaTime) {
    if (this.currentPathIndex >= this.paths.length) return;
    
    // Update progress
    this.pathProgress += this.baseSpeed * deltaTime;
    
    if (this.pathProgress >= 1) {
      this.finishCurrentPath();
      return;
    }
    
    // Calculate guide position
    const pathFunc = this.paths[this.currentPathIndex];
    this.guidePos = pathFunc(this.pathProgress);
    
    // Calculate deviation
    if (this.cursorPosition) {
      const dx = this.cursorPosition.x - this.guidePos.x;
      const dy = this.cursorPosition.y - this.guidePos.y;
      const deviation = Math.sqrt(dx * dx + dy * dy);
      
      this.deviations.push(deviation);
      
      // Record trail
      this.trail.push({
        x: this.cursorPosition.x,
        y: this.cursorPosition.y,
        deviation
      });
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
      
      // Scoring based on deviation
      if (deviation < 30) {
        this.score += 2 * deltaTime * 0.01;
        this.recordSuccess();
      } else {
        this.recordFail();
      }
    }
  }
  
  finishCurrentPath() {
    this.currentPathIndex++;
    if (this.currentPathIndex < this.paths.length) {
      this.startNextPath();
    } else {
      this.endGame();
    }
  }
  
  getAccuracy() {
    if (this.deviations.length === 0) return 0;
    const avgDev = this.deviations.reduce((a, b) => a + b, 0) / this.deviations.length;
    // Map deviation 0-100 to accuracy 100-0%
    const acc = Math.max(0, 100 - avgDev);
    return acc;
  }
  
  render() {
    // Background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#f0fdf4');
    gradient.addColorStop(1, '#dcfce7');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.currentPathIndex >= this.paths.length) return;
    
    const pathFunc = this.paths[this.currentPathIndex];
    
    // Draw full path
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    
    const steps = 100;
    for (let i = 0; i <= steps; i++) {
      const p = pathFunc(i / steps);
      if (i === 0) this.ctx.moveTo(p.x, p.y);
      else this.ctx.lineTo(p.x, p.y);
    }
    this.ctx.stroke();
    
    // Draw center line
    this.ctx.beginPath();
    this.ctx.strokeStyle = '#94a3b8';
    this.ctx.lineWidth = 4;
    this.ctx.setLineDash([10, 10]);
    for (let i = 0; i <= steps; i++) {
      const p = pathFunc(i / steps);
      if (i === 0) this.ctx.moveTo(p.x, p.y);
      else this.ctx.lineTo(p.x, p.y);
    }
    this.ctx.stroke();
    this.ctx.restore();
    
    // Draw trail
    if (this.trail.length > 1) {
      this.ctx.save();
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = 8;
      
      for (let i = 1; i < this.trail.length; i++) {
        const p1 = this.trail[i-1];
        const p2 = this.trail[i];
        
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        
        // Color based on deviation
        const dev = p2.deviation;
        if (dev < 20) this.ctx.strokeStyle = '#22c55e'; // Green
        else if (dev < 40) this.ctx.strokeStyle = '#eab308'; // Yellow
        else this.ctx.strokeStyle = '#ef4444'; // Red
        
        this.ctx.globalAlpha = i / this.trail.length;
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
    
    // Draw guide dot
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(this.guidePos.x, this.guidePos.y, 15, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(59, 130, 246, 0.4)';
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(this.guidePos.x, this.guidePos.y, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#2563eb';
    this.ctx.fill();
    this.ctx.restore();
    
    // Draw player cursor
    if (this.cursorPosition) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(this.cursorPosition.x, this.cursorPosition.y, 10, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      
      const currentDev = this.trail.length > 0 ? this.trail[this.trail.length-1].deviation : 0;
      if (currentDev < 20) this.ctx.strokeStyle = '#22c55e';
      else if (currentDev < 40) this.ctx.strokeStyle = '#eab308';
      else this.ctx.strokeStyle = '#ef4444';
      
      this.ctx.lineWidth = 3;
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.restore();
    }
    
    // Path Progress HUD
    this.ctx.save();
    this.ctx.fillStyle = '#333';
    this.ctx.font = '20px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Path ${this.currentPathIndex + 1} / ${this.paths.length}`, this.canvas.width / 2, 70);
    
    // Progress bar
    const barWidth = 200;
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
    this.ctx.fillRect(this.canvas.width/2 - barWidth/2, 85, barWidth, 10);
    this.ctx.fillStyle = '#2563eb';
    this.ctx.fillRect(this.canvas.width/2 - barWidth/2, 85, barWidth * this.pathProgress, 10);
    this.ctx.restore();
  }
}
