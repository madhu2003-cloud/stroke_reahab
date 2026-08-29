import GameBase from './gameBase.js';

export default class BubblePopGame extends GameBase {
  constructor(canvasId, options = {}) {
    super(canvasId, options);
    this.bubbles = [];
    this.spawnRate = 1000;
    this.lastSpawn = 0;
    this.handState = 'open'; // 'open' or 'closed'
    this.particles = [];
  }
  
  async init() {
    await super.init();
    this.tracker.onLandmarksUpdate((landmarks) => {
      this.currentLandmarks = landmarks;
      this.detectHandState(landmarks);
    });
  }
  
  detectHandState(landmarks) {
    if (!landmarks) return;
    
    // Check distance between wrist (0) and tips (8, 12, 16, 20)
    const wrist = landmarks[0];
    const tips = [8, 12, 16, 20];
    const mcps = [5, 9, 13, 17];
    
    let isClosed = true;
    for (let i=0; i<4; i++) {
      const tip = landmarks[tips[i]];
      const mcp = landmarks[mcps[i]];
      // distance from wrist to tip
      const distToTip = Math.hypot(tip.x - wrist.x, tip.y - wrist.y);
      // distance from wrist to mcp
      const distToMcp = Math.hypot(mcp.x - wrist.x, mcp.y - wrist.y);
      
      if (distToTip > distToMcp * 1.2) {
        isClosed = false;
        break;
      }
    }
    
    const newState = isClosed ? 'closed' : 'open';
    if (newState === 'closed' && this.handState === 'open') {
      this.onHandClosed();
    }
    this.handState = newState;
  }
  
  onHandClosed() {
    // Pop a bubble!
    if (this.bubbles.length > 0) {
      // Find the largest or oldest bubble
      const popped = this.bubbles.shift();
      this.recordSuccess(100);
      this.score += 10;
      this.createParticles(popped.x, popped.y, popped.color);
    } else {
      this.recordFail();
    }
  }
  
  createParticles(x, y, color) {
    for(let i=0; i<15; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: color
      });
    }
  }

  update(deltaTime) {
    if (performance.now() - this.lastSpawn > this.spawnRate) {
      this.spawnBubble();
      this.lastSpawn = performance.now();
      this.spawnRate = Math.max(400, this.spawnRate - 10);
    }
    
    // Update bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y -= b.speed * (deltaTime / 16);
      b.x += Math.sin(b.y / 50) * 2; // wobble
      
      if (b.y + b.radius < 0) {
        this.bubbles.splice(i, 1);
        this.recordFail(); // missed bubble
      }
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
  
  spawnBubble() {
    const radius = 30 + Math.random() * 30;
    const colors = ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA'];
    this.bubbles.push({
      x: radius + Math.random() * (this.canvas.width - radius * 2),
      y: this.canvas.height + radius,
      radius: radius,
      speed: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  render() {
    // Draw hand state
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    this.ctx.font = '24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Hand: ${this.handState.toUpperCase()}`, this.canvas.width / 2, 80);
    
    // Draw bubbles
    for (const b of this.bubbles) {
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = b.color;
      this.ctx.fill();
      
      // Highlight
      this.ctx.beginPath();
      this.ctx.arc(b.x - b.radius*0.3, b.y - b.radius*0.3, b.radius*0.2, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
      this.ctx.fill();
    }
    
    // Draw particles
    for (const p of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, 4 * p.life, 0, Math.PI * 2);
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
    
    this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
    this.ctx.lineWidth = 3;
    
    for (const [start, end] of connections) {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      // Note: handTracking mapped x to (1-x)*width. 
      // Let's just use the direct raw landmarks.
      const x1 = (1 - p1.x) * this.canvas.width;
      const y1 = p1.y * this.canvas.height;
      const x2 = (1 - p2.x) * this.canvas.width;
      const y2 = p2.y * this.canvas.height;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
}
