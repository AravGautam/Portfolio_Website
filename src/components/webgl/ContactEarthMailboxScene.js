import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

/**
 * Signature 3D Contact Experience Scene (Red & Cobalt Blue)
 * 1. 3D Accurate Earth with Natural Earth landmask point cloud.
 * 2. Camera locates Satna, MP, India (24.5854° N, 80.8293° E) with pulsing beacon.
 * 3. A glowing 3D Bézier spline emerges from India and travels into space.
 * 4. A 3D Mailbox object sits at the end of the spline.
 * 5. Mailbox lid opens/closes based on form state.
 * 6. Interactive flying letter packet on submit.
 */
export class ContactEarthMailboxScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 28);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.time = 0;

    this.globeRadius = 9.2;
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    this.mailboxGroup = new THREE.Group();
    this.scene.add(this.mailboxGroup);

    this.mailboxLidAngle = 0;
    this.targetMailboxLidAngle = 0; // 0 = closed, 1 = open
    this.letterProgress = -1; // -1 = idle, 0 to 1 = flying along spline

    this.loadLandmaskAndInit();
    this.initMailboxObject();
    this.bindEvents();
  }

  latLongToVector3(lat, lon, radius = this.globeRadius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  loadLandmaskAndInit() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/earth-topology.png';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1024;
      canvas.height = 512;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      this.buildGlobeGeometry(imgData, canvas.width, canvas.height);
      this.initSatnaPinpointAndSpline();
    };

    img.onerror = () => {
      this.buildFallbackGlobe();
      this.initSatnaPinpointAndSpline();
    };
  }

  buildGlobeGeometry(imgData, mapWidth, mapHeight) {
    const particleCount = 28000;
    const positions = [];
    const colors = [];

    const cyanBlue = new THREE.Color(0x00f0ff);
    const crimsonRed = new THREE.Color(0xff3344);
    const oceanDark = new THREE.Color(0x0a1128);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const lat = 90 - (phi * 180) / Math.PI;
      let lon = ((theta * 180) / Math.PI) % 360;
      if (lon > 180) lon -= 360;
      if (lon < -180) lon += 360;

      const u = Math.min(Math.max((lon + 180) / 360, 0), 0.999);
      const v = Math.min(Math.max((90 - lat) / 180, 0), 0.999);

      const px = Math.floor(u * mapWidth);
      const py = Math.floor(v * mapHeight);
      const luminance = imgData[(py * mapWidth + px) * 4] / 255;

      const isLand = luminance > 0.35;

      if (isLand || Math.random() < 0.05) {
        const radius = isLand ? this.globeRadius + 0.05 : this.globeRadius;
        const pos = this.latLongToVector3(lat, lon, radius);

        positions.push(pos.x, pos.y, pos.z);

        if (isLand) {
          const chosen = Math.random() > 0.25 ? cyanBlue : crimsonRed;
          colors.push(chosen.r, chosen.g, chosen.b);
        } else {
          colors.push(oceanDark.r, oceanDark.g, oceanDark.b);
        }
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    this.points = new THREE.Points(geometry, material);
    this.globeGroup.add(this.points);

    // Inner dark sphere to occlude back hemisphere
    const coreGeo = new THREE.SphereGeometry(this.globeRadius - 0.1, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x05060a });
    this.coreSphere = new THREE.Mesh(coreGeo, coreMat);
    this.globeGroup.add(this.coreSphere);
  }

  buildFallbackGlobe() {
    const particleCount = 10000;
    const positions = [];
    const colors = [];
    const cyan = new THREE.Color(0x00f0ff);

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const lat = 90 - (phi * 180) / Math.PI;
      const lon = ((theta * 180) / Math.PI) % 360 - 180;

      const pos = this.latLongToVector3(lat, lon, this.globeRadius);
      positions.push(pos.x, pos.y, pos.z);
      colors.push(cyan.r, cyan.g, cyan.b);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.8 });
    this.points = new THREE.Points(geometry, material);
    this.globeGroup.add(this.points);
  }

  initSatnaPinpointAndSpline() {
    const satnaLat = 24.5854;
    const satnaLon = 80.8293;
    this.satnaPos = this.latLongToVector3(satnaLat, satnaLon, this.globeRadius + 0.15);

    this.satnaGroup = new THREE.Group();
    this.satnaGroup.position.copy(this.satnaPos);
    this.satnaGroup.lookAt(this.satnaPos.clone().multiplyScalar(2));

    // Concentric Sonar Pulse Rings
    this.sonarRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(0.3 + i * 0.35, 0.34 + i * 0.35, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xff3344 : 0x00f0ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = { phase: i * 0.33 };
      this.satnaGroup.add(ring);
      this.sonarRings.push(ring);
    }

    // Glowing beacon
    const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.satnaGroup.add(new THREE.Mesh(coreGeo, coreMat));

    this.globeGroup.add(this.satnaGroup);

    // Orient India facing the camera
    this.globeGroup.rotation.y = -Math.PI * 0.72;
    this.globeGroup.rotation.x = 0.28;

    // Glowing 3D Spline from Satna into space towards the 3D Mailbox
    const mailboxTarget = new THREE.Vector3(12, -2, 2);
    const midPoint1 = this.satnaPos.clone().add(new THREE.Vector3(4, 5, 3));
    const midPoint2 = new THREE.Vector3(8, 2, 4);

    this.splineCurve = new THREE.CubicBezierCurve3(this.satnaPos, midPoint1, midPoint2, mailboxTarget);
    const splinePoints = this.splineCurve.getPoints(60);
    const splineGeo = new THREE.BufferGeometry().setFromPoints(splinePoints);
    const splineMat = new THREE.LineBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.6,
      linewidth: 2
    });
    this.splineLine = new THREE.Line(splineGeo, splineMat);
    this.globeGroup.add(this.splineLine);

    // Glowing Letter Mesh that travels along the spline
    const letterGeo = new THREE.BoxGeometry(0.6, 0.4, 0.08);
    const letterMat = new THREE.MeshBasicMaterial({ color: 0xff3344 });
    this.letterMesh = new THREE.Mesh(letterGeo, letterMat);
    this.letterMesh.visible = false;
    this.globeGroup.add(this.letterMesh);
  }

  initMailboxObject() {
    // 3D Cyber Mailbox Object
    this.mailboxGroup.position.set(12, -2, 2);

    // Mailbox Body
    const bodyGeo = new THREE.BoxGeometry(2.4, 1.8, 3.2);
    const bodyMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    this.mailboxBody = new THREE.Mesh(bodyGeo, bodyMat);
    this.mailboxGroup.add(this.mailboxBody);

    // Mailbox Post
    const postGeo = new THREE.CylinderGeometry(0.12, 0.12, 4, 16);
    const postMat = new THREE.MeshBasicMaterial({ color: 0xff3344, wireframe: true, transparent: true, opacity: 0.3 });
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.y = -2.8;
    this.mailboxGroup.add(post);

    // Mailbox Door / Lid (Hinged at bottom of front face)
    this.lidPivot = new THREE.Group();
    this.lidPivot.position.set(0, -0.9, 1.6);

    const lidGeo = new THREE.BoxGeometry(2.3, 1.7, 0.1);
    const lidMat = new THREE.MeshBasicMaterial({
      color: 0xff3344,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.set(0, 0.85, 0);
    this.lidPivot.add(lidMesh);

    this.mailboxGroup.add(this.lidPivot);
    this.openMailbox();
  }

  openMailbox() {
    this.targetMailboxLidAngle = Math.PI * 0.55; // Open downward
  }

  closeMailbox() {
    this.targetMailboxLidAngle = 0; // Closed
  }

  sendLetterAnimation(onComplete) {
    this.letterProgress = 0;
    this.onLetterComplete = onComplete;
    if (this.letterMesh) this.letterMesh.visible = true;
    this.closeMailbox();
  }

  bindEvents() {
    this.onMouseDown = (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.globeGroup.rotation.y += deltaX * 0.005;
        this.globeGroup.rotation.x += deltaY * 0.005;

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    this.onMouseUp = () => {
      this.isDragging = false;
    };

    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);

    this.container.addEventListener('mouseenter', () => soundEngine.playRadarPing());
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.05);

    if (!this.isDragging) {
      this.globeGroup.rotation.y += delta * 0.025;
    }

    // Sonar radar ripples
    if (this.sonarRings) {
      this.sonarRings.forEach((ring) => {
        const progress = (this.time * 0.8 + ring.userData.phase) % 1;
        const scale = 0.5 + progress * 2.2;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = Math.max(0, 1 - progress);
      });
    }

    // Mailbox Lid Animation
    this.mailboxLidAngle = THREE.MathUtils.lerp(this.mailboxLidAngle, this.targetMailboxLidAngle, 0.08);
    if (this.lidPivot) {
      this.lidPivot.rotation.x = this.mailboxLidAngle;
    }

    // Flying letter along spline
    if (this.letterProgress >= 0 && this.splineCurve && this.letterMesh) {
      this.letterProgress += delta * 0.6;
      if (this.letterProgress <= 1.0) {
        const pt = this.splineCurve.getPoint(this.letterProgress);
        this.letterMesh.position.copy(pt);
        this.letterMesh.rotation.y = this.time * 4;
      } else {
        this.letterProgress = -1;
        this.letterMesh.visible = false;
        if (this.onLetterComplete) this.onLetterComplete();
      }
    }

    this.camera.position.x = this.mouse.x * 1.5;
    this.camera.position.y = this.mouse.y * 1.0;
    this.camera.lookAt(0, 0, 0);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.container.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);

    if (this.points) {
      this.points.geometry.dispose();
      this.points.material.dispose();
    }
  }
}
