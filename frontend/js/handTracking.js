export default class HandTracker {
  constructor(videoElement, canvasElement) {
    this.videoElement = videoElement || document.createElement('video');
    this.canvasElement = canvasElement;
    
    // Make sure video auto plays and is hidden if not attached
    this.videoElement.autoplay = true;
    this.videoElement.playsInline = true;
    
    this.position = null;
    this.isTrackingActive = false;
    this.callbacks = [];
    this.mouseFallbackEnabled = false;
    
    this.hands = null;
    this.camera = null;
    
    // Bind mouse events
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
  }

  async _loadScripts() {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js'
    ];
    
    for (const src of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.crossOrigin = 'anonymous';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
    }
  }

  async init() {
    try {
      await this._loadScripts();
      
      this.hands = new window.Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      this.hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.hands.onResults((results) => this._onResults(results));
      
      // Test camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoElement.srcObject = stream;
      
      this.camera = new window.Camera(this.videoElement, {
        onFrame: async () => {
          if (this.isTrackingActive) {
            await this.hands.send({image: this.videoElement});
          }
        },
        width: 640,
        height: 480
      });
      
      return true;
    } catch (error) {
      console.warn("Hand tracking initialization failed. Falling back to mouse.", error);
      this.enableMouseFallback();
      return false;
    }
  }

  start() {
    this.isTrackingActive = true;
    if (this.camera) {
      this.camera.start();
    }
  }

  stop() {
    this.isTrackingActive = false;
    if (this.camera) {
      this.camera.stop();
    }
  }

  _onResults(results) {
    if (this.mouseFallbackEnabled) return; // Ignore if mouse takes over
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      // Index finger tip is landmark 8
      const indexTip = landmarks[8];
      
      if (this.canvasElement) {
        const rect = this.canvasElement.getBoundingClientRect();
        // MediaPipe x is inverted usually, but we'll map directly for now
        // Assuming mirror mode: 1 - x
        this.position = {
          x: (1 - indexTip.x) * rect.width,
          y: indexTip.y * rect.height
        };
        
        this.landmarks = landmarks; // store for advanced games
        this._emitPosition();
        this._emitLandmarks();
      }
    } else {
      this.position = null;
      this.landmarks = null;
    }
  }
  
  getFingerPosition() {
    return this.position;
  }
  
  getLandmarks() {
    return this.landmarks;
  }
  
  isTracking() {
    return this.isTrackingActive;
  }
  
  onPositionUpdate(callback) {
    this.callbacks.push(callback);
  }

  onLandmarksUpdate(callback) {
    if (!this.landmarkCallbacks) this.landmarkCallbacks = [];
    this.landmarkCallbacks.push(callback);
  }
  
  _emitPosition() {
    if (this.position) {
      this.callbacks.forEach(cb => cb(this.position.x, this.position.y));
    }
  }

  _emitLandmarks() {
    if (this.landmarks && this.landmarkCallbacks) {
      this.landmarkCallbacks.forEach(cb => cb(this.landmarks));
    }
  }
  
  enableMouseFallback() {
    if (this.mouseFallbackEnabled) return;
    this.mouseFallbackEnabled = true;
    
    if (this.canvasElement) {
      this.canvasElement.addEventListener('mousemove', this._handleMouseMove);
      this.canvasElement.addEventListener('touchmove', this._handleTouchMove, { passive: false });
    }
  }
  
  _handleMouseMove(e) {
    if (!this.isTrackingActive) return;
    const rect = this.canvasElement.getBoundingClientRect();
    this.position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    this._emitPosition();
  }
  
  _handleTouchMove(e) {
    if (!this.isTrackingActive) return;
    e.preventDefault();
    if (e.touches.length > 0) {
      const rect = this.canvasElement.getBoundingClientRect();
      this.position = {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
      this._emitPosition();
    }
  }
  
  destroy() {
    this.stop();
    if (this.hands) {
      this.hands.close();
    }
    if (this.canvasElement) {
      this.canvasElement.removeEventListener('mousemove', this._handleMouseMove);
      this.canvasElement.removeEventListener('touchmove', this._handleTouchMove);
    }
    if (this.videoElement && this.videoElement.srcObject) {
      this.videoElement.srcObject.getTracks().forEach(track => track.stop());
    }
  }
}
