import * as THREE from 'three';

/**
 * WaveTopologyScene:
 * Real-time 3D procedural vector terrain and undulating kinetic manifold.
 * Features mouse proximity elevation physics, dynamic vertex wave modulation,
 * interactive camera rotation, and expanding shockwave ripple pulses.
 */
export class WaveTopologyScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 14, 22);
    this.camera.lookAt(0, 0, 0);

    this.rotationGroup = new THREE.Group();
    this.scene.add(this.rotationGroup);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.time = 0;
    this.pulseTime = 999;

    this.initTerrain();
    this.bindEvents();
  }

  initTerrain() {
    const size = 26;
    const segments = 48;
    this.segments = segments;

    // Plane geometry laying horizontally in X-Z
    this.geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    this.geometry.rotateX(-Math.PI / 2);

    const posCount = this.geometry.attributes.position.count;
    this.baseY = new Float32Array(posCount);
    const colors = new Float32Array(posCount * 3);

    const colorA = new THREE.Color(0x0284c7); // Deep Blue
    const colorB = new THREE.Color(0x38bdf8); // Neon Cyan
    const colorC = new THREE.Color(0xffffff); // White Crests

    const posArray = this.geometry.attributes.position.array;
    for (let i = 0; i < posCount; i++) {
      const idx = i * 3;
      this.baseY[i] = posArray[idx + 1];

      colors[idx] = colorB.r;
      colors[idx + 1] = colorB.g;
      colors[idx + 2] = colorB.b;
    }

    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Wireframe Mesh
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.wireMesh = new THREE.Mesh(this.geometry, wireMat);
    this.rotationGroup.add(this.wireMesh);

    // Glowing Vertex Points on each vertex intersection
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#38bdf8');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const pointTexture = new THREE.CanvasTexture(canvas);

    const pointsMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.pointsMesh = new THREE.Points(this.geometry, pointsMat);
    this.rotationGroup.add(this.pointsMesh);
  }

  triggerPulse() {
    this.pulseTime = 0;
  }

  bindEvents() {
    this.onPointerDown = (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    };

    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);

      if (this.isDragging) {
        const dx = e.clientX - this.prevMousePos.x;
        const dy = e.clientY - this.prevMousePos.y;
        this.rotationGroup.rotation.y += dx * 0.008;
        this.rotationGroup.rotation.x += dy * 0.008;
        this.prevMousePos = { x: e.clientX, y: e.clientY };
      }
    };

    this.onPointerUp = () => {
      this.isDragging = false;
    };

    this.container.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  update(delta) {
    this.time += delta;
    this.pulseTime += delta;

    this.mouse.lerp(this.targetMouse, 0.08);

    if (!this.isDragging) {
      this.rotationGroup.rotation.y = Math.sin(this.time * 0.2) * 0.35 + this.mouse.x * 0.4;
      this.rotationGroup.rotation.x = 0.22 + Math.cos(this.time * 0.25) * 0.15 - this.mouse.y * 0.3;
    }

    const pos = this.geometry.attributes.position.array;
    const colors = this.geometry.attributes.color.array;
    const count = this.geometry.attributes.position.count;

    const mouseWorldX = this.mouse.x * 12;
    const mouseWorldZ = -this.mouse.y * 12;

    const colorA = new THREE.Color(0x0284c7);
    const colorB = new THREE.Color(0x38bdf8);
    const colorC = new THREE.Color(0xffffff);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const x = pos[idx];
      const z = pos[idx + 2];

      // Procedural multi-frequency sine & cosine wave formulas
      const wave1 = Math.sin(x * 0.35 + this.time * 2.2) * 1.35;
      const wave2 = Math.cos(z * 0.4 - this.time * 1.8) * 1.15;
      const wave3 = Math.sin((x + z) * 0.25 + this.time * 1.2) * 0.85;

      // Mouse proximity interaction (cursor pulls terrain upward)
      const distToMouse = Math.hypot(x - mouseWorldX, z - mouseWorldZ);
      const mouseInfluence = Math.max(0, 1.0 - distToMouse / 5.5) * 2.8;

      // Pulse wave ripple propagating from center
      let pulseHeight = 0;
      if (this.pulseTime < 4.0) {
        const distToCenter = Math.hypot(x, z);
        const waveFront = this.pulseTime * 8.0;
        const distFromFront = Math.abs(distToCenter - waveFront);
        pulseHeight = Math.max(0, 1.0 - distFromFront / 2.0) * Math.sin(distFromFront * 3) * (2.5 / (this.pulseTime + 0.5));
      }

      const y = wave1 + wave2 + wave3 + mouseInfluence + pulseHeight;
      pos[idx + 1] = y;

      // Color mapping: deeper blue in valleys, bright cyan in mid, pure white on wave crests
      const heightRatio = Math.min(Math.max((y + 2.5) / 5.5, 0), 1);
      const vertexColor = heightRatio > 0.65
        ? colorB.clone().lerp(colorC, (heightRatio - 0.65) / 0.35)
        : colorA.clone().lerp(colorB, heightRatio / 0.65);

      colors[idx] = vertexColor.r;
      colors[idx + 1] = vertexColor.g;
      colors[idx + 2] = vertexColor.b;
    }

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
  }

  destroy() {
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.geometry.dispose();
  }
}

export default WaveTopologyScene;
