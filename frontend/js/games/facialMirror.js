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
    this.symmetryScore = 0; // Live expression symmetry percentage (0 when neutral/inactive)
    this.expressionIntensity = 0; // 0.0 to 1.0
    this.isExpressionActive = false;
    this.holdTimer = 0;
    this.requiredHoldTime = 2.0; // seconds to maintain active expression
    this.audioCtx = null;
    this.particles = [];

    // Face mesh tracking state
    this.faceMesh = null;
    this.faceLandmarks = null;
    this.baselineMetrics = null;
    this.isModelLoaded = false;
    this.activeFrames = 0;
    this.validExpressionFrames = 0;
    
    // Optical motion analysis fallback buffer
    this.prevFrameData = null;
    this.opticalActivity = 0;
  }

  async _loadFaceMeshScripts() {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'
    ];
    for (const src of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = src;
          script.crossOrigin = 'anonymous';
          script.onload = resolve;
          script.onerror = () => {
            console.warn('FaceMesh script load error:', src);
            resolve();
          };
          document.head.appendChild(script);
        });
      }
    }
  }

  async init() {
    await super.init();
    this.symmetryScore = 0;
    this.holdTimer = 0;
    this.validExpressionFrames = 0;
    this.activeFrames = 0;

    try {
      await this._loadFaceMeshScripts();
      if (window.FaceMesh) {
        this.faceMesh = new window.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });
        this.faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        this.faceMesh.onResults((results) => {
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            this.faceLandmarks = results.multiFaceLandmarks[0];
          } else {
            this.faceLandmarks = null;
          }
        });
        this.isModelLoaded = true;
      }
    } catch (e) {
      console.warn('Facial Mirror FaceMesh init warning:', e);
    }
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

  evaluateFacialExpression() {
    const currentEx = this.exercises[this.currentExIndex];
    let active = false;
    let symmetry = 0;
    let intensity = 0;

    const video = this.tracker?.videoElement;

    // 1. Evaluate with 468 MediaPipe Face Landmarks if available
    if (this.faceLandmarks && this.faceLandmarks.length >= 468) {
      const lm = this.faceLandmarks;
      
      // Face geometry references
      const noseTip = lm[1];
      const leftCheek = lm[234];
      const rightCheek = lm[454];
      const faceWidth = Math.max(0.01, Math.hypot(rightCheek.x - leftCheek.x, rightCheek.y - leftCheek.y));

      const leftMouth = lm[61];
      const rightMouth = lm[291];
      const upperLip = lm[13];
      const lowerLip = lm[14];

      const leftBrow = lm[70];
      const rightBrow = lm[300];
      const leftEye = lm[159];
      const rightEye = lm[386];

      const mouthWidthNorm = Math.hypot(rightMouth.x - leftMouth.x, rightMouth.y - leftMouth.y) / faceWidth;
      const mouthHeightNorm = Math.hypot(lowerLip.x - upperLip.x, lowerLip.y - upperLip.y) / faceWidth;

      const leftBrowDist = Math.hypot(leftBrow.x - leftEye.x, leftBrow.y - leftEye.y) / faceWidth;
      const rightBrowDist = Math.hypot(rightBrow.x - rightEye.x, rightBrow.y - rightEye.y) / faceWidth;

      const leftCornerElev = (noseTip.y - leftMouth.y) / faceWidth;
      const rightCornerElev = (noseTip.y - rightMouth.y) / faceWidth;

      if (currentEx.id === 'smile') {
        // Wide mouth extension + upward corners
        // Neutral mouth width is ~0.35-0.42; Smile is > 0.46
        const smileWidthRatio = (mouthWidthNorm - 0.38) / 0.14;
        const cornerRise = (leftCornerElev + rightCornerElev) / 2;
        intensity = Math.max(0, Math.min(1.0, smileWidthRatio * 0.7 + cornerRise * 1.5));

        if (intensity >= 0.45) {
          active = true;
          // Bilateral corner symmetry
          const diff = Math.abs(leftCornerElev - rightCornerElev);
          symmetry = Math.max(50, Math.round(100 - (diff * 220)));
        }
      } else if (currentEx.id === 'eyebrows') {
        // Eyebrow elevation above eyes (resting ~0.15-0.18; raised > 0.22)
        const avgBrowHeight = (leftBrowDist + rightBrowDist) / 2;
        const browLift = (avgBrowHeight - 0.17) / 0.08;
        intensity = Math.max(0, Math.min(1.0, browLift));

        if (intensity >= 0.45) {
          active = true;
          const browDiff = Math.abs(leftBrowDist - rightBrowDist);
          symmetry = Math.max(50, Math.round(100 - (browDiff * 300)));
        }
      } else if (currentEx.id === 'pucker') {
        // Lip pucker: mouth width contracts below resting baseline into a tight 'O'
        const puckerContract = (0.36 - mouthWidthNorm) / 0.12;
        intensity = Math.max(0, Math.min(1.0, puckerContract * 0.8 + (mouthHeightNorm / 0.1) * 0.4));

        if (intensity >= 0.45) {
          active = true;
          const centerAlign = Math.abs((leftMouth.x + rightMouth.x) / 2 - noseTip.x);
          symmetry = Math.max(50, Math.round(100 - (centerAlign * 400)));
        }
      } else if (currentEx.id === 'cheeks') {
        // Cheek puff: facial lateral displacement / tension
        const cheekWidthRatio = (faceWidth - 0.32) / 0.10;
        intensity = Math.max(0, Math.min(1.0, cheekWidthRatio * 0.7 + (1 - mouthHeightNorm) * 0.3));

        if (intensity >= 0.45) {
          active = true;
          const cheekBalance = Math.abs((leftCheek.y - rightCheek.y));
          symmetry = Math.max(50, Math.round(100 - (cheekBalance * 300)));
        }
      }
    } else if (video && video.readyState >= 2) {
      // 2. Optical Vision Fallback (Real-time dynamic ROI motion & facial change detection)
      try {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = 120;
        offCanvas.height = 90;
        const offCtx = offCanvas.getContext('2d');
        offCtx.drawImage(video, 0, 0, 120, 90);
        const currData = offCtx.getImageData(0, 0, 120, 90).data;

        if (this.prevFrameData) {
          let diffSum = 0;
          let changedPixels = 0;
          for (let i = 0; i < currData.length; i += 16) {
            const d = Math.abs(currData[i] - this.prevFrameData[i]) +
                      Math.abs(currData[i+1] - this.prevFrameData[i+1]) +
                      Math.abs(currData[i+2] - this.prevFrameData[i+2]);
            if (d > 45) {
              diffSum += d;
              changedPixels++;
            }
          }
          this.opticalActivity = changedPixels / (currData.length / 16);
          intensity = Math.min(1.0, this.opticalActivity * 8.0);
          
          // Require noticeable facial movement/expression engagement to activate
          if (this.opticalActivity > 0.08) {
            active = true;
            symmetry = Math.min(95, Math.max(65, Math.round(75 + this.opticalActivity * 120)));
          }
        }
        this.prevFrameData = currData;
      } catch(e) {}
    }

    return { active, symmetry: Math.min(100, Math.max(0, symmetry)), intensity };
  }

  update(deltaTime) {
    const dt = deltaTime / 1000;
    this.activeFrames++;

    // Send video frame to FaceMesh model if active
    const video = this.tracker?.videoElement;
    if (this.faceMesh && video && video.readyState >= 2) {
      try {
        this.faceMesh.send({ image: video });
      } catch(e) {}
    }

    const { active, symmetry, intensity } = this.evaluateFacialExpression();
    this.isExpressionActive = active;
    this.expressionIntensity = intensity;

    if (active && symmetry > 0) {
      // User is actively keeping the facial expression!
      this.validExpressionFrames++;
      this.symmetryScore += (symmetry - this.symmetryScore) * 0.15;
      this.holdTimer += dt;
      if (Math.random() > 0.96) this.playHoldBeep();

      if (this.holdTimer >= this.requiredHoldTime) {
        this.triggerExerciseSuccess();
      }
    } else {
      // User is resting or not performing the expression: reset/decay symmetry and hold timer
      this.symmetryScore = Math.max(0, this.symmetryScore - 4.0);
      this.holdTimer = Math.max(0, this.holdTimer - dt * 2.0);
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

  getAccuracy() {
    if (this.activeFrames === 0) return 0;
    // Real accuracy reflects the ratio of frames spent actively performing expressions
    const ratioPct = (this.validExpressionFrames / this.activeFrames) * 100;
    return Math.min(100, Math.round(ratioPct));
  }

  render() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cx = w / 2;
    const cy = h / 2 + 20;
    const video = this.tracker?.videoElement;

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

    // Render Live Camera Feed Inside Center Mirror Oval
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, 145, 185, 0, 0, Math.PI * 2);
    ctx.clip();

    if (video && video.readyState >= 2) {
      ctx.save();
      ctx.translate(cx + 145, cy - 185);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, 290, 370);
      ctx.restore();
      // Slight biofeedback tint
      ctx.fillStyle = this.isExpressionActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(15, 23, 42, 0.25)';
      ctx.fillRect(cx - 145, cy - 185, 290, 370);
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(cx - 145, cy - 185, 290, 370);
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentEx.icon, cx, cy);
    }
    ctx.restore();

    // Oval Mirror Frame Border
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, 145, 185, 0, 0, Math.PI * 2);
    ctx.strokeStyle = this.isExpressionActive ? '#10b981' : currentEx.color;
    ctx.lineWidth = 4;
    ctx.shadowColor = this.isExpressionActive ? '#10b981' : currentEx.color;
    ctx.shadowBlur = this.isExpressionActive ? 25 : 10;
    ctx.stroke();

    // Central Vertical Symmetry Guideline
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 175);
    ctx.lineTo(cx, cy + 175);
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
    ctx.strokeStyle = this.isExpressionActive ? '#10b981' : '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 85);
    ctx.quadraticCurveTo(cx, cy + 105, cx + 50, cy + 85);
    ctx.stroke();
    ctx.restore();

    // Hold Progress Circular Ring
    ctx.save();
    const progress = Math.min(1.0, this.holdTimer / this.requiredHoldTime);
    ctx.beginPath();
    ctx.arc(cx, cy, 200, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
    ctx.strokeStyle = this.isExpressionActive ? '#10b981' : '#6b7280';
    ctx.lineWidth = 10;
    ctx.shadowColor = this.isExpressionActive ? '#10b981' : 'transparent';
    ctx.shadowBlur = 15;
    ctx.stroke();

    // Live Biofeedback Status Indicator
    const symVal = Math.round(this.symmetryScore);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.roundRect(cx - 150, cy + 205, 300, 48, 12);
    ctx.fill();
    ctx.strokeStyle = this.isExpressionActive ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = this.isExpressionActive ? '#10b981' : '#fbbf24';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    if (this.isExpressionActive) {
      ctx.fillText(`Symmetry: ${symVal}% (Holding: ${(this.holdTimer).toFixed(1)}s / ${this.requiredHoldTime}s)`, cx, cy + 235);
    } else {
      ctx.fillText(`⚠️ Perform & Hold: ${currentEx.name}`, cx, cy + 235);
    }
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
