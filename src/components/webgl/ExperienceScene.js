import * as THREE from 'three';

/**
 * 3D "Road of Career Journey" Scene
 * Renders an expansive, centered, forward-running 3D career highway:
 * - Wide asphalt cyber-highway spanning the entire vertical perspective
 * - Centered path with elegant sinusoidal squiggles running straight into the horizon
 * - Grand milestone gantries for each career epoch (2023 VITS CSE -> 2024 Dream Filler Backend Intern -> Scaled Systems)
 * - Dynamic high-speed photon packets cruising down both highway lanes
 * - Responsive mouse parallax camera tilt (no awkward spinning off-screen)
 */
export class ExperienceScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 800;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(48, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 3.8, 17);
    this.camera.lookAt(0, 1.2, -16);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.time = 0;

    // Lighting (Warm Studio Bronze & Ambient)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xb46f32, 2.8);
    keyLight.position.set(8, 20, 12);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(-8, 10, -15);
    this.scene.add(rimLight);

    this.initRoad();
    this.bindEvents();
  }

  initRoad() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // 1. Spline Curve: Centered, straight with gentle elegant squiggles in between
    const curvePoints = [
      new THREE.Vector3(0, 4.4, -42),     // Far horizon (2023 Start)
      new THREE.Vector3(2.6, 2.6, -26),   // Gentle right bend (VITS CSE Foundations)
      new THREE.Vector3(-2.4, 0.6, -8),   // Gentle left bend (Dream Filler Backend Intern - Present)
      new THREE.Vector3(1.8, -0.4, 8),    // Gentle S-curve (Distributed Systems & High-Throughput)
      new THREE.Vector3(0, -1.0, 24)      // Direct center foreground (Future Horizons)
    ];

    this.curve = new THREE.CatmullRomCurve3(curvePoints);
    const numPoints = 160;
    const pathPoints = this.curve.getPoints(numPoints);

    // 2. Generate Wide 3D Highway Ribbon (Substantial width = 3.8 units)
    const roadWidth = 3.8;
    const vertices = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints);
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      const left = new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2);
      const right = new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2);

      vertices.push(left.x, left.y, left.z);
      vertices.push(right.x, right.y, right.z);

      const u = i / numPoints;
      uvs.push(0, u * 8);
      uvs.push(1, u * 8);

      if (i < numPoints) {
        const v1 = i * 2;
        const v2 = i * 2 + 1;
        const v3 = (i + 1) * 2;
        const v4 = (i + 1) * 2 + 1;

        indices.push(v1, v3, v2);
        indices.push(v2, v3, v4);
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    roadGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    roadGeo.setIndex(indices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0d,
      roughness: 0.28,
      metalness: 0.85,
      side: THREE.DoubleSide
    });

    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    this.group.add(roadMesh);

    // 3. Central Glowing Lane Divider (Dashed Bronze Line)
    const centerPoints = this.curve.getPoints(100);
    const centerGeo = new THREE.BufferGeometry().setFromPoints(centerPoints);
    const centerMat = new THREE.LineDashedMaterial({
      color: 0xb46f32,
      dashSize: 1.0,
      gapSize: 0.7,
      linewidth: 3
    });
    const centerLine = new THREE.Line(centerGeo, centerMat);
    centerLine.computeLineDistances();
    centerLine.position.y += 0.05;
    this.group.add(centerLine);

    // 4. Glowing Highway Rails & Edge Conduits (Left & Right Warm Bronze Rails)
    const railMat = new THREE.LineBasicMaterial({
      color: 0xb46f32,
      transparent: true,
      opacity: 0.85
    });

    const leftRailPts = [];
    const rightRailPts = [];
    for (let i = 0; i <= numPoints; i++) {
      const pt = pathPoints[i];
      const tangent = this.curve.getTangent(i / numPoints);
      const up = new THREE.Vector3(0, 1, 0);
      const normal = new THREE.Vector3().crossVectors(tangent, up).normalize();

      leftRailPts.push(new THREE.Vector3().copy(pt).addScaledVector(normal, -roadWidth / 2).add(new THREE.Vector3(0, 0.3, 0)));
      rightRailPts.push(new THREE.Vector3().copy(pt).addScaledVector(normal, roadWidth / 2).add(new THREE.Vector3(0, 0.3, 0)));
    }

    const leftRailGeo = new THREE.BufferGeometry().setFromPoints(leftRailPts);
    const rightRailGeo = new THREE.BufferGeometry().setFromPoints(rightRailPts);
    this.group.add(new THREE.Line(leftRailGeo, railMat));
    this.group.add(new THREE.Line(rightRailGeo, railMat));

    // 5. Vertical Structural Pillars anchoring the highway into the grid floor
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.4,
      metalness: 0.8
    });
    for (let pIdx = 10; pIdx < numPoints; pIdx += 25) {
      const pt = pathPoints[pIdx];
      const height = pt.y - (-8);
      if (height > 0) {
        const pillarGeo = new THREE.CylinderGeometry(0.18, 0.25, height, 12);
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(pt.x, pt.y - height / 2, pt.z);
        this.group.add(pillar);
      }
    }

    // 6. Career Milestone Arch Gantries
    // Waypoint 1 (t = 0.18): VITS CSE (2023)
    // Waypoint 2 (t = 0.52): DREAM FILLER BACKEND INTERN (Present)
    // Waypoint 3 (t = 0.82): SCALABLE DISTRIBUTED SYSTEMS (Next)
    this.milestones = [];
    const milestoneConfigs = [
      { t: 0.18, title: '2023 // VITS CSE', color: 0x8892b0, accent: 0xffffff },
      { t: 0.52, title: '2024 — PRESENT // DREAM FILLER INTERN', color: 0xb46f32, accent: 0xffa44a },
      { t: 0.82, title: 'FUTURE // DISTRIBUTED ARCHITECTURES', color: 0x38bdf8, accent: 0x7dd3fc }
    ];

    milestoneConfigs.forEach((cfg) => {
      const pt = this.curve.getPoint(cfg.t);
      const tangent = this.curve.getTangent(cfg.t);
      const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

      const mGroup = new THREE.Group();
      mGroup.position.copy(pt);

      // Grand Arch Gateway spanning the full highway
      const archRadius = roadWidth / 1.75;
      const archGeo = new THREE.TorusGeometry(archRadius, 0.12, 12, 32, Math.PI);
      const archMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.65,
        roughness: 0.2,
        metalness: 0.9
      });
      const arch = new THREE.Mesh(archGeo, archMat);
      arch.lookAt(pt.clone().add(tangent));
      mGroup.add(arch);

      // Horizontal Gantry Crossbeam
      const beamGeo = new THREE.BoxGeometry(roadWidth * 1.05, 0.16, 0.2);
      const beamMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        emissive: cfg.color,
        emissiveIntensity: 0.3,
        metalness: 0.95
      });
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.y = archRadius * 0.92;
      beam.lookAt(pt.clone().add(tangent));
      mGroup.add(beam);

      // Luminous Beacon Sphere atop the Arch
      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 16, 16),
        new THREE.MeshBasicMaterial({ color: cfg.accent })
      );
      beacon.position.y = archRadius + 0.5;
      mGroup.add(beacon);

      // Pulsing Ground Halo Ring on Road Surface
      const groundRing = new THREE.Mesh(
        new THREE.RingGeometry(0.7, 0.9, 32),
        new THREE.MeshBasicMaterial({ color: cfg.color, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
      );
      groundRing.rotation.x = Math.PI / 2;
      groundRing.position.y = 0.08;
      mGroup.add(groundRing);

      this.group.add(mGroup);
      this.milestones.push({ group: mGroup, beacon, groundRing, color: cfg.color, baseT: cfg.t });
    });

    // 7. Dynamic Photon Packets / Vehicles Traveling Down Highway Lanes
    this.lightStreaks = [];
    const streakCount = 10;
    for (let k = 0; k < streakCount; k++) {
      const isNorthbound = k % 2 === 0;
      const streakMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.16, 0.65),
        new THREE.MeshBasicMaterial({ color: isNorthbound ? 0xb46f32 : 0xffffff })
      );
      this.group.add(streakMesh);
      this.lightStreaks.push({
        mesh: streakMesh,
        progress: (k / streakCount) + Math.random() * 0.08,
        speed: (isNorthbound ? 0.22 : 0.18) + Math.random() * 0.08,
        laneOffset: (isNorthbound ? -1 : 1) * (roadWidth * 0.25),
        isNorthbound
      });
    }

    // 8. Ground Grid Floor beneath highway
    const baseGrid = new THREE.GridHelper(70, 50, 0x332211, 0x111116);
    baseGrid.position.y = -8;
    this.group.add(baseGrid);
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

    // Dynamic, responsive camera perspective down the central road corridor
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * 3.6, 0.06);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, 3.8 - this.mouse.y * 1.8, 0.06);
    this.camera.lookAt(0, 1.2, -16);

    // Subtle gentle road banking (without disorienting spinning)
    if (this.group) {
      this.group.rotation.z = -this.mouse.x * 0.04;
      this.group.rotation.x = this.mouse.y * 0.03;
    }

    // Milestones pulse and breathing
    if (this.milestones) {
      this.milestones.forEach((m, idx) => {
        const pulse = 1 + Math.sin(this.time * 3 + idx) * 0.14;
        m.beacon.scale.setScalar(pulse);
        m.groundRing.scale.setScalar(1 + Math.sin(this.time * 2.2 + idx) * 0.12);
      });
    }

    // Cruising photon streaks along highway lanes
    if (this.lightStreaks && this.curve) {
      this.lightStreaks.forEach((streak) => {
        streak.progress = (streak.progress + delta * streak.speed) % 1.0;
        const pt = this.curve.getPoint(streak.progress);
        const tangent = this.curve.getTangent(streak.progress);
        const normal = new THREE.Vector3().crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();

        streak.mesh.position.copy(pt)
          .addScaledVector(normal, streak.laneOffset)
          .add(new THREE.Vector3(0, 0.22, 0));

        streak.mesh.lookAt(pt.clone().add(tangent));
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
  }
}
