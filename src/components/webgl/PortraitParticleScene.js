import * as THREE from 'three';

/**
 * High-Definition Volumetric 3D Particle Portrait
 * - High-density particle grid sampled directly from source photo
 * - Default state is 100% intact, pristine, and clearly recognizable as Arav
 * - Mouse hover creates subtle organic particle displacement near cursor
 * - Mouse click / tap triggers explosive 3D particle scatter with smooth spring return
 * - Supports 3D interactive drag rotation
 */
export class PortraitParticleScene {
  constructor(container, imageSrc = '/arav-portrait-hero.jpg') {
    this.container = container;
    this.imageSrc = imageSrc;
    this.width = container.clientWidth || 400;
    this.height = container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 24);

    this.mouse = new THREE.Vector2(100.0, 100.0); // Start off-screen so no center distortion
    this.targetMouse = new THREE.Vector2(100.0, 100.0);
    this.isPressed = false;
    this.isHovered = false;
    this.hoverProgress = 0.0;
    this.impulse = 0.0;
    this.assembleProgress = 1.0; // 100% formed & pristine by default
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

      // High-density sampling for ultra-sharp facial recognition
      const sampleWidth = 240;
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

          if (a > 0.08) {
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Preserve facial details and filter dark empty background
            if (lum > 0.05) {
              const normX = (x / sampleWidth - 0.5) * 2;
              const normY = (y / sampleHeight - 0.5) * 2;

              const posX = (x / sampleWidth - 0.5) * scaleX;
              const posY = -(y / sampleHeight - 0.5) * scaleY;

              // True volumetric 3D cranial depth relief
              const distFromCenter = Math.sqrt(normX * normX + normY * normY);
              const cranialBulge = Math.sqrt(Math.max(0, 1.0 - Math.min(distFromCenter * 0.92, 1.0) ** 2)) * 3.2;
              const facialRelief = (lum - 0.3) * 3.2 + Math.pow(lum, 2.0) * 1.8;
              const posZ = cranialBulge + facialRelief - 1.5;

              targetPositions.push(posX, posY, posZ);

              // 3D scatter explosion trajectory
              const sTheta = Math.random() * Math.PI * 2;
              const sPhi = Math.acos(Math.random() * 2 - 1);
              const sRadius = 12 + Math.random() * 24;
              const sX = sRadius * Math.sin(sPhi) * Math.cos(sTheta);
              const sY = sRadius * Math.sin(sPhi) * Math.sin(sTheta);
              const sZ = sRadius * Math.cos(sPhi);

              scatteredPositions.push(sX, sY, sZ);

              // Natural True Color Preservation with subtle warm bronze highlights
              const warmHighlight = Math.max(0, (lum - 0.6) * 0.4);
              colors.push(
                Math.min(1.0, r + warmHighlight * 0.4),
                Math.min(1.0, g + warmHighlight * 0.2),
                Math.min(1.0, b)
              );

              randoms.push(Math.random(), Math.random(), Math.random());
            }
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(targetPositions, 3));
      geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(targetPositions, 3));
      geometry.setAttribute('aScattered', new THREE.Float32BufferAttribute(scatteredPositions, 3));
      geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const vertexShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uHover;
        uniform float uImpulse;
        attribute vec3 aTarget;
        attribute vec3 aScattered;
        attribute vec3 aRandom;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;

          vec3 pos = aTarget;

          // Subtle organic micro-breathing (keeps the face looking alive)
          float breath = sin(uTime * 1.2 + aRandom.y * 6.28) * 0.12;
          pos.z += breath;

          // Interactive Cursor proximity repulsion (active ONLY when hovered over canvas)
          if (uHover > 0.01) {
            vec3 mouseWorld = vec3(uMouse.x * 10.0, uMouse.y * 9.0, 1.5);
            float dist = distance(pos, mouseWorld);
            float maxDist = 5.0;

            if (dist < maxDist) {
              float force = pow(1.0 - dist / maxDist, 1.8) * uHover;
              vec3 dir = normalize(pos - mouseWorld);
              pos += dir * force * 3.2;
            }
          }

          // Click / Touch dispersion explosion impulse
          if (uImpulse > 0.005) {
            vec3 scatterDir = normalize(aScattered + (aRandom - 0.5) * 4.0);
            pos += scatterDir * uImpulse * (7.0 + aRandom.y * 12.0);
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // High-density sharp particle sizing
          gl_PointSize = (14.0 * (0.8 + aRandom.z * 0.5)) / -mvPosition.z;
          vAlpha = clamp(1.0 - (-mvPosition.z / 60.0), 0.35, 1.0);
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float strength = pow(1.0 - (d * 2.0), 1.2);
          gl_FragColor = vec4(vColor, strength * vAlpha);
        }
      `;

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(100.0, 100.0) },
          uHover: { value: 0.0 },
          uImpulse: { value: 0.0 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      });

      this.points = new THREE.Points(geometry, this.material);
      this.rotationGroup.add(this.points);
    };
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);
      this.isHovered = true;

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
    };

    this.onMouseLeave = () => {
      this.isHovered = false;
      this.targetMouse.set(100.0, 100.0);
    };

    this.onTouchStart = (e) => {
      if (e.touches.length > 0) {
        this.isPressed = true;
        this.isDragging = true;
        this.isHovered = true;
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
    this.container.addEventListener('mouseleave', this.onMouseLeave);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: true });
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchend', this.onMouseUp);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.1);

    // Hover blending
    const targetHover = this.isHovered ? 1.0 : 0.0;
    this.hoverProgress = THREE.MathUtils.lerp(this.hoverProgress, targetHover, 0.08);

    // Click impulse for scattering
    if (this.isPressed) {
      this.impulse = THREE.MathUtils.lerp(this.impulse, 1.0, 0.2);
    } else {
      this.impulse = THREE.MathUtils.lerp(this.impulse, 0.0, 0.06);
    }

    if (this.material) {
      this.material.uniforms.uTime.value = this.time;
      this.material.uniforms.uMouse.value.copy(this.mouse);
      this.material.uniforms.uHover.value = this.hoverProgress;
      this.material.uniforms.uImpulse.value = this.impulse;
    }

    // Natural 3D head rotation when hovering
    if (!this.isDragging && this.isHovered) {
      this.rotationGroup.rotation.y = THREE.MathUtils.lerp(this.rotationGroup.rotation.y, this.mouse.x * 0.35, 0.05);
      this.rotationGroup.rotation.x = THREE.MathUtils.lerp(this.rotationGroup.rotation.x, -this.mouse.y * 0.25, 0.05);
    } else if (!this.isDragging) {
      this.rotationGroup.rotation.y = THREE.MathUtils.lerp(this.rotationGroup.rotation.y, 0, 0.04);
      this.rotationGroup.rotation.x = THREE.MathUtils.lerp(this.rotationGroup.rotation.x, 0, 0.04);
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
    this.container.removeEventListener('mouseenter', this.onMouseEnter);
    this.container.removeEventListener('mouseleave', this.onMouseLeave);
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

export default PortraitParticleScene;
