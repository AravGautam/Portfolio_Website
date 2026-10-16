import * as THREE from 'three';

/**
 * 3D Scenic Pacific Coast Highway Experience Scene
 * Authentic Recreation of Big Sur / California Route 1:
 * - Serpentine asphalt coastal highway hugging cliffs
 * - Pacific Ocean on the LEFT with animated rolling swells, sea stacks & crashing white surf
 * - Dramatic sunlit mountain bluffs on the RIGHT with golden rock & green cypress groves
 * - Roadway with double solid yellow center lines & white shoulder stripes
 * - Galvanized silver W-beam guardrail on wooden posts along the ocean edge
 * - Tasteful, proportional California Route 1 turnout milestone markers
 * - Coastal cruisers traveling along scenic lanes with headlights & taillights
 * - Golden hour sunset lighting casting warm radiance across cliffs & ocean
 */
export class ExperienceScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 800;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1a2d);
    this.scene.fog = new THREE.FogExp2(0x132238, 0.015);

    // Camera perspective overlooking the coastal highway from a scenic bluff
    const aspect = this.width / this.height;
    const fov = aspect < 1.0 ? 52 : 46;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
    this.camera.position.set(0.4, 7.2, 23.0);
    this.camera.lookAt(0, 2.4, -14.0);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.time = 0;

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
    canvas.width = 440;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // California Scenic Highway Forest Green Sign
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Crisp reflective white border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Route 1 Highway Shield Badge
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(18, 16, 72, 34, 6);
    ctx.fill();

    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('CA-1', 32, 39);

    // Milestone Category
    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(milestone.epoch, 104, 38);

    // Destination / Role Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(milestone.title, 20, 88);

    // Description / Technologies
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px monospace';
    ctx.fillText(milestone.desc, 20, 124);

    // Amber reflective turnout strip
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(20, 148, 120, 3.5);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const planeMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.35,
      metalness: 0.3,
      side: THREE.DoubleSide
    });

    // Proportional, elegant sign scale (no oversized billboard)
    const planeGeo = new THREE.PlaneGeometry(1.65, 0.85);
    return new THREE.Mesh(planeGeo, planeMat);
  }

  initBigSurScene() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 1. Serpentine Spline Curve (Matches the Big Sur coastal photo S-curves)
    const curvePoints = [
      new THREE.Vector3(1.8, 8.5, -50),      // Distant mountain pass (High headland)
      new THREE.Vector3(3.8, 5.8, -32),      // Curve 1: Inland curve around mountain bluff
      new THREE.Vector3(-1.2, 3.6, -14),     // Curve 2: Dramatic ocean bluff curve (Left)
      new THREE.Vector3(2.4, 1.6, 6),        // Curve 3: Headland turn (Right)
      new THREE.Vector3(-0.6, -0.4, 28)      // Descending oceanfront curve (Foreground)
    ];

    this.curve = new THREE.CatmullRomCurve3(curvePoints);
    const numPoints = 180;
    const pathPoints = this.curve.getPoints(numPoints);

    // 2. Asphalt Highway Roadbed
    const roadWidth = 3.2;
    const roadVerts = [];
    const roadNormals = [];
    const roadUvs = [];
    const roadIndices = [];

    // Note: Tangent points +Z. Normal = Cross(Tangent, Up) points -X (LEFT / OCEAN).
    // Therefore:
    // +normal is LEFT (OCEAN SIDE)
    // -normal is RIGHT (MOUNTAIN SIDE)
    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints);
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      // Left edge (ocean side) to right edge (mountain side)
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

      const v = (i / numPoints) * 16;
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
      const tangent = this.curve.getTangent(i / numPoints);
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
      const tangent = this.curve.getTangent(i / numPoints);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      // Guardrail sits on the ocean side (+normal)
      const railPt = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2 + 0.14).add(new THREE.Vector3(0, 0.36, 0));
      guardrailPts.push(railPt);

      // Wooden post every 5 points
      if (i % 5 === 0) {
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

    // 5. Majestic Sunlit Mountain Bluffs & Ridges (Right Side / -normal)
    const mountainVerts = [];
    const mountainColors = [];
    const mountainIndices = [];

    const rockGold = new THREE.Color(0xb86937);   // Warm golden-amber sandstone
    const rockDark = new THREE.Color(0x6e3e20);   // Shaded cliff earth
    const grassAmber = new THREE.Color(0xc9944d); // Sunlit hillside grass
    const cypressGreen = new THREE.Color(0x274a22); // Coastal cypress foliage

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      // Right-hand mountain side (-normal)
      const roadRight = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2 - 0.45);
      const midSlope = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2 - 4.5).add(new THREE.Vector3(0, 3.2 + Math.sin(i * 0.14) * 1.4, 0));
      const highRidge = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2 - 10.5).add(new THREE.Vector3(0, 8.4 + Math.cos(i * 0.11) * 2.6, 0));
      const peak = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2 - 16.5).add(new THREE.Vector3(0, 14.5 + Math.sin(i * 0.09) * 3.2, 0));

      mountainVerts.push(
        roadRight.x, roadRight.y, roadRight.z,
        midSlope.x, midSlope.y, midSlope.z,
        highRidge.x, highRidge.y, highRidge.z,
        peak.x, peak.y, peak.z
      );

      const blend = (Math.sin(i * 0.22) + 1) * 0.5;
      const c1 = rockGold.clone().lerp(rockDark, blend * 0.3);
      const c2 = rockGold.clone().lerp(grassAmber, 0.7);
      const c3 = cypressGreen.clone().lerp(grassAmber, blend);
      const c4 = rockGold.clone().lerp(grassAmber, 0.85);

      mountainColors.push(
        c1.r, c1.g, c1.b,
        c2.r, c2.g, c2.b,
        c3.r, c3.g, c3.b,
        c4.r, c4.g, c4.b
      );

      if (i < numPoints) {
        const r1 = i * 4;
        const r2 = (i + 1) * 4;
        for (let s = 0; s < 3; s++) {
          mountainIndices.push(r1 + s, r2 + s, r1 + s + 1);
          mountainIndices.push(r1 + s + 1, r2 + s, r2 + s + 1);
        }
      }
    }

    const mountainGeo = new THREE.BufferGeometry();
    mountainGeo.setAttribute('position', new THREE.Float32BufferAttribute(mountainVerts, 3));
    mountainGeo.setAttribute('color', new THREE.Float32BufferAttribute(mountainColors, 3));
    mountainGeo.computeVertexNormals();
    mountainGeo.setIndex(mountainIndices);

    const mountainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.94,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    this.group.add(new THREE.Mesh(mountainGeo, mountainMat));

    // 6. Coastal Cypress Trees on the Mountain Ridge (Matches photo cypress grove)
    const treeTrunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6);
    const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3b2f2f, roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1f4621, roughness: 0.85 });

    for (let tIdx = 10; tIdx < numPoints; tIdx += 12) {
      const pt = pathPoints[tIdx];
      const tangent = this.curve.getTangent(tIdx / numPoints);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const treePos = pt.clone().addScaledVector(normal, -roadWidth / 2 - 5.5 - Math.random() * 4.0)
        .add(new THREE.Vector3(0, 3.8 + Math.random() * 2.2, 0));

      const trunk = new THREE.Mesh(treeTrunkGeo, treeTrunkMat);
      trunk.position.copy(treePos);
      this.group.add(trunk);

      // Canopy layers (flat, wind-swept coastal Monterey cypress canopy)
      const canopy1 = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 0.35, 8), foliageMat);
      canopy1.position.copy(treePos).add(new THREE.Vector3(0, 0.5, 0));
      this.group.add(canopy1);

      const canopy2 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.9, 0.3, 8), foliageMat);
      canopy2.position.copy(treePos).add(new THREE.Vector3(0, 0.8, 0));
      this.group.add(canopy2);
    }

    // 7. Plunging Ocean Cliffs directly beneath Road (Left Side / +normal)
    const oceanCliffVerts = [];
    const oceanCliffColors = [];
    const oceanCliffIndices = [];
    const seaLevelY = -3.8;

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      // Drops from road left edge (+normal) down into the surf
      const roadLeft = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2 + 0.14);
      const midCliff = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2 + 3.4).add(new THREE.Vector3(0, (seaLevelY - pt.y) * 0.55, 0));
      const seaShore = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2 + 7.8).setY(seaLevelY);

      oceanCliffVerts.push(
        roadLeft.x, roadLeft.y, roadLeft.z,
        midCliff.x, midCliff.y, midCliff.z,
        seaShore.x, seaShore.y, seaShore.z
      );

      const sunlitSand = new THREE.Color(0xa8673a);
      const darkWetRock = new THREE.Color(0x241d18);

      oceanCliffColors.push(
        sunlitSand.r, sunlitSand.g, sunlitSand.b,
        darkWetRock.r, darkWetRock.g, darkWetRock.b,
        darkWetRock.r * 0.7, darkWetRock.g * 0.7, darkWetRock.b * 0.7
      );

      if (i < numPoints) {
        const r1 = i * 3;
        const r2 = (i + 1) * 3;
        oceanCliffIndices.push(r1, r2, r1 + 1);
        oceanCliffIndices.push(r1 + 1, r2, r2 + 1);
        oceanCliffIndices.push(r1 + 1, r2 + 1, r1 + 2);
        oceanCliffIndices.push(r1 + 2, r2 + 1, r2 + 2);
      }
    }

    const oceanCliffGeo = new THREE.BufferGeometry();
    oceanCliffGeo.setAttribute('position', new THREE.Float32BufferAttribute(oceanCliffVerts, 3));
    oceanCliffGeo.setAttribute('color', new THREE.Float32BufferAttribute(oceanCliffColors, 3));
    oceanCliffGeo.computeVertexNormals();
    oceanCliffGeo.setIndex(oceanCliffIndices);

    const oceanCliffMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.92,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    this.group.add(new THREE.Mesh(oceanCliffGeo, oceanCliffMat));

    // 8. The Vast Pacific Ocean (Left / West Plane with Specular Sunset Highlight)
    const oceanGeo = new THREE.PlaneGeometry(140, 140, 32, 32);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x094875,
      roughness: 0.14,
      metalness: 0.8,
      side: THREE.DoubleSide
    });
    this.oceanMesh = new THREE.Mesh(oceanGeo, oceanMat);
    this.oceanMesh.rotation.x = -Math.PI / 2;
    // Positioned across the entire left ocean view
    this.oceanMesh.position.set(-35, seaLevelY, -10);
    this.group.add(this.oceanMesh);

    // 9. Offshore Sea Stack Rocks with Crashing White Foam (Pfeiffer Beach aesthetic)
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x3d3126,
      roughness: 0.95,
      metalness: 0.08
    });

    const seaStackConfigs = [
      { pos: new THREE.Vector3(-8.5, seaLevelY + 1.2, -32), scale: new THREE.Vector3(3.2, 4.4, 2.8) },
      { pos: new THREE.Vector3(-12.0, seaLevelY + 0.9, -14), scale: new THREE.Vector3(2.6, 3.6, 2.4) },
      { pos: new THREE.Vector3(-7.5, seaLevelY + 0.8, 6), scale: new THREE.Vector3(2.4, 3.2, 2.0) },
      { pos: new THREE.Vector3(-11.5, seaLevelY + 0.6, 20), scale: new THREE.Vector3(3.0, 2.8, 2.6) }
    ];

    this.seaStacks = [];
    seaStackConfigs.forEach((cfg) => {
      const rockGeo = new THREE.DodecahedronGeometry(1.0, 1);
      rockGeo.scale(cfg.scale.x, cfg.scale.y, cfg.scale.z);
      const rock = new THREE.Mesh(rockGeo, rockMat);
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

    // 10. Tasteful California Route 1 Scenic Turnout Milestone Markers
    this.milestones = [];
    const milestoneConfigs = [
      {
        t: 0.26,
        epoch: 'MILESTONE // 2023',
        title: 'VITS CSE FOUNDATIONS',
        desc: 'ALGORITHMS // SYSTEMS ARCHITECTURE'
      },
      {
        t: 0.54,
        epoch: 'ACTIVE // 2024 — PRESENT',
        title: 'DREAM FILLER COMPANY',
        desc: 'BACKEND SERVICES // REST APIS // DB ARCH'
      },
      {
        t: 0.78,
        epoch: 'PACIFIC HORIZONS',
        title: 'DISTRIBUTED SYSTEMS',
        desc: 'HIGH CONCURRENCY // EVENT CLOUD'
      }
    ];

    milestoneConfigs.forEach((cfg) => {
      const pt = this.curve.getPoint(cfg.t);
      const tangent = this.curve.getTangent(cfg.t);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const mGroup = new THREE.Group();
      // Position sign neatly on the mountain shoulder turnout (-normal)
      const signPos = pt.clone().addScaledVector(normal, -roadWidth / 2 - 1.1).add(new THREE.Vector3(0, 0.1, 0));
      mGroup.position.copy(signPos);

      // Orient sign naturally toward approaching drivers
      const lookPt = pt.clone().add(tangent.clone().multiplyScalar(4));
      mGroup.lookAt(lookPt);

      // Wooden Signposts
      const signPostGeo = new THREE.CylinderGeometry(0.045, 0.055, 1.4, 8);
      const signPostMat = new THREE.MeshStandardMaterial({ color: 0x3d3228, roughness: 0.9 });

      const post1 = new THREE.Mesh(signPostGeo, signPostMat);
      post1.position.set(-0.55, 0.7, 0);
      mGroup.add(post1);

      const post2 = new THREE.Mesh(signPostGeo, signPostMat);
      post2.position.set(0.55, 0.7, 0);
      mGroup.add(post2);

      // Highway Turnout Signboard Panel
      const signboard = this.createTurnoutSign(cfg);
      signboard.position.set(0, 1.25, 0.04);
      mGroup.add(signboard);

      // Amber Solar Reflector Beacon
      const solarBeacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.045, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xf59e0b })
      );
      solarBeacon.position.set(0, 1.76, 0.04);
      mGroup.add(solarBeacon);

      this.group.add(mGroup);
      this.milestones.push({ group: mGroup, solarBeacon });
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
      const wGroup = new THREE.Group();
      wGroup.position.set(pos.x, pos.y, pos.z);

      // Rubber Tire
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.075, 16), tireMat);
      tire.rotation.z = Math.PI / 2;
      wGroup.add(tire);

      // Multi-Spoke Alloy Rim
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.08, 12), rimMat);
      rim.rotation.z = Math.PI / 2;
      wGroup.add(rim);

      // Red Sport Brake Caliper
      const caliper = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.035), new THREE.MeshBasicMaterial({ color: 0xdc2626 }));
      caliper.position.set(pos.x > 0 ? -0.025 : 0.025, 0.03, 0);
      wGroup.add(caliper);

      carGroup.add(wGroup);
      wheels.push(wGroup);
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
      { color: 0xea580c, isConvertible: true, speed: 0.082 },  // Sunset Lava Orange Speedster
      { color: 0xdc2626, isConvertible: false, speed: 0.075 }, // Guards Crimson Red Fastback Coupe
      { color: 0x0284c7, isConvertible: true, speed: 0.088 },  // Pacific Riviera Blue Speedster
      { color: 0xf1f5f9, isConvertible: false, speed: 0.070 }, // Chalk White Fastback Coupe
      { color: 0x15803d, isConvertible: true, speed: 0.085 }   // Monterey Cypress Green Speedster
    ];

    const roadWidth = 3.2;

    carConfigs.forEach((cfg, idx) => {
      const isNorthbound = idx % 2 === 0;
      const { carGroup, wheels } = this.createSportsCar(cfg);

      this.group.add(carGroup);

      this.cruisers.push({
        group: carGroup,
        wheels,
        progress: (idx / carConfigs.length) + Math.random() * 0.08,
        speed: cfg.speed + (Math.random() - 0.5) * 0.01,
        laneOffset: (isNorthbound ? -1 : 1) * (roadWidth * 0.24),
        isNorthbound
      });
    });
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
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.06);

    // Scenic vista camera perspective looking down the Pacific Coast Highway
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, 0.4 + this.mouse.x * 2.0, 0.05);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 7.2 - this.mouse.y * 1.0, 0.05);
    this.camera.lookAt(0, 2.4, -14.0);

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

    // Cruising Coastal Roadsters along Highway Lanes
    if (this.cruisers && this.curve) {
      this.cruisers.forEach((car) => {
        if (car.isNorthbound) {
          // Northbound: Cruises toward distant mountain pass
          car.progress = (car.progress - delta * car.speed + 1.0) % 1.0;
        } else {
          // Southbound: Cruises south along coastal highway
          car.progress = (car.progress + delta * car.speed) % 1.0;
        }

        const pt = this.curve.getPoint(car.progress);
        const tangent = this.curve.getTangent(car.progress);
        const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

        car.group.position.copy(pt)
          .addScaledVector(normal, car.laneOffset)
          .add(new THREE.Vector3(0, 0.04, 0));

        // Orient vehicle along highway curvature
        const forward = car.isNorthbound ? tangent.clone().negate() : tangent;
        const lookPt = pt.clone().add(forward);
        car.group.lookAt(lookPt);
        car.group.rotation.z = (car.isNorthbound ? 1 : -1) * normal.x * 0.18;

        // Dynamically spin all 4 alloy wheels proportional to speed
        const spinSpeed = car.speed * 42;
        if (car.wheels) {
          car.wheels.forEach((w) => {
            w.rotation.x += car.isNorthbound ? -delta * spinSpeed : delta * spinSpeed;
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
    this.container.removeEventListener('mousemove', this.onMouseMove);
  }
}
