import * as THREE from 'three';

/**
 * High-performance GPU Particle Cloud Scene for Hero
 * Features:
 * - 12,000+ GPU particles (scaled gracefully on mobile)
 * - Mouse proximity attraction & repulsion physics
 * - Procedural curl-noise / harmonic breathing
 * - Scatter & Reform impulse on click/drag
 */
export class HeroParticlesScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 35;

    // Detect mobile / low power to set particle count
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
    this.particleCount = isMobile ? 4000 : 12000;

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isPressed = false;
    this.impulseStrength = 0;
    this.time = 0;

    this.initParticles();
    this.bindEvents();
  }

  initParticles() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const originalPositions = new Float32Array(this.particleCount * 3);
    const randoms = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    const color1 = new THREE.Color(0x00f0ff); // Electric Cyan
    const color2 = new THREE.Color(0x38bdf8); // Electric Sky Blue
    const color3 = new THREE.Color(0xffffff); // Crisp White

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Create a complex dual-torus / volumetric orbital cloud
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 10 + (Math.random() - 0.5) * 8;

      // Primary orbital ring + core cloud
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = (radius * 0.6) * Math.sin(phi) * Math.sin(theta);
      const z = (radius * 0.8) * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions[i3] = x;
      originalPositions[i3 + 1] = y;
      originalPositions[i3 + 2] = z;

      randoms[i3] = Math.random();
      randoms[i3 + 1] = Math.random();
      randoms[i3 + 2] = Math.random();

      // Blend colors based on radial distance
      const mixRatio = Math.random();
      const chosenColor = mixRatio > 0.6 ? color1 : mixRatio > 0.2 ? color2 : color3;

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOriginal', new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Shader Material for glow, depth, and mouse interaction
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uImpulse;
      attribute vec3 aOriginal;
      attribute vec3 aRandom;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;
        vec3 pos = aOriginal;

        // Harmonic organic oscillation
        float freq = 0.5;
        pos.x += sin(uTime * freq + aRandom.x * 6.28) * (1.0 + aRandom.y);
        pos.y += cos(uTime * freq * 0.8 + aRandom.y * 6.28) * (1.0 + aRandom.z);
        pos.z += sin(uTime * freq * 1.2 + aRandom.z * 6.28) * (1.0 + aRandom.x);

        // Interactive mouse force
        vec3 mouseWorld = vec3(uMouse.x * 20.0, uMouse.y * 15.0, 0.0);
        float dist = distance(pos, mouseWorld);
        float maxDist = 12.0;

        if (dist < maxDist) {
          float force = (1.0 - dist / maxDist);
          vec3 dir = normalize(pos - mouseWorld);
          pos += dir * force * 5.0;
        }

        // Scatter impulse when clicked/held
        if (uImpulse > 0.01) {
          vec3 scatterDir = normalize(pos);
          pos += scatterDir * uImpulse * (8.0 + aRandom.x * 12.0);
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        // Perspective particle size
        gl_PointSize = (24.0 * (1.0 + aRandom.z * 1.5)) / -mvPosition.z;
        vAlpha = clamp(1.0 - (-mvPosition.z / 70.0), 0.2, 0.95);
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Soft circular particle
        float d = distance(gl_PointCoord, vec2(0.5));
        if (d > 0.5) discard;

        float strength = pow(1.0 - (d * 2.0), 1.5);
        gl_FragColor = vec4(vColor, strength * vAlpha);
      }
    `;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uImpulse: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);

    // Subtle background wireframe constellation
    const icosaGeometry = new THREE.IcosahedronGeometry(18, 1);
    const icosaMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.04
    });
    this.wireframeMesh = new THREE.Mesh(icosaGeometry, icosaMaterial);
    this.scene.add(this.wireframeMesh);
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);
    };

    this.onMouseDown = () => {
      this.isPressed = true;
    };

    this.onMouseUp = () => {
      this.isPressed = false;
    };

    this.onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        this.targetMouse.set(x, y);
      }
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.container.addEventListener('touchstart', this.onMouseDown, { passive: true });
    window.addEventListener('touchend', this.onMouseUp, { passive: true });
  }

  update(delta) {
    this.time += delta;

    // Smooth mouse lerp
    this.mouse.lerp(this.targetMouse, 0.08);

    // Impulse physics for click/scatter
    if (this.isPressed) {
      this.impulseStrength = THREE.MathUtils.lerp(this.impulseStrength, 1.0, 0.1);
    } else {
      this.impulseStrength = THREE.MathUtils.lerp(this.impulseStrength, 0.0, 0.05);
    }

    if (this.material) {
      this.material.uniforms.uTime.value = this.time;
      this.material.uniforms.uMouse.value.copy(this.mouse);
      this.material.uniforms.uImpulse.value = this.impulseStrength;
    }

    // Parallax camera rotation
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.mouse.x * 5, 0.05);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.mouse.y * 3, 0.05);
    this.camera.lookAt(0, 0, 0);

    // Gentle rotational drift
    if (this.points) {
      this.points.rotation.y = this.time * 0.05;
      this.points.rotation.x = Math.sin(this.time * 0.03) * 0.1;
    }
    if (this.wireframeMesh) {
      this.wireframeMesh.rotation.y = -this.time * 0.03;
      this.wireframeMesh.rotation.x = Math.cos(this.time * 0.02) * 0.1;
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
    this.container.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchstart', this.onMouseDown);
    window.removeEventListener('touchend', this.onMouseUp);

    if (this.points) {
      this.points.geometry.dispose();
      this.material.dispose();
    }
    if (this.wireframeMesh) {
      this.wireframeMesh.geometry.dispose();
      this.wireframeMesh.material.dispose();
    }
  }
}
