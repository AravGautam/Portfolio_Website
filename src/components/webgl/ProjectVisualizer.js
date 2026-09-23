import * as THREE from 'three';

/**
 * AAA-Grade 3D Spatial Project Visualizer Scene
 * 
 * 1. 'neural' (AI-Powered Fitness Tracker):
 *    - Bright sculpted Platinum-Titanium Cyber Android Head with chiseled jaw, brow & temple panels
 *    - Luminous cybernetic ocular lenses tracking mouse gaze
 *    - Floating Holographic Fitness Prediction Terminal with real-time calorie graph & ML telemetry
 * 
 * 2. 'chess' (Real-Time Online Chess Platform):
 *    - Authentic 8x8 tournament chessboard with beveled frame
 *    - Sculpted 3D chess pieces (King, Queen, Knight, Bishop, Rook, Pawns)
 *    - Real dynamic legal moves: parabolic L-shape Knight hopping, pawn advances, diagonal bishop sweeps
 * 
 * 3. 'network' (Full-Stack MERN Application Suite):
 *    - 4 Sculpted 3D M-E-R-N Emblems:
 *      * M: 3D MongoDB Leaf Emblem in vibrant emerald green
 *      * E: 3D Express.js Minimalist Titanium Hexagonal Badge
 *      * R: 3D React Atomic Nucleus with 3 revolving orbital rings & electrons
 *      * N: 3D Node.js Isometric Hexagonal Logo
 *    - NO central orange circle/blob (clean, uncluttered multi-tier architecture)
 *    - Direct inter-service data laser conduits
 *    - ON-HOVER / CURSOR SCATTER PHYSICS with smooth spring return
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
      neural: { pos: new THREE.Vector3(0, 0.8, 16), lookAt: new THREE.Vector3(0, 0.4, 0) },
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

    // Cinematic Lighting Setup (Crisp metallic highlights against pure black)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xb46f32, 2.8); // Warm bronze key light
    dirLight1.position.set(12, 16, 14);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00e5ff, 2.2); // Cool cyan rim light
    dirLight2.position.set(-12, -8, -10);
    this.scene.add(dirLight2);

    const frontLight = new THREE.PointLight(0xffffff, 1.5, 40);
    frontLight.position.set(0, 2, 10);
    this.scene.add(frontLight);

    this.groups = {};
    this.initAllScenes();
    this.bindEvents();
  }

  initAllScenes() {
    this.initRobotScene();
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
  // 1. PREDICTIVE AI CYBER-ANDROID ROBOT HEAD & ML HOLOGRAPHIC TERMINAL
  // =========================================================================
  initRobotScene() {
    const robotGroup = new THREE.Group();

    // Head Container (articulates with mouse)
    const headPivot = new THREE.Group();
    headPivot.position.set(-1.2, 0.5, 0);
    robotGroup.add(headPivot);

    // Premium High-Contrast Materials (Titanium Platinum & Dark Carbon)
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0xd8e2ec, // Bright platinum titanium
      roughness: 0.22,
      metalness: 0.88
    });

    const darkCarbonMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Dark matte carbon
      roughness: 0.45,
      metalness: 0.6
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb46f32,
      emissive: 0xb46f32,
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8
    });

    const cyanGlowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    // 1. Cranium / Skull Cap
    const craniumGeo = new THREE.SphereGeometry(1.9, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.56);
    const cranium = new THREE.Mesh(craniumGeo, titaniumMat);
    cranium.scale.set(1.0, 1.15, 1.05);
    headPivot.add(cranium);

    // Brow Ridge & Nose Bridge
    const browGeo = new THREE.BoxGeometry(1.7, 0.35, 0.8);
    const brow = new THREE.Mesh(browGeo, darkCarbonMat);
    brow.position.set(0, 0.75, 1.45);
    const noseGeo = new THREE.ConeGeometry(0.2, 0.8, 4);
    noseGeo.rotateY(Math.PI / 4);
    const nose = new THREE.Mesh(noseGeo, titaniumMat);
    nose.position.set(0, 0.2, 1.85);
    headPivot.add(brow, nose);

    // Chiseled Cheek Plates (Left & Right)
    const cheekGeo = new THREE.BoxGeometry(0.7, 1.0, 0.6);
    const cheekL = new THREE.Mesh(cheekGeo, titaniumMat);
    cheekL.position.set(-0.9, -0.2, 1.3);
    cheekL.rotation.y = 0.25;
    cheekL.rotation.z = -0.15;
    const cheekR = new THREE.Mesh(cheekGeo, titaniumMat);
    cheekR.position.set(0.9, -0.2, 1.3);
    cheekR.rotation.y = -0.25;
    cheekR.rotation.z = 0.15;
    headPivot.add(cheekL, cheekR);

    // Cyber Jawline & Chin Vent
    const jawGeo = new THREE.BoxGeometry(1.2, 0.6, 1.0);
    const jaw = new THREE.Mesh(jawGeo, darkCarbonMat);
    jaw.position.set(0, -0.85, 1.1);
    const chinPlate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.3), bronzeMat);
    chinPlate.position.set(0, -1.1, 1.45);
    headPivot.add(jaw, chinPlate);

    // Luminous Ocular Scanner Eyes (Dual Cyber Lenses with Pupil Ring)
    const eyeHousingGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.15, 24);
    eyeHousingGeo.rotateX(Math.PI / 2);

    const eyeL = new THREE.Mesh(eyeHousingGeo, darkCarbonMat);
    eyeL.position.set(-0.55, 0.55, 1.72);
    const pupilL = new THREE.Mesh(new THREE.RingGeometry(0.08, 0.18, 16), cyanGlowMat);
    pupilL.position.set(-0.55, 0.55, 1.81);

    const eyeR = new THREE.Mesh(eyeHousingGeo, darkCarbonMat);
    eyeR.position.set(0.55, 0.55, 1.72);
    const pupilR = pupilL.clone();
    pupilR.position.set(0.55, 0.55, 1.81);

    headPivot.add(eyeL, pupilL, eyeR, pupilR);

    // Temple Audio/Sensor Discs
    const earDiscGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 24);
    earDiscGeo.rotateZ(Math.PI / 2);
    const earL = new THREE.Mesh(earDiscGeo, bronzeMat);
    earL.position.set(-1.85, 0.4, 0.1);
    const earR = earL.clone();
    earR.position.set(1.85, 0.4, 0.1);
    headPivot.add(earL, earR);

    // Neck Actuator Column
    const neckColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.95, 1.2, 16),
      darkCarbonMat
    );
    neckColumn.position.set(-1.2, -1.1, 0);
    robotGroup.add(neckColumn);

    // -----------------------------------------------------------------------
    // Holographic ML Fitness Prediction Terminal (Right side of robot)
    // -----------------------------------------------------------------------
    const hudTerminal = new THREE.Group();
    hudTerminal.position.set(2.4, 0.4, 1.5);
    robotGroup.add(hudTerminal);

    // Terminal Frame & Glass Panel
    const panelGeo = new THREE.PlaneGeometry(4.5, 3.2);
    const panelMat = new THREE.MeshBasicMaterial({
      color: 0x050c18,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    const panelWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(panelGeo),
      new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 })
    );
    hudTerminal.add(panelMesh, panelWire);

    // Dynamic Calorie Prediction Waveform
    const wavePoints = [];
    const waveLength = 3.6;
    const waveStep = 32;
    for (let i = 0; i <= waveStep; i++) {
      const x = (i / waveStep) * waveLength - waveLength / 2;
      const y = Math.sin((i / waveStep) * Math.PI * 3) * 0.45;
      wavePoints.push(new THREE.Vector3(x, y, 0.05));
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveLine = new THREE.Line(
      waveGeo,
      new THREE.LineBasicMaterial({ color: 0xb46f32, linewidth: 2 }) // Warm bronze prediction line
    );
    hudTerminal.add(waveLine);

    // Target Accuracy Ring on Terminal: 92% Indicator
    const targetRing = new THREE.Mesh(
      new THREE.RingGeometry(0.4, 0.48, 32),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
    );
    targetRing.position.set(1.4, 0.8, 0.06);
    hudTerminal.add(targetRing);

    // Horizontal Scanning Laser across HUD
    const hudLaser = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
    );
    hudLaser.position.z = 0.08;
    hudTerminal.add(hudLaser);

    // Floating Neural Data Particles streaming between Robot and Terminal
    const particleCount = 28;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 6;
      pPos[i + 1] = (Math.random() - 0.5) * 4;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.12,
      transparent: true,
      opacity: 0.75
    });
    const neuralStream = new THREE.Points(pGeo, pMat);
    robotGroup.add(neuralStream);

    this.scene.add(robotGroup);
    this.groups.neural = {
      group: robotGroup,
      headPivot,
      pupilL,
      pupilR,
      hudTerminal,
      hudLaser,
      waveLine,
      targetRing,
      neuralStream,
      targetScale: this.currentType === 'neural' ? 1 : 0.001,
      targetOpacity: this.currentType === 'neural' ? 1 : 0
    };
  }

  // =========================================================================
  // 2. REALISTIC 3D TOURNAMENT CHESSBOARD & LEGAL MOVE ENGINE
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
    const tileMap = {};

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        const isDark = (r + c) % 2 === 1;
        const tile = new THREE.Mesh(tileGeo, isDark ? darkTileMat : lightTileMat);
        const x = c * tileSpacing - boardOffset;
        const z = r * tileSpacing - boardOffset;
        tile.position.set(x, 0, z);
        tile.userData = { r, c, isDark };
        chessGroup.add(tile);
        tiles.push(tile);
        tileMap[`${r}_${c}`] = tile;
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

    // Glowing Inner Frame Bezel in Bronze
    const innerFrameGeo = new THREE.BoxGeometry(boardSize * tileSpacing + 0.15, 0.28, boardSize * tileSpacing + 0.15);
    const innerFrameWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(innerFrameGeo),
      new THREE.LineBasicMaterial({ color: 0xb46f32, transparent: true, opacity: 0.7 })
    );
    innerFrameWire.position.y = 0.05;
    chessGroup.add(innerFrameWire);

    // Authentic 3D Pieces (White = Chrome Ivory, Black = Bronze Titanium)
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.2,
      roughness: 0.2,
      metalness: 0.6
    });

    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      emissive: 0xb46f32,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.85
    });

    const createPawn = (isWhite) => {
      const g = new THREE.Group();
      const mat = isWhite ? whiteMat : blackMat;
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 0.2, 16), mat);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.3, 0.6, 16), mat);
      body.position.y = 0.35;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.04, 8, 16), mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.65;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
      head.position.y = 0.9;
      g.add(base, body, ring, head);
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
      const muzzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.3, 12), mat);
      muzzle.rotation.x = Math.PI / 2;
      muzzle.position.set(0, 0.8, 0.38);
      g.add(base, neck, head, muzzle);
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
      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), mat);
      finial.position.y = 1.6;
      g.add(base, stem, mitre, finial);
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
      const crownBall = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), mat);
      crownBall.position.y = 1.6;
      g.add(base, waist, coronet, crownBall);
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
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), mat);
      crossV.position.y = 1.8;
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.08), mat);
      crossH.position.y = 1.82;
      g.add(base, column, crown, crossV, crossH);
      return g;
    };

    const pieces = [];
    const placePiece = (pieceObj, r, c, name) => {
      pieceObj.position.set(c * tileSpacing - boardOffset, 0.22, r * tileSpacing - boardOffset);
      pieceObj.userData = { r, c, startR: r, startC: c, name };
      chessGroup.add(pieceObj);
      pieces.push(pieceObj);
      return pieceObj;
    };

    // Pawns
    for (let c = 0; c < 8; c++) {
      placePiece(createPawn(true), 1, c, 'Pawn');
      placePiece(createPawn(false), 6, c, 'Pawn');
    }

    // White Back Rank
    placePiece(createRook(true), 0, 0, 'Rook');
    const heroKnightWhite = placePiece(createKnight(true), 0, 1, 'Knight');
    placePiece(createBishop(true), 0, 2, 'Bishop');
    placePiece(createQueen(true), 0, 3, 'Queen');
    placePiece(createKing(true), 0, 4, 'King');
    const heroBishopWhite = placePiece(createBishop(true), 0, 5, 'Bishop');
    placePiece(createKnight(true), 0, 6, 'Knight');
    placePiece(createRook(true), 0, 7, 'Rook');

    // Black Back Rank
    placePiece(createRook(false), 7, 0, 'Rook');
    const heroKnightBlack = placePiece(createKnight(false), 7, 1, 'Knight');
    placePiece(createBishop(false), 7, 2, 'Bishop');
    placePiece(createQueen(false), 7, 3, 'Queen');
    placePiece(createKing(false), 7, 4, 'King');
    placePiece(createBishop(false), 7, 5, 'Bishop');
    placePiece(createKnight(false), 7, 6, 'Knight');
    placePiece(createRook(false), 7, 7, 'Rook');

    // Legal Move Indicator
    const legalDotGeo = new THREE.RingGeometry(0.2, 0.35, 24);
    legalDotGeo.rotateX(-Math.PI / 2);
    const legalDot = new THREE.Mesh(
      legalDotGeo,
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    legalDot.position.y = 0.15;
    chessGroup.add(legalDot);

    const moveSequence = [
      { piece: pieces[4], from: { r: 1, c: 4 }, to: { r: 3, c: 4 }, isKnight: false },
      { piece: pieces[12], from: { r: 6, c: 4 }, to: { r: 4, c: 4 }, isKnight: false },
      { piece: heroKnightWhite, from: { r: 0, c: 1 }, to: { r: 2, c: 2 }, isKnight: true },
      { piece: heroKnightBlack, from: { r: 7, c: 1 }, to: { r: 5, c: 2 }, isKnight: true },
      { piece: heroBishopWhite, from: { r: 0, c: 5 }, to: { r: 3, c: 2 }, isKnight: false }
    ];

    chessGroup.rotation.x = 0.58;
    chessGroup.rotation.y = 0.25;

    this.scene.add(chessGroup);
    this.groups.chess = {
      group: chessGroup,
      tiles,
      tileMap,
      pieces,
      heroKnightWhite,
      heroKnightBlack,
      legalDot,
      moveSequence,
      boardOffset,
      tileSpacing,
      activeMoveIdx: 0,
      moveProgress: 0,
      targetScale: this.currentType === 'chess' ? 1 : 0.001,
      targetOpacity: this.currentType === 'chess' ? 1 : 0
    };
  }

  // =========================================================================
  // 3. 3D M-E-R-N SYMBOLS (NO CENTRAL ORANGE CIRCLE) WITH HOVER SCATTER
  // =========================================================================
  initMernScene() {
    const mernGroup = new THREE.Group();
    const emblems = [];

    // -----------------------------------------------------------------------
    // M: MongoDB 3D Leaf Emblem (Emerald Green Organic Leaf)
    // -----------------------------------------------------------------------
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

    const spineGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.6, 8);
    const spineMesh = new THREE.Mesh(spineGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    spineMesh.position.z = 0.28;

    mGroup.add(leafMesh, spineMesh);
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

    // -----------------------------------------------------------------------
    // E: Express.js 3D Hexagonal Badge with Monogram
    // -----------------------------------------------------------------------
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

    const hexWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(hexGeo),
      new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })
    );
    hexWire.rotation.x = Math.PI / 2;

    const barMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const barTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 0.45), barMat);
    barTop.position.set(-0.2, 0.6, 0.1);
    const barMid = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.18, 0.45), barMat);
    barMid.position.set(-0.35, 0.05, 0.1);
    const barBot = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.2, 0.45), barMat);
    barBot.position.set(-0.2, -0.5, 0.1);
    const barSpine = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.3, 0.45), barMat);
    barSpine.position.set(-0.65, 0.05, 0.1);

    eGroup.add(hexMesh, hexWire, barTop, barMid, barBot, barSpine);
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

    // -----------------------------------------------------------------------
    // R: React 3D Atomic Nucleus & 3 Rotating Orbital Rings
    // -----------------------------------------------------------------------
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

    const orbit1 = createOrbit(Math.PI / 3, 0, 0);
    const orbit2 = createOrbit(Math.PI / 3, 0, Math.PI / 3);
    const orbit3 = createOrbit(Math.PI / 3, 0, -Math.PI / 3);
    rGroup.add(orbit1, orbit2, orbit3);

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

    // -----------------------------------------------------------------------
    // N: Node.js 3D Isometric Hexagon Logo
    // -----------------------------------------------------------------------
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

    const nodeInner = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.1, 0.55, 6),
      new THREE.MeshStandardMaterial({ color: 0x111c11, metalness: 0.9, roughness: 0.3 })
    );
    nodeInner.rotation.x = Math.PI / 2;

    const nodeWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(nodeHexGeo),
      new THREE.LineBasicMaterial({ color: 0x83cd29, linewidth: 2 })
    );
    nodeWire.rotation.x = Math.PI / 2;

    nGroup.add(nodeMesh, nodeInner, nodeWire);
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

    // Direct Inter-service Laser Conduits connecting MERN symbols
    const conduitGeo = new THREE.BufferGeometry();
    const conduitMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4
    });
    const conduitLine = new THREE.LineSegments(conduitGeo, conduitMat);
    mernGroup.add(conduitLine);

    this.scene.add(mernGroup);
    this.groups.network = {
      group: mernGroup,
      emblems,
      conduitLine,
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

      // On-hover scatter trigger in MERN scene
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
        this.groups.chess.activeMoveIdx = (this.groups.chess.activeMoveIdx + 1) % this.groups.chess.moveSequence.length;
        this.groups.chess.moveProgress = 0;
      }

      if (this.groups.network && this.groups.network.group.visible) {
        this.groups.network.scatterForce = 3.5;
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

    // 1. Robot Head & ML HUD
    if (this.groups.neural && this.groups.neural.group.visible) {
      const n = this.groups.neural;
      const targetRotY = this.mouse.x * 0.5;
      const targetRotX = -this.mouse.y * 0.3;
      n.headPivot.rotation.y = THREE.MathUtils.lerp(n.headPivot.rotation.y, targetRotY, 0.08);
      n.headPivot.rotation.x = THREE.MathUtils.lerp(n.headPivot.rotation.x, targetRotX, 0.08);

      // Scanning HUD laser
      n.hudLaser.position.y = Math.sin(this.time * 2.5) * 1.2;

      // ML Target indicator pulse
      n.targetRing.scale.setScalar(1 + Math.sin(this.time * 4) * 0.1);

      // Neural streaming particles
      n.neuralStream.rotation.y = this.time * 0.05;
    }

    // 2. Real-Time Chess Engine & Dynamic Move Execution
    if (this.groups.chess && this.groups.chess.group.visible) {
      const c = this.groups.chess;
      c.group.rotation.y = 0.25 + Math.sin(this.time * 0.5) * 0.05 + this.mouse.x * 0.2;
      c.group.rotation.x = 0.58 - this.mouse.y * 0.15;

      c.moveProgress = Math.min(c.moveProgress + delta * 0.75, 1.0);
      const activeMove = c.moveSequence[c.activeMoveIdx];
      if (activeMove && activeMove.piece) {
        const { piece, from, to, isKnight } = activeMove;
        const startX = from.c * c.tileSpacing - c.boardOffset;
        const startZ = from.r * c.tileSpacing - c.boardOffset;
        const endX = to.c * c.tileSpacing - c.boardOffset;
        const endZ = to.r * c.tileSpacing - c.boardOffset;

        const t = c.moveProgress;
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        piece.position.x = THREE.MathUtils.lerp(startX, endX, easeT);
        piece.position.z = THREE.MathUtils.lerp(startZ, endZ, easeT);

        const hopHeight = isKnight ? 2.2 : 0.8;
        piece.position.y = 0.22 + Math.sin(t * Math.PI) * hopHeight;

        if (c.legalDot) {
          c.legalDot.position.set(endX, 0.14, endZ);
          c.legalDot.scale.setScalar(1 + Math.sin(this.time * 5) * 0.15);
        }

        if (c.moveProgress >= 1.0) {
          c.moveProgress = 0;
          c.activeMoveIdx = (c.activeMoveIdx + 1) % c.moveSequence.length;
        }
      }
    }

    // 3. MERN Emblems with Interactive Hover Scatter Physics
    if (this.groups.network && this.groups.network.group.visible) {
      const net = this.groups.network;
      net.scatterForce = THREE.MathUtils.lerp(net.scatterForce, 0, delta * 2.2);

      const conduitPositions = [];

      net.emblems.forEach((emb, idx) => {
        emb.group.rotation.x += emb.rotationSpeed.x * delta;
        emb.group.rotation.y += emb.rotationSpeed.y * delta;
        emb.group.rotation.z += emb.rotationSpeed.z * delta;

        const orbitAngle = this.time * 0.35 + (idx * Math.PI) / 2;
        const orbitRadius = 5.2;
        const targetHomeX = Math.cos(orbitAngle) * orbitRadius;
        const targetHomeY = Math.sin(orbitAngle * 1.5) * 1.4 + (idx % 2 === 0 ? 1.0 : -1.0);
        const targetHomeZ = Math.sin(orbitAngle) * orbitRadius * 0.5;

        if (net.scatterForce > 0.05) {
          const scatterDir = new THREE.Vector3(targetHomeX, targetHomeY, targetHomeZ).normalize();
          scatterDir.x += this.mouse.x * 1.5;
          scatterDir.y += this.mouse.y * 1.5;
          scatterDir.normalize();

          const blastDist = net.scatterForce * 4.2;
          const scatterTarget = new THREE.Vector3(
            targetHomeX + scatterDir.x * blastDist,
            targetHomeY + scatterDir.y * blastDist,
            targetHomeZ + scatterDir.z * blastDist
          );
          emb.currentPos.lerp(scatterTarget, delta * 6);
        } else {
          const home = new THREE.Vector3(targetHomeX, targetHomeY, targetHomeZ);
          emb.currentPos.lerp(home, delta * 3.5);
        }

        emb.group.position.copy(emb.currentPos);

        // Add conduit line to next emblem in stack
        const nextEmb = net.emblems[(idx + 1) % net.emblems.length];
        conduitPositions.push(
          emb.currentPos.x, emb.currentPos.y, emb.currentPos.z,
          nextEmb.currentPos.x, nextEmb.currentPos.y, nextEmb.currentPos.z
        );
      });

      if (net.conduitLine) {
        net.conduitLine.geometry.setAttribute('position', new THREE.Float32BufferAttribute(conduitPositions, 3));
      }
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
  }
}
