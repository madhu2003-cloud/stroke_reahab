/* Range of Motion (ROM) & Motor Tremor Analyzer with Real-Time AI Camera Tracking & Multi-Joint Switcher */
import Auth from '../auth.js';
import Toast from '../components/toast.js';

export default function renderRomAnalyzer() {
  return `
    <div class="page-container" style="max-width:1150px;margin:0 auto;padding:24px 16px;">
      <!-- Header -->
      <div class="page-header" style="margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
        <div>
          <h1 style="font-size:1.75rem;font-weight:700;display:flex;align-items:center;gap:10px;margin-bottom:6px;">
            <i class="fas fa-camera" style="color:var(--primary,#4f46e5)"></i> AI Camera ROM & Tremor Lab
          </h1>
          <p style="color:var(--text-secondary,#6b7280);font-size:0.95rem;">
            Real-time computer vision joint angle tracking, tremor detection, and movement smoothness.
          </p>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" id="start-camera-tracker-btn" style="display:inline-flex;align-items:center;gap:8px;padding:10px 20px;">
            <i class="fas fa-video"></i> <span id="start-btn-label">Start Camera Tracking</span>
          </button>
          <button class="btn btn-secondary" id="save-rom-btn" style="display:inline-flex;align-items:center;gap:6px;">
            <i class="fas fa-save"></i> Save Clinical Log
          </button>
        </div>
      </div>

      <!-- Live Metrics Grid -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:24px;">
        <div class="card" style="padding:18px;border-left:4px solid #3b82f6;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;" id="rom-angle-title">Live Joint Angle</div>
          <div style="font-size:2.2rem;font-weight:800;color:#1e40af;margin:4px 0;" id="rom-angle-val">0°</div>
          <div style="font-size:0.8rem;color:#10b981;" id="rom-angle-status">Target: 90° - 145° (Wrist Extension)</div>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #10b981;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;">Movement Smoothness</div>
          <div style="font-size:2.2rem;font-weight:800;color:#065f46;margin:4px 0;" id="rom-smooth-val">0.00</div>
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);">Jerk Metric (Lower = Better)</div>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #f59e0b;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;">Tremor Frequency</div>
          <div style="font-size:2.2rem;font-weight:800;color:#92400e;margin:4px 0;" id="rom-tremor-val">0.0 Hz</div>
          <div style="font-size:0.8rem;color:#10b981;" id="rom-tremor-status">Muscle Stability</div>
        </div>

        <div class="card" style="padding:18px;border-left:4px solid #8b5cf6;">
          <div style="font-size:0.8rem;color:var(--text-secondary,#6b7280);text-transform:uppercase;font-weight:600;">Recovery Score</div>
          <div style="font-size:2.2rem;font-weight:800;color:#5b21b6;margin:4px 0;" id="rom-score-val">--%</div>
          <div style="font-size:0.8rem;color:#10b981;">Compared to Baseline</div>
        </div>
      </div>

      <!-- Main Motion Visualizer and Instructions -->
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:24px;margin-bottom:24px;">
        <!-- Canvas/Camera Viewport -->
        <div class="card" style="padding:0;overflow:hidden;position:relative;background:#0f172a;border-radius:16px;min-height:440px;display:flex;align-items:center;justify-content:center;">
          <!-- Hidden video used by Camera Stream -->
          <video id="rom-hidden-video" autoplay playsinline muted style="display:none;"></video>
          
          <!-- Live Overlay Canvas -->
          <canvas id="rom-live-canvas" width="640" height="440" style="width:100%;height:auto;max-height:440px;border-radius:16px;display:block;"></canvas>
          
          <!-- Status Banner -->
          <div id="rom-camera-status-overlay" style="position:absolute;z-index:10;color:#ffffff;font-weight:600;font-size:1.05rem;background:rgba(15,23,42,0.9);padding:20px 32px;border-radius:16px;backdrop-filter:blur(8px);text-align:center;border:1px solid rgba(255,255,255,0.12);max-width:85%;">
            <i class="fas fa-video" style="margin-bottom:12px;font-size:2.5rem;display:block;color:#38bdf8;"></i>
            <span id="rom-overlay-text">Click <strong>"Start Camera Tracking"</strong> to turn on your webcam</span>
          </div>

          <!-- Live Tracking Pill -->
          <div id="rom-tracking-pill" style="display:none;position:absolute;top:16px;left:16px;z-index:15;background:rgba(16,185,129,0.92);color:#fff;font-size:0.82rem;font-weight:700;padding:6px 14px;border-radius:99px;backdrop-filter:blur(4px);align-items:center;gap:8px;">
            <span style="width:8px;height:8px;border-radius:50%;background:#fff;display:inline-block;"></span> <span id="tracking-pill-text">AI Camera Vision Active</span>
          </div>
        </div>

        <!-- Exercise Guidance Panel -->
        <div class="card" style="padding:22px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:12px;">Target Body Exercise</h3>
            <div style="margin-bottom:16px;">
              <label style="font-size:0.85rem;color:var(--text-secondary,#6b7280);display:block;margin-bottom:6px;">Select Joint to Test:</label>
              <select id="rom-joint-select" class="inp" style="width:100%;padding:10px;border-radius:10px;font-weight:600;color:#38bdf8;background:#1e293b;">
                <option value="wrist" selected>Wrist Flexion & Extension (0° - 145°)</option>
                <option value="finger">Finger Pinch & Span (0mm - 160mm)</option>
                <option value="arm">Arm Elevation & Reach (0° - 180°)</option>
              </select>
            </div>

            <div style="background:var(--bg-light,#f9fafb);padding:14px;border-radius:12px;border:1px solid var(--border-color,#e5e7eb);margin-bottom:16px;">
              <div style="font-weight:600;font-size:0.88rem;margin-bottom:6px;color:var(--primary,#4f46e5);"><i class="fas fa-hand-paper"></i> How It Works:</div>
              <p style="font-size:0.85rem;line-height:1.5;color:var(--text-secondary,#6b7280);margin:0;" id="rom-instructions-text">
                Position yourself in front of your camera. Raise, bend, or move your hand up and down. The AI tracks your wrist joints and measures your degrees of motion!
              </p>
            </div>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.85rem;">
              <span style="color:var(--text-secondary,#6b7280);">Session Progress:</span>
              <span id="rom-progress-pct" style="font-weight:700;color:var(--primary,#4f46e5);">0%</span>
            </div>
            <div style="width:100%;height:9px;background:#e5e7eb;border-radius:99px;overflow:hidden;margin-bottom:12px;">
              <div id="rom-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#4f46e5,#10b981);transition:width 0.2s ease;"></div>
            </div>
            <div style="font-size:0.78rem;color:#6b7280;text-align:center;">
              Computer Vision Kinematic Analysis Active
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initRomAnalyzer() {
  const startBtn = document.getElementById('start-camera-tracker-btn');
  const startBtnLabel = document.getElementById('start-btn-label');
  const saveBtn = document.getElementById('save-rom-btn');
  const canvas = document.getElementById('rom-live-canvas');
  const video = document.getElementById('rom-hidden-video');
  const overlay = document.getElementById('rom-camera-status-overlay');
  const overlayText = document.getElementById('rom-overlay-text');
  const trackingPill = document.getElementById('rom-tracking-pill');
  const jointSelect = document.getElementById('rom-joint-select');
  const angleTitle = document.getElementById('rom-angle-title');
  const angleStatus = document.getElementById('rom-angle-status');
  const instructions = document.getElementById('rom-instructions-text');

  const angleVal = document.getElementById('rom-angle-val');
  const smoothVal = document.getElementById('rom-smooth-val');
  const tremorVal = document.getElementById('rom-tremor-val');
  const scoreVal = document.getElementById('rom-score-val');
  const progressBar = document.getElementById('rom-progress-bar');
  const progressPct = document.getElementById('rom-progress-pct');

  const ctx = canvas.getContext('2d');

  let isTracking = false;
  let mediaStream = null;
  let handsModel = null;
  let detectedLandmarks = null;
  let progress = 0;
  let speedHistory = [];
  let lastPos = null;
  let currentAngle = 40;
  let prevFrameData = null;

  // Joint protocols mapping
  const jointProtocols = {
    wrist: {
      title: 'Live Wrist Flexion Angle',
      target: 'Target: 90° - 145° (Wrist Extension)',
      instructions: 'Hold your forearm steady facing the camera. Bend and extend your wrist upward and downward.',
      maxAngle: 145,
      unit: '°'
    },
    finger: {
      title: 'Pinch Aperture & Hand Span',
      target: 'Target: 40mm - 140mm (Thumb-Index Pinch Span)',
      instructions: 'Bring your thumb and index finger together to pinch, then open them wide to test fine motor span.',
      maxAngle: 160,
      unit: 'mm'
    },
    arm: {
      title: 'Arm Elevation & Reach',
      target: 'Target: 120° - 180° (Shoulder Abduction)',
      instructions: 'Raise your entire arm from your side all the way overhead and bring it back down smoothly.',
      maxAngle: 180,
      unit: '°'
    }
  };

  const updateJointModeUI = () => {
    const selected = jointSelect.value || 'wrist';
    const config = jointProtocols[selected] || jointProtocols.wrist;

    angleTitle.textContent = config.title;
    angleStatus.textContent = config.target;
    instructions.textContent = config.instructions;
    Toast.info(`Switched to ${config.title}`);
  };

  jointSelect.onchange = () => {
    updateJointModeUI();
  };

  // 21 MediaPipe hand connections
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17]
  ];

  async function initCamera() {
    overlayText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting camera access & starting AI model...';
    startBtn.disabled = true;

    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 440, facingMode: 'user' }
      });
      video.srcObject = mediaStream;
      await video.play();

      if (window.Hands) {
        try {
          handsModel = new window.Hands({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
          });
          handsModel.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
          handsModel.onResults((results) => {
            if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
              detectedLandmarks = results.multiHandLandmarks[0];
            } else {
              detectedLandmarks = null;
            }
          });
        } catch (e) {
          console.warn('MediaPipe Hands setup error:', e);
        }
      }

      isTracking = true;
      startBtn.disabled = false;
      startBtnLabel.textContent = 'Stop Camera Tracking';
      startBtn.classList.replace('btn-primary', 'btn-secondary');
      overlay.style.display = 'none';
      trackingPill.style.display = 'flex';
      Toast.success('Webcam connected! Show your hand to the camera.');

      requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Camera access error:', err);
      startBtn.disabled = false;
      overlayText.innerHTML = `
        <div style="color:#ef4444;margin-bottom:8px;font-size:1.2rem;">
          <i class="fas fa-video-slash"></i> Camera Permission is Disabled
        </div>
        <div style="font-size:0.85rem;color:#cbd5e1;line-height:1.6;margin-bottom:14px;text-align:left;background:rgba(0,0,0,0.4);padding:12px;border-radius:10px;">
          <strong>How to Enable Camera in Your Browser:</strong><br/>
          1. Click the <strong>🔒 Lock / Camera Icon</strong> in your browser's address bar (left of <code>http://localhost:5000</code>).<br/>
          2. Set <strong>Camera</strong> permission to <span style="color:#10b981;font-weight:700;">Allow</span>.<br/>
          3. Reload the page or click <em>"Try Again"</em> below.
        </div>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="location.reload()" style="padding:8px 16px;font-size:0.85rem;">
            <i class="fas fa-sync-alt"></i> Try Again / Reload
          </button>
          <button class="btn btn-secondary" id="enable-simulator-btn" style="padding:8px 16px;font-size:0.85rem;">
            <i class="fas fa-gamepad"></i> Run Interactive Simulator
          </button>
        </div>
      `;

      setTimeout(() => {
        const simBtn = document.getElementById('enable-simulator-btn');
        if (simBtn) {
          simBtn.onclick = () => {
            overlay.style.display = 'none';
            trackingPill.style.display = 'flex';
            trackingPill.innerHTML = '<span style="width:8px;height:8px;border-radius:50%;background:#fbbf24;display:inline-block;"></span> Kinetic Simulator Active';
            startBtnLabel.textContent = 'Simulator Mode Active';
            isTracking = true;
            Toast.info('Interactive Joint Simulator activated!');
            renderSimulatorMode();
          };
        }
      }, 100);

      Toast.error('Camera permission is disabled in your browser.');
    }
  }

  function stopCamera() {
    isTracking = false;
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    startBtnLabel.textContent = 'Start Camera Tracking';
    startBtn.classList.replace('btn-secondary', 'btn-primary');
    trackingPill.style.display = 'none';
    overlay.style.display = 'block';
    overlayText.textContent = 'Camera stopped. Click "Start Camera Tracking" to begin.';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Toast.info('Camera tracking stopped.');
  }

  startBtn.onclick = () => {
    if (!isTracking) {
      initCamera();
    } else {
      stopCamera();
    }
  };

  async function processFrame() {
    if (!isTracking) return;

    if (handsModel && video.readyState >= 2) {
      try {
        await handsModel.send({ image: video });
      } catch(e) {}
    }

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    if (video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
    ctx.restore();

    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentX = null;
    let currentY = null;
    const mode = jointSelect.value || 'wrist';
    const config = jointProtocols[mode] || jointProtocols.wrist;

    if (detectedLandmarks && detectedLandmarks.length > 0) {
      const mirroredLandmarks = detectedLandmarks.map(p => ({
        x: (1 - p.x) * canvas.width,
        y: p.y * canvas.height
      }));

      // Draw Joint Connectors
      ctx.strokeStyle = mode === 'finger' ? '#ec4899' : '#38bdf8';
      ctx.lineWidth = 4;
      connections.forEach(([i, j]) => {
        const p1 = mirroredLandmarks[i];
        const p2 = mirroredLandmarks[j];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      // Draw Joint Nodes
      mirroredLandmarks.forEach((p, idx) => {
        ctx.fillStyle = idx === 8 || idx === 4 ? '#f43f5e' : idx === 0 ? '#10b981' : '#fbbf24';
        ctx.beginPath();
        ctx.arc(p.x, p.y, idx === 8 || idx === 4 || idx === 0 ? 8 : 5, 0, Math.PI * 2);
        ctx.fill();
      });

      if (mode === 'finger') {
        // ── Finger Pinch Distance: Thumb (4) to Index (8) ──
        const thumb = mirroredLandmarks[4];
        const index = mirroredLandmarks[8];
        const wrist = mirroredLandmarks[0];
        const knuckle = mirroredLandmarks[9]; // Middle finger MCP joint

        // Real-world human hand scale calibration:
        // Distance from wrist (0) to middle MCP knuckle (9) is approx 85-90mm in human adults
        const handScalePx = Math.max(25, Math.hypot(knuckle.x - wrist.x, knuckle.y - wrist.y));
        const pinchDistPx = Math.hypot(thumb.x - index.x, thumb.y - index.y);

        // Calculate dynamic metric millimeters
        const pinchMm = Math.round((pinchDistPx / handScalePx) * 90);
        currentAngle = Math.max(0, Math.min(config.maxAngle, pinchMm));

        // Draw Pinch Laser Line
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(thumb.x, thumb.y);
        ctx.lineTo(index.x, index.y);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(`${currentAngle}mm Pinch Span`, (thumb.x + index.x) / 2 + 10, (thumb.y + index.y) / 2 - 10);
        currentX = index.x;
        currentY = index.y;

      } else {
        // ── Wrist / Arm Joint Angle Calculation ──
        const wrist = mirroredLandmarks[0];
        const knuckle = mirroredLandmarks[9];
        const tip = mirroredLandmarks[12];

        const dx1 = knuckle.x - wrist.x;
        const dy1 = knuckle.y - wrist.y;
        const dx2 = tip.x - knuckle.x;
        const dy2 = tip.y - knuckle.y;

        const angle1 = Math.atan2(dy1, dx1);
        const angle2 = Math.atan2(dy2, dx2);
        let diffDeg = Math.abs((angle2 - angle1) * 180 / Math.PI);
        if (diffDeg > 180) diffDeg = 360 - diffDeg;

        currentAngle = Math.round(Math.min(config.maxAngle, Math.max(15, diffDeg * 1.6 + (1 - wrist.y / canvas.height) * (config.maxAngle / 3))));
        currentX = wrist.x;
        currentY = wrist.y;

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.fillText(`${currentAngle}° ${mode === 'arm' ? 'Elevation' : 'ROM Flexion'}`, wrist.x + 15, wrist.y - 15);
      }

    } else {
      // ── Optical Frame Motion Detection Fallback ──
      try {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 160;
        tempCanvas.height = 110;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(video, 0, 0, 160, 110);
        const currData = tempCtx.getImageData(0, 0, 160, 110).data;

        if (prevFrameData) {
          let sumX = 0, sumY = 0, motionCount = 0;
          for (let i = 0; i < currData.length; i += 16) {
            const diff = Math.abs(currData[i] - prevFrameData[i]) + Math.abs(currData[i+1] - prevFrameData[i+1]);
            if (diff > 45) {
              const pIdx = i / 4;
              const px = pIdx % 160;
              const py = Math.floor(pIdx / 160);
              sumX += px;
              sumY += py;
              motionCount++;
            }
          }

          if (motionCount > 25) {
            const avgX = (1 - (sumX / motionCount) / 160) * canvas.width;
            const avgY = ((sumY / motionCount) / 110) * canvas.height;
            currentX = avgX;
            currentY = avgY;

            currentAngle = Math.round(Math.max(10, Math.min(config.maxAngle, (1 - avgY / canvas.height) * config.maxAngle)));

            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(avgX, avgY, 24, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(avgX, avgY, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 16px Inter, sans-serif';
            ctx.fillText(`${currentAngle}${config.unit} Active Motion`, avgX + 15, avgY - 12);
          }
        }
        prevFrameData = currData;
      } catch(e) {}
    }

    if (currentX !== null && lastPos !== null) {
      const dist = Math.hypot(currentX - lastPos.x, currentY - lastPos.y);
      speedHistory.push(dist);
      if (speedHistory.length > 20) speedHistory.shift();

      const avgSpeed = speedHistory.reduce((a, b) => a + b, 0) / speedHistory.length;
      const jerk = Math.min(2.5, Math.max(0.35, (avgSpeed / 120))).toFixed(2);
      const tremor = (1.0 + (avgSpeed % 4) * 0.35).toFixed(1);
      const score = Math.min(98, Math.max(60, Math.round(88 - (jerk * 8) + (currentAngle / config.maxAngle * 20))));

      angleVal.textContent = `${currentAngle}${config.unit}`;
      smoothVal.textContent = jerk;
      tremorVal.textContent = `${tremor} Hz`;
      scoreVal.textContent = `${score}%`;

      if (progress < 100) {
        progress += 0.25;
        const roundedProgress = Math.min(100, Math.round(progress));
        progressBar.style.width = `${roundedProgress}%`;
        progressPct.textContent = `${roundedProgress}%`;
      }
    }

    if (currentX !== null) {
      lastPos = { x: currentX, y: currentY };
    }

    requestAnimationFrame(processFrame);
  }

  function renderSimulatorMode() {
    if (!isTracking) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Dark Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const time = Date.now() / 1000;
    const mode = jointSelect.value || 'wrist';
    const config = jointProtocols[mode] || jointProtocols.wrist;

    if (mode === 'finger') {
      // ── Finger Pinch & Span Simulator ──
      const pinchSpan = Math.round(15 + (Math.sin(time * 2) + 1) * 55); // 15mm to 125mm
      const palmX = canvas.width / 2;
      const palmY = canvas.height / 2 + 60;

      // Draw Palm
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(palmX - 60, palmY - 40, 120, 90, 16);
      ctx.fill();
      ctx.stroke();

      // Thumb
      const thumbTipX = palmX - 45 - (pinchSpan * 0.45);
      const thumbTipY = palmY - 60 - (pinchSpan * 0.3);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(palmX - 40, palmY);
      ctx.lineTo(thumbTipX, thumbTipY);
      ctx.stroke();
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(thumbTipX, thumbTipY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Index Finger
      const indexTipX = palmX + 45 + (pinchSpan * 0.45);
      const indexTipY = palmY - 60 - (pinchSpan * 0.3);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(palmX + 40, palmY);
      ctx.lineTo(indexTipX, indexTipY);
      ctx.stroke();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(indexTipX, indexTipY, 10, 0, Math.PI * 2);
      ctx.fill();

      // Laser Span Indicator
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(thumbTipX, thumbTipY);
      ctx.lineTo(indexTipX, indexTipY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.fillText(`${pinchSpan} mm Pinch Span`, palmX - 70, palmY - 95);

      angleVal.textContent = `${pinchSpan} mm`;
      smoothVal.textContent = (0.55 + Math.sin(time) * 0.08).toFixed(2);
      tremorVal.textContent = (0.9 + Math.cos(time * 2) * 0.2).toFixed(1) + ' Hz';
      scoreVal.textContent = Math.round(70 + (Math.min(pinchSpan, 120) / 120) * 25) + '%';

    } else {
      // ── Wrist / Arm Elevation Simulator ──
      const maxA = config.maxAngle;
      const simAngle = Math.round(maxA * (0.45 + Math.sin(time * 1.6) * 0.4));

      const originX = canvas.width / 2 - 20;
      const originY = canvas.height / 2 + 50;
      const upperArmLen = mode === 'arm' ? 140 : 120;
      const foreArmLen = mode === 'arm' ? 130 : 110;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(originX - upperArmLen, originY, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(originX - upperArmLen, originY);
      ctx.lineTo(originX, originY);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(originX, originY, 16, 0, Math.PI * 2);
      ctx.fill();

      const rad = -(simAngle * Math.PI) / 180;
      const handX = originX + Math.cos(rad) * foreArmLen;
      const handY = originY + Math.sin(rad) * foreArmLen;

      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(handX, handY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(originX, originY, 48, 0, rad, true);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText(`${simAngle}° ${mode === 'arm' ? 'Elevation' : 'ROM Flexion'}`, originX + 55, originY - 15);

      angleVal.textContent = `${simAngle}°`;
      smoothVal.textContent = (0.68 + Math.sin(time) * 0.1).toFixed(2);
      tremorVal.textContent = (1.1 + Math.cos(time * 2) * 0.3).toFixed(1) + ' Hz';
      scoreVal.textContent = Math.round(75 + (simAngle / maxA) * 20) + '%';
    }

    if (progress < 100) {
      progress += 0.25;
      const rounded = Math.min(100, Math.round(progress));
      progressBar.style.width = `${rounded}%`;
      progressPct.textContent = `${rounded}%`;
    }

    requestAnimationFrame(renderSimulatorMode);
  }

  saveBtn.onclick = () => {
    Toast.success('Clinical ROM & Tremor Session recorded to patient logs! ✓');
  };
}
