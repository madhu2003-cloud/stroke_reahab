import GameBase from './gameBase.js';

export default class NumberShowGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.targetNumber = 1;
    this.currentFingers = 0;
    this.numberTimer = 0;
    this.successDelay = 1000; // Hold for 1 second
    this.holdTime = 0;
    this.particles = [];
  }
  
  async init() {
    await super.init();
    this.tracker.onLandmarksUpdate((landmarks) => {
      this.currentLandmarks = landmarks;
      this.countFingers(landmarks);
    });
    this.pickNewNumber();
  }
  
  pickNewNumber() {
    let next;
    do {
      next = Math.floor(Math.random() * 5) + 1; // 1 to 5
    } while (next === this.targetNumber);
    this.targetNumber = next;
    this.holdTime = 0;
  }
  
  countFingers(landmarks) {
    if (!landmarks) {
      this.currentFingers = 0;
      return;
    }
    
    let count = 0;
    const tips = [8, 12, 16, 20];
    const pips = [6, 10, 14, 18];
    const wrist = landmarks[0];
    
    // Check 4 fingers (index, middle, ring, pinky)
    for (let i = 0; i < 4; i++) {
      const tip = landmarks[tips[i]];
      const pip = landmarks[pips[i]];
      
      const distTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      const distPip = Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
      
      if (distTip > distPip) {
        count++;
      }
    }
    
    // Check thumb (tip is 4, IP is 3, MCP is 2)
    // Thumb logic is a bit different due to axis, but simple distance from pinky base or wrist can work.
    // For simplicity, checking if thumb tip is further from wrist than thumb MCP
    const thumbTip = landmarks[4];
    const thumbMcp = landmarks[2];
    if (Math.hypot(thumbTip.x - wrist.x, thumbTip.y - wrist.y) > Math.hypot(thumbMcp.x - wrist.x, thumbMcp.y - wrist.y) * 1.2) {
      count++;
    }
    
    this.currentFingers = Math.min(5, count);
  }
  
  update(deltaTime) {
    if (this.currentFingers === this.targetNumber) {
      this.holdTime += deltaTime;
      if (this.holdTime > this.successDelay) {
        this.recordSuccess();
        this.score += 20;
        this.createParticles(this.canvas.width/2, this.canvas.height/2);
        this.pickNewNumber();
      }
    } else {
      this.holdTime = 0;
    }
    
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
  
  createParticles(x, y) {
    for(let i=0; i<30; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.5) * 20,
        life: 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
      });
    }
  }
  
  render() {
    // Draw target number
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.font = '120px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.targetNumber, this.canvas.width / 2, this.canvas.height / 2 - 50);
    
    this.ctx.font = '30px sans-serif';
    this.ctx.fillText("Show this number of fingers", this.canvas.width / 2, this.canvas.height / 2 + 50);
    
    this.ctx.fillStyle = this.currentFingers === this.targetNumber ? '#4CAF50' : '#FF9800';
    this.ctx.fillText(`Detected: ${this.currentFingers}`, this.canvas.width / 2, this.canvas.height / 2 + 100);
    
    // Progress bar for holding
    if (this.holdTime > 0) {
      const progress = Math.min(1, this.holdTime / this.successDelay);
      this.ctx.fillStyle = '#4CAF50';
      this.ctx.fillRect(this.canvas.width / 2 - 100, this.canvas.height / 2 + 140, 200 * progress, 20);
      this.ctx.strokeStyle = '#FFF';
      this.ctx.strokeRect(this.canvas.width / 2 - 100, this.canvas.height / 2 + 140, 200, 20);
    }
    
    // Draw particles
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 6 * p.life, 0, Math.PI * 2);
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
    
    this.ctx.strokeStyle = 'rgba(0, 200, 255, 0.5)';
    this.ctx.lineWidth = 3;
    
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
    
    // Highlight tips
    this.ctx.fillStyle = 'yellow';
    const tips = [4, 8, 12, 16, 20];
    for (let i of tips) {
      const p = landmarks[i];
      const x = (1 - p.x) * this.canvas.width;
      const y = p.y * this.canvas.height;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 8, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }
}
