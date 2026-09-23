import * as THREE from 'three';

/**
 * High-End Volumetric 3D Particle Portrait & LiDAR Hologram
 * - Real 3D cranial volume & facial luminance depth relief (True 3D, not 2D)
 * - Scattered cosmic cloud by default with smooth organic assembly transition
 * - 60 FPS GPU vertex shader with cursor repulsion, turbulence, and click impulse
 * - Interactive 3D orbit rotation
 */
export class PortraitParticleScene {
  constructor(container, imageSrc = '/arav-formal-dark.jpg') {
    this.container = container;
    this.imageSrc = imageSrc;
    this.width = container.clientWidth || 400;
    this.height = container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 26);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isPressed = false;
    this.isHovered = false;
    this.impulse = 0;
    this.assembleProgress = 0.0; // Starts scattered by default!
    this.targetAssemble = 0.0;
    this.time = 0;

    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.rotationGroup = new THREE.Group();
    this.scene.add(this.rotationGroup);

    this.loadImageAndGenerateParticles();
    this.bindEvents();
  }

  loadImageAndGenerateParticles() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const sampleWidth = 140;
      const sampleHeight = Math.round((img.height / img.width) * sampleWidth);
      canvas.width = sampleWidth;
      canvas.height = sampleHeight;

      ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
      const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data;

      const targetPositions = [];
      const scatteredPositions = [];
      const colors = [];
      const randoms = [];

      const aspect = sampleWidth / sampleHeight;
      const scaleX = 14;
      const scaleY = scaleX / aspect;

      for (let y = 0; y < sampleHeight; y += 1) {
        for (let x = 0; x < sampleWidth; x += 1) {
          const idx = (y * sampleWidth + x) * 4;
          const r = imgData[idx] / 255;
          const g = imgData[idx + 1] / 255;
          const b = imgData[idx + 2] / 255;
          const a = imgData[idx + 3] / 255;

          if (a > 0.1) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Filter out deep dark background
            if (lum > 0.07) {
              const normX = (x / sampleWidth - 0.5) * 2; // -1 to 1
              const normY = (y / sampleHeight - 0.5) * 2; // -1 to 1

              const posX = (x / sampleWidth - 0.5) * scaleX;
              const posY = -(y / sampleHeight - 0.5) * scaleY;

              // Volumetric 3D head curvature
              const distFromCenter = Math.sqrt(normX * normX + normY * normY);
              const cranialBulge = Math.sqrt(Math.max(0, 1.0 - Math.min(distFromCenter * 0.9, 1.0) ** 2)) * 3.8;
              const facialRelief = (lum - 0.35) * 4.2 + Math.pow(lum, 2.2) * 2.5;
              const posZ = cranialBulge + facialRelief - 2.0;

              targetPositions.push(posX, posY, posZ);

              // Scattered 3D positions by default (wide cosmic cloud)
              const sTheta = Math.random() * Math.PI * 2;
              const sPhi = Math.acos(Math.random() * 2 - 1);
              const sRadius = 14 + Math.random() * 28;
              const sX = sRadius * Math.sin(sPhi) * Math.cos(sTheta);
              const sY = sRadius * Math.sin(sPhi) * Math.sin(sTheta);
              const sZ = sRadius * Math.cos(sPhi);

              scatteredPositions.push(sX, sY, sZ);

              // Cyber-cyan & natural lighting gradient
              const tintR = r * 0.85 + 0.05;
              const tintG = g * 0.95 + 0.08;
              const tintB = b * 1.1 + 0.18;
              colors.push(tintR, tintG, tintB);

              randoms.push(Math.random(), Math.random(), Math.random());
            }
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(scatteredPositions, 3));
      geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(targetPositions, 3));
      geometry.setAttribute('aScattered', new THREE.Float32BufferAttribute(scatteredPositions, 3));
      geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const vertexShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uImpulse;
        uniform float uAssemble;
        attribute vec3 aTarget;
        attribute vec3 aScattered;
        attribute vec3 aRandom;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;

          // Smooth interpolation between scattered cosmic cloud and assembled 3D head
          float p = clamp(uAssemble + (aRandom.x - 0.5) * 0.25, 0.0, 1.0);
          // Ease-in-out curve
          float easeP = p * p * (3.0 - 2.0 * p);
          vec3 pos = mix(aScattered, aTarget, easeP);

          // 3D Organic breathing & gentle turbulence
          float breath = sin(uTime * 1.4 + aRandom.y * 6.28) * 0.3 * easeP;
          pos.z += breath;
          pos.x += cos(uTime * 0.8 + aRandom.z * 6.28) * 0.15 * (1.0 - easeP * 0.5);

          // Interactive 3D Cursor proximity repulsion
          vec3 mouseWorld = vec3(uMouse.x * 12.0, uMouse.y * 10.0, 2.0);
          float dist = distance(pos, mouseWorld);
          float maxDist = 6.5;

          if (dist < maxDist) {
            float force = pow(1.0 - dist / maxDist, 1.5);
            vec3 dir = normalize(pos - mouseWorld);
            pos += dir * force * 4.0;
          }

          // Click / Touch dispersion impulse
          if (uImpulse > 0.01) {
            vec3 scatterDir = normalize(pos + (aRandom - 0.5) * 6.0);
            pos += scatterDir * uImpulse * (8.0 + aRandom.y * 10.0);
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Perspective depth point sizing
          gl_PointSize = (18.0 * (1.0 + aRandom.z * 0.7)) / -mvPosition.z;
          vAlpha = clamp(1.0 - (-mvPosition.z / 65.0), 0.25, 0.95);
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float strength = pow(1.0 - (d * 2.0), 1.3);
          gl_FragColor = vec4(vColor, strength * vAlpha);
        }
      `;

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uImpulse: { value: 0 },
          uAssemble: { value: 0.0 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      });

      this.points = new THREE.Points(geometry, this.material);
      this.rotationGroup.add(this.points);

      // Auto-assemble smoothly after mount to give user the spectacular crystallization effect
      setTimeout(() => {
        this.targetAssemble = 1.0;
      }, 350);
    };
  }

  // Toggle or force scatter/assemble
  toggleScatter() {
    this.targetAssemble = this.targetAssemble > 0.5 ? 0.0 : 1.0;
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);

      if (this.isDragging) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.rotationGroup.rotation.y += deltaX * 0.007;
        this.rotationGroup.rotation.x += deltaY * 0.007;

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    this.onMouseDown = (e) => {
      this.isPressed = true;
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    this.onMouseUp = () => {
      this.isPressed = false;
      this.isDragging = false;
    };

    this.onMouseEnter = () => {
      this.isHovered = true;
      this.targetAssemble = 1.0;
    };

    this.onTouchStart = (e) => {
      if (e.touches.length > 0) {
        this.isPressed = true;
        this.isDragging = true;
        this.targetAssemble = 1.0;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    this.onTouchMove = (e) => {
      if (this.isDragging && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        this.targetMouse.set(x, y);

        const deltaX = touch.clientX - this.previousMousePosition.x;
        const deltaY = touch.clientY - this.previousMousePosition.y;

        this.rotationGroup.rotation.y += deltaX * 0.007;
        this.rotationGroup.rotation.x += deltaY * 0.007;

        this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
      }
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('mousedown', this.onMouseDown);
    this.container.addEventListener('mouseenter', this.onMouseEnter);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchend', this.onMouseUp);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.08);

    // Smooth transition between scattered and formed states
    this.assembleProgress = THREE.MathUtils.lerp(this.assembleProgress, this.targetAssemble, 0.04);

    if (this.isPressed) {
      this.impulse = THREE.MathUtils.lerp(this.impulse, 0.8, 0.12);
    } else {
      this.impulse = THREE.MathUtils.lerp(this.impulse, 0.0, 0.05);
    }

    if (this.material) {
      this.material.uniforms.uTime.value = this.time;
      this.material.uniforms.uMouse.value.copy(this.mouse);
      this.material.uniforms.uImpulse.value = this.impulse;
      this.material.uniforms.uAssemble.value = this.assembleProgress;
    }

    // Natural 3D head follow & idle drift when not dragging
    if (!this.isDragging) {
      this.rotationGroup.rotation.y = THREE.MathUtils.lerp(this.rotationGroup.rotation.y, this.mouse.x * 0.45, 0.05);
      this.rotationGroup.rotation.x = THREE.MathUtils.lerp(this.rotationGroup.rotation.x, -this.mouse.y * 0.3, 0.05);
    }

    // Camera parallax
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
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('mousedown', this.onMouseDown);
    this.container.removeEventListener('mouseenter', this.onMouseEnter);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchend', this.onMouseUp);

    if (this.points) {
      this.points.geometry.dispose();
      if (this.material) this.material.dispose();
    }
  }
}
