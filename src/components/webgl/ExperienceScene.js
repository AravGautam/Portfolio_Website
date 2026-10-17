import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

/**
 * 3D Scenic Pacific Coast Highway Experience Scene
 * Scenic Serpentine Mountain Highway Experience Scene:
 * - Serpentine asphalt coastal highway hugging cliffs
 * - Pacific Ocean on the LEFT with animated rolling swells, sea stacks & crashing white surf
 * - Dramatic sunlit mountain bluffs on the RIGHT with golden rock & green cypress groves
 * - Roadway with double solid yellow center lines & white shoulder stripes
 * - Galvanized silver W-beam guardrail on wooden posts along the ocean edge
 * - Tasteful, proportional roadside turnout milestone markers
 * - Coastal cruisers traveling along scenic lanes with headlights & taillights
 * - Golden hour sunset lighting casting warm radiance across cliffs & ocean
 */
export class ExperienceScene {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.onSelectMilestone = options.onSelectMilestone || null;
    this.selectedMilestoneId = null;
    this.hoveredMilestoneId = null;
    this.hitboxes = [];
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 800;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a1526);
    this.scene.fog = new THREE.FogExp2(0x102034, 0.009);

    // Camera perspective overlooking the full-length coastal highway vista
    const aspect = this.width / this.height;
    const fov = aspect < 1.0 ? 52 : 46;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.set(0.4, 7.8, 25.0);
    this.camera.lookAt(0, 2.8, -16.0);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.time = 0;
    this.worldUp = new THREE.Vector3(0, 1, 0);

    // Golden Hour Sunset Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffecd2, 1.3);
    this.scene.add(ambientLight);

    // Warm setting sun from the ocean (West) casting golden rays on the cliffs
    const sunLight = new THREE.DirectionalLight(0xffa144, 4.6);
    sunLight.position.set(-35, 24, 12);
    this.scene.add(sunLight);

    // Cool sky dome light for natural shadows
    const skyLight = new THREE.DirectionalLight(0x7dd3fc, 1.3);
    skyLight.position.set(20, 30, -20);
    this.scene.add(skyLight);

    // Ocean water bounce light
    const oceanBounce = new THREE.DirectionalLight(0x38bdf8, 0.9);
    oceanBounce.position.set(-16, -4, 10);
    this.scene.add(oceanBounce);

    this.initBigSurScene();
    this.initSeaSprayMist();
    this.bindEvents();
  }

  createTurnoutSign(milestone) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // California Scenic Highway Forest Green signboard base
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle horizontal extruded aluminum highway panel seams
    ctx.strokeStyle = '#043e2f';
    ctx.lineWidth = 1.5;
    for (let y = 16; y < canvas.height - 16; y += 16) {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(canvas.width - 16, y);
      ctx.stroke();
    }

    // Crisp reflective highway white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Silver / chrome mounting bolt details in corners
    ctx.fillStyle = '#f1f5f9';
    [[18, 18], [canvas.width - 18, 18], [18, canvas.height - 18], [canvas.width - 18, canvas.height - 18]].forEach(([rx, ry]) => {
      ctx.beginPath();
      ctx.arc(rx, ry, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // California Route Marker Shield Badge: Green box with crisp white border and white lettering
    const bX = 24;
    const bY = 18;
    const bW = 68;
    const bH = 50;
    const bR = 8;

    // Dark green badge background
    ctx.fillStyle = '#033b2c';
    ctx.beginPath();
    ctx.roundRect(bX, bY, bW, bH, bR);
    ctx.fill();

    // Crisp white outer border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // White text inside: Top = EDU / EXP, Center = 1 / 2 (Matching California 1 shield structure)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(milestone.badgeTop || 'EDU', bX + bW / 2, bY + 18);

    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(milestone.badgeNum || '1', bX + bW / 2, bY + 42);
    ctx.textAlign = 'start';

    // Milestone Category Header (Emerald / mint highway text)
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(milestone.epoch, 108, 47);

    // Destination / Company Title (Highway Gothic bold white)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(milestone.title, 26, 106);

    // Role / Subtitle Highlight (Mint highlight)
    ctx.fillStyle = '#6ee7b7';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(milestone.subtitle || '', 26, 142);

    // Description / Core Technologies (Reflective silver-white)
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '13px monospace';
    ctx.fillText(milestone.desc, 26, 178);

    // Lower amber hazard reflector bar
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(26, 206, 140, 4.5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;

    const planeMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.25,
      side: THREE.DoubleSide
    });

    const signGroup = new THREE.Group();

    // High-resolution front signboard face
    const planeGeo = new THREE.PlaneGeometry(1.9, 0.95);
    const frontFace = new THREE.Mesh(planeGeo, planeMat);
    frontFace.position.z = 0.035;
    signGroup.add(frontFace);

    // Physical dark galvanized aluminum / redwood backing board
    const backGeo = new THREE.BoxGeometry(1.94, 0.99, 0.06);
    const backMat = new THREE.MeshStandardMaterial({
      color: 0x063327,
      roughness: 0.88,
      metalness: 0.2
    });
    const backBoard = new THREE.Mesh(backGeo, backMat);
    signGroup.add(backBoard);

    return signGroup;
  }

  initBigSurScene() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 1. Serpentine Spline Curve spanning the full coastal panoramic vista (z = +56 to z = -110)
    const curvePoints = [
      new THREE.Vector3(16.0, 15.0, -110), // Distant mountain pass winding behind headland
      new THREE.Vector3(9.5, 12.0, -82),   // High coastal cliff turn
      new THREE.Vector3(3.2, 9.0, -58),    // Upper mountain pass bluff
      new THREE.Vector3(4.8, 6.2, -36),    // S-Curve: inland bend around promontory
      new THREE.Vector3(-1.6, 3.8, -16),   // S-Curve: dramatic ocean bluff turn
      new THREE.Vector3(2.6, 1.8, 8),      // Middle coastal headland sweep
      new THREE.Vector3(-0.4, -0.2, 32),   // Oceanfront curve entering foreground
      new THREE.Vector3(1.6, -2.2, 56)     // Foreground coastal stretch continuing past camera
    ];

    this.curve = new THREE.CatmullRomCurve3(curvePoints);
    const numPoints = 260;
    const pathPoints = this.curve.getPoints(numPoints);

    // Deterministic pseudo-random noise generator for rugged rock fractures
    const pseudoNoise = (x, y) => {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    };

    // 2. Asphalt Highway Roadbed
    const roadWidth = 3.2;
    const roadVerts = [];
    const roadNormals = [];
    const roadUvs = [];
    const roadIndices = [];

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      // Road cross section: left edge (ocean) to right edge (mountain)
      const leftEdge = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2);
      const centerRoad = new THREE.Vector3().copy(pt).add(new THREE.Vector3(0, 0.03, 0));
      const rightEdge = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2);
      const rightShoulder = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2 - 0.45).add(new THREE.Vector3(0, -0.04, 0));

      roadVerts.push(
        leftEdge.x, leftEdge.y, leftEdge.z,
        centerRoad.x, centerRoad.y, centerRoad.z,
        rightEdge.x, rightEdge.y, rightEdge.z,
        rightShoulder.x, rightShoulder.y, rightShoulder.z
      );

      roadNormals.push(
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0
      );

      const v = (i / numPoints) * 24;
      roadUvs.push(
        0, v,
        0.5, v,
        0.9, v,
        1, v
      );

      if (i < numPoints) {
        const row1 = i * 4;
        const row2 = (i + 1) * 4;
        for (let col = 0; col < 3; col++) {
          const a = row1 + col;
          const b = row1 + col + 1;
          const c = row2 + col;
          const d = row2 + col + 1;
          roadIndices.push(a, c, b);
          roadIndices.push(b, c, d);
        }
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadVerts, 3));
    roadGeo.setAttribute('normal', new THREE.Float32BufferAttribute(roadNormals, 3));
    roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(roadUvs, 2));
    roadGeo.setIndex(roadIndices);

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x222730,
      roughness: 0.88,
      metalness: 0.15,
      side: THREE.DoubleSide
    });
    this.group.add(new THREE.Mesh(roadGeo, roadMat));

    // 3. Double Solid Yellow Center Lines & White Shoulder Lines
    const yellowStripeMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      linewidth: 3
    });

    const whiteStripeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.92
    });

    const leftYellowPts = [];
    const rightYellowPts = [];
    const leftWhitePts = [];
    const rightWhitePts = [];

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      // Double yellow lines in the center (separated by 0.08)
      leftYellowPts.push(new THREE.Vector3().copy(pt).addScaledVector(normal, 0.045).add(new THREE.Vector3(0, 0.045, 0)));
      rightYellowPts.push(new THREE.Vector3().copy(pt).addScaledVector(normal, -0.045).add(new THREE.Vector3(0, 0.045, 0)));

      // White outer shoulder stripes
      leftWhitePts.push(new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2 - 0.16).add(new THREE.Vector3(0, 0.045, 0)));
      rightWhitePts.push(new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2 + 0.16).add(new THREE.Vector3(0, 0.045, 0)));
    }

    this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftYellowPts), yellowStripeMat));
    this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightYellowPts), yellowStripeMat));
    this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftWhitePts), whiteStripeMat));
    this.group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightWhitePts), whiteStripeMat));

    // 4. Silver W-Beam Highway Guardrail along the Ocean Cliff Edge (Left Side / +normal)
    const guardrailPts = [];
    const guardrailMat = new THREE.MeshStandardMaterial({
      color: 0xc8d1dc,
      roughness: 0.32,
      metalness: 0.88
    });

    const postMat = new THREE.MeshStandardMaterial({
      color: 0x3d352e,
      roughness: 0.9,
      metalness: 0.1
    });
    const postGeo = new THREE.BoxGeometry(0.1, 0.58, 0.1);

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      // Guardrail sits on the ocean side (+normal)
      const railPt = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2 + 0.14).add(new THREE.Vector3(0, 0.36, 0));
      guardrailPts.push(railPt);

      // Wooden post every 4 points
      if (i % 4 === 0) {
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.copy(railPt).add(new THREE.Vector3(0, -0.2, 0));
        this.group.add(post);

        // Amber reflector tab
        const tabGeo = new THREE.BoxGeometry(0.03, 0.05, 0.02);
        const tabMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
        const tab = new THREE.Mesh(tabGeo, tabMat);
        tab.position.copy(railPt).add(new THREE.Vector3(0, 0.04, 0.02));
        this.group.add(tab);
      }
    }

    const railCurve = new THREE.CatmullRomCurve3(guardrailPts);
    const railGeo = new THREE.TubeGeometry(railCurve, numPoints, 0.06, 8, false);
    this.group.add(new THREE.Mesh(railGeo, guardrailMat));

    // 5. Majestic Sunlit Rocky Mountain Bluffs & Crags (Right Side / -normal)
    // Multi-tier faceted rock geometry with geological strata and carved milestone turnouts
    const mVerts = [];
    const mColors = [];
    const mIndices = [];
    const numMountainStrips = 8;

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();
      const tNorm = i / numPoints;

      // Turnout alcove carve-outs for the 2 milestone monuments (Back: 0.54, Front: 0.65)
      let turnoutIndent = 0;
      [0.54, 0.65].forEach((mT) => {
        const d = Math.abs(tNorm - mT);
        if (d < 0.040) {
          const w = 1.0 - (d / 0.040);
          turnoutIndent = Math.max(turnoutIndent, w * w * 2.4);
        }
      });

      // Procedural multi-frequency rock fractures
      const rFracture1 = (pseudoNoise(i * 0.28, 1) - 0.5) * 1.5;
      const rFracture2 = (pseudoNoise(i * 0.22, 2) - 0.5) * 2.4;
      const rFracture3 = (pseudoNoise(i * 0.16, 3) - 0.5) * 3.5;
      const rFracture4 = (pseudoNoise(i * 0.12, 4) - 0.5) * 4.6;

      const profileStrips = [
        // Strip 0: Roadside stone shoulder & gravel ditch
        { dist: -roadWidth / 2 - 0.40, h: -0.04, c: [0.42, 0.36, 0.32] },
        // Strip 1: Turnout terrace level ledge
        { dist: -roadWidth / 2 - 1.40 - turnoutIndent * 0.9, h: 0.10, c: [0.52, 0.42, 0.35] },
        // Strip 2: Lower rocky escarpment / sheer cliff base
        { dist: -roadWidth / 2 - 3.40 - turnoutIndent * 1.5, h: 2.6 + rFracture1, c: [0.38, 0.32, 0.28] },
        // Strip 3: Stepped rock bench with coastal sage scrub
        { dist: -roadWidth / 2 - 6.80 - turnoutIndent, h: 5.8 + rFracture2, c: [0.26, 0.38, 0.22] },
        // Strip 4: Golden sandstone crags & rock buttresses
        { dist: -roadWidth / 2 - 11.80, h: 10.6 + rFracture3, c: [0.66, 0.44, 0.28] },
        // Strip 5: Sunlit granite promontory ridge
        { dist: -roadWidth / 2 - 17.80, h: 16.8 + rFracture4, c: [0.76, 0.52, 0.32] },
        // Strip 6: Towering coastal mountain peaks
        { dist: -roadWidth / 2 - 25.50, h: 23.8 + rFracture3 * 0.8, c: [0.70, 0.46, 0.29] },
        // Strip 7: Backslope descending toward inland canyon
        { dist: -roadWidth / 2 - 35.00, h: 12.0, c: [0.26, 0.20, 0.16] }
      ];

      for (let s = 0; s < numMountainStrips; s++) {
        const strip = profileStrips[s];
        const vPos = pt.clone().addScaledVector(normal, strip.dist).add(new THREE.Vector3(0, strip.h, 0));
        mVerts.push(vPos.x, vPos.y, vPos.z);
        mColors.push(strip.c[0], strip.c[1], strip.c[2]);
      }

      if (i < numPoints) {
        const r1 = i * numMountainStrips;
        const r2 = (i + 1) * numMountainStrips;
        for (let s = 0; s < numMountainStrips - 1; s++) {
          mIndices.push(r1 + s, r2 + s, r1 + s + 1);
          mIndices.push(r1 + s + 1, r2 + s, r2 + s + 1);
        }
      }
    }

    const baseMountainGeo = new THREE.BufferGeometry();
    baseMountainGeo.setAttribute('position', new THREE.Float32BufferAttribute(mVerts, 3));
    baseMountainGeo.setAttribute('color', new THREE.Float32BufferAttribute(mColors, 3));
    baseMountainGeo.setIndex(mIndices);
    // Non-indexed flat-shaded geometry gives authentic chiseled rock facets
    const mountainGeo = baseMountainGeo.toNonIndexed();
    mountainGeo.computeVertexNormals();

    const mountainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.94,
      metalness: 0.12,
      side: THREE.DoubleSide
    });
    this.group.add(new THREE.Mesh(mountainGeo, mountainMat));

    // 6. Coastal Cypress Trees on Rocky Ledges
    const treeTrunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.85, 6);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3b2f2f, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1f4621, roughness: 0.85 });

    for (let tIdx = 18; tIdx < numPoints - 10; tIdx += 16) {
      const pt = pathPoints[tIdx];
      const tangent = this.curve.getTangent(tIdx / numPoints).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const treePos = pt.clone().addScaledVector(normal, -roadWidth / 2 - 5.8 - Math.random() * 3.5)
        .add(new THREE.Vector3(0, 4.6 + Math.random() * 2.2, 0));

      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.copy(treePos);
      this.group.add(trunk);

      // Wind-swept flat coastal cypress canopy
      const canopy1 = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.25, 0.35, 8), foliageMat);
      canopy1.position.copy(treePos).add(new THREE.Vector3(0, 0.55, 0));
      this.group.add(canopy1);

      const canopy2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.95, 0.3, 8), foliageMat);
      canopy2.position.copy(treePos).add(new THREE.Vector3(0, 0.85, 0));
      this.group.add(canopy2);
    }

    // 7. Plunging Rocky Ocean Cliffs beneath Road (Left Side / +normal)
    const oVerts = [];
    const oColors = [];
    const oIndices = [];
    const seaLevelY = -3.8;
    const numOceanStrips = 5;

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      const oFracture = (pseudoNoise(i * 0.35, 7) - 0.5) * 1.3;

      const oceanProfile = [
        // Road outer edge under guardrail
        { dist: roadWidth / 2 + 0.14, y: pt.y, c: [0.46, 0.38, 0.32] },
        // Rocky cliff brow
        { dist: roadWidth / 2 + 1.80, y: pt.y - 0.9 + oFracture * 0.5, c: [0.42, 0.34, 0.28] },
        // Sheer sea-cliff face
        { dist: roadWidth / 2 + 4.20, y: (seaLevelY + pt.y) * 0.48 + oFracture, c: [0.28, 0.22, 0.18] },
        // Rocky wave-cut bench
        { dist: roadWidth / 2 + 7.80, y: seaLevelY + 0.6 + Math.abs(oFracture) * 0.4, c: [0.18, 0.16, 0.14] },
        // Submerged tide reef at sea level
        { dist: roadWidth / 2 + 12.50, y: seaLevelY, c: [0.10, 0.12, 0.14] }
      ];

      for (let s = 0; s < numOceanStrips; s++) {
        const strip = oceanProfile[s];
        const vPos = pt.clone().addScaledVector(normal, strip.dist).setY(strip.y);
        oVerts.push(vPos.x, vPos.y, vPos.z);
        oColors.push(strip.c[0], strip.c[1], strip.c[2]);
      }

      if (i < numPoints) {
        const r1 = i * numOceanStrips;
        const r2 = (i + 1) * numOceanStrips;
        for (let s = 0; s < numOceanStrips - 1; s++) {
          oIndices.push(r1 + s, r2 + s, r1 + s + 1);
          oIndices.push(r1 + s + 1, r2 + s, r2 + s + 1);
        }
      }
    }

    const baseOceanCliffGeo = new THREE.BufferGeometry();
    baseOceanCliffGeo.setAttribute('position', new THREE.Float32BufferAttribute(oVerts, 3));
    baseOceanCliffGeo.setAttribute('color', new THREE.Float32BufferAttribute(oColors, 3));
    baseOceanCliffGeo.setIndex(oIndices);
    const oceanCliffGeo = baseOceanCliffGeo.toNonIndexed();
    oceanCliffGeo.computeVertexNormals();

    const oceanCliffMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.95,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    this.group.add(new THREE.Mesh(oceanCliffGeo, oceanCliffMat));

    // 8. Distant Coastal Mountain Headland Range (Prevents empty cut-off in the distance)
    const backdropGeo = new THREE.BufferGeometry();
    const bgVerts = [];
    const bgColors = [];
    const bgIndices = [];
    const bgSteps = 24;

    for (let j = 0; j <= bgSteps; j++) {
      const u = j / bgSteps;
      const x = -45 + u * 110;
      const z = -120 - Math.sin(u * Math.PI) * 24;
      const peakH = 15 + Math.sin(u * 5.2) * 5.0 + Math.cos(u * 8.4) * 3.5 + Math.sin(u * Math.PI) * 19.0;

      // Base at sea level
      bgVerts.push(x, seaLevelY - 1.0, z);
      bgColors.push(0.12, 0.16, 0.22);

      // Mid-mountain shoulder
      bgVerts.push(x, peakH * 0.52, z - 4.0);
      bgColors.push(0.24, 0.25, 0.28);

      // Craggy mountain crest
      bgVerts.push(x, peakH, z - 8.0);
      bgColors.push(0.48, 0.36, 0.28);

      if (j < bgSteps) {
        const c1 = j * 3;
        const c2 = (j + 1) * 3;
        bgIndices.push(c1, c2, c1 + 1);
        bgIndices.push(c1 + 1, c2, c2 + 1);
        bgIndices.push(c1 + 1, c2 + 1, c1 + 2);
        bgIndices.push(c1 + 2, c2 + 1, c2 + 2);
      }
    }

    backdropGeo.setAttribute('position', new THREE.Float32BufferAttribute(bgVerts, 3));
    backdropGeo.setAttribute('color', new THREE.Float32BufferAttribute(bgColors, 3));
    backdropGeo.setIndex(bgIndices);
    const nonIndexedBg = backdropGeo.toNonIndexed();
    nonIndexedBg.computeVertexNormals();

    const backdropMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.98,
      metalness: 0.08,
      side: THREE.DoubleSide
    });
    this.group.add(new THREE.Mesh(nonIndexedBg, backdropMat));

    // 9. Scattered 3D Faceted Rock Boulders along the Highway
    const boulderGeo = new THREE.DodecahedronGeometry(1.0, 0);
    const boulderMat = new THREE.MeshStandardMaterial({
      color: 0x4d4239,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true
    });

    const boulderLocations = [
      { t: 0.22, offset: -roadWidth / 2 - 2.8, scale: 1.6 },
      { t: 0.33, offset: -roadWidth / 2 - 3.8, scale: 1.4 },
      { t: 0.44, offset: -roadWidth / 2 - 3.8, scale: 1.3 },
      { t: 0.58, offset: -roadWidth / 2 - 3.6, scale: 1.4 },
      { t: 0.72, offset: -roadWidth / 2 - 3.4, scale: 1.3 },
      { t: 0.78, offset: -roadWidth / 2 - 2.6, scale: 1.5 },
      { t: 0.88, offset: -roadWidth / 2 - 2.8, scale: 1.7 }
    ];

    boulderLocations.forEach((bCfg) => {
      const bPt = this.curve.getPoint(bCfg.t);
      const bTan = this.curve.getTangent(bCfg.t).normalize();
      const bNorm = new THREE.Vector3().crossVectors(bTan, this.worldUp).normalize();

      const boulder = new THREE.Mesh(boulderGeo, boulderMat);
      boulder.position.copy(bPt).addScaledVector(bNorm, bCfg.offset).add(new THREE.Vector3(0, 0.35 * bCfg.scale, 0));
      boulder.scale.set(
        bCfg.scale * (0.8 + Math.random() * 0.4),
        bCfg.scale * (0.7 + Math.random() * 0.5),
        bCfg.scale * (0.8 + Math.random() * 0.4)
      );
      boulder.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.group.add(boulder);
    });

    // 10. The Vast Pacific Ocean (Left / West Plane with Specular Sunset Highlight)
    const oceanGeo = new THREE.PlaneGeometry(220, 240, 32, 32);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x094875,
      roughness: 0.14,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    this.oceanMesh.rotation.x = -Math.PI / 2;
    this.oceanMesh.position.set(-55, seaLevelY, -30);
    this.group.add(this.oceanMesh);

    // 11. Offshore Sea Stack Rocks with Crashing White Foam (Pfeiffer Beach aesthetic)
    const seaRockMat = new THREE.MeshStandardMaterial({
      color: 0x3d3126,
      roughness: 0.95,
      metalness: 0.08,
      flatShading: true
    });

    const seaStackConfigs = [
      { pos: new THREE.Vector3(-14.0, seaLevelY + 1.6, -75), scale: new THREE.Vector3(3.6, 5.2, 3.2) },
      { pos: new THREE.Vector3(-10.5, seaLevelY + 1.2, -42), scale: new THREE.Vector3(3.2, 4.4, 2.8) },
      { pos: new THREE.Vector3(-13.0, seaLevelY + 0.9, -16), scale: new THREE.Vector3(2.6, 3.6, 2.4) },
      { pos: new THREE.Vector3(-9.5, seaLevelY + 0.8, 10), scale: new THREE.Vector3(2.4, 3.2, 2.0) },
      { pos: new THREE.Vector3(-12.5, seaLevelY + 0.6, 35), scale: new THREE.Vector3(3.0, 2.8, 2.6) }
    ];

    this.seaStacks = [];
    seaStackConfigs.forEach((cfg) => {
      const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
      rockGeo.scale(cfg.scale.x, cfg.scale.y, cfg.scale.z);
      const rock = new THREE.Mesh(rockGeo, seaRockMat);
      rock.position.copy(cfg.pos);
      rock.rotation.set(0.18, Math.random() * Math.PI, 0.1);
      this.group.add(rock);

      // Crashing seafoam ring around the base of each sea stack
      const foamGeo = new THREE.RingGeometry(cfg.scale.x * 0.75, cfg.scale.x * 1.45, 32);
      const foamMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const foam = new THREE.Mesh(foamGeo, foamMat);
      foam.rotation.x = Math.PI / 2;
      foam.position.set(cfg.pos.x, seaLevelY + 0.04, cfg.pos.z);
      this.group.add(foam);

      this.seaStacks.push({ rock, foam });
    });

    // 12. Architectural Milestone Overlook Monuments Anchored in Stone Turnouts
    this.milestones = [];
    this.hitboxes = [];

    const milestoneConfigs = [
      {
        id: 'vits-cse',
        t: 0.54,
        badgeTop: 'EDU',
        badgeNum: '1',
        epoch: 'VITS CSE // 2023 — 2027',
        title: 'VITS CSE FOUNDATIONS',
        subtitle: 'B.TECH COMPUTER SCIENCE & ENGINEERING',
        desc: '200+ DSA SOLVED // CORE CS // SYSTEMS',
        details: {
          role: 'Bachelor of Technology in Computer Science & Engineering',
          institution: 'Vindhya Institute of Technology and Science (VITS), RGPV',
          period: '2023 — 2027',
          cgpa: '7.85',
          summary: 'Four-year comprehensive Computer Science & Engineering degree focusing on core algorithmic problem-solving, operating systems, distributed architectures, database engineering, and applied software development.',
          bullets: [
            'Data Structures & Algorithms: Solved 200+ competitive programming problems across LeetCode, Codeforces, and GeeksforGeeks (Dynamic Programming, Trees, Graphs, Greedy Algorithms)',
            'Operating Systems & Concurrency: Process scheduling, multi-threading in Java and C++, memory virtualization, concurrency synchronization, and Linux file systems',
            'Database Management Systems (DBMS): Relational schema design, SQL querying, normalization (1NF-BCNF), indexing strategies, and ACID transaction guarantees',
            'Computer Networks: Deep dive into the OSI model, TCP/IP stack, HTTP/HTTPS protocols, socket programming, and client-server architecture',
            'Object-Oriented Software Design: Enterprise OOP principles, design patterns, clean architecture, and systems programming with Java, C++, and Python',
            'Hackathon Team Leadership: Led 4-member developer teams in fast-paced 24-hour hackathons to architect and deploy functional prototypes',
            'Technical Workshop Coordination: Served as Class Coordinator organizing collegiate coding symposiums and technical workshops for 100+ students (CGPA 7.85)'
          ],
          tags: ['Data Structures', 'Algorithms', 'C++', 'Java', 'Python', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'SQL', 'System Design']
        }
      },
      {
        id: 'dream-filler',
        t: 0.65,
        badgeTop: 'EXP',
        badgeNum: '2',
        epoch: 'DREAM FILLER // 2024 — PRESENT',
        title: 'DREAM FILLER COMPANY',
        subtitle: 'BACKEND ENGINEER INTERN',
        desc: 'REST APIS // NODE.JS // MONGODB // JWT',
        details: {
          role: 'Backend Engineer Intern',
          company: 'Dream Filler Company',
          period: '2024 — Present',
          summary: 'Engineering scalable backend architectures, high-performance RESTful APIs, and robust data management layers.',
          bullets: [
            'Architecting and optimizing high-throughput RESTful backend endpoints and API microservices',
            'Designing scalable database schemas, indexing strategies, and aggregation pipelines with Node.js, Express, and MongoDB',
            'Implementing JWT authentication, authorization, request validation, and resilient error-handling middleware',
            'Optimizing API query performance, reducing response latency, and database query tuning',
            'Collaborating on distributed system designs, architectural code reviews, and production stability'
          ],
          tags: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'System Design', 'JWT Auth', 'Backend Engineering']
        }
      }
    ];

    // Shared materials for architectural milestone monuments
    const stoneTerraceMat = new THREE.MeshStandardMaterial({
      color: 0x3d352e,
      roughness: 0.95,
      metalness: 0.08,
      flatShading: true
    });

    const stonePlinthMat = new THREE.MeshStandardMaterial({
      color: 0x483e35,
      roughness: 0.92,
      metalness: 0.1,
      flatShading: true
    });

    const timberPostMat = new THREE.MeshStandardMaterial({
      color: 0x24160e,
      roughness: 0.88,
      metalness: 0.12
    });

    milestoneConfigs.forEach((cfg) => {
      const pt = this.curve.getPoint(cfg.t);
      const tangent = this.curve.getTangent(cfg.t).normalize();
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const mGroup = new THREE.Group();

      // Paved stone overlook terrace platform (sits cleanly on mountain shoulder)
      const terraceGeo = new THREE.BoxGeometry(4.0, 0.18, 3.0);
      const terraceMesh = new THREE.Mesh(terraceGeo, stoneTerraceMat);
      terraceMesh.position.set(0, 0.09, 0);
      mGroup.add(terraceMesh);

      // Stacked stone foundation plinths anchored into terrace
      [-0.72, 0.72].forEach((pX) => {
        const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.44), stonePlinthMat);
        plinth.position.set(pX, 0.27, 0);
        mGroup.add(plinth);

        // Heavy rustic redwood upright timber posts
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.55, 0.12), timberPostMat);
        post.position.set(pX, 1.05, 0);
        mGroup.add(post);
      });

      // Horizontal redwood timber header beam
      const headerBeam = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.12), timberPostMat);
      headerBeam.position.set(0, 1.84, 0);
      mGroup.add(headerBeam);

      // Flanking natural rock boulders framing the monument into the rock face (hug back of terrace so face is 100% visible)
      [-1.9, 1.9].forEach((bX, bIdx) => {
        const fBoulder = new THREE.Mesh(new THREE.DodecahedronGeometry(0.50 + bIdx * 0.10, 0), boulderMat);
        fBoulder.position.set(bX, 0.38, -0.45);
        fBoulder.rotation.set(Math.random(), Math.random(), Math.random());
        mGroup.add(fBoulder);
      });

      // High-resolution milestone signboard mounted securely between timber posts
      const signboard = this.createTurnoutSign(cfg);
      signboard.position.set(0, 1.25, 0.04);
      mGroup.add(signboard);

      // Amber Solar Reflector Beacon atop monument
      const solarBeacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      solarBeacon.position.set(0, 1.96, 0.04);
      mGroup.add(solarBeacon);

      // Generous invisible touch hitbox for effortless interaction
      const hitboxGeo = new THREE.BoxGeometry(2.8, 2.4, 1.4);
      const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
      hitbox.position.set(0, 1.25, 0.1);
      hitbox.userData = { milestoneId: cfg.id, config: cfg };
      mGroup.add(hitbox);
      this.hitboxes.push(hitbox);

      // Position monument neatly on the carved turnout terrace
      const terracePos = pt.clone().addScaledVector(normal, -roadWidth / 2 - 1.8).add(new THREE.Vector3(0, 0.08, 0));
      mGroup.position.copy(terracePos);

      // Orient monument naturally toward approaching drivers along the highway
      const signLookTarget = terracePos.clone().add(tangent.clone().multiplyScalar(2.6)).addScaledVector(normal, 1.2);
      mGroup.lookAt(signLookTarget);

      this.group.add(mGroup);
      this.milestones.push({
        id: cfg.id,
        config: cfg,
        group: mGroup,
        signboard,
        solarBeacon,
        hitbox,
        currentScale: 1.0,
        targetScale: 1.0,
        baseY: 1.25
      });
    });

    this.initCruisers();
  }

  createSportsCar(config) {
    const carGroup = new THREE.Group();

    // High-gloss metallic automotive paint
    const bodyMat = new THREE.MeshStandardMaterial({
      color: config.color,
      roughness: 0.16,
      metalness: 0.88
    });

    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.85,
      metalness: 0.15
    });

    const tintedGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0a1120,
      roughness: 0.08,
      metalness: 0.95,
      transparent: true,
      opacity: 0.88
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95
    });

    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.92,
      metalness: 0.08
    });

    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.25,
      metalness: 0.92
    });

    // 1. Sculpted Lower Body & Aerodynamic Bumpers
    const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.14, 1.46), bodyMat);
    lowerBody.position.y = 0.15;
    carGroup.add(lowerBody);

    // Front Sloping Hood
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.50), bodyMat);
    hood.position.set(0, 0.21, 0.42);
    hood.rotation.x = -0.06;
    carGroup.add(hood);

    // Front Bumper Lower Air Dam & Grill
    const grill = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.06, 0.04), darkTrimMat);
    grill.position.set(0, 0.12, 0.73);
    carGroup.add(grill);

    // Rear Engine Deck & Ducktail Spoiler Lip
    const rearDeck = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.09, 0.42), bodyMat);
    rearDeck.position.set(0, 0.22, -0.42);
    rearDeck.rotation.x = 0.05;
    carGroup.add(rearDeck);

    const spoiler = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.025, 0.08), bodyMat);
    spoiler.position.set(0, 0.27, -0.64);
    carGroup.add(spoiler);

    // Rear Lower Diffuser
    const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.05, 0.05), darkTrimMat);
    diffuser.position.set(0, 0.11, -0.73);
    carGroup.add(diffuser);

    // Dual Chrome Exhaust Pipes
    [-0.16, 0.16].forEach((exX) => {
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.06, 8), chromeMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(exX, 0.10, -0.75);
      carGroup.add(tip);
    });

    // 2. Cockpit Architecture: Speedster Convertible vs Fastback Coupe
    if (config.isConvertible) {
      // Open-top Speedster Cockpit
      const interior = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.11, 0.46), darkTrimMat);
      interior.position.set(0, 0.20, -0.02);
      carGroup.add(interior);

      // Saddle Tan Leather Bucket Seats
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.72 });
      [-0.14, 0.14].forEach((sX) => {
        const seat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.20), seatMat);
        seat.position.set(sX, 0.24, -0.04);
        carGroup.add(seat);

        const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.09, 0.07), seatMat);
        headrest.position.set(sX, 0.33, -0.15);
        carGroup.add(headrest);

        // Aerodynamic Speedster Rollover Fairing Cowl
        const cowl = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), bodyMat);
        cowl.scale.set(1, 0.7, 1.8);
        cowl.position.set(sX, 0.27, -0.27);
        carGroup.add(cowl);
      });

      // Raked Tinted Windshield
      const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.13, 0.035), tintedGlassMat);
      windshield.position.set(0, 0.30, 0.16);
      windshield.rotation.x = -0.52;
      carGroup.add(windshield);
    } else {
      // Sleek Fastback Coupe: Aerodynamic Tinted Glass Canopy
      const roof = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.15, 0.56), tintedGlassMat);
      roof.position.set(0, 0.28, -0.06);
      carGroup.add(roof);

      const roofTop = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.02, 0.38), bodyMat);
      roofTop.position.set(0, 0.36, -0.06);
      carGroup.add(roofTop);
    }

    // Side Aero Mirrors
    [-0.34, 0.34].forEach((mX) => {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.08), bodyMat);
      mirror.position.set(mX, 0.25, 0.14);
      carGroup.add(mirror);
    });

    // 3. Four 3D Wheels with Alloy Rims and Red Brake Calipers (Dynamically Spinning)
    const wheels = [];
    const wheelPositions = [
      { x: -0.34, y: 0.13, z: 0.44 },  // Front Left
      { x: 0.34, y: 0.13, z: 0.44 },   // Front Right
      { x: -0.34, y: 0.13, z: -0.44 }, // Rear Left
      { x: 0.34, y: 0.13, z: -0.44 }  // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const assembly = new THREE.Group();
      assembly.position.set(pos.x, pos.y, pos.z);

      // Rotating Wheel Hub (Rubber Tire + Multi-Spoke Rim)
      const spinner = new THREE.Group();

      // Rubber Tire
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.075, 16), tireMat);
      tire.rotation.z = Math.PI / 2;
      spinner.add(tire);

      // Multi-Spoke Alloy Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12), rimMat);
      rim.rotation.z = Math.PI / 2;
      spinner.add(rim);

      assembly.add(spinner);

      // Stationary Red Sport Brake Caliper (mounted to suspension)
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.035), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      caliper.position.set(pos.x > 0 ? -0.025 : 0.025, 0.03, 0);
      assembly.add(caliper);

      carGroup.add(assembly);
      wheels.push(spinner);
    });

    // 4. Optical Lighting: Front Projector LEDs & Full-Width Rear Lightbar
    const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
    [-0.22, 0.22].forEach((hX) => {
      const headlight = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.04, 0.04), headlightMat);
      headlight.position.set(hX, 0.19, 0.71);
      carGroup.add(headlight);
    });

    const taillightMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
    const lightbar = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.035, 0.04), taillightMat);
    lightbar.position.set(0, 0.22, -0.72);
    carGroup.add(lightbar);

    // 5. Soft Ground Contact Shadow (Grounds the vehicle naturally onto asphalt)
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.6), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, 0.02, 0);
    carGroup.add(shadowMesh);

    return {
      carGroup,
      wheels
    };
  }

  initCruisers() {
    // 11. Fleet of Stylized Coastal Grand Tourers & Speedsters
    this.cruisers = [];
    const carConfigs = [
      { color: 0xea580c, isConvertible: true, speed: 0.056 },  // Sunset Lava Orange Speedster
      { color: 0xdc2626, isConvertible: false, speed: 0.050 }, // Guards Crimson Red Fastback Coupe
      { color: 0x0284c7, isConvertible: true, speed: 0.058 },  // Pacific Riviera Blue Speedster
      { color: 0xf1f5f9, isConvertible: false, speed: 0.048 }, // Chalk White Fastback Coupe
      { color: 0x15803d, isConvertible: true, speed: 0.054 }   // Monterey Cypress Green Speedster
    ];

    const roadWidth = 3.2;

    carConfigs.forEach((cfg, idx) => {
      const isNorthbound = idx % 2 === 0;
      const { carGroup, wheels } = this.createSportsCar(cfg);

      this.group.add(carGroup);

      this.cruisers.push({
        group: carGroup,
        wheels,
        progress: (idx / carConfigs.length) + 0.04,
        speed: cfg.speed,
        laneOffset: (isNorthbound ? -1 : 1) * (roadWidth * 0.235),
        isNorthbound
      });
    });
  }

  getLanePosition(progress, laneOffset) {
    const t = ((progress % 1.0) + 1.0) % 1.0;
    const pt = this.curve.getPoint(t);
    const tangent = this.curve.getTangent(t).normalize();
    const roadSide = new THREE.Vector3().crossVectors(tangent, this.worldUp).normalize();
    return pt.addScaledVector(roadSide, laneOffset);
  }

  initSeaSprayMist() {
    // Sea spray particles drifting gently over the water
    const count = 75;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      pos[i] = -22 + (Math.random() - 0.5) * 26;
      pos[i + 1] = -3.8 + Math.random() * 7.0;
      pos[i + 2] = (Math.random() - 0.5) * 55;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xffedd5,
      size: 0.16,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending
    });

    this.seaSpray = new THREE.Points(geo, mat);
    this.scene.add(this.seaSpray);
  }

  bindEvents() {
    this.raycaster = new THREE.Raycaster();
    this.mouseCoords = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);

      this.mouseCoords.set(x, y);
      if (this.hitboxes && this.hitboxes.length > 0) {
        this.raycaster.setFromCamera(this.mouseCoords, this.camera);
        const intersects = this.raycaster.intersectObjects(this.hitboxes, false);
        if (intersects.length > 0) {
          const hitId = intersects[0].object.userData.milestoneId;
          if (this.hoveredMilestoneId !== hitId) {
            this.hoveredMilestoneId = hitId;
            soundEngine.playHover();
          }
          this.container.style.cursor = 'pointer';
        } else {
          if (this.hoveredMilestoneId !== null) {
            this.hoveredMilestoneId = null;
          }
          this.container.style.cursor = 'default';
        }
      }
    };

    this.onPointerDown = (e) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    this.onPointerUp = (e) => {
      const dx = Math.abs(e.clientX - pointerDownPos.x);
      const dy = Math.abs(e.clientY - pointerDownPos.y);
      if (dx < 12 && dy < 12 && this.hitboxes && this.hitboxes.length > 0) {
        const rect = this.container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        this.mouseCoords.set(x, y);
        this.raycaster.setFromCamera(this.mouseCoords, this.camera);
        const intersects = this.raycaster.intersectObjects(this.hitboxes, false);
        if (intersects.length > 0) {
          const hitObj = intersects[0].object;
          const hitId = hitObj.userData.milestoneId;
          const hitCfg = hitObj.userData.config;
          soundEngine.playClick();
          this.selectMilestone(hitId, hitCfg);
        }
      }
    };

    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointerup', this.onPointerUp);
  }

  selectMilestone(id, config = null) {
    this.selectedMilestoneId = id;
    const m = this.milestones.find((item) => item.id === id);
    const cfg = config || (m ? m.config : null);
    if (this.onSelectMilestone && cfg) {
      this.onSelectMilestone(cfg);
    }
  }

  clearSelection() {
    this.selectedMilestoneId = null;
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.06);

    // Interactive Milestone Overlook Monuments (Expands smoothly on touch / selection / hover)
    if (this.milestones) {
      this.milestones.forEach((m) => {
        const isSelected = this.selectedMilestoneId === m.id;
        const isHovered = this.hoveredMilestoneId === m.id;

        m.targetScale = isSelected ? 1.38 : (isHovered ? 1.15 : 1.0);
        const targetY = isSelected ? 1.44 : (isHovered ? 1.34 : m.baseY);

        m.currentScale = THREE.MathUtils.lerp(m.currentScale, m.targetScale, 0.12);
        if (m.signboard) {
          m.signboard.scale.setScalar(m.currentScale);
          m.signboard.position.y = THREE.MathUtils.lerp(m.signboard.position.y, targetY, 0.12);
        }

        // Animate solar beacon pulse
        if (m.solarBeacon) {
          const beaconScale = isSelected
            ? 1.65 + Math.sin(this.time * 6.0) * 0.25
            : (isHovered ? 1.35 + Math.sin(this.time * 4.0) * 0.15 : 1.0 + Math.sin(this.time * 2.0) * 0.08);
          m.solarBeacon.scale.setScalar(beaconScale);
        }
      });
    }

    // Scenic vista camera perspective looking down the Pacific Coast Highway
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, 0.4 + this.mouse.x * 2.0, 0.05);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 7.8 - this.mouse.y * 1.0, 0.05);
    this.camera.lookAt(0, 2.8, -16.0);

    // Gentle camera parallax banking
    if (this.group) {
      this.group.rotation.y = this.mouse.x * 0.018;
    }

    // Animated Ocean Swells & Pulsing Seafoam Surf
    if (this.seaStacks) {
      this.seaStacks.forEach((stack, idx) => {
        const wavePulse = 1.0 + Math.sin(this.time * 2.2 + idx * 1.6) * 0.2;
        if (stack.foam) {
          stack.foam.scale.setScalar(wavePulse);
          stack.foam.material.opacity = 0.5 + Math.cos(this.time * 2.2 + idx * 1.6) * 0.3;
        }
      });
    }

    // Cruising Coastal Sports Cars along Highway Lanes with exact road alignment
    if (this.cruisers && this.curve) {
      const rotMat = new THREE.Matrix4();
      const dt = 0.012; // Lookahead chord along lane

      this.cruisers.forEach((car) => {
        if (car.isNorthbound) {
          // Northbound: Cruises toward distant mountain pass (decreasing t)
          car.progress = (car.progress - delta * car.speed + 1.0) % 1.0;
        } else {
          // Southbound: Cruises south along coastal highway (increasing t)
          car.progress = (car.progress + delta * car.speed) % 1.0;
        }

        // Exact lane points for vehicle center, front lookahead, and rear lookbehind
        const posCenter = this.getLanePosition(car.progress, car.laneOffset);
        const posFront = this.getLanePosition(
          car.isNorthbound ? car.progress - dt : car.progress + dt,
          car.laneOffset
        );
        const posRear = this.getLanePosition(
          car.isNorthbound ? car.progress + dt : car.progress - dt,
          car.laneOffset
        );

        // Forward vector aligned along the exact lane curvature
        const forward = new THREE.Vector3().subVectors(posFront, posRear).normalize();

        // Local road surface coordinate frame
        const tangent = this.curve.getTangent(car.progress).normalize();
        const roadSide = new THREE.Vector3().crossVectors(tangent, this.worldUp).normalize();
        const roadUp = new THREE.Vector3().crossVectors(roadSide, tangent).normalize();

        // Exact orthonormal vehicle basis (car local +X is right side, +Y is roof, +Z is front)
        const carRight = new THREE.Vector3().crossVectors(roadUp, forward).normalize();
        const carUp = new THREE.Vector3().crossVectors(forward, carRight).normalize();

        rotMat.makeBasis(carRight, carUp, forward);
        car.group.quaternion.setFromRotationMatrix(rotMat);

        // Position car precisely in its lane resting on the asphalt surface
        car.group.position.copy(posCenter).addScaledVector(carUp, 0.055);

        // Dynamically spin alloy wheels forward proportional to travel speed
        const spinDelta = delta * car.speed * 45;
        if (car.wheels) {
          car.wheels.forEach((w) => {
            w.rotation.x += spinDelta;
          });
        }
      });
    }

    // Subtle sea spray mist drift
    if (this.seaSpray) {
      this.seaSpray.rotation.y = this.time * 0.012;
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1.0 ? 52 : 46;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    if (this.onPointerMove) this.container.removeEventListener('pointermove', this.onPointerMove);
    if (this.onPointerDown) this.container.removeEventListener('pointerdown', this.onPointerDown);
    if (this.onPointerUp) this.container.removeEventListener('pointerup', this.onPointerUp);
  }
}
