import GameBase from './gameBase.js';

export default class ThumbTouchGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.targetFinger = 8; // start with index tip
    this.fingerNames = {
      8: 'Index',
      12: 'Middle',
      16: 'Ring',
      20: 'Pinky'
    };
    this.sequence = [8, 12, 16, 20];
    this.seqIndex = 0;
    this.touchThreshold = 0.05; // Relative distance
    this.particles = [];
  }
  
  async init() {
    await super.init();
    this.tracker.onLandmarksUpdate((landmarks) => {
      this.currentLandmarks = landmarks;
      this.checkTouch(landmarks);
    });
  }
  
  checkTouch(landmarks) {
    if (!landmarks) return;
    
    const thumbTip = landmarks[4];
    const targetTip = landmarks[this.targetFinger];
    
    // Calculate Euclidean distance in normalized coordinates
    const distance = Math.hypot(thumbTip.x - targetTip.x, thumbTip.y - targetTip.y);
    
    if (distance < this.touchThreshold) {
      this.onTouched();
    }
  }
  
  onTouched() {
    this.recordSuccess();
    this.score += 15;
    
    // Particles at the thumb tip
    if (this.currentLandmarks) {
      const p = this.currentLandmarks[4];
      const x = (1 - p.x) * this.canvas.width;
      const y = p.y * this.canvas.height;
      this.createParticles(x, y);
    }
    
    // Move to next finger
    this.seqIndex++;
    if (this.seqIndex >= this.sequence.length) {
      this.seqIndex = 0; // restart sequence
      this.score += 50; // Bonus for completing sequence
    }
    this.targetFinger = this.sequence[this.seqIndex];
  }
  
  createParticles(x, y) {
    for(let i=0; i<20; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        life: 1,
        color: '#FFEB3B'
      });
    }
  }
  
  update(deltaTime) {
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  render() {
    // Instructions
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = '40px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Touch Thumb to ${this.fingerNames[this.targetFinger]} Finger`, this.canvas.width / 2, 80);
    
    // Draw particles
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 5 * p.life, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
    }
    
    // Draw hand skeleton if landmarks available
    if (this.currentLandmarks) {
      this.drawHand(this.currentLandmarks);
    }
  }
  
  drawHand(landmarks) {
    this.ctx.save();
    const connections = [
      [0,1],[1,2],[2,3],[3,4],
      [0,5],[5,6],[6,7],[7,8],
      [5,9],[9,10],[10,11],[11,12],
      [9,13],[13,14],[14,15],[15,16],
      [13,17],[17,18],[18,19],[19,20],
      [0,17]
    ];
    
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.lineWidth = 2;
    
    for (const [start, end] of connections) {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      const x1 = (1 - p1.x) * this.canvas.width;
      const y1 = p1.y * this.canvas.height;
      const x2 = (1 - p2.x) * this.canvas.width;
      const y2 = p2.y * this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    
    // Highlight thumb
    const thumb = landmarks[4];
    const tx = (1 - thumb.x) * this.canvas.width;
    const ty = thumb.y * this.canvas.height;
    this.ctx.beginPath();
    this.ctx.arc(tx, ty, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FF9800';
    this.ctx.fill();
    
    // Highlight target
    const target = landmarks[this.targetFinger];
    const targetX = (1 - target.x) * this.canvas.width;
    const targetY = target.y * this.canvas.height;
    this.ctx.beginPath();
    this.ctx.arc(targetX, targetY, 15, 0, Math.PI * 2);
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fill();
    this.ctx.strokeStyle = '#FFF';
    this.ctx.stroke();
    
    // Draw line between them
    this.ctx.beginPath();
    this.ctx.moveTo(tx, ty);
    this.ctx.lineTo(targetX, targetY);
    this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
    this.ctx.setLineDash([5, 5]);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    this.ctx.restore();
  }
}
