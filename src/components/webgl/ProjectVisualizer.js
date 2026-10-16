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
  constructor(container, initialVisualType = 'neural') {
    this.container = container;
    this.currentType = initialVisualType;
    this.targetType = initialVisualType;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;

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

    // Cinematic Lighting Setup (High-contrast metallic reflections)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0781ff, 3.2); // Azure key light
    dirLight1.position.set(12, 16, 14);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00f0ff, 2.4); // Electric cyan rim light
    dirLight2.position.set(-12, -8, -10);
    this.scene.add(dirLight2);

    const frontLight = new THREE.PointLight(0xffffff, 1.8, 40);
    frontLight.position.set(0, 2, 12);
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

  createIronManHoloHelmet() {
    const jarvisGroup = new THREE.Group();
    jarvisGroup.position.set(0, 0.15, 0.0);

    // 1. Professional WebGL Materials matching Iron Man Holographic Reference
    const cyanWireMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });

    const brightCyanLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const whiteHotLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });

    // Stark Ruby Red Circuit Accent Material (Neck actuators & right telemetry conduit)
    const redAccentMat = new THREE.LineBasicMaterial({
      color: 0xff1744,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    const goldAccentMat = new THREE.LineBasicMaterial({
      color: 0xffb703,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });

    // Head Pivot Group (Tracks mouse in 3D)
    const headGroup = new THREE.Group();
    jarvisGroup.add(headGroup);

    const addLine = (points, mat = cyanWireMat) => {
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, mat);
      headGroup.add(line);
      return line;
    };

    const addLineLoop = (points, mat = cyanWireMat) => {
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.LineLoop(geo, mat);
      headGroup.add(line);
      return line;
    };

    // 2. Translucent Dark 3D Volumetric Head Mass (Gives physical depth and specular volume inside wireframe)
    const domeShellGeo = new THREE.SphereGeometry(1.25, 24, 20);
    domeShellGeo.scale(0.96, 1.28, 0.92);
    const domeShellMat = new THREE.MeshStandardMaterial({
      color: 0x040812,
      roughness: 0.35,
      metalness: 0.9,
      transparent: true,
      opacity: 0.92,
      depthWrite: false
    });
    const domeShell = new THREE.Mesh(domeShellGeo, domeShellMat);
    domeShell.position.set(0, 0.25, -0.12);
    headGroup.add(domeShell);

    // 3. Central Vertical Centerline (Top of forehead all the way down to chin)
    addLine([
      new THREE.Vector3(0, 1.58, 0.50),
      new THREE.Vector3(0, -1.24, 0.72)
    ], cyanWireMat);

    // 4. Outer Cranium Silhouette Dome
    addLine([
      new THREE.Vector3(-1.18, 0.22, 0.05),
      new THREE.Vector3(-1.12, 0.92, 0.25),
      new THREE.Vector3(-0.85, 1.38, 0.42),
      new THREE.Vector3(0, 1.62, 0.52),
      new THREE.Vector3(0.85, 1.38, 0.42),
      new THREE.Vector3(1.12, 0.92, 0.25),
      new THREE.Vector3(1.18, 0.22, 0.05)
    ], cyanWireMat);

    // 5. Forehead Facet Seams (Matching User Reference Image)
    // Upper horizontal line extending past cranium on left
    addLine([
      new THREE.Vector3(-1.42, 1.32, 0.38),
      new THREE.Vector3(0.88, 1.32, 0.40)
    ], cyanWireMat);

    // Mid-forehead horizontal line
    addLine([
      new THREE.Vector3(-0.92, 0.98, 0.52),
      new THREE.Vector3(0.92, 0.98, 0.52)
    ], cyanWireMat);

    // Diagonal forehead facet lines
    addLine([new THREE.Vector3(0, 1.62, 0.52), new THREE.Vector3(-0.92, 0.98, 0.52)], cyanWireMat);
    addLine([new THREE.Vector3(0, 1.62, 0.52), new THREE.Vector3(0.92, 0.98, 0.52)], cyanWireMat);
    addLine([new THREE.Vector3(-0.92, 0.98, 0.52), new THREE.Vector3(-0.45, 0.68, 0.68)], cyanWireMat);
    addLine([new THREE.Vector3(0.92, 0.98, 0.52), new THREE.Vector3(0.45, 0.68, 0.68)], cyanWireMat);
    addLine([new THREE.Vector3(0, 0.98, 0.58), new THREE.Vector3(-0.45, 0.68, 0.68)], cyanWireMat);
    addLine([new THREE.Vector3(0, 0.98, 0.58), new THREE.Vector3(0.45, 0.68, 0.68)], cyanWireMat);

    // 6. Crisp White Brow Line
    addLine([
      new THREE.Vector3(-0.96, 0.68, 0.65),
      new THREE.Vector3(0.96, 0.68, 0.65)
    ], whiteHotLineMat);

    // 7. Signature Slanted Luminous Dual-Segment Visor Eyes (Exact Reference Match)
    const eyeVisorMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const createEyeVisor = (p0, p1, p2, p3, underlineStart, underlineEnd) => {
      const geo = new THREE.BufferGeometry();
      const vertices = new Float32Array([
        p0.x, p0.y, p0.z,
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,

        p0.x, p0.y, p0.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z
      ]);
      geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, eyeVisorMat);
      headGroup.add(mesh);

      // White perimeter outline loop
      addLineLoop([p0, p1, p2, p3], whiteHotLineMat);

      // Horizontal white underline directly beneath visor (exact match to picture)
      addLine([underlineStart, underlineEnd], whiteHotLineMat);
    };

    // Left Eye Visor + Underline
    createEyeVisor(
      new THREE.Vector3(-0.24, 0.54, 0.78),
      new THREE.Vector3(-0.78, 0.60, 0.70),
      new THREE.Vector3(-0.74, 0.48, 0.72),
      new THREE.Vector3(-0.26, 0.44, 0.78),
      new THREE.Vector3(-0.76, 0.36, 0.72),
      new THREE.Vector3(-0.25, 0.36, 0.78)
    );

    // Right Eye Visor + Underline
    createEyeVisor(
      new THREE.Vector3(0.24, 0.54, 0.78),
      new THREE.Vector3(0.78, 0.60, 0.70),
      new THREE.Vector3(0.74, 0.48, 0.72),
      new THREE.Vector3(0.26, 0.44, 0.78),
      new THREE.Vector3(0.25, 0.36, 0.78),
      new THREE.Vector3(0.76, 0.36, 0.72)
    );

    // 8. Cheekbones & Outer Jaw Contours
    // Left outer jaw
    addLine([
      new THREE.Vector3(-1.18, 0.22, 0.05),
      new THREE.Vector3(-0.88, -0.62, 0.45),
      new THREE.Vector3(-0.35, -1.24, 0.68)
    ], cyanWireMat);

    // Right outer jaw
    addLine([
      new THREE.Vector3(1.18, 0.22, 0.05),
      new THREE.Vector3(0.88, -0.62, 0.45),
      new THREE.Vector3(0.35, -1.24, 0.68)
    ], cyanWireMat);

    // Left inner cheek diagonal facet
    addLine([
      new THREE.Vector3(-0.88, 0.68, 0.65),
      new THREE.Vector3(-0.62, -0.22, 0.72),
      new THREE.Vector3(-0.35, -1.24, 0.68)
    ], cyanWireMat);

    // Right inner cheek diagonal facet
    addLine([
      new THREE.Vector3(0.88, 0.68, 0.65),
      new THREE.Vector3(0.62, -0.22, 0.72),
      new THREE.Vector3(0.35, -1.24, 0.68)
    ], cyanWireMat);

    // 9. Mouth Vent & White Chin Box (Exact Reference Match)
    // Clean horizontal mouth line
    addLine([
      new THREE.Vector3(-0.36, -0.42, 0.80),
      new THREE.Vector3(0.36, -0.42, 0.80)
    ], cyanWireMat);

    // Small vertical micro-notch on center line
    addLine([
      new THREE.Vector3(0, -0.42, 0.80),
      new THREE.Vector3(0, -0.50, 0.78)
    ], brightCyanLineMat);

    // White rectangular box right on the chin
    addLineLoop([
      new THREE.Vector3(-0.20, -0.92, 0.74),
      new THREE.Vector3(0.20, -0.92, 0.74),
      new THREE.Vector3(0.20, -1.18, 0.72),
      new THREE.Vector3(-0.20, -1.18, 0.72)
    ], whiteHotLineMat);

    // 10. Ear Transceiver Loops with Golden Dots
    [-1.18, 1.18].forEach((sideX) => {
      const earLoopGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(sideX, 0.35, 0.05),
        new THREE.Vector3(sideX + (sideX > 0 ? 0.08 : -0.08), 0.22, 0.05),
        new THREE.Vector3(sideX, 0.08, 0.05),
        new THREE.Vector3(sideX - (sideX > 0 ? 0.06 : -0.06), 0.22, 0.05)
      ]);
      headGroup.add(new THREE.LineLoop(earLoopGeo, cyanWireMat));

      const earDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffb703 })
      );
      earDot.position.set(sideX, 0.22, 0.05);
      headGroup.add(earDot);
    });

    // 11. Cybernetic Neck, Red Actuator Blocks & Collar Arcs
    // Diagonal neck boundaries
    addLine([new THREE.Vector3(-0.55, -1.24, 0.65), new THREE.Vector3(-0.85, -1.75, 0.35)], cyanWireMat);
    addLine([new THREE.Vector3(0.55, -1.24, 0.65), new THREE.Vector3(0.85, -1.75, 0.35)], cyanWireMat);

    // Curved collar arcs under chin
    addLine([
      new THREE.Vector3(-0.68, -1.30, 0.58),
      new THREE.Vector3(0, -1.38, 0.62),
      new THREE.Vector3(0.68, -1.30, 0.58)
    ], cyanWireMat);

    addLine([
      new THREE.Vector3(-0.82, -1.48, 0.50),
      new THREE.Vector3(0, -1.56, 0.54),
      new THREE.Vector3(0.82, -1.48, 0.50)
    ], cyanWireMat);

    // Center neck parallel bars
    addLine([new THREE.Vector3(-0.35, -1.68, 0.48), new THREE.Vector3(0.35, -1.68, 0.48)], cyanWireMat);
    addLine([new THREE.Vector3(-0.30, -1.75, 0.46), new THREE.Vector3(0.30, -1.75, 0.46)], cyanWireMat);

    // Left Red Actuator Block
    const redLeftGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.55, -1.32, 0.50),
      new THREE.Vector3(-0.85, -1.32, 0.40),
      new THREE.Vector3(-0.95, -1.72, 0.30),
      new THREE.Vector3(-0.65, -1.72, 0.40)
    ]);
    jarvisGroup.add(new THREE.LineLoop(redLeftGeo, redAccentMat));
    jarvisGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.60, -1.52, 0.45),
      new THREE.Vector3(-0.90, -1.52, 0.35)
    ]), redAccentMat));

    // Right Red Actuator Block
    const redRightGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.55, -1.32, 0.50),
      new THREE.Vector3(0.85, -1.32, 0.40),
      new THREE.Vector3(0.95, -1.72, 0.30),
      new THREE.Vector3(0.65, -1.72, 0.40)
    ]);
    jarvisGroup.add(new THREE.LineLoop(redRightGeo, redAccentMat));
    jarvisGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.60, -1.52, 0.45),
      new THREE.Vector3(0.90, -1.52, 0.35)
    ]), redAccentMat));

    // 8 Red Corner Node Spheres
    const redNodeMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
    const redNodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    [
      new THREE.Vector3(-0.55, -1.32, 0.50),
      new THREE.Vector3(-0.85, -1.32, 0.40),
      new THREE.Vector3(-0.95, -1.72, 0.30),
      new THREE.Vector3(-0.65, -1.72, 0.40),
      new THREE.Vector3(0.55, -1.32, 0.50),
      new THREE.Vector3(0.85, -1.32, 0.40),
      new THREE.Vector3(0.95, -1.72, 0.30),
      new THREE.Vector3(0.65, -1.72, 0.40)
    ].forEach((pos) => {
      const redNode = new THREE.Mesh(redNodeGeo, redNodeMat);
      redNode.position.copy(pos);
      jarvisGroup.add(redNode);
    });

    // 12. Upper Torso Shoulders & Chest Stark Arc Reactor
    // Collar / Shoulder Line
    const clavicleGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-3.2, -1.95, 0.05),
      new THREE.Vector3(-1.25, -1.82, 0.28),
      new THREE.Vector3(1.25, -1.82, 0.28),
      new THREE.Vector3(3.2, -1.95, 0.05)
    ]);
    jarvisGroup.add(new THREE.Line(clavicleGeo, cyanWireMat));

    // Left and Right Pectoral Boxes
    const leftPecGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.25, -1.85, 0.30),
      new THREE.Vector3(-1.18, -2.45, 0.35),
      new THREE.Vector3(-0.35, -2.45, 0.45),
      new THREE.Vector3(-0.35, -1.88, 0.42)
    ]);
    jarvisGroup.add(new THREE.LineLoop(leftPecGeo, cyanWireMat));

    const rightPecGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.25, -1.85, 0.30),
      new THREE.Vector3(1.18, -2.45, 0.35),
      new THREE.Vector3(0.35, -2.45, 0.45),
      new THREE.Vector3(0.35, -1.88, 0.42)
    ]);
    jarvisGroup.add(new THREE.LineLoop(rightPecGeo, cyanWireMat));

    // Stark Arc Reactor in Center of Chest
    const chestReactorGroup = new THREE.Group();
    chestReactorGroup.position.set(0, -2.15, 0.45);

    const chestReactorOuter = new THREE.Mesh(
      new THREE.RingGeometry(0.34, 0.42, 36),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
    );
    chestReactorGroup.add(chestReactorOuter);

    const chestReactorInner = new THREE.Mesh(
      new THREE.RingGeometry(0.20, 0.28, 32),
      new THREE.MeshBasicMaterial({ color: 0xffb703, side: THREE.DoubleSide })
    );
    chestReactorGroup.add(chestReactorInner);

    const chestReactorCoreDisc = new THREE.Mesh(
      new THREE.CircleGeometry(0.20, 32),
      new THREE.MeshBasicMaterial({ color: 0x020610, side: THREE.DoubleSide })
    );
    chestReactorCoreDisc.position.z = 0.01;
    chestReactorGroup.add(chestReactorCoreDisc);

    // Stark Equilateral White Triangle pointing UP
    const triRadius = 0.16;
    const triPts = [
      new THREE.Vector3(0, triRadius, 0.02),
      new THREE.Vector3(Math.cos(Math.PI * 7 / 6) * triRadius, Math.sin(Math.PI * 7 / 6) * triRadius, 0.02),
      new THREE.Vector3(Math.cos(Math.PI * 11 / 6) * triRadius, Math.sin(Math.PI * 11 / 6) * triRadius, 0.02),
      new THREE.Vector3(0, triRadius, 0.02)
    ];
    chestReactorGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(triPts), whiteHotLineMat));

    // Glowing cyan center dot inside triangle
    const chestCoreSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    chestCoreSphere.position.z = 0.03;
    chestReactorGroup.add(chestCoreSphere);

    const chestLight = new THREE.PointLight(0x00f0ff, 2.5, 8);
    chestReactorGroup.add(chestLight);
    jarvisGroup.add(chestReactorGroup);

    // 13. Enclosing Concentric Circles, Nodes, and Telemetry Conduits (Exact Reference Feature)
    const framingRingsGroup = new THREE.Group();
    framingRingsGroup.position.set(0, 0.25, 0.02);
    jarvisGroup.add(framingRingsGroup);

    // Large Outer Teal Circle
    const outerTealRing = new THREE.Mesh(
      new THREE.RingGeometry(2.14, 2.18, 64),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
    );
    framingRingsGroup.add(outerTealRing);

    // Inner Golden Circle
    const innerGoldRing = new THREE.Mesh(
      new THREE.RingGeometry(1.76, 1.80, 64),
      new THREE.MeshBasicMaterial({ color: 0xffb703, side: THREE.DoubleSide, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending })
    );
    framingRingsGroup.add(innerGoldRing);

    // Top Vertical Line & Gold Node Sphere
    const topPinGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.78, 0),
      new THREE.Vector3(0, 2.16, 0)
    ]);
    framingRingsGroup.add(new THREE.Line(topPinGeo, goldAccentMat));

    const topGoldDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffb703 })
    );
    topGoldDot.position.set(0, 2.16, 0);
    framingRingsGroup.add(topGoldDot);

    // Left Horizontal Node on Circle
    const leftCircleDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff })
    );
    leftCircleDot.position.set(-2.16, -0.03, 0);
    framingRingsGroup.add(leftCircleDot);

    // Right Horizontal Node on Circle & Target Reticle
    const rightCircleDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff1744 })
    );
    rightCircleDot.position.set(2.16, -0.03, 0);
    framingRingsGroup.add(rightCircleDot);

    const rightTargetReticle = new THREE.Mesh(
      new THREE.RingGeometry(0.08, 0.11, 24),
      new THREE.MeshBasicMaterial({ color: 0xff1744, side: THREE.DoubleSide, transparent: true, opacity: 0.95 })
    );
    rightTargetReticle.position.set(2.46, -0.03, 0);
    framingRingsGroup.add(rightTargetReticle);

    // 14. Animated Diagnostic Horizontal Laser Scanline
    const scanlineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-1.35, 0, 0.82),
      new THREE.Vector3(1.35, 0, 0.82)
    ]);
    const scanlineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const scanline = new THREE.Line(scanlineGeo, scanlineMat);
    headGroup.add(scanline);

    return {
      jarvisGroup,
      headGroup,
      eyeVisorMat,
      scanline,
      chestReactorGroup,
      chestCoreSphere,
      outerReticle: outerTealRing,
      innerReticle: innerGoldRing
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

    // 2. Central Holographic Iron Man / J.A.R.V.I.S. AI Core (Image 1)
    const holoHelmet = this.createIronManHoloHelmet();
    mainPivot.add(holoHelmet.jarvisGroup);

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
      holoHelmet,
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

    // 1. J.A.R.V.I.S. Iron Man Holographic Interface Animation Loop
    if (this.groups.neural && this.groups.neural.group.visible) {
      const n = this.groups.neural;
      const h = n.holoHelmet;

      // 1. Real-Time 3D Head Tracking (Iron Man looks directly at cursor with weighted inertia)
      if (h && h.headGroup) {
        const targetRotY = this.mouse.x * 0.45;
        const targetRotX = -this.mouse.y * 0.32;
        const targetRotZ = -this.mouse.x * 0.08;

        h.headGroup.rotation.y = THREE.MathUtils.lerp(h.headGroup.rotation.y, targetRotY, 0.08);
        h.headGroup.rotation.x = THREE.MathUtils.lerp(h.headGroup.rotation.x, targetRotX, 0.08);
        h.headGroup.rotation.z = THREE.MathUtils.lerp(h.headGroup.rotation.z, targetRotZ, 0.08);

        // Holographic Diagnostic Scanline Sweeping Vertically Across Faceplate
        if (h.scanline) {
          h.scanline.position.y = 0.55 + Math.sin(this.time * 2.8) * 1.35;
        }

        // Slender Eye Visor Shimmer and Flare
        if (h.eyeVisorMat) {
          const breath = 0.85 + Math.sin(this.time * 3.5) * 0.12 + (n.pulseEnergy * 0.45);
          h.eyeVisorMat.opacity = Math.min(1.0, breath);
        }

        // Concentric Reticle Dials Rotation
        if (h.outerReticle) h.outerReticle.rotation.z += delta * 0.22;
        if (h.innerReticle) h.innerReticle.rotation.z -= delta * 0.18;

        // Chest Stark Arc Reactor Breathing
        if (h.chestReactorGroup) {
          const cBreath = 1.0 + Math.sin(this.time * 2.4) * 0.04 + (n.pulseEnergy * 0.15);
          h.chestReactorGroup.scale.set(cBreath, cBreath, 1);
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

      // Dynamic Holographic Conduits Connecting Iron Man Ear Hubs / Crown to Screens
      const leftDock = new THREE.Vector3(n.screenLeft.width / 2, 0, 0)
        .applyEuler(n.screenLeft.meshGroup.rotation)
        .add(n.screenLeft.meshGroup.position);

      const rightDock = new THREE.Vector3(-n.screenRight.width / 2, 0, 0)
        .applyEuler(n.screenRight.meshGroup.rotation)
        .add(n.screenRight.meshGroup.position);

      const topDock = new THREE.Vector3(0, -n.screenTop.height / 2, 0)
        .applyEuler(n.screenTop.meshGroup.rotation)
        .add(n.screenTop.meshGroup.position);

      const leftExit = new THREE.Vector3(-1.18, 0.22, 0.05);
      const rightExit = new THREE.Vector3(1.18, 0.22, 0.05);
      const topExit = new THREE.Vector3(0, 2.4, 0.05);

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
