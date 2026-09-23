import * as THREE from 'three';

/**
 * Interactive 3D Particle Portrait Scene
 * - Loads `/arav-portrait-hero.jpg`
 * - Renders high-density GPU particles with depth relief
 * - On click: dynamic shockwave particle scatter & organic reconstruction
 * - On hover: dynamic cursor repulsion, 3D tilt, and orange/white/navy light glow
 */
export class InteractivePortraitScene {
  constructor(container, imageSrc = '/arav-portrait-hero.jpg') {
    this.container = container;
    this.imageSrc = imageSrc;
    this.width = container.clientWidth || 500;
    this.height = container.clientHeight || 650;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 24);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isPressed = false;
    this.impulse = 0;
    this.isScattered = false;
    this.scatterProgress = 0.0;
    this.time = 0;

    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    this.loadImageAndCreateMesh();
    this.bindEvents();
  }

  loadImageAndCreateMesh() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.imageSrc;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const sampleW = 150;
      const sampleH = Math.round((img.height / img.width) * sampleW);
      canvas.width = sampleW;
      canvas.height = sampleH;

      ctx.drawImage(img, 0, 0, sampleW, sampleH);
      const imgData = ctx.getImageData(0, 0, sampleW, sampleH).data;

      const basePositions = [];
      const scatterPositions = [];
      const colors = [];
      const randoms = [];

      const aspect = sampleW / sampleH;
      const scaleX = 13.5;
      const scaleY = scaleX / aspect;

      for (let y = 0; y < sampleH; y += 1) {
        for (let x = 0; x < sampleW; x += 1) {
          const idx = (y * sampleW + x) * 4;
          const r = imgData[idx] / 255;
          const g = imgData[idx + 1] / 255;
          const b = imgData[idx + 2] / 255;
          const a = imgData[idx + 3] / 255;

          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (a > 0.1 && lum > 0.04) {
            const posX = (x / sampleW - 0.5) * scaleX;
            const posY = -(y / sampleH - 0.5) * scaleY;

            // 3D Cranial depth
            const normX = (x / sampleW - 0.5) * 2.0;
            const normY = (y / sampleH - 0.5) * 2.0;
            const distCenter = Math.sqrt(normX * normX + normY * normY);
            const cranialZ = Math.sqrt(Math.max(0, 1.0 - Math.min(distCenter * 0.9, 1.0) ** 2)) * 3.2;
            const reliefZ = (lum - 0.3) * 3.6 + Math.pow(lum, 2.0) * 2.0;
            const posZ = cranialZ + reliefZ - 1.5;

            basePositions.push(posX, posY, posZ);

            // Wide scatter cloud trajectory
            const sTheta = Math.random() * Math.PI * 2;
            const sPhi = Math.acos(Math.random() * 2 - 1);
            const sRadius = 15 + Math.random() * 30;
            scatterPositions.push(
              sRadius * Math.sin(sPhi) * Math.cos(sTheta),
              sRadius * Math.sin(sPhi) * Math.sin(sTheta),
              sRadius * Math.cos(sPhi)
            );

            // Orange, crisp white & deep royal blue lighting highlights
            const isRim = normX > 0.4 || normX < -0.4;
            const tintR = isRim ? Math.min(1.0, r * 1.2 + 0.35) : r;
            const tintG = isRim ? g * 0.8 + 0.15 : g;
            const tintB = isRim ? b * 0.4 : b;

            colors.push(tintR, tintG, tintB);
            randoms.push(Math.random(), Math.random(), Math.random());
          }
        }
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(basePositions, 3));
      geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(basePositions, 3));
      geometry.setAttribute('aScatter', new THREE.Float32BufferAttribute(scatterPositions, 3));
      geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const vertexShader = `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uImpulse;
        uniform float uScatter;
        attribute vec3 aTarget;
        attribute vec3 aScatter;
        attribute vec3 aRandom;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          vColor = color;

          // Scatter transition
          float p = clamp(uScatter + (aRandom.x - 0.5) * 0.2, 0.0, 1.0);
          float easeP = p * p * (3.0 - 2.0 * p);
          vec3 pos = mix(aTarget, aScatter, easeP);

          // Subtle organic breathing
          pos.z += sin(uTime * 1.5 + aRandom.y * 6.28) * 0.2 * (1.0 - easeP);

          // Cursor proximity repulsion
          vec3 mouseWorld = vec3(uMouse.x * 10.0, uMouse.y * 8.0, 2.0);
          float dist = distance(pos, mouseWorld);
          float maxDist = 5.5;

          if (dist < maxDist) {
            float force = pow(1.0 - dist / maxDist, 1.6);
            vec3 dir = normalize(pos - mouseWorld);
            pos += dir * force * 3.5;
          }

          // Click dynamic explosion impulse
          if (uImpulse > 0.01) {
            vec3 burstDir = normalize(pos + (aRandom - 0.5) * 8.0);
            pos += burstDir * uImpulse * (12.0 + aRandom.z * 14.0);
          }

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Perspective size
          gl_PointSize = (19.0 * (1.0 + aRandom.x * 0.6)) / -mvPosition.z;
          vAlpha = clamp(1.0 - (-mvPosition.z / 60.0), 0.3, 0.95);
        }
      `;

      const fragmentShader = `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          if (d > 0.5) discard;
          float strength = pow(1.0 - (d * 2.0), 1.4);
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
          uScatter: { value: 0.0 }
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      });

      this.points = new THREE.Points(geometry, this.material);
      this.rootGroup.add(this.points);
    };
  }

  // Scatter trigger on click
  triggerScatter() {
    this.impulse = 1.0;
    this.scatterProgress = 0.85;

    // Smoothly reconstruct back after dramatic scatter
    setTimeout(() => {
      this.scatterProgress = 0.0;
    }, 900);
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);
    };

    this.onClick = () => {
      this.triggerScatter();
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('click', this.onClick);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.08);

    // Decay impulse
    this.impulse = THREE.MathUtils.lerp(this.impulse, 0.0, 0.06);

    if (this.material) {
      this.material.uniforms.uTime.value = this.time;
      this.material.uniforms.uMouse.value.copy(this.mouse);
      this.material.uniforms.uImpulse.value = this.impulse;
      this.material.uniforms.uScatter.value = THREE.MathUtils.lerp(
        this.material.uniforms.uScatter.value,
        this.scatterProgress,
        0.08
      );
    }

    // Parallax rotation
    this.rootGroup.rotation.y = THREE.MathUtils.lerp(this.rootGroup.rotation.y, this.mouse.x * 0.35, 0.05);
    this.rootGroup.rotation.x = THREE.MathUtils.lerp(this.rootGroup.rotation.x, -this.mouse.y * 0.2, 0.05);
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.container.removeEventListener('mousemove', this.onMouseMove);
    this.container.removeEventListener('click', this.onClick);
    if (this.points) {
      this.points.geometry.dispose();
      if (this.material) this.material.dispose();
    }
  }
}
