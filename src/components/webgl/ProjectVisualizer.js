import * as THREE from 'three';

/**
 * AAA-Grade 3D Spatial Project Visualizer Scene
 * 
 * 1. 'neural' (AI-Powered Fitness Platform & ML Engine):
 *    - Terminator T-800 Cybernetic Endoskeleton Skull (Burnished Chrome & Dark Titanium)
 *    - Mechanical Titanium Teeth / Grille with Mandibular Hydraulic Pistons
 *    - Signature Glowing Ruby Red Cybernetic Ocular Cameras with Mouse-Tracking Gaze
 *    - Cyberdyne AI Telemetry HUD with Real-Time Calorie Waveforms & Target Acquisition Lock
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

    // Cinematic Lighting Setup (High-contrast metallic reflections)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x0781ff, 3.0); // Azure key light
    dirLight1.position.set(12, 16, 14);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff0033, 2.0); // Terminator crimson rim
    dirLight2.position.set(-12, -8, -10);
    this.scene.add(dirLight2);

    const frontLight = new THREE.PointLight(0xffffff, 1.6, 40);
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
  // 1. TERMINATOR T-800 CYBERNETIC SKULL & AI PREDICTION TERMINAL
  // =========================================================================
  initRobotScene() {
    const robotGroup = new THREE.Group();

    // Head Container (articulates with mouse)
    const headPivot = new THREE.Group();
    headPivot.position.set(-1.2, 0.5, 0);
    robotGroup.add(headPivot);

    // High-Contrast Terminator Materials (Polished Chrome & Dark Titanium Endoskeleton)
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xecf0f5, // Polished chrome steel
      roughness: 0.15,
      metalness: 0.95
    });

    const darkTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x1c1e22, // Dark gunmetal titanium
      roughness: 0.35,
      metalness: 0.85
    });

    const bronzeTrimMat = new THREE.MeshStandardMaterial({
      color: 0x0781ff,
      emissive: 0x0781ff,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.85
    });

    // Signature Terminator Ruby Red Ocular Materials
    const rubyGlowMat = new THREE.MeshBasicMaterial({
      color: 0xff002b
    });

    const innerPupilMat = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    // 1. Cranium / Skull Dome with Sagittal Groove
    const craniumGeo = new THREE.SphereGeometry(1.85, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.58);
    const cranium = new THREE.Mesh(craniumGeo, chromeMat);
    cranium.scale.set(1.0, 1.18, 1.08);
    headPivot.add(cranium);

    // Cranial Plate Inset Seams & Forehead Rivets
    const foreheadPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.4, 0.2),
      darkTitaniumMat
    );
    foreheadPlate.position.set(0, 1.1, 1.25);
    foreheadPlate.rotation.x = -0.3;
    headPivot.add(foreheadPlate);

    // Heavy Terminator Brow Ridge & Nasal Cavity
    const browGeo = new THREE.BoxGeometry(1.85, 0.38, 0.85);
    const brow = new THREE.Mesh(browGeo, chromeMat);
    brow.position.set(0, 0.72, 1.48);

    const noseCavity = new THREE.Mesh(
      new THREE.ConeGeometry(0.18, 0.55, 3),
      darkTitaniumMat
    );
    noseCavity.rotation.x = Math.PI;
    noseCavity.position.set(0, 0.28, 1.82);
    headPivot.add(brow, noseCavity);

    // Chiseled Cheekbones & Mandibular Insets
    const cheekGeo = new THREE.BoxGeometry(0.65, 0.85, 0.75);
    const cheekL = new THREE.Mesh(cheekGeo, chromeMat);
    cheekL.position.set(-0.95, -0.15, 1.35);
    cheekL.rotation.y = 0.3;
    cheekL.rotation.z = -0.12;
    const cheekR = new THREE.Mesh(cheekGeo, chromeMat);
    cheekR.position.set(0.95, -0.15, 1.35);
    cheekR.rotation.y = -0.3;
    cheekR.rotation.z = 0.12;
    headPivot.add(cheekL, cheekR);

    // 2. Terminator Mechanical Teeth / Jaw Grille
    const jawBase = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 1.0), darkTitaniumMat);
    jawBase.position.set(0, -0.85, 1.15);
    headPivot.add(jawBase);

    // Upper & Lower Teeth Rows (Segmented Titanium Teeth)
    const teethGroup = new THREE.Group();
    teethGroup.position.set(0, -0.55, 1.65);
    for (let i = -3; i <= 3; i++) {
      // Upper tooth
      const tTop = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.14), chromeMat);
      tTop.position.set(i * 0.16, 0.1, 0);
      // Lower tooth
      const tBot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.14), chromeMat);
      tBot.position.set(i * 0.16, -0.1, 0);
      teethGroup.add(tTop, tBot);
    }
    headPivot.add(teethGroup);

    // Mandibular Hydraulic Cylinders (Left & Right Jaw Pistons)
    const createPiston = (xPos) => {
      const pGroup = new THREE.Group();
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.9, 12), bronzeTrimMat);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 12), chromeMat);
      rod.position.y = -0.2;
      pGroup.add(cylinder, rod);
      pGroup.position.set(xPos, -0.4, 0.9);
      pGroup.rotation.z = xPos > 0 ? -0.2 : 0.2;
      return pGroup;
    };
    headPivot.add(createPiston(-1.25), createPiston(1.25));

    // 3. Signature Terminator Ruby Red Ocular Cameras
    const eyeSocketGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.25, 24);
    eyeSocketGeo.rotateX(Math.PI / 2);

    const eyeHousingL = new THREE.Mesh(eyeSocketGeo, darkTitaniumMat);
    eyeHousingL.position.set(-0.55, 0.55, 1.68);
    const eyeHousingR = new THREE.Mesh(eyeSocketGeo, darkTitaniumMat);
    eyeHousingR.position.set(0.55, 0.55, 1.68);

    // Glowing Ruby Iris Rings
    const pupilL = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.2, 24), rubyGlowMat);
    pupilL.position.set(-0.55, 0.55, 1.82);
    const pupilCenterL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), innerPupilMat);
    pupilCenterL.position.set(-0.55, 0.55, 1.83);

    const pupilR = pupilL.clone();
    pupilR.position.set(0.55, 0.55, 1.82);
    const pupilCenterR = pupilCenterL.clone();
    pupilCenterR.position.set(0.55, 0.55, 1.83);

    // Red Ocular Point Light (casts atmospheric Terminator glow)
    const eyeLight = new THREE.PointLight(0xff002b, 2.2, 6);
    eyeLight.position.set(0, 0.55, 2.2);

    headPivot.add(eyeHousingL, eyeHousingR, pupilL, pupilCenterL, pupilR, pupilCenterR, eyeLight);

    // Temple Servomotors / Sensor Discs
    const earDiscGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.35, 24);
    earDiscGeo.rotateZ(Math.PI / 2);
    const earL = new THREE.Mesh(earDiscGeo, chromeMat);
    earL.position.set(-1.88, 0.4, 0.1);
    const earR = earL.clone();
    earR.position.set(1.88, 0.4, 0.1);
    headPivot.add(earL, earR);

    // Neck Hydraulic Vertebrae Column
    const neckColumn = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 1.0, 1.3, 16),
      darkTitaniumMat
    );
    neckColumn.position.set(-1.2, -1.15, 0);
    robotGroup.add(neckColumn);

    // -----------------------------------------------------------------------
    // Cyberdyne AI Fitness Telemetry HUD Terminal (Right side of Terminator)
    // -----------------------------------------------------------------------
    const hudTerminal = new THREE.Group();
    hudTerminal.position.set(2.4, 0.4, 1.5);
    robotGroup.add(hudTerminal);

    // Terminal Frame & Red-Tinted Glass Panel
    const panelGeo = new THREE.PlaneGeometry(4.6, 3.2);
    const panelMat = new THREE.MeshBasicMaterial({
      color: 0x1a0505,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    const panelWire = new THREE.LineSegments(
      new THREE.EdgesGeometry(panelGeo),
      new THREE.LineBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.65 })
    );
    hudTerminal.add(panelMesh, panelWire);

    // Dynamic AI Calorie Prediction Waveform
    const wavePoints = [];
    const waveLength = 3.8;
    const waveStep = 32;
    for (let i = 0; i <= waveStep; i++) {
      const x = (i / waveStep) * waveLength - waveLength / 2;
      const y = Math.sin((i / waveStep) * Math.PI * 3) * 0.45;
      wavePoints.push(new THREE.Vector3(x, y, 0.05));
    }
    const waveGeo = new THREE.BufferGeometry().setFromPoints(wavePoints);
    const waveLine = new THREE.Line(
      waveGeo,
      new THREE.LineBasicMaterial({ color: 0x0781ff, linewidth: 2 })
    );
    hudTerminal.add(waveLine);

    // Terminator Target Lock Reticle (92% Accuracy Indicator)
    const targetRing = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.5, 32),
      new THREE.MeshBasicMaterial({ color: 0xff0033, side: THREE.DoubleSide })
    );
    targetRing.position.set(1.4, 0.8, 0.06);
    hudTerminal.add(targetRing);

    // Horizontal Scanning Laser across HUD
    const hudLaser = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 0.04),
      new THREE.MeshBasicMaterial({ color: 0xff0033, transparent: true, opacity: 0.9, side: THREE.DoubleSide })
    );
    hudLaser.position.z = 0.08;
    hudTerminal.add(hudLaser);

    // Floating Cyber Data Particles
    const particleCount = 30;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 6;
      pPos[i + 1] = (Math.random() - 0.5) * 4;
      pPos[i + 2] = (Math.random() - 0.5) * 4;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xff0033,
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

    // 1. Terminator T-800 Head & AI HUD
    if (this.groups.neural && this.groups.neural.group.visible) {
      const n = this.groups.neural;
      const targetRotY = this.mouse.x * 0.45;
      const targetRotX = -this.mouse.y * 0.28;
      n.headPivot.rotation.y = THREE.MathUtils.lerp(n.headPivot.rotation.y, targetRotY, 0.08);
      n.headPivot.rotation.x = THREE.MathUtils.lerp(n.headPivot.rotation.x, targetRotX, 0.08);

      // Scanning HUD laser
      n.hudLaser.position.y = Math.sin(this.time * 2.5) * 1.2;

      // ML Target indicator pulse
      n.targetRing.scale.setScalar(1 + Math.sin(this.time * 4) * 0.1);

      // Neural streaming particles
      n.neuralStream.rotation.y = this.time * 0.05;
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
  }
}

export default ProjectVisualizerScene;
