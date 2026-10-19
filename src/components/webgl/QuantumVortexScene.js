import * as THREE from 'three';

/**
 * QuantumVortexScene:
 * High-performance interactive 3D WebGL particle vortex swirling around
 * a gravitational singularity with mouse raycasting, 3D drag rotation,
 * and explosive supernova shockwave physics.
 */
export class QuantumVortexScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 10, 24);
    this.camera.lookAt(0, 0, 0);

    this.rotationGroup = new THREE.Group();
    this.scene.add(this.rotationGroup);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.time = 0;
    this.explosionForce = 0;

    this.initCore();
    this.initParticles();
    this.bindEvents();
  }

  initCore() {
    // Gravitational event horizon singularity
    const coreGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x030712,
      wireframe: false
    });
    this.coreMesh = new THREE.Mesh(coreGeo, coreMat);
    this.rotationGroup.add(this.coreMesh);

    // Glowing halo ring around the singularity
    const ringGeo = new THREE.RingGeometry(1.65, 2.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.haloRing = new THREE.Mesh(ringGeo, ringMat);
    this.haloRing.rotation.x = Math.PI / 2;
    this.rotationGroup.add(this.haloRing);
  }

  initParticles() {
    const count = 3200;
    this.particleCount = count;

    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const colorA = new THREE.Color(0x38bdf8); // Cyan
    const colorB = new THREE.Color(0x0284c7); // Deep Azure
    const colorC = new THREE.Color(0xffffff); // White hot core

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Exponential distribution towards the center
      const r = Math.pow(Math.random(), 2.0) * 14 + 2.0;
      const angle = Math.random() * Math.PI * 2;
      const verticalSpread = (Math.random() - 0.5) * (r * 0.22);

      const x = Math.cos(angle) * r;
      const y = verticalSpread;
      const z = Math.sin(angle) * r;

      positions[idx] = x;
      positions[idx + 1] = y;
      positions[idx + 2] = z;

      basePositions[idx] = x;
      basePositions[idx + 1] = y;
      basePositions[idx + 2] = z;

      velocities[idx] = 0;
      velocities[idx + 1] = 0;
      velocities[idx + 2] = 0;

      // Color based on radius (white-hot near core, cyan to blue on outer disk)
      const ratio = Math.min(Math.max((r - 2) / 12, 0), 1);
      const chosenColor = ratio < 0.25 ? colorC.clone().lerp(colorA, ratio * 4) : colorA.clone().lerp(colorB, (ratio - 0.25) * 1.33);

      colors[idx] = chosenColor.r;
      colors[idx + 1] = chosenColor.g;
      colors[idx + 2] = chosenColor.b;

      scales[i] = Math.random() * 2.2 + 1.2;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Particle Canvas Texture for glowing circular dots
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.8)');
    grad.addColorStop(0.7, 'rgba(2, 132, 199, 0.3)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);

    this.material = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.particleMesh = new THREE.Points(this.geometry, this.material);
    this.rotationGroup.add(this.particleMesh);

    this.basePositions = basePositions;
    this.velocities = velocities;
  }

  triggerSupernova() {
    this.explosionForce = 1.0;
    const pos = this.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      const x = pos[idx];
      const y = pos[idx + 1];
      const z = pos[idx + 2];
      const len = Math.hypot(x, y, z) || 1;

      const blast = Math.random() * 26 + 18;
      this.velocities[idx] = (x / len) * blast;
      this.velocities[idx + 1] = ((y / len) + (Math.random() - 0.5) * 0.5) * blast;
      this.velocities[idx + 2] = (z / len) * blast;
    }
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

    // Smooth mouse lerp
    this.mouse.lerp(this.targetMouse, 0.08);

    // Continuous orbital rotation
    if (!this.isDragging) {
      this.rotationGroup.rotation.y += 0.28 * delta;
      this.rotationGroup.rotation.x = Math.sin(this.time * 0.4) * 0.18 + this.mouse.y * 0.25;
    }

    // Pulse halo ring
    if (this.haloRing) {
      const scale = 1 + Math.sin(this.time * 3) * 0.08;
      this.haloRing.scale.set(scale, scale, 1);
    }

    // Update particles orbiting singularity
    const positions = this.geometry.attributes.position.array;
    const base = this.basePositions;
    const vel = this.velocities;
    const decay = Math.exp(-delta * 3.5);

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;

      if (this.explosionForce > 0.01) {
        // Disperse and pull back
        positions[idx] += vel[idx] * delta;
        positions[idx + 1] += vel[idx + 1] * delta;
        positions[idx + 2] += vel[idx + 2] * delta;

        vel[idx] *= decay;
        vel[idx + 1] *= decay;
        vel[idx + 2] *= decay;

        // Gravitational return spring
        const pull = delta * 4.2;
        positions[idx] += (base[idx] - positions[idx]) * pull;
        positions[idx + 1] += (base[idx + 1] - positions[idx + 1]) * pull;
        positions[idx + 2] += (base[idx + 2] - positions[idx + 2]) * pull;
      } else {
        // Natural swirling orbital physics
        let x = positions[idx];
        let y = positions[idx + 1];
        let z = positions[idx + 2];

        const r = Math.hypot(x, z);
        const currentAngle = Math.atan2(z, x);
        const angularVelocity = (2.2 / (r + 0.5)) * delta;
        const nextAngle = currentAngle + angularVelocity;

        // Wave oscillation in Y
        const wave = Math.sin(r * 1.5 - this.time * 3) * 0.45;

        positions[idx] = Math.cos(nextAngle) * r;
        positions[idx + 1] = base[idx + 1] + wave;
        positions[idx + 2] = Math.sin(nextAngle) * r;
      }
    }

    if (this.explosionForce > 0) {
      this.explosionForce = Math.max(0, this.explosionForce - delta * 0.85);
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  destroy() {
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.geometry.dispose();
    this.material.dispose();
  }
}

export default QuantumVortexScene;
