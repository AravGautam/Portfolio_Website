import * as THREE from 'three';

/**
 * AAA-Grade 3D Spatial Project Visualizer Scene
 * 
 * 1. 'neural' (AI-Powered Fitness Platform & ML Engine):
 *    - J.A.R.V.I.S. Iron Man Holographic Interface & Arc Reactor AI Core
 *    - Concentric Acoustic Voice Waves & Circular Speech Equalizer Ticks
 *    - Floating HUD Screens displaying Falling Matrix Codes & Streaming Tensors
 *    - Real-Time Biometric Telemetry: 360-degree Radar, Live ECG Heart Trace & Calorie Bars
 *    - Holographic Projection Conduits with Laser Rays and Energy Packet Stream
 * 
 * 2. 'chess' (Real-Time Online Chess Platform):
 *    - Authentic 8x8 tournament chessboard with beveled obsidian frame & bronze inlay
 *    - Full 3D sculpted chess pieces (King, Queen, Knight, Bishop, Rook, Pawns)
 *    - Authentic opening move execution (1. e4 e5, 2. Nf3 Nc6, 3. Bc4)
 *    - Single-piece physics with zero duplication + automatic graceful board reset
 * 
 * 3. 'network' (Full-Stack MERN Application Suite):
 *    - 3D M-E-R-N Emblems (MongoDB Leaf, Express Hex, React Atom, Node Hex)
 *    - Laser data conduits & cursor scatter physics
 */
export class ProjectVisualizerScene {
  constructor(container, initialVisualType = 'neural', renderer = null) {
    this.container = container;
    this.renderer = renderer;
    this.currentType = initialVisualType;
    this.targetType = initialVisualType;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;
    this.cubeFrameCounter = 0;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);

    this.cameraTargets = {
      neural: { pos: new THREE.Vector3(0, 0, 14.5), lookAt: new THREE.Vector3(0, 0, 0) },
      chess: { pos: new THREE.Vector3(0, 12, 16), lookAt: new THREE.Vector3(0, -0.2, 0) },
      network: { pos: new THREE.Vector3(0, 1.2, 18), lookAt: new THREE.Vector3(0, 0, 0) }
    };

    const initialCam = this.cameraTargets[initialVisualType] || this.cameraTargets.neural;
    this.camera.position.copy(initialCam.pos);
    this.currentLookAt = new THREE.Vector3().copy(initialCam.lookAt);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isHovered = false;
    this.time = 0;

    // Setup Clean Studio HDR Environment for Natural Glass Reflections
    this.scene.environment = this.generateStudioEnvironmentMap();

    // Natural Studio Lighting for realistic glass & brain rendering
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2); // Clean top key light
    dirLight1.position.set(8, 12, 10);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xb0d8ff, 1.4); // Subtle cool rim light
    dirLight2.position.set(-8, -4, -6);
    this.scene.add(dirLight2);

    const frontLight = new THREE.PointLight(0xfff7f0, 1.6, 35); // Warm fill light
    frontLight.position.set(0, 1.5, 10);
    this.scene.add(frontLight);

    this.groups = {};
    this.initAllScenes();
    this.bindEvents();
  }

  initAllScenes() {
    this.initAiNeuralScene();
    this.initChessScene();
    this.initMernScene();

    // Set initial visibility
    Object.keys(this.groups).forEach((key) => {
      const g = this.groups[key];
      const isCurrent = key === this.currentType;
      g.group.scale.setScalar(isCurrent ? 1 : 0.001);
      g.group.visible = isCurrent;
    });
  }

  // =========================================================================
  // 1. J.A.R.V.I.S. HOLOGRAPHIC AI INTERFACE & FLOATING DATA MATRIX HUD
  // =========================================================================
  createJarvisScreen(type, width, height, position, rotation) {
    const meshGroup = new THREE.Group();
    meshGroup.position.copy(position);
    meshGroup.rotation.copy(rotation);

    // High-resolution canvas for crisp text & telemetry graphics
    const canvas = document.createElement('canvas');
    if (type === 'banner') {
      canvas.width = 1024;
      canvas.height = 180;
    } else {
      canvas.width = 1024;
      canvas.height = 640;
    }
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Glass Display Panel
    const planeGeo = new THREE.PlaneGeometry(width, height);
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const screenMesh = new THREE.Mesh(planeGeo, planeMat);
    meshGroup.add(screenMesh);

    // Distinct Holographic Frame & Corner Brackets per screen type
    let frameColor = 0x00f0ff; // Laser Cyan
    let bracketColor = 0xffb703; // Stark Gold
    if (type === 'telemetry') {
      frameColor = 0xff3366; // Coral Red / Ruby
      bracketColor = 0x00f0ff; // Laser Cyan
    } else if (type === 'banner') {
      frameColor = 0xffb703; // Stark Gold
      bracketColor = 0x38bdf8; // Sky Blue
    }

    const frameGeo = new THREE.EdgesGeometry(planeGeo);
    const frameMat = new THREE.LineBasicMaterial({
      color: frameColor,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const frameLines = new THREE.LineSegments(frameGeo, frameMat);
    meshGroup.add(frameLines);

    // 4 Corner Brackets
    const bracketSize = 0.22;
    const halfW = width / 2;
    const halfH = height / 2;
    const bracketPoints = [
      // Top-Left
      -halfW, halfH - bracketSize, 0.01, -halfW, halfH, 0.01,
      -halfW, halfH, 0.01, -halfW + bracketSize, halfH, 0.01,
      // Top-Right
      halfW - bracketSize, halfH, 0.01, halfW, halfH, 0.01,
      halfW, halfH, 0.01, halfW, halfH - bracketSize, 0.01,
      // Bottom-Left
      -halfW, -halfH + bracketSize, 0.01, -halfW, -halfH, 0.01,
      -halfW, -halfH, 0.01, -halfW + bracketSize, -halfH, 0.01,
      // Bottom-Right
      halfW - bracketSize, -halfH, 0.01, halfW, -halfH, 0.01,
      halfW, -halfH, 0.01, halfW, -halfH + bracketSize, 0.01,
    ];
    const bracketGeo = new THREE.BufferGeometry();
    bracketGeo.setAttribute('position', new THREE.Float32BufferAttribute(bracketPoints, 3));
    const bracketMat = new THREE.LineBasicMaterial({
      color: bracketColor,
      transparent: true,
      opacity: 0.95
    });
    const bracketsMesh = new THREE.LineSegments(bracketGeo, bracketMat);
    meshGroup.add(bracketsMesh);

    // State for matrix rain
    const state = {
      matrixCols: [],
      radarAngle: 0,
    };

    if (type === 'matrix') {
      const colCount = 12;
      for (let c = 0; c < colCount; c++) {
        state.matrixCols.push({
          x: 32 + c * 32,
          y: Math.random() * 500,
          speed: 120 + Math.random() * 140,
        });
      }
    }

    return {
      type,
      width,
      height,
      basePos: position.clone(),
      baseRot: rotation.clone(),
      meshGroup,
      screenMesh,
      canvas,
      ctx,
      texture,
      state
    };
  }

  drawJarvisMatrixCanvas(screen, time, isHovered) {
    const { ctx, canvas, state } = screen;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Holographic Glass Tint
    ctx.fillStyle = 'rgba(4, 10, 22, 0.92)';
    ctx.fillRect(0, 0, w, h);

    // Outer Cybernetic Border
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Header HUD Strip in Stark Gold & Cyan
    ctx.fillStyle = 'rgba(255, 183, 3, 0.12)';
    ctx.fillRect(10, 10, w - 20, 56);
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, 56);

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('STARK INDUSTRIES // J.A.R.V.I.S. v4.2', 26, 46);

    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('[NEURAL MATRIX // 92.4% ACC]', w - 275, 46);

    // Sub-header title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('NEURAL FITNESS TELEMETRY & TENSOR MATRIX', 26, 96);

    // Dividing Grid
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(430, 80);
    ctx.lineTo(430, h - 20);
    ctx.stroke();

    // 1. Matrix Code Rain Stream (Left Half - Authentic Matrix Emerald Green & White)
    const tokens = ['0x7F', '0x4C', '0xA1', '0x9E', '0x22', '0xFF', '1011', '0x03', '0x88', 'EP:92', 'V8', 'ML', '0xBC', '0x10', '0xAA'];
    ctx.font = '13px monospace';
    const speedMult = isHovered ? 1.8 : 1.0;

    state.matrixCols.forEach((col, colIdx) => {
      col.y += 0.85 * speedMult;
      if (col.y > h - 40) col.y = 110;

      for (let i = 0; i < 9; i++) {
        const charY = col.y - i * 22;
        if (charY < 100 || charY > h - 30) continue;

        const token = tokens[(colIdx * 3 + i + Math.floor(time * 4)) % tokens.length];
        if (i === 0) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00ffaa';
          ctx.shadowBlur = 10;
        } else if (i < 3) {
          ctx.fillStyle = '#00ffaa';
          ctx.shadowBlur = 0;
        } else if ((colIdx + i) % 7 === 0) {
          ctx.fillStyle = '#ffd166'; // Cyber gold token
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = 'rgba(0, 255, 128, ' + (1 - i / 10) + ')';
          ctx.shadowBlur = 0;
        }
        ctx.fillText(token, col.x, charY);
      }
    });
    ctx.shadowBlur = 0;

    // 2. Neural Fitness Telemetry Cards (Right Half)
    const rx = 460;
    let ry = 110;

    // Card 1: Machine Learning Core
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(rx, ry, w - rx - 26, 150);
    ctx.strokeRect(rx, ry, w - rx - 26, 150);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('CORE MODEL: RANDOM FOREST REGRESSOR', rx + 16, ry + 28);

    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('ACCURACY: 92.4% [OPTIMAL PREDICTION]', rx + 16, ry + 56);

    // Accuracy Gauge Bar (Emerald Green to Gold Gradient)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(rx + 16, ry + 68, 480, 10);
    const accGrad = ctx.createLinearGradient(rx + 16, 0, rx + 16 + 480 * 0.924, 0);
    accGrad.addColorStop(0, '#00ffaa');
    accGrad.addColorStop(1, '#ffb703');
    ctx.fillStyle = accGrad;
    ctx.fillRect(rx + 16, ry + 68, 480 * 0.924, 10);

    // Feature Weights Matrix in distinct colors
    const features = [
      { name: 'HEART RATE', val: 0.84, color: '#ff3366' },
      { name: 'DURATION', val: 0.92, color: '#ffb703' },
      { name: 'AGE / BMI', val: 0.68, color: '#c084fc' },
      { name: 'BODY TEMP', val: 0.76, color: '#00ffaa' }
    ];
    features.forEach((feat, fIdx) => {
      const fx = rx + 16 + (fIdx % 2) * 240;
      const fy = ry + 104 + Math.floor(fIdx / 2) * 26;
      ctx.fillStyle = feat.color;
      ctx.font = '11px monospace';
      ctx.fillText(feat.name + ': ' + Math.round(feat.val * 100) + '%', fx, fy);
      ctx.fillStyle = feat.color;
      ctx.fillRect(fx + 120, fy - 8, 90 * feat.val, 6);
    });

    // Card 2: Streamlit Runtime Benchmark
    ry += 166;
    ctx.fillStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.fillRect(rx, ry, w - rx - 26, 120);
    ctx.strokeRect(rx, ry, w - rx - 26, 120);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('STREAMLIT CLOUD RUNTIME INFERENCE', rx + 16, ry + 28);

    ctx.fillStyle = '#4ade80';
    ctx.font = '12px monospace';
    ctx.fillText('LATENCY: 12.4 ms [ULTRA FAST]', rx + 16, ry + 56);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('THROUGHPUT: 1,420 INFERENCES / SEC', rx + 16, ry + 80);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('TENSORS: 48,200 TRAINED SAMPLES', rx + 16, ry + 104);

    // Card 3: Model Convergence Badge
    ry += 136;
    ctx.fillStyle = 'rgba(255, 183, 3, 0.12)';
    ctx.fillRect(rx, ry, w - rx - 26, 68);
    ctx.strokeStyle = '#ffb703';
    ctx.strokeRect(rx, ry, w - rx - 26, 68);

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('NEURAL PASS: VERIFIED // LOSS TENSOR: 0.0018', rx + 16, ry + 30);
    ctx.fillStyle = '#00ffaa';
    ctx.font = '11px monospace';
    ctx.fillText('ACTIVE PROTOCOL: CONTINUOUS FIT-PREDICTION ENGINE', rx + 16, ry + 50);

    // Scanlines
    ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
    for (let s = 0; s < h; s += 4) {
      ctx.fillRect(0, s, w, 1);
    }

    screen.texture.needsUpdate = true;
  }

  drawJarvisTelemetryCanvas(screen, time) {
    const { ctx, canvas } = screen;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Holographic Glass Tint
    ctx.fillStyle = 'rgba(6, 10, 22, 0.92)';
    ctx.fillRect(0, 0, w, h);

    // Outer Border in Coral Red / Crimson
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.75)';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Header Strip in Coral Red & Gold
    ctx.fillStyle = 'rgba(255, 51, 102, 0.15)';
    ctx.fillRect(10, 10, w - 20, 56);
    ctx.strokeStyle = 'rgba(255, 51, 102, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, 56);

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('BIOMETRIC TELEMETRY & VITALS MATRIX', 26, 46);

    ctx.fillStyle = '#ff2a55';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('HR: 142 BPM [PEAK]', w - 210, 46);

    // Sub-header title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('REAL-TIME ATHLETE BIOMETRICS & RADAR SCANNER', 26, 96);

    // 1. Circular Radar Scanner (Left Half - Emerald / Teal Military Aesthetic)
    const radarCenterX = 210;
    const radarCenterY = 350;
    const radarRadius = 140;

    // Radar Concentric Circles
    ctx.strokeStyle = 'rgba(0, 255, 170, 0.35)';
    ctx.lineWidth = 1.5;
    [35, 70, 105, 140].forEach((r) => {
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Radar Crosshairs
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    ctx.beginPath();
    ctx.moveTo(radarCenterX - radarRadius, radarCenterY);
    ctx.lineTo(radarCenterX + radarRadius, radarCenterY);
    ctx.moveTo(radarCenterX, radarCenterY - radarRadius);
    ctx.lineTo(radarCenterX, radarCenterY + radarRadius);
    ctx.stroke();

    // Radar Degree Marks
    ctx.fillStyle = 'rgba(0, 255, 170, 0.65)';
    ctx.font = '10px monospace';
    ctx.fillText('0 deg', radarCenterX + radarRadius + 6, radarCenterY + 4);
    ctx.fillText('90 deg', radarCenterX - 18, radarCenterY - radarRadius - 6);
    ctx.fillText('180 deg', radarCenterX - radarRadius - 52, radarCenterY + 4);
    ctx.fillText('270 deg', radarCenterX - 22, radarCenterY + radarRadius + 16);

    // Radar Rotating Sweep Beam (Emerald Green)
    const sweepAngle = (time * 2.2) % (Math.PI * 2);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.arc(radarCenterX, radarCenterY, radarRadius, sweepAngle - 0.45, sweepAngle);
    ctx.closePath();
    const sweepGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 10, radarCenterX, radarCenterY, radarRadius);
    sweepGrad.addColorStop(0, 'rgba(0, 255, 170, 0.6)');
    sweepGrad.addColorStop(1, 'rgba(0, 255, 170, 0.0)');
    ctx.fillStyle = sweepGrad;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(radarCenterX, radarCenterY);
    ctx.lineTo(radarCenterX + Math.cos(sweepAngle) * radarRadius, radarCenterY + Math.sin(sweepAngle) * radarRadius);
    ctx.stroke();
    ctx.restore();

    // Radar Target Blips in Ruby Red & Amber
    const targets = [
      { r: 60, a: 0.8, color: '#ff0055' },
      { r: 100, a: 2.2, color: '#ffb703' },
      { r: 125, a: 3.9, color: '#ff0055' },
      { r: 85, a: 5.1, color: '#00ffaa' }
    ];
    targets.forEach((tgt) => {
      const tx = radarCenterX + Math.cos(tgt.a) * tgt.r;
      const ty = radarCenterY + Math.sin(tgt.a) * tgt.r;
      const diffAngle = Math.abs((sweepAngle - tgt.a + Math.PI * 4) % (Math.PI * 2));
      const isPinged = diffAngle < 0.6;
      ctx.fillStyle = isPinged ? '#ffffff' : tgt.color;
      ctx.beginPath();
      ctx.arc(tx, ty, isPinged ? 6 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#00ffaa';
    ctx.font = '11px monospace';
    ctx.fillText('TARGET LOCK: FITNESS PREDICTION ENGINE', 50, 530);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('COORDINATES: [28.4 LAT, -14.2 LONG]', 50, 550);

    // 2. ECG Heart Rate & Energy Spectrum (Right Half - Vibrant Hot Red & Coral)
    const rx = 440;
    let ry = 110;

    // Oscilloscope Grid Frame
    ctx.fillStyle = 'rgba(255, 42, 85, 0.08)';
    ctx.strokeStyle = 'rgba(255, 42, 85, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.fillRect(rx, ry, w - rx - 26, 170);
    ctx.strokeRect(rx, ry, w - rx - 26, 170);

    ctx.fillStyle = '#ff2a55';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('ELECTROCARDIOGRAM (ECG) // LIVE CARDIAC TRACE', rx + 16, ry + 26);

    // ECG Medical Grid
    ctx.strokeStyle = 'rgba(255, 42, 85, 0.15)';
    ctx.lineWidth = 1;
    for (let gx = rx + 16; gx < w - 40; gx += 20) {
      ctx.beginPath();
      ctx.moveTo(gx, ry + 36);
      ctx.lineTo(gx, ry + 154);
      ctx.stroke();
    }
    for (let gy = ry + 36; gy < ry + 154; gy += 20) {
      ctx.beginPath();
      ctx.moveTo(rx + 16, gy);
      ctx.lineTo(w - 40, gy);
      ctx.stroke();
    }

    // Dynamic ECG Waveform in Glowing Cardiac Red / Hot Pink
    const ecgBaseline = ry + 100;
    ctx.strokeStyle = '#ff2a55';
    ctx.shadowColor = '#ff0055';
    ctx.shadowBlur = 8;
    ctx.lineWidth = 2.8;
    ctx.beginPath();

    const ecgWidth = w - rx - 60;
    for (let x = 0; x < ecgWidth; x += 3) {
      const t = (x / ecgWidth + time * 0.9) % 1.0;
      let offset = 0;
      // P wave
      if (t > 0.18 && t < 0.26) offset = Math.sin((t - 0.18) / 0.08 * Math.PI) * 10;
      // Q wave
      else if (t >= 0.26 && t < 0.30) offset = -((t - 0.26) / 0.04) * 14;
      // R spike
      else if (t >= 0.30 && t < 0.35) offset = 54 - Math.abs(t - 0.325) / 0.025 * 68;
      // S wave
      else if (t >= 0.35 && t < 0.40) offset = -((0.40 - t) / 0.05) * 18;
      // T wave
      else if (t > 0.50 && t < 0.65) offset = Math.sin((t - 0.50) / 0.15 * Math.PI) * 18;

      const plotY = ecgBaseline - offset;
      if (x === 0) ctx.moveTo(rx + 16 + x, plotY);
      else ctx.lineTo(rx + 16 + x, plotY);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Caloric Burn Bar Matrix (Flame Gradient: Gold -> Orange -> Red)
    ry += 186;
    ctx.fillStyle = 'rgba(255, 183, 3, 0.08)';
    ctx.fillRect(rx, ry, w - rx - 26, 170);
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.4)';
    ctx.strokeRect(rx, ry, w - rx - 26, 170);

    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('METABOLIC EXPENDITURE SPECTRUM', rx + 16, ry + 26);

    ctx.fillStyle = '#ff7b00';
    ctx.font = '12px monospace';
    ctx.fillText('RATE: 680 KCAL / HOUR // OPTIMAL BURN', rx + 16, ry + 50);

    // 10 Spectrum Bars with Flame Gradient
    const barCount = 10;
    const barWidth = 36;
    const barSpacing = 16;
    for (let b = 0; b < barCount; b++) {
      const bx = rx + 24 + b * (barWidth + barSpacing);
      const val = 0.35 + 0.55 * Math.sin(time * 3 + b * 0.7);
      const bH = val * 64;
      const by = ry + 144 - bH;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(bx, ry + 80, barWidth, 64);

      // Flame Gradient
      const flameGrad = ctx.createLinearGradient(0, ry + 144, 0, by);
      flameGrad.addColorStop(0, '#ffd166');
      flameGrad.addColorStop(0.5, '#ff7b00');
      flameGrad.addColorStop(1, '#ff0055');
      ctx.fillStyle = flameGrad;
      ctx.fillRect(bx, by, barWidth, bH);
    }

    // Telemetry Footer in Multi-Color
    ctx.font = '11px monospace';
    ctx.fillStyle = '#00ffaa';
    ctx.fillText('VO2 MAX: 54.2 ml/kg/min', rx + 16, h - 36);
    ctx.fillStyle = '#ffb703';
    ctx.fillText('CADENCE: 178 SPM', rx + 200, h - 36);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('EFFICIENCY: 94.8%', rx + 340, h - 36);

    // Scanlines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let s = 0; s < h; s += 4) {
      ctx.fillRect(0, s, w, 1);
    }

    screen.texture.needsUpdate = true;
  }

  drawJarvisBannerCanvas(screen, time, isHovered, pulse) {
    const { ctx, canvas } = screen;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Translucent Dark Glass HUD Header Panel
    ctx.fillStyle = 'rgba(6, 10, 22, 0.94)';
    ctx.fillRect(0, 0, w, h);

    // Precision Stark Gold Border Frame with Corner Brackets
    ctx.strokeStyle = 'rgba(255, 183, 3, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    ctx.fillStyle = '#00f0ff';
    const cSize = 14;
    ctx.fillRect(4, 4, cSize, 3);
    ctx.fillRect(4, 4, 3, cSize);
    ctx.fillRect(w - 4 - cSize, 4, cSize, 3);
    ctx.fillRect(w - 7, 4, 3, cSize);
    ctx.fillRect(4, h - 7, cSize, 3);
    ctx.fillRect(4, h - 4 - cSize, 3, cSize);
    ctx.fillRect(w - 4 - cSize, h - 7, cSize, 3);
    ctx.fillRect(w - 7, h - 4 - cSize, 3, cSize);

    // Banner Title & Status
    ctx.fillStyle = '#ffb703';
    ctx.font = 'bold 17px monospace';
    ctx.fillText('STARK INDUSTRIES // J.A.R.V.I.S. TACTICAL HUD // MK-85', 24, 38);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px monospace';
    ctx.fillText('NEURAL PREDICTION & TELEMETRY STREAM // LATENCY: 1.2ms // SECURE', 24, 62);

    // 40-Band Clean Frequency Spectrum (Stark Gold -> Electric Cyan Gradient)
    const bandCount = 40;
    const bandW = 18;
    const bandSpacing = 6;
    const startX = 24;
    const startY = 145;

    for (let b = 0; b < bandCount; b++) {
      const harmonic = Math.sin(time * 5 + b * 0.35) * 0.45 + Math.cos(time * 9 + b * 0.8) * 0.25 + (pulse * 0.4);
      const normH = Math.max(0.12, Math.min(1.0, 0.35 + harmonic));
      const barH = normH * 55;

      const bx = startX + b * (bandW + bandSpacing);
      const by = startY - barH;

      // Clean Gradient: Gold in bass/mids transitioning into Electric Cyan and pure white highlights
      if (b < 16) {
        ctx.fillStyle = '#ffb703';
      } else if (b < 32) {
        ctx.fillStyle = '#00f0ff';
      } else {
        ctx.fillStyle = b % 2 === 0 ? '#38bdf8' : '#ffffff';
      }
      ctx.fillRect(bx, by, bandW, barH);
    }

    screen.texture.needsUpdate = true;
  }

  generateStudioEnvironmentMap() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Clean neutral studio background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, "#0a0e17");
    bgGrad.addColorStop(0.5, "#111827");
    bgGrad.addColorStop(1, "#0a0e17");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Overhead white studio softbox
    const topSoftbox = ctx.createRadialGradient(512, 70, 15, 512, 70, 240);
    topSoftbox.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    topSoftbox.addColorStop(0.35, "rgba(240, 249, 255, 0.85)");
    topSoftbox.addColorStop(0.7, "rgba(186, 230, 253, 0.25)");
    topSoftbox.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = topSoftbox;
    ctx.fillRect(200, 0, 624, 200);

    // Soft side fill lights
    const leftLight = ctx.createLinearGradient(120, 0, 260, 0);
    leftLight.addColorStop(0, "rgba(0, 0, 0, 0)");
    leftLight.addColorStop(0.5, "rgba(224, 242, 254, 0.6)");
    leftLight.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = leftLight;
    ctx.fillRect(100, 80, 180, 340);

    const rightLight = ctx.createLinearGradient(760, 0, 900, 0);
    rightLight.addColorStop(0, "rgba(0, 0, 0, 0)");
    rightLight.addColorStop(0.5, "rgba(224, 242, 254, 0.6)");
    rightLight.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = rightLight;
    ctx.fillRect(740, 80, 180, 340);

    const texture = new THREE.CanvasTexture(canvas);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    return texture;
  }

  setRenderer(renderer) {
    this.renderer = renderer;
    if (this.groups.neural && this.cubeCamera) {
      this.updateCubeReflection();
    }
  }

  updateCubeReflection() {
    if (!this.renderer || !this.cubeCamera || !this.cubeRenderTarget) return;
    const n = this.groups.neural;
    if (!n || !n.neuralOrb) return;
    const orb = n.neuralOrb;

    if (orb.outerGlassBall) orb.outerGlassBall.visible = false;
    if (orb.waterVolume) orb.waterVolume.visible = false;
    if (orb.screenReflections) {
      orb.screenReflections.forEach((m) => { m.visible = false; });
    }
    if (orb.specArc1) orb.specArc1.visible = false;
    if (orb.specArc2) orb.specArc2.visible = false;

    orb.orbGroup.getWorldPosition(this.cubeCamera.position);
    this.cubeCamera.update(this.renderer, this.scene);

    if (orb.outerGlassBall) {
      orb.outerGlassBall.visible = true;
      if (orb.outerGlassBall.material.envMap !== this.cubeRenderTarget.texture) {
        orb.outerGlassBall.material.envMap = this.cubeRenderTarget.texture;
        orb.outerGlassBall.material.needsUpdate = true;
      }
    }
    if (orb.waterVolume) orb.waterVolume.visible = true;
    if (orb.screenReflections) {
      orb.screenReflections.forEach((m) => { m.visible = true; });
    }
    if (orb.specArc1) orb.specArc1.visible = true;
    if (orb.specArc2) orb.specArc2.visible = true;
  }

  generateBrainDiffuseMap() {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // 1. Base anatomical tissue gradient (warm cortical flesh tones)
    const baseGrad = ctx.createLinearGradient(0, 0, 0, 512);
    baseGrad.addColorStop(0.0, "#f2c1b6"); // superior crests (parietal dome)
    baseGrad.addColorStop(0.25, "#e59b8e"); // upper convexity
    baseGrad.addColorStop(0.55, "#d67e70"); // lateral mid-cortex
    baseGrad.addColorStop(0.85, "#c46759"); // inferior temporal/occipital base
    baseGrad.addColorStop(1.0, "#9c3e32"); // deep basal sulcus
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // 2. Deep Median Longitudinal Fissure (Center vertical divider)
    const fissureGrad = ctx.createLinearGradient(480, 0, 544, 0);
    fissureGrad.addColorStop(0.0, "rgba(80, 18, 16, 0)");
    fissureGrad.addColorStop(0.35, "rgba(70, 15, 13, 0.75)");
    fissureGrad.addColorStop(0.5, "rgba(45, 10, 8, 0.95)");
    fissureGrad.addColorStop(0.65, "rgba(70, 15, 13, 0.75)");
    fissureGrad.addColorStop(1.0, "rgba(80, 18, 16, 0)");
    ctx.fillStyle = fissureGrad;
    ctx.fillRect(470, 0, 84, 512);

    // Lateral seams for spherical mapping wrap (0 and 1024)
    const seamGradL = ctx.createLinearGradient(0, 0, 40, 0);
    seamGradL.addColorStop(0, "rgba(55, 12, 10, 0.85)");
    seamGradL.addColorStop(1, "rgba(55, 12, 10, 0)");
    ctx.fillStyle = seamGradL;
    ctx.fillRect(0, 0, 40, 512);

    const seamGradR = ctx.createLinearGradient(984, 0, 1024, 0);
    seamGradR.addColorStop(0, "rgba(55, 12, 10, 0)");
    seamGradR.addColorStop(1, "rgba(55, 12, 10, 0.85)");
    ctx.fillStyle = seamGradR;
    ctx.fillRect(984, 0, 40, 512);

    // 3. Primary Anatomical Sulcal Grooves (Central, Precentral, Lateral, Calcarine)
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const drawSulcus = (startX, startY, pts, width, color) => {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      pts.forEach((pt) => ctx.lineTo(pt[0], pt[1]));
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    // Major sulci on left hemisphere (x: 50 to 460) and right hemisphere (x: 564 to 974)
    [0, 512].forEach((offset) => {
      // Central sulcus
      drawSulcus(offset + 250, 40, [
        [offset + 235, 120], [offset + 210, 200], [offset + 195, 300], [offset + 220, 390]
      ], 14, "rgba(85, 20, 18, 0.35)");
      drawSulcus(offset + 250, 40, [
        [offset + 235, 120], [offset + 210, 200], [offset + 195, 300], [offset + 220, 390]
      ], 6, "rgba(50, 12, 10, 0.7)");

      // Precentral sulcus
      drawSulcus(offset + 170, 70, [
        [offset + 155, 160], [offset + 140, 260], [offset + 150, 360]
      ], 10, "rgba(90, 22, 19, 0.3)");
      drawSulcus(offset + 170, 70, [
        [offset + 155, 160], [offset + 140, 260], [offset + 150, 360]
      ], 4, "rgba(55, 14, 12, 0.6)");

      // Postcentral sulcus
      drawSulcus(offset + 330, 60, [
        [offset + 320, 160], [offset + 295, 270], [offset + 310, 370]
      ], 10, "rgba(90, 22, 19, 0.3)");
      drawSulcus(offset + 330, 60, [
        [offset + 320, 160], [offset + 295, 270], [offset + 310, 370]
      ], 4, "rgba(55, 14, 12, 0.6)");

      // Lateral (Sylvian) fissure
      drawSulcus(offset + 110, 310, [
        [offset + 220, 280], [offset + 330, 260], [offset + 420, 230]
      ], 12, "rgba(80, 18, 16, 0.35)");
      drawSulcus(offset + 110, 310, [
        [offset + 220, 280], [offset + 330, 260], [offset + 420, 230]
      ], 5, "rgba(45, 10, 8, 0.75)");

      // Superior temporal sulcus
      drawSulcus(offset + 130, 370, [
        [offset + 240, 350], [offset + 350, 340], [offset + 410, 310]
      ], 8, "rgba(95, 24, 20, 0.28)");
    });
    ctx.restore();

    // 4. Pia Mater Vascular Arborization (Arterial trunks & fine capillary networks)
    const vascularRoots = [
      // Left hemisphere roots
      { x: 180, y: 320, angle: -Math.PI * 0.45, length: 110 },
      { x: 260, y: 310, angle: -Math.PI * 0.52, length: 130 },
      { x: 340, y: 300, angle: -Math.PI * 0.58, length: 120 },
      { x: 140, y: 220, angle: -Math.PI * 0.25, length: 95 },
      { x: 210, y: 150, angle: -Math.PI * 0.65, length: 85 },
      { x: 300, y: 140, angle: -Math.PI * 0.48, length: 90 },
      { x: 380, y: 190, angle: -Math.PI * 0.35, length: 95 },
      { x: 100, y: 390, angle: -Math.PI * 0.15, length: 75 },
      { x: 260, y: 410, angle: -Math.PI * 0.20, length: 80 },
      { x: 390, y: 380, angle: -Math.PI * 0.30, length: 75 },
      // Right hemisphere mirrored roots
      { x: 692, y: 320, angle: -Math.PI * 0.45, length: 110 },
      { x: 772, y: 310, angle: -Math.PI * 0.52, length: 130 },
      { x: 852, y: 300, angle: -Math.PI * 0.58, length: 120 },
      { x: 652, y: 220, angle: -Math.PI * 0.25, length: 95 },
      { x: 722, y: 150, angle: -Math.PI * 0.65, length: 85 },
      { x: 812, y: 140, angle: -Math.PI * 0.48, length: 90 },
      { x: 892, y: 190, angle: -Math.PI * 0.35, length: 95 },
      { x: 612, y: 390, angle: -Math.PI * 0.15, length: 75 },
      { x: 772, y: 410, angle: -Math.PI * 0.20, length: 80 },
      { x: 902, y: 380, angle: -Math.PI * 0.30, length: 75 }
    ];

    const drawVesselTree = (x, y, angle, length, depth) => {
      if (depth > 3 || length < 10) return;
      const steps = 7;
      const stepLen = length / steps;
      let currX = x;
      let currY = y;

      ctx.beginPath();
      ctx.moveTo(currX, currY);

      let currAngle = angle;
      for (let s = 0; s < steps; s++) {
        currAngle += (Math.sin(s * 1.8 + depth * 2.5) * 0.28) + ((Math.random() - 0.5) * 0.18);
        currX += Math.cos(currAngle) * stepLen;
        currY += Math.sin(currAngle) * stepLen;
        ctx.lineTo(currX, currY);
      }

      if (depth === 0) {
        ctx.strokeStyle = "#8b1515"; // Deep arterial feeder
        ctx.lineWidth = 2.4;
      } else if (depth === 1) {
        ctx.strokeStyle = "#a82020"; // Primary arteriole
        ctx.lineWidth = 1.4;
      } else if (depth === 2) {
        ctx.strokeStyle = "#c52e2e"; // Secondary arteriole
        ctx.lineWidth = 0.85;
      } else {
        ctx.strokeStyle = "rgba(225, 55, 55, 0.7)"; // Fine capillary tuft
        ctx.lineWidth = 0.55;
      }
      ctx.stroke();

      const spread = 0.52 + Math.random() * 0.25;
      drawVesselTree(currX, currY, currAngle - spread, length * 0.68, depth + 1);
      drawVesselTree(currX, currY, currAngle + spread, length * 0.64, depth + 1);
      if (depth === 1 && Math.random() > 0.4) {
        drawVesselTree(currX, currY, currAngle + 0.1, length * 0.52, depth + 1);
      }
    };

    ctx.save();
    ctx.lineCap = "round";
    vascularRoots.forEach((root) => {
      drawVesselTree(root.x, root.y, root.angle, root.length, 0);
    });
    ctx.restore();

    // 5. Fine Organic Cellular Micro-Stippling (Natural biological tissue noise)
    const imgData = ctx.getImageData(0, 0, 1024, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = ((Math.random() - 0.5) * 14);
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.7));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.6));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  generateBrainNormalMap() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const hMap = new Float32Array(width * height);
    for (let y = 0; y < height; y++) {
      const v = y / height;
      const ny = v * Math.PI * 2.0;

      for (let x = 0; x < width; x++) {
        const u = x / width;
        const nx = u * Math.PI * 4.0;

        const f1 = Math.sin(nx * 3.5 + Math.cos(ny * 4.2)) * Math.cos(ny * 3.8 + Math.sin(nx * 3.2));
        const f2 = Math.sin(nx * 7.5 - ny * 6.5) * Math.cos(ny * 7.0 + nx * 5.0) * 0.45;
        const f3 = Math.cos(nx * 15.0 + ny * 13.0) * 0.20;
        const gyri = f1 + f2 + f3;

        const distToFissure = Math.abs(u - 0.5);
        const fissure = Math.exp(-distToFissure * 32.0) * 1.6;

        const distToSeam = Math.min(u, 1.0 - u);
        const seamCrevice = Math.exp(-distToSeam * 32.0) * 1.2;

        hMap[y * width + x] = (gyri - fissure - seamCrevice);
      }
    }

    const strength = 1.8;
    for (let y = 0; y < height; y++) {
      const yPrev = (y - 1 + height) % height;
      const yNext = (y + 1) % height;

      for (let x = 0; x < width; x++) {
        const xPrev = (x - 1 + width) % width;
        const xNext = (x + 1) % width;

        const hL = hMap[y * width + xPrev];
        const hR = hMap[y * width + xNext];
        const hU = hMap[yPrev * width + x];
        const hD = hMap[yNext * width + x];

        let dx = (hR - hL) * strength;
        let dy = (hD - hU) * strength;
        let dz = 1.0;

        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        dx /= len;
        dy /= len;
        dz /= len;

        const idx = (y * width + x) * 4;
        data[idx] = Math.floor((dx * 0.5 + 0.5) * 255);
        data[idx + 1] = Math.floor((-dy * 0.5 + 0.5) * 255);
        data[idx + 2] = Math.floor((dz * 0.5 + 0.5) * 255);
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  generateBrainRoughnessMap() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const v = y / height;
      const ny = v * Math.PI * 2.0;

      for (let x = 0; x < width; x++) {
        const u = x / width;
        const nx = u * Math.PI * 4.0;

        const fold = Math.sin(nx * 3.5 + Math.cos(ny * 4.2)) * Math.cos(ny * 3.8);
        const distToFissure = Math.abs(u - 0.5);

        let rVal = 75 + fold * 25;
        if (distToFissure < 0.05) {
          rVal = 35; // Wet longitudinal fissure
        }
        rVal = Math.min(255, Math.max(25, rVal));

        const idx = (y * width + x) * 4;
        data[idx] = rVal;
        data[idx + 1] = rVal;
        data[idx + 2] = rVal;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  createBrainGeometry() {
    const geo = new THREE.SphereGeometry(1.0, 112, 84);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    // Natural human brain tissue color palette
    const colDeep = new THREE.Color(0x78231c);    // deep vascular sulcus crevice
    const colMid = new THREE.Color(0xd6796c);     // healthy cortex tissue
    const colCrest = new THREE.Color(0xefa598);   // soft warm peach crest
    const colHighlight = new THREE.Color(0xfde5df); // illuminated tissue highlight

    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);

      // Anatomical brain proportions: elongated along Z, vaulted dome, flatter base
      x *= 0.88;
      y *= 0.80;
      z *= 1.12;

      const absX = Math.abs(x);
      // Clean deep longitudinal fissure separating left and right hemispheres
      const fissure = Math.exp(-absX * 6.8) * 0.32;

      // Temporal lobe lateral curvature
      let temporal = 0;
      if (y < 0.08 && z > -0.25 && z < 0.42 && absX > 0.30) {
        temporal = 0.14 * Math.sin((z + 0.25) * Math.PI / 0.67);
      }

      // Sylvian fissure groove separating frontal/parietal from temporal
      let sylvian = 0;
      if (y > 0.0 && y < 0.18 && z > -0.12 && z < 0.38 && absX > 0.32) {
        sylvian = 0.12 * Math.exp(-Math.pow((y - 0.09) * 9.5, 2));
      }

      // Frontal vs occipital pole curvature
      let poleCurve = 0;
      if (z > 0.2) poleCurve += 0.07 * Math.sin(z * 2.2);
      if (z < -0.2) poleCurve += 0.09 * Math.cos(z * 1.8);

      // Organic winding gyri and sulci convolutions (tapered at midline fissure)
      const f1 = Math.sin(x * 8.2 + Math.cos(z * 6.8)) * Math.cos(y * 7.8 + Math.sin(x * 5.8));
      const f2 = Math.sin(x * 15.5 - z * 12.5) * Math.cos(y * 13.5 + z * 9.2) * 0.42;
      const f3 = Math.cos(x * 23.0 + y * 19.0) * 0.18;
      const foldMask = THREE.MathUtils.clamp((absX - 0.04) / 0.15, 0.0, 1.0);
      const gyri = (f1 + f2 + f3) * 0.078 * foldMask;

      const rBase = Math.sqrt(x * x + y * y + z * z);
      const rFactor = 1.0 + (gyri - fissure + temporal - sylvian + poleCurve) / Math.max(0.01, rBase);

      pos.setXYZ(i, x * rFactor, y * rFactor, z * rFactor);

      // Realistic tissue color interpolation based on fold depth
      const tFold = THREE.MathUtils.clamp((gyri + 0.09) / 0.18, 0, 1);
      const c = new THREE.Color();
      if (tFold < 0.45) {
        c.lerpColors(colDeep, colMid, tFold / 0.45);
      } else {
        c.lerpColors(colMid, colCrest, (tFold - 0.45) / 0.55);
        if (tFold > 0.85) {
          c.lerp(colHighlight, (tFold - 0.85) / 0.15);
        }
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }

  createCerebellumGeometry() {
    const geo = new THREE.SphereGeometry(0.38, 48, 36);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      const striation = Math.sin(y * 45.0) * 0.016 + Math.cos(x * 12.0) * 0.008;
      pos.setXYZ(i, x * 1.28, (y + striation) * 0.68, z * 0.88);
    }
    geo.computeVertexNormals();
    return geo;
  }

  createBrainstemGeometry() {
    const geo = new THREE.CylinderGeometry(0.13, 0.075, 0.55, 32, 24);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      if (y > 0.0) {
        z += 0.05 * Math.cos(y * Math.PI);
        x *= 1.25;
        z += Math.sin(y * 36.0) * 0.006;
      } else {
        if (z > 0.02) {
          z -= Math.exp(-Math.pow(x * 16.0, 2)) * 0.02;
        }
      }
      pos.setXYZ(i, x, y, z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  createNeuralBrainOrb(screens = null) {
    const orbGroup = new THREE.Group();
    orbGroup.position.set(0, 0.15, 0.0);

    // Initialize Real-Time Dynamic Reflection CubeCamera
    if (!this.cubeRenderTarget) {
      this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        colorSpace: THREE.SRGBColorSpace
      });
      this.cubeCamera = new THREE.CubeCamera(0.15, 80, this.cubeRenderTarget);
      this.scene.add(this.cubeCamera);
    }

    // 1. Sleek, Minimal Circular Base Collar (Clean brushed metal, zero clutter)
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.48, 0);
    orbGroup.add(pedestalGroup);

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.22
    });

    const basePlate = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.48, 0.14, 48), metalMat);
    pedestalGroup.add(basePlate);

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.15
    });
    const rimRing = new THREE.Mesh(new THREE.RingGeometry(1.32, 1.42, 48), rimMat);
    rimRing.rotation.x = -Math.PI / 2;
    rimRing.position.y = 0.075;
    pedestalGroup.add(rimRing);

    // 2. Suspended Natural 3D Human Brain (Floating in Water)
    const brainGroup = new THREE.Group();
    brainGroup.position.set(0, 0.06, 0);
    brainGroup.rotation.y = 0.45; // Natural slight 3/4 angle
    orbGroup.add(brainGroup);

    // Generate Rich Anatomical Biological Textures
    if (!this.brainDiffuseMap) {
      this.brainDiffuseMap = this.generateBrainDiffuseMap();
    }
    if (!this.brainNormalMap) {
      this.brainNormalMap = this.generateBrainNormalMap();
    }
    if (!this.brainRoughnessMap) {
      this.brainRoughnessMap = this.generateBrainRoughnessMap();
    }

    // Main Cerebral Hemispheres (Natural cortical tissue with pia mater vascular network)
    const brainGeo = this.createBrainGeometry();
    const brainMat = new THREE.MeshPhysicalMaterial({
      map: this.brainDiffuseMap,
      normalMap: this.brainNormalMap,
      normalScale: new THREE.Vector2(1.35, 1.35),
      roughnessMap: this.brainRoughnessMap,
      roughness: 0.26,
      metalness: 0.02,
      clearcoat: 0.78,
      clearcoatRoughness: 0.08,
      transmission: 0.12,
      ior: 1.42,
      envMap: this.cubeRenderTarget ? this.cubeRenderTarget.texture : this.scene.environment,
      envMapIntensity: 1.5
    });
    const brainMesh = new THREE.Mesh(brainGeo, brainMat);
    brainMesh.renderOrder = 2;
    brainGroup.add(brainMesh);

    // Natural Foliate Cerebellum (Tucked neatly at posterior-inferior base)
    const cerebellumGeo = this.createCerebellumGeometry();
    const cerebellumMat = new THREE.MeshPhysicalMaterial({
      color: 0xc96d5e,
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.65,
      clearcoatRoughness: 0.10,
      transmission: 0.10,
      ior: 1.40,
      envMap: this.cubeRenderTarget ? this.cubeRenderTarget.texture : this.scene.environment,
      envMapIntensity: 1.3
    });
    const cbmMesh = new THREE.Mesh(cerebellumGeo, cerebellumMat);
    cbmMesh.position.set(0, -0.42, -0.40);
    cbmMesh.scale.set(0.75, 0.38, 0.52);
    cbmMesh.renderOrder = 2;
    brainGroup.add(cbmMesh);

    // Natural Brainstem Trunk (Creamy-pink neural tract tissue)
    const stemGeo = this.createBrainstemGeometry();
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0xead9d4,
      roughness: 0.24,
      metalness: 0.02,
      clearcoat: 0.70,
      clearcoatRoughness: 0.08,
      transmission: 0.08,
      ior: 1.40,
      envMap: this.cubeRenderTarget ? this.cubeRenderTarget.texture : this.scene.environment,
      envMapIntensity: 1.3
    });
    const brainStem = new THREE.Mesh(stemGeo, stemMat);
    brainStem.position.set(0, -0.62, -0.15);
    brainStem.rotation.x = -0.18;
    brainStem.renderOrder = 2;
    brainGroup.add(brainStem);

    // 3. Clear Water Bubbles System (Occasional Rising Bubbles in Liquid)
    const bubbles = [];
    const bubbleGeo = new THREE.SphereGeometry(1, 16, 16);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.98,
      transparent: true,
      opacity: 0.85,
      roughness: 0.015,
      metalness: 0.0,
      ior: 1.15,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      depthWrite: false,
      envMap: this.cubeRenderTarget ? this.cubeRenderTarget.texture : this.scene.environment,
      envMapIntensity: 2.2
    });

    for (let i = 0; i < 28; i++) {
      const bubbleMesh = new THREE.Mesh(bubbleGeo, bubbleMat);
      const radius = 0.024 + Math.random() * 0.048;
      bubbleMesh.scale.setScalar(radius);
      bubbleMesh.renderOrder = 5;

      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 1.05;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = -1.2 + Math.random() * 2.4;

      bubbleMesh.position.set(x, y, z);
      orbGroup.add(bubbleMesh);

      bubbles.push({
        mesh: bubbleMesh,
        baseX: x,
        baseZ: z,
        radius,
        speed: 0.22 + Math.random() * 0.35,
        wobbleSpeed: 2.2 + Math.random() * 3.0,
        wobbleAmp: 0.025 + Math.random() * 0.035,
        phase: Math.random() * Math.PI * 2
      });
    }

    // 4. Inner Clear Water Fluid Volume (Refractive Index of Water 1.333)
    const waterGeo = new THREE.SphereGeometry(1.54, 48, 48);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0xebf8ff,
      transmission: 0.94,
      transparent: true,
      opacity: 0.18,
      roughness: 0.02,
      metalness: 0.0,
      ior: 1.333,
      side: THREE.BackSide,
      depthWrite: false
    });
    const waterVolume = new THREE.Mesh(waterGeo, waterMat);
    waterVolume.renderOrder = 1;
    orbGroup.add(waterVolume);

    // 5. Outer Crystal Optical Glass Ball (Physical Crown Glass IOR 1.52)
    const glassGeo = new THREE.SphereGeometry(1.58, 64, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.98,
      transparent: true,
      opacity: 1.0,
      roughness: 0.02,
      metalness: 0.0,
      ior: 1.52,
      reflectivity: 0.96,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      thickness: 0.45,
      envMap: this.cubeRenderTarget ? this.cubeRenderTarget.texture : this.scene.environment,
      envMapIntensity: 2.5,
      depthWrite: false
    });
    const glassBall = new THREE.Mesh(glassGeo, glassMat);
    glassBall.renderOrder = 10;
    orbGroup.add(glassBall);

    // 6. Real-Time Optical Screen Reflections on Curved Glass Surface
    const screenReflections = [];
    if (screens) {
      // Left Screen Curved Reflection (Cyan Matrix Screen)
      const leftReflectGeo = new THREE.SphereGeometry(
        1.585,
        28,
        28,
        Math.PI * 0.65,
        Math.PI * 0.36,
        Math.PI * 0.30,
        Math.PI * 0.38
      );
      const leftReflectMat = new THREE.MeshBasicMaterial({
        map: screens.screenLeft.texture,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const leftReflectMesh = new THREE.Mesh(leftReflectGeo, leftReflectMat);
      leftReflectMesh.renderOrder = 11;
      orbGroup.add(leftReflectMesh);
      screenReflections.push(leftReflectMesh);

      // Right Screen Curved Reflection (Ruby Telemetry Screen & ECG Heartbeat)
      const rightReflectGeo = new THREE.SphereGeometry(
        1.585,
        28,
        28,
        Math.PI * 0.00,
        Math.PI * 0.36,
        Math.PI * 0.30,
        Math.PI * 0.38
      );
      const rightReflectMat = new THREE.MeshBasicMaterial({
        map: screens.screenRight.texture,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const rightReflectMesh = new THREE.Mesh(rightReflectGeo, rightReflectMat);
      rightReflectMesh.renderOrder = 11;
      orbGroup.add(rightReflectMesh);
      screenReflections.push(rightReflectMesh);

      // Top Screen Curved Reflection (Stark Gold Banner Screen)
      const topReflectGeo = new THREE.SphereGeometry(
        1.585,
        28,
        16,
        Math.PI * 0.28,
        Math.PI * 0.44,
        Math.PI * 0.12,
        Math.PI * 0.22
      );
      const topReflectMat = new THREE.MeshBasicMaterial({
        map: screens.screenTop.texture,
        transparent: true,
        opacity: 0.60,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      const topReflectMesh = new THREE.Mesh(topReflectGeo, topReflectMat);
      topReflectMesh.renderOrder = 11;
      orbGroup.add(topReflectMesh);
      screenReflections.push(topReflectMesh);
    }

    // Natural Curved Specular Glints on Optical Glass Surface
    const specHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const specArc1 = new THREE.Mesh(new THREE.TorusGeometry(1.59, 0.014, 16, 48, Math.PI * 0.45), specHighlightMat);
    specArc1.rotation.set(0.42, 0.48, 0.78);
    specArc1.renderOrder = 12;
    orbGroup.add(specArc1);

    const specArc2 = new THREE.Mesh(new THREE.TorusGeometry(1.59, 0.009, 16, 40, Math.PI * 0.32), specHighlightMat);
    specArc2.rotation.set(-0.55, -0.62, -0.35);
    specArc2.renderOrder = 12;
    orbGroup.add(specArc2);

    // 7. Docking Conduit Collar Ports (Left, Right, Top) connecting to HUD screens
    const collarMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
    const collarRingGeo = new THREE.RingGeometry(0.12, 0.18, 24);

    const collarLeft = new THREE.Mesh(collarRingGeo, collarMat);
    collarLeft.position.set(-1.54, 0.15, 0);
    collarLeft.rotation.y = Math.PI / 2;
    orbGroup.add(collarLeft);

    const collarRight = new THREE.Mesh(collarRingGeo, collarMat);
    collarRight.position.set(1.54, 0.15, 0);
    collarRight.rotation.y = -Math.PI / 2;
    orbGroup.add(collarRight);

    const collarTop = new THREE.Mesh(collarRingGeo, new THREE.MeshBasicMaterial({ color: 0xffb703, side: THREE.DoubleSide }));
    collarTop.position.set(0, 1.58, 0);
    collarTop.rotation.x = Math.PI / 2;
    orbGroup.add(collarTop);

    return {
      orbGroup,
      jarvisGroup: orbGroup,
      brainGroup,
      brainMesh,
      brainStem,
      cbmMesh,
      specArc1,
      specArc2,
      bubbles,
      outerGlassBall: glassBall,
      waterVolume,
      screenReflections,
      pedestalGroup,
      headGroup: brainGroup
    };
  }

  initAiNeuralScene() {
    const neuralGroup = new THREE.Group();

    // Central Pivot that tilts smoothly with cursor
    const mainPivot = new THREE.Group();
    neuralGroup.add(mainPivot);

    // 1. Floating Holographic HUD Screens Controlled by J.A.R.V.I.S.
    const screenLeft = this.createJarvisScreen('matrix', 4.4, 2.8, new THREE.Vector3(-4.2, 0.1, 1.2), new THREE.Euler(-0.04, 0.30, 0));
    const screenRight = this.createJarvisScreen('telemetry', 4.4, 2.8, new THREE.Vector3(4.2, 0.1, 1.2), new THREE.Euler(-0.04, -0.30, 0));
    const screenTop = this.createJarvisScreen('banner', 5.2, 0.9, new THREE.Vector3(0, 3.2, 0.6), new THREE.Euler(0.12, 0, 0));

    mainPivot.add(screenLeft.meshGroup);
    mainPivot.add(screenRight.meshGroup);
    mainPivot.add(screenTop.meshGroup);

    // 2. Central 3D Glass Water Orb with Bioluminescent Neural Brain & Rising Bubbles
    const neuralOrb = this.createNeuralBrainOrb({ screenLeft, screenRight, screenTop });
    mainPivot.add(neuralOrb.orbGroup);

    // 3. Holographic Conduits Linking Center Helmet to Screens
    const conduitsGroup = new THREE.Group();
    mainPivot.add(conduitsGroup);

    // Left Conduit Line (Cyan to Matrix Screen)
    const leftConduitGeo = new THREE.BufferGeometry();
    leftConduitGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const leftConduit = new THREE.Line(
      leftConduitGeo,
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    );
    conduitsGroup.add(leftConduit);

    // Right Conduit Line (Ruby Red to Telemetry Screen)
    const rightConduitGeo = new THREE.BufferGeometry();
    rightConduitGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const rightConduit = new THREE.Line(
      rightConduitGeo,
      new THREE.LineBasicMaterial({ color: 0xff1744, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    );
    conduitsGroup.add(rightConduit);

    // Top Conduit Line (Gold to Banner Screen)
    const topConduitGeo = new THREE.BufferGeometry();
    topConduitGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    const topConduit = new THREE.Line(
      topConduitGeo,
      new THREE.LineBasicMaterial({ color: 0xffb703, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending })
    );
    conduitsGroup.add(topConduit);

    // Terminal Docking Rings at Screen Frames
    const terminalGeo = new THREE.RingGeometry(0.06, 0.085, 24);
    const leftTerminal = new THREE.Mesh(
      terminalGeo,
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    const rightTerminal = new THREE.Mesh(
      terminalGeo,
      new THREE.MeshBasicMaterial({ color: 0xff1744, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    const topTerminal = new THREE.Mesh(
      terminalGeo,
      new THREE.MeshBasicMaterial({ color: 0xffb703, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    conduitsGroup.add(leftTerminal);
    conduitsGroup.add(rightTerminal);
    conduitsGroup.add(topTerminal);

    // 3 Sleek Data Transmission Packets
    const packetGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const leftPacket = new THREE.Mesh(packetGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff }));
    const rightPacket = new THREE.Mesh(packetGeo, new THREE.MeshBasicMaterial({ color: 0xff1744 }));
    const topPacket = new THREE.Mesh(packetGeo, new THREE.MeshBasicMaterial({ color: 0xffb703 }));
    conduitsGroup.add(leftPacket);
    conduitsGroup.add(rightPacket);
    conduitsGroup.add(topPacket);

    this.scene.add(neuralGroup);

    this.groups.neural = {
      group: neuralGroup,
      mainPivot,
      neuralOrb,
      holoHelmet: neuralOrb,
      leftConduit,
      rightConduit,
      topConduit,
      leftTerminal,
      rightTerminal,
      topTerminal,
      leftPacket,
      rightPacket,
      topPacket,
      screenLeft,
      screenRight,
      screenTop,
      pulseEnergy: 0,
      targetScale: this.currentType === 'neural' ? 1 : 0.001,
      targetOpacity: this.currentType === 'neural' ? 1 : 0,
    };
  }

  // =========================================================================
  // 2. REALISTIC 3D CHESSBOARD & LEGAL MOVE ENGINE WITH CLEAN BOARD RESET
  // =========================================================================
  initChessScene() {
    const chessGroup = new THREE.Group();
    const boardSize = 8;
    const tileSpacing = 1.35;
    const boardOffset = (boardSize * tileSpacing) / 2 - tileSpacing / 2;

    // Checkerboard Tiles
    const tileGeo = new THREE.BoxGeometry(1.28, 0.25, 1.28);
    const darkTileMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0e,
      roughness: 0.25,
      metalness: 0.8
    });
    const lightTileMat = new THREE.MeshStandardMaterial({
      color: 0xdbeafe,
      roughness: 0.2,
      metalness: 0.3
    });

    const tiles = [];
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        const isDark = (r + c) % 2 === 1;
        const tile = new THREE.Mesh(tileGeo, isDark ? darkTileMat : lightTileMat);
        const x = c * tileSpacing - boardOffset;
        const z = r * tileSpacing - boardOffset;
        tile.position.set(x, 0, z);
        chessGroup.add(tile);
        tiles.push(tile);
      }
    }

    // Border Frame with Beveled Obsidian Rim & Bronze Inlay
    const borderGeo = new THREE.BoxGeometry(boardSize * tileSpacing + 1.2, 0.4, boardSize * tileSpacing + 1.2);
    const borderMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.15,
      metalness: 0.95
    });
    const border = new THREE.Mesh(borderGeo, borderMat);
    border.position.y = -0.15;
    chessGroup.add(border);

    // Glowing Inner Frame Bezel in Azure
    const innerFrameGeo = new THREE.BoxGeometry(boardSize * tileSpacing + 0.15, 0.28, boardSize * tileSpacing + 0.15);
    const innerFrameWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(innerFrameGeo),
      new THREE.LineBasicMaterial({ color: 0x0781ff, transparent: true, opacity: 0.7 })
    );
    innerFrameWire.position.y = 0.05;
    chessGroup.add(innerFrameWire);

    // Authentic Materials for Pieces
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.6
    });

    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      emissive: 0x0781ff,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.85
    });

    const createPawn = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.2, 16), mat);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 0.6, 16), mat);
      body.position.y = 0.35;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
      head.position.y = 0.85;
      g.add(base, body, head);
      return g;
    };

    const createRook = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.2, 16), mat);
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.33, 0.8, 16), mat);
      column.position.y = 0.45;
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 0.35, 16), mat);
      turret.position.y = 0.95;
      g.add(base, column, turret);
      return g;
    };

    const createKnight = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.2, 16), mat);
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.65, 0.4), mat);
      neck.position.set(0, 0.45, -0.05);
      neck.rotation.x = -0.25;
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.38, 0.55), mat);
      head.position.set(0, 0.85, 0.12);
      head.rotation.x = 0.35;
      g.add(base, neck, head);
      return g;
    };

    const createBishop = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.2, 16), mat);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.32, 0.9, 16), mat);
      stem.position.y = 0.5;
      const mitre = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), mat);
      mitre.scale.set(0.9, 1.4, 0.9);
      mitre.position.y = 1.15;
      g.add(base, stem, mitre);
      return g;
    };

    const createQueen = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.48, 0.22, 16), mat);
      const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.35, 1.1, 16), mat);
      waist.position.y = 0.65;
      const coronet = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.4, 16), mat);
      coronet.rotation.x = Math.PI;
      coronet.position.y = 1.35;
      g.add(base, waist, coronet);
      return g;
    };

    const createKing = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 0.24, 16), mat);
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.38, 1.25, 16), mat);
      column.position.y = 0.72;
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.28, 0.35, 16), mat);
      crown.position.y = 1.45;
      g.add(base, column, crown);
      return g;
    };

    // Piece Grid Dictionary: board[r][c]
    const boardPieces = {};
    const allPieces = [];

    const spawnPiece = (pieceObj, r, c, name) => {
      const posX = c * tileSpacing - boardOffset;
      const posZ = r * tileSpacing - boardOffset;
      pieceObj.position.set(posX, 0.22, posZ);
      pieceObj.userData = {
        r,
        c,
        startR: r,
        startC: c,
        startX: posX,
        startZ: posZ,
        targetX: posX,
        targetZ: posZ,
        name
      };
      chessGroup.add(pieceObj);
      boardPieces[`${r}_${c}`] = pieceObj;
      allPieces.push(pieceObj);
      return pieceObj;
    };

    // 1. Spawn White & Black Pawns
    for (let c = 0; c < 8; c++) {
      spawnPiece(createPawn(true), 1, c, 'WhitePawn');
      spawnPiece(createPawn(false), 6, c, 'BlackPawn');
    }

    // 2. White Back Rank (r=0)
    spawnPiece(createRook(true), 0, 0, 'WhiteRook');
    spawnPiece(createKnight(true), 0, 1, 'WhiteKnightB');
    spawnPiece(createBishop(true), 0, 2, 'WhiteBishopC');
    spawnPiece(createQueen(true), 0, 3, 'WhiteQueen');
    spawnPiece(createKing(true), 0, 4, 'WhiteKing');
    const whiteBishopF = spawnPiece(createBishop(true), 0, 5, 'WhiteBishopF');
    const whiteKnightG = spawnPiece(createKnight(true), 0, 6, 'WhiteKnightG');
    spawnPiece(createRook(true), 0, 7, 'WhiteRook');

    // 3. Black Back Rank (r=7)
    spawnPiece(createRook(false), 7, 0, 'BlackRook');
    const blackKnightB = spawnPiece(createKnight(false), 7, 1, 'BlackKnightB');
    spawnPiece(createBishop(false), 7, 2, 'BlackBishopC');
    spawnPiece(createQueen(false), 7, 3, 'BlackQueen');
    spawnPiece(createKing(false), 7, 4, 'BlackKing');
    spawnPiece(createBishop(false), 7, 5, 'BlackBishopF');
    spawnPiece(createKnight(false), 7, 6, 'BlackKnightG');
    spawnPiece(createRook(false), 7, 7, 'BlackRook');

    // Legal Move Indicator
    const legalDotGeo = new THREE.RingGeometry(0.2, 0.35, 24);
    legalDotGeo.rotateX(-Math.PI / 2);
    const legalDot = new THREE.Mesh(
      legalDotGeo,
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    legalDot.position.y = 0.15;
    chessGroup.add(legalDot);

    // Authentic Opening Moves (e4, e5, Nf3, Nc6, Bc4)
    const whitePawnE = boardPieces['1_4']; // e2 pawn
    const blackPawnE = boardPieces['6_4']; // e7 pawn

    const moveSequence = [
      { piece: whitePawnE, from: { r: 1, c: 4 }, to: { r: 3, c: 4 }, isKnight: false },
      { piece: blackPawnE, from: { r: 6, c: 4 }, to: { r: 4, c: 4 }, isKnight: false },
      { piece: whiteKnightG, from: { r: 0, c: 6 }, to: { r: 2, c: 5 }, isKnight: true },
      { piece: blackKnightB, from: { r: 7, c: 1 }, to: { r: 5, c: 2 }, isKnight: true },
      { piece: whiteBishopF, from: { r: 0, c: 5 }, to: { r: 3, c: 2 }, isKnight: false }
    ];

    chessGroup.rotation.x = 0.58;
    chessGroup.rotation.y = 0.25;

    this.scene.add(chessGroup);
    this.groups.chess = {
      group: chessGroup,
      tiles,
      allPieces,
      boardPieces,
      legalDot,
      moveSequence,
      boardOffset,
      tileSpacing,
      activeMoveIdx: 0,
      moveProgress: 0,
      isResetting: false,
      resetProgress: 0,
      targetScale: this.currentType === 'chess' ? 1 : 0.001,
      targetOpacity: this.currentType === 'chess' ? 1 : 0
    };
  }

  // =========================================================================
  // 3. 3D M-E-R-N SYMBOLS WITH HOVER SCATTER
  // =========================================================================
  initMernScene() {
    const mernGroup = new THREE.Group();
    const emblems = [];

    // M: MongoDB 3D Leaf Emblem
    const mGroup = new THREE.Group();
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 2.0);
    leafShape.bezierCurveTo(1.3, 1.1, 1.5, -0.7, 0, -2.0);
    leafShape.bezierCurveTo(-1.5, -0.7, -1.3, 1.1, 0, 2.0);

    const leafGeo = new THREE.ExtrudeGeometry(leafShape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.12
    });

    const mongoMat = new THREE.MeshStandardMaterial({
      color: 0x13aa52,
      emissive: 0x00ed64,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const leafMesh = new THREE.Mesh(leafGeo, mongoMat);
    leafMesh.scale.set(0.9, 0.9, 0.9);
    mGroup.add(leafMesh);
    mernGroup.add(mGroup);
    emblems.push({
      group: mGroup,
      name: 'MongoDB',
      color: 0x13aa52,
      homePos: new THREE.Vector3(-4.8, 2.2, 0),
      currentPos: new THREE.Vector3(-4.8, 2.2, 0),
      velocity: new THREE.Vector3(),
      rotationSpeed: new THREE.Vector3(0.4, 0.6, 0.2)
    });

    // E: Express.js 3D Hexagonal Badge
    const eGroup = new THREE.Group();
    const hexGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.35, 6);
    const expressMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.4,
      roughness: 0.15,
      metalness: 0.9
    });
    const hexMesh = new THREE.Mesh(hexGeo, expressMat);
    hexMesh.rotation.x = Math.PI / 2;
    eGroup.add(hexMesh);
    mernGroup.add(eGroup);
    emblems.push({
      group: eGroup,
      name: 'Express.js',
      color: 0x38bdf8,
      homePos: new THREE.Vector3(4.8, 2.2, 0),
      currentPos: new THREE.Vector3(4.8, 2.2, 0),
      velocity: new THREE.Vector3(),
      rotationSpeed: new THREE.Vector3(0.5, 0.3, 0.4)
    });

    // R: React 3D Atomic Nucleus & 3 Rotating Orbital Rings
    const rGroup = new THREE.Group();
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0x00d8ff,
      emissive: 0x61dafb,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.8
    });
    const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.65, 24, 24), nucleusMat);
    rGroup.add(nucleus);

    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x61dafb,
      transparent: true,
      opacity: 0.85
    });

    const createOrbit = (rotX, rotY, rotZ) => {
      const orbitGeo = new THREE.TorusGeometry(1.8, 0.05, 12, 64);
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.scale.set(1.0, 0.45, 1.0);
      orbit.rotation.set(rotX, rotY, rotZ);
      return orbit;
    };

    rGroup.add(
      createOrbit(Math.PI / 3, 0, 0),
      createOrbit(Math.PI / 3, 0, Math.PI / 3),
      createOrbit(Math.PI / 3, 0, -Math.PI / 3)
    );
    mernGroup.add(rGroup);
    emblems.push({
      group: rGroup,
      name: 'React',
      color: 0x61dafb,
      homePos: new THREE.Vector3(-4.2, -2.4, 0),
      currentPos: new THREE.Vector3(-4.2, -2.4, 0),
      velocity: new THREE.Vector3(),
      rotationSpeed: new THREE.Vector3(0.8, 0.7, 0.5)
    });

    // N: Node.js 3D Isometric Hexagon Logo
    const nGroup = new THREE.Group();
    const nodeHexGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x339933,
      emissive: 0x68a063,
      emissiveIntensity: 0.65,
      roughness: 0.2,
      metalness: 0.7
    });
    const nodeMesh = new THREE.Mesh(nodeHexGeo, nodeMat);
    nodeMesh.rotation.x = Math.PI / 2;
    nGroup.add(nodeMesh);
    mernGroup.add(nGroup);
    emblems.push({
      group: nGroup,
      name: 'Node.js',
      color: 0x68a063,
      homePos: new THREE.Vector3(4.2, -2.4, 0),
      currentPos: new THREE.Vector3(4.2, -2.4, 0),
      velocity: new THREE.Vector3(),
      rotationSpeed: new THREE.Vector3(0.3, 0.5, 0.7)
    });

    this.scene.add(mernGroup);
    this.groups.network = {
      group: mernGroup,
      emblems,
      scatterForce: 0,
      targetScale: this.currentType === 'network' ? 1 : 0.001,
      targetOpacity: this.currentType === 'network' ? 1 : 0
    };
  }

  setVisualType(type) {
    if (this.currentType === type) return;
    this.targetType = type;
    this.currentType = type;

    Object.keys(this.groups).forEach((key) => {
      const g = this.groups[key];
      const isTarget = key === type;
      if (isTarget) {
        g.group.visible = true;
      }
      g.targetScale = isTarget ? 1 : 0.001;
      g.targetOpacity = isTarget ? 1 : 0;
    });
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);

      if (this.groups.network && this.groups.network.group.visible) {
        this.groups.network.scatterForce = Math.min(this.groups.network.scatterForce + 0.35, 2.5);
      }
    };

    this.onMouseEnter = () => {
      this.isHovered = true;
      if (this.groups.network) {
        this.groups.network.scatterForce = 2.0;
      }
    };

    this.onMouseLeave = () => {
      this.isHovered = false;
      this.targetMouse.set(0, 0);
    };

    this.onClick = () => {
      if (this.groups.chess && this.groups.chess.group.visible) {
        const c = this.groups.chess;
        if (!c.isResetting) {
          c.activeMoveIdx = (c.activeMoveIdx + 1) % (c.moveSequence.length + 1);
          c.moveProgress = 0;
          if (c.activeMoveIdx >= c.moveSequence.length) {
            c.isResetting = true;
            c.resetProgress = 0;
          }
        }
      }

      if (this.groups.network && this.groups.network.group.visible) {
        this.groups.network.scatterForce = 3.5;
      }

      if (this.groups.neural && this.groups.neural.group.visible) {
        this.groups.neural.pulseEnergy = 1.0;
      }
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('mouseenter', this.onMouseEnter);
    this.container.addEventListener('mouseleave', this.onMouseLeave);
    this.container.addEventListener('click', this.onClick);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.06);

    const targetCam = this.cameraTargets[this.currentType] || this.cameraTargets.neural;
    this.camera.position.lerp(
      new THREE.Vector3(
        targetCam.pos.x + this.mouse.x * 2.2,
        targetCam.pos.y + this.mouse.y * 1.5,
        targetCam.pos.z
      ),
      0.06
    );

    this.currentLookAt.lerp(targetCam.lookAt, 0.06);
    this.camera.lookAt(this.currentLookAt);

    // Smooth transition scale between groups
    Object.keys(this.groups).forEach((key) => {
      const g = this.groups[key];
      const currentScale = g.group.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, g.targetScale, 0.08);
      g.group.scale.setScalar(newScale);

      if (newScale < 0.01 && g.targetScale === 0.001) {
        g.group.visible = false;
      }
    });

    // 1. Natural Brain in Glass Water Orb Animation Loop
    if (this.groups.neural && this.groups.neural.group.visible) {
      const n = this.groups.neural;
      const orb = n.neuralOrb || n.holoHelmet;

      if (orb && orb.brainGroup) {
        // Brain tracks cursor smoothly with natural buoyancy
        const targetRotY = 0.45 + this.mouse.x * 0.40;
        const targetRotX = -0.05 - this.mouse.y * 0.26;
        const targetRotZ = -this.mouse.x * 0.06;

        orb.brainGroup.rotation.y = THREE.MathUtils.lerp(orb.brainGroup.rotation.y, targetRotY, 0.08);
        orb.brainGroup.rotation.x = THREE.MathUtils.lerp(orb.brainGroup.rotation.x, targetRotX, 0.08);
        orb.brainGroup.rotation.z = THREE.MathUtils.lerp(orb.brainGroup.rotation.z, targetRotZ, 0.08);

        // Gentle floating buoyancy drift inside fluid
        orb.brainGroup.position.y = 0.06 + Math.sin(this.time * 1.4) * 0.035;

        // Subtle specular highlight parallax
        if (orb.specArc1) {
          orb.specArc1.rotation.z = 0.78 + this.mouse.x * 0.12;
          orb.specArc1.rotation.y = 0.48 + this.mouse.y * 0.10;
        }
        if (orb.specArc2) {
          orb.specArc2.rotation.z = -0.35 + this.mouse.x * 0.12;
          orb.specArc2.rotation.y = -0.62 + this.mouse.y * 0.10;
        }

        // Natural Rising Water Bubbles with fluid wobble & pop/respawn physics
        if (orb.bubbles && orb.bubbles.length > 0) {
          for (let i = 0; i < orb.bubbles.length; i++) {
            const b = orb.bubbles[i];
            b.mesh.position.y += b.speed * delta;
            b.mesh.position.x = b.baseX + Math.sin(this.time * b.wobbleSpeed + b.phase) * b.wobbleAmp;
            b.mesh.position.z = b.baseZ + Math.cos(this.time * b.wobbleSpeed + b.phase) * b.wobbleAmp;

            const distSq = b.mesh.position.x * b.mesh.position.x +
                           b.mesh.position.y * b.mesh.position.y +
                           b.mesh.position.z * b.mesh.position.z;

            // When bubble reaches top of liquid or exits sphere boundary, pop and respawn at bottom
            if (b.mesh.position.y > 1.30 || distSq > 2.1) {
              b.mesh.position.y = -1.20 - Math.random() * 0.28;
              const angle = Math.random() * Math.PI * 2;
              const dist = Math.random() * 0.95;
              b.baseX = Math.cos(angle) * dist;
              b.baseZ = Math.sin(angle) * dist;
              b.mesh.position.x = b.baseX;
              b.mesh.position.z = b.baseZ;
            }
          }
        }
      }

      // Parallax Tilt for entire assembly
      const pivotRotY = this.mouse.x * 0.22;
      const pivotRotX = -this.mouse.y * 0.16;
      n.mainPivot.rotation.y = THREE.MathUtils.lerp(n.mainPivot.rotation.y, pivotRotY, 0.08);
      n.mainPivot.rotation.x = THREE.MathUtils.lerp(n.mainPivot.rotation.x, pivotRotX, 0.08);

      // Floating Holographic Screens Subtle Levitation & Parallax Drift
      n.screenLeft.meshGroup.position.x = n.screenLeft.basePos.x + Math.sin(this.time * 0.8) * 0.06 + this.mouse.x * 0.22;
      n.screenLeft.meshGroup.position.y = n.screenLeft.basePos.y + Math.cos(this.time * 0.7) * 0.06 + this.mouse.y * 0.16;

      n.screenRight.meshGroup.position.x = n.screenRight.basePos.x + Math.sin(this.time * 0.8 + 1.2) * 0.06 + this.mouse.x * 0.22;
      n.screenRight.meshGroup.position.y = n.screenRight.basePos.y + Math.cos(this.time * 0.7 + 1.2) * 0.06 + this.mouse.y * 0.16;

      n.screenTop.meshGroup.position.y = n.screenTop.basePos.y + Math.sin(this.time * 0.9) * 0.04 + this.mouse.y * 0.1;

      // Dynamic Holographic Conduits Connecting Orb Hubs to Screens
      const leftDock = new THREE.Vector3(n.screenLeft.width / 2, 0, 0)
        .applyEuler(n.screenLeft.meshGroup.rotation)
        .add(n.screenLeft.meshGroup.position);

      const rightDock = new THREE.Vector3(-n.screenRight.width / 2, 0, 0)
        .applyEuler(n.screenRight.meshGroup.rotation)
        .add(n.screenRight.meshGroup.position);

      const topDock = new THREE.Vector3(0, -n.screenTop.height / 2, 0)
        .applyEuler(n.screenTop.meshGroup.rotation)
        .add(n.screenTop.meshGroup.position);

      const leftExit = new THREE.Vector3(-1.54, 0.15, 0.0);
      const rightExit = new THREE.Vector3(1.54, 0.15, 0.0);
      const topExit = new THREE.Vector3(0, 1.58, 0.0);

      // Update Left Conduit Line
      if (n.leftConduit) {
        const lp = n.leftConduit.geometry.attributes.position;
        lp.setXYZ(0, leftExit.x, leftExit.y, leftExit.z);
        lp.setXYZ(1, leftDock.x, leftDock.y, leftDock.z);
        lp.needsUpdate = true;
        n.leftTerminal.position.copy(leftDock);
        n.leftTerminal.quaternion.copy(n.screenLeft.meshGroup.quaternion);
      }

      // Update Right Conduit Line
      if (n.rightConduit) {
        const rp = n.rightConduit.geometry.attributes.position;
        rp.setXYZ(0, rightExit.x, rightExit.y, rightExit.z);
        rp.setXYZ(1, rightDock.x, rightDock.y, rightDock.z);
        rp.needsUpdate = true;
        n.rightTerminal.position.copy(rightDock);
        n.rightTerminal.quaternion.copy(n.screenRight.meshGroup.quaternion);
      }

      // Update Top Conduit Line
      if (n.topConduit) {
        const tp = n.topConduit.geometry.attributes.position;
        tp.setXYZ(0, topExit.x, topExit.y, topExit.z);
        tp.setXYZ(1, topDock.x, topDock.y, topDock.z);
        tp.needsUpdate = true;
        n.topTerminal.position.copy(topDock);
        n.topTerminal.quaternion.copy(n.screenTop.meshGroup.quaternion);
      }

      // Smooth Single Data Packets gliding calmly along the 3 conduits
      if (n.leftPacket) {
        const leftProg = (this.time * 0.7) % 1.0;
        n.leftPacket.position.lerpVectors(leftExit, leftDock, leftProg);
      }

      if (n.rightPacket) {
        const rightProg = (this.time * 0.7 + 0.33) % 1.0;
        n.rightPacket.position.lerpVectors(rightExit, rightDock, rightProg);
      }

      if (n.topPacket) {
        const topProg = (this.time * 0.7 + 0.66) % 1.0;
        n.topPacket.position.lerpVectors(topExit, topDock, topProg);
      }

      // Update Dynamic Canvases for Screens
      this.drawJarvisMatrixCanvas(n.screenLeft, this.time, this.isHovered, n.pulseEnergy);
      this.drawJarvisTelemetryCanvas(n.screenRight, this.time, this.isHovered, n.pulseEnergy);
      this.drawJarvisBannerCanvas(n.screenTop, this.time, this.isHovered, n.pulseEnergy);

      // Real-Time Optical Screen Reflections Parallax & Energy Pulse
      if (orb && orb.screenReflections && orb.screenReflections.length === 3) {
        const pulse = 1.0 + n.pulseEnergy * 0.35;
        orb.screenReflections[0].material.opacity = 0.72 * pulse;
        orb.screenReflections[1].material.opacity = 0.72 * pulse;
        orb.screenReflections[2].material.opacity = 0.60 * pulse;
      }

      // Update Dynamic Cube Camera Reflections (Throttled to maintain smooth 120 FPS)
      if (this.renderer && this.cubeCamera) {
        this.cubeFrameCounter = (this.cubeFrameCounter || 0) + 1;
        if (this.cubeFrameCounter % 2 === 0) {
          this.updateCubeReflection();
        }
      }

      // Energy Pulse Dissipation
      n.pulseEnergy = Math.max(0, n.pulseEnergy - delta * 2.2);
    }

    // 2. Real-Time Chess Engine: Single Piece Execution & Clean Reset
    if (this.groups.chess && this.groups.chess.group.visible) {
      const c = this.groups.chess;
      c.group.rotation.y = 0.25 + Math.sin(this.time * 0.5) * 0.04 + this.mouse.x * 0.2;
      c.group.rotation.x = 0.58 - this.mouse.y * 0.15;

      if (c.isResetting) {
        c.resetProgress = Math.min(c.resetProgress + delta * 0.8, 1.0);
        const t = c.resetProgress;
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        // Animate all moved pieces gracefully back to original starting squares
        c.moveSequence.forEach((move) => {
          const { piece } = move;
          if (piece && piece.userData) {
            piece.position.x = THREE.MathUtils.lerp(piece.userData.targetX, piece.userData.startX, easeT);
            piece.position.z = THREE.MathUtils.lerp(piece.userData.targetZ, piece.userData.startZ, easeT);
            piece.position.y = 0.22 + Math.sin(t * Math.PI) * 0.4;
          }
        });

        if (c.legalDot) {
          c.legalDot.position.y = -10; // Hide during reset
        }

        if (c.resetProgress >= 1.0) {
          c.isResetting = false;
          c.activeMoveIdx = 0;
          c.moveProgress = 0;
          c.moveSequence.forEach((move) => {
            if (move.piece && move.piece.userData) {
              move.piece.position.set(move.piece.userData.startX, 0.22, move.piece.userData.startZ);
              move.piece.userData.targetX = move.piece.userData.startX;
              move.piece.userData.targetZ = move.piece.userData.startZ;
            }
          });
        }
      } else {
        // Execute active move in sequence
        const activeMove = c.moveSequence[c.activeMoveIdx];
        if (activeMove && activeMove.piece) {
          c.moveProgress = Math.min(c.moveProgress + delta * 0.7, 1.0);
          const { piece, from, to, isKnight } = activeMove;
          const startX = from.c * c.tileSpacing - c.boardOffset;
          const startZ = from.r * c.tileSpacing - c.boardOffset;
          const endX = to.c * c.tileSpacing - c.boardOffset;
          const endZ = to.r * c.tileSpacing - c.boardOffset;

          const t = c.moveProgress;
          const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

          piece.position.x = THREE.MathUtils.lerp(startX, endX, easeT);
          piece.position.z = THREE.MathUtils.lerp(startZ, endZ, easeT);

          const hopHeight = isKnight ? 2.0 : 0.75;
          piece.position.y = 0.22 + Math.sin(t * Math.PI) * hopHeight;

          if (c.legalDot) {
            c.legalDot.position.set(endX, 0.14, endZ);
            c.legalDot.scale.setScalar(1 + Math.sin(this.time * 5) * 0.15);
          }

          if (c.moveProgress >= 1.0) {
            piece.userData.targetX = endX;
            piece.userData.targetZ = endZ;
            c.moveProgress = 0;
            c.activeMoveIdx++;

            if (c.activeMoveIdx >= c.moveSequence.length) {
              c.isResetting = true;
              c.resetProgress = 0;
            }
          }
        }
      }
    }

    // 3. MERN Emblems
    if (this.groups.network && this.groups.network.group.visible) {
      const net = this.groups.network;
      net.scatterForce = THREE.MathUtils.lerp(net.scatterForce, 0, delta * 2.2);

      net.emblems.forEach((emb) => {
        emb.group.rotation.x += emb.rotationSpeed.x * delta;
        emb.group.rotation.y += emb.rotationSpeed.y * delta;

        if (net.scatterForce > 0.05) {
          const scatterDir = emb.homePos.clone().normalize();
          emb.currentPos.copy(emb.homePos).add(scatterDir.multiplyScalar(net.scatterForce * 1.5));
        } else {
          emb.currentPos.lerp(emb.homePos, 0.08);
        }
        emb.group.position.copy(emb.currentPos);
      });
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('mouseenter', this.onMouseEnter);
    this.container.removeEventListener('mouseleave', this.onMouseLeave);
    this.container.removeEventListener('click', this.onClick);

    if (this.cubeRenderTarget) {
      this.cubeRenderTarget.dispose();
      this.cubeRenderTarget = null;
    }
    if (this.brainDiffuseMap) {
      this.brainDiffuseMap.dispose();
      this.brainDiffuseMap = null;
    }
    if (this.brainNormalMap) {
      this.brainNormalMap.dispose();
      this.brainNormalMap = null;
    }
    if (this.brainRoughnessMap) {
      this.brainRoughnessMap.dispose();
      this.brainRoughnessMap = null;
    }

    if (this.groups.neural) {
      if (this.groups.neural.screenLeft && this.groups.neural.screenLeft.texture) {
        this.groups.neural.screenLeft.texture.dispose();
      }
      if (this.groups.neural.screenRight && this.groups.neural.screenRight.texture) {
        this.groups.neural.screenRight.texture.dispose();
      }
      if (this.groups.neural.screenTop && this.groups.neural.screenTop.texture) {
        this.groups.neural.screenTop.texture.dispose();
      }
    }
  }
}

export default ProjectVisualizerScene;
