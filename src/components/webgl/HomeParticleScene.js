import * as THREE from 'three';

/**
 * Interactive GPU Particle Hero Scene (Red & Cobalt Blue)
 * Procedural particle typography forming "ARAV" with physical mouse repulsion,
 * scatter on hold, dynamic turbulence, and camera depth response.
 */
export class HomeParticleScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || window.innerWidth;
    this.height = container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 30);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isPressed = false;
    this.impulse = 0;
    this.time = 0;

    this.initTextParticles();
    this.initAmbientNetwork();
    this.bindEvents();
  }

  initTextParticles() {
    // Render offscreen text "ARAV" onto canvas to sample precise 2D/3D particle anchor coordinates
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 150;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 90px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ARAV', canvas.width / 2, canvas.height / 2);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const targetPositions = [];
    const initialPositions = [];
    const colors = [];
    const randoms = [];

    const blueColor = new THREE.Color(0x00f0ff);
    const redColor = new THREE.Color(0xff3344);
    const whiteColor = new THREE.Color(0xffffff);

    const step = 3;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const idx = (y * canvas.width + x) * 4;
        if (imgData[idx] > 128) {
          const posX = (x / canvas.width - 0.5) * 28;
          const posY = -(y / canvas.height - 0.5) * 11;
          const posZ = (Math.random() - 0.5) * 2;

          targetPositions.push(posX, posY, posZ);

          // Initial scattered position in cosmic space
          const randAngle = Math.random() * Math.PI * 2;
          const randRadius = 15 + Math.random() * 35;
          initialPositions.push(
            Math.cos(randAngle) * randRadius,
            Math.sin(randAngle) * randRadius,
            (Math.random() - 0.5) * 40
          );

          // Crimson Red & Electric Blue palette
          const randColor = Math.random();
          const chosen = randColor > 0.6 ? redColor : randColor > 0.2 ? blueColor : whiteColor;
          colors.push(chosen.r, chosen.g, chosen.b);

          randoms.push(Math.random(), Math.random(), Math.random());
        }
      }
    }

    // Add 1,500 ambient floating space dust particles
    for (let i = 0; i < 1500; i++) {
      const x = (Math.random() - 0.5) * 70;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;

      targetPositions.push(x, y, z);
      initialPositions.push(x, y, z);

      const chosen = Math.random() > 0.5 ? redColor : blueColor;
      colors.push(chosen.r, chosen.g, chosen.b);
      randoms.push(Math.random(), Math.random(), Math.random());
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(initialPositions, 3));
    geometry.setAttribute('aTarget', new THREE.Float32BufferAttribute(targetPositions, 3));
    geometry.setAttribute('aInitial', new THREE.Float32BufferAttribute(initialPositions, 3));
    geometry.setAttribute('aRandom', new THREE.Float32BufferAttribute(randoms, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uImpulse;
      uniform float uAssemble;
      attribute vec3 aTarget;
      attribute vec3 aInitial;
      attribute vec3 aRandom;
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        vColor = color;
        float p = clamp(uAssemble + (aRandom.x - 0.5) * 0.3, 0.0, 1.0);
        float easeP = p * p * (3.0 - 2.0 * p);
        vec3 pos = mix(aInitial, aTarget, easeP);

        // Harmonic organic turbulence
        pos.x += sin(uTime * 1.5 + aRandom.y * 6.28) * 0.35;
        pos.y += cos(uTime * 1.2 + aRandom.z * 6.28) * 0.35;
        pos.z += sin(uTime * 0.8 + aRandom.x * 6.28) * 0.6;

        // Physical mouse proximity repulsion
        vec3 mouseWorld = vec3(uMouse.x * 18.0, uMouse.y * 14.0, 0.0);
        float dist = distance(pos, mouseWorld);
        float maxDist = 7.5;

        if (dist < maxDist) {
          float force = pow(1.0 - dist / maxDist, 1.6);
          vec3 dir = normalize(pos - mouseWorld);
          pos += dir * force * 5.0;
        }

        // Scatter explosion when pressed / held
        if (uImpulse > 0.01) {
          vec3 scatterDir = normalize(pos + (aRandom - 0.5) * 8.0);
          pos += scatterDir * uImpulse * (12.0 + aRandom.y * 14.0);
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = (16.0 * (1.0 + aRandom.z * 0.8)) / -mvPosition.z;
        vAlpha = clamp(1.0 - (-mvPosition.z / 60.0), 0.2, 0.95);
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
    this.scene.add(this.points);

    // Auto-crystallize on mount
    setTimeout(() => {
      this.targetAssemble = 1.0;
    }, 200);
    this.targetAssemble = 0.0;
    this.assembleProgress = 0.0;
  }

  initAmbientNetwork() {
    // Red & Blue geometric wireframe matrix in deep background
    const geo = new THREE.IcosahedronGeometry(18, 1);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.04
    });
    this.ambientMesh = new THREE.Mesh(geo, mat);
    this.scene.add(this.ambientMesh);
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

    this.onTouchStart = (e) => {
      if (e.touches.length > 0) {
        this.isPressed = true;
        const touch = e.touches[0];
        const rect = this.container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        this.targetMouse.set(x, y);
      }
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

    this.onTouchEnd = () => {
      this.isPressed = false;
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchEnd);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.08);

    this.assembleProgress = THREE.MathUtils.lerp(this.assembleProgress, this.targetAssemble, 0.05);

    if (this.isPressed) {
      this.impulse = THREE.MathUtils.lerp(this.impulse, 1.0, 0.12);
    } else {
      this.impulse = THREE.MathUtils.lerp(this.impulse, 0.0, 0.06);
    }

    if (this.material) {
      this.material.uniforms.uTime.value = this.time;
      this.material.uniforms.uMouse.value.copy(this.mouse);
      this.material.uniforms.uImpulse.value = this.impulse;
      this.material.uniforms.uAssemble.value = this.assembleProgress;
    }

    if (this.ambientMesh) {
      this.ambientMesh.rotation.y = this.time * 0.05;
      this.ambientMesh.rotation.x = this.time * 0.03;
    }

    // Parallax depth camera
    this.camera.position.x = this.mouse.x * 2.5;
    this.camera.position.y = this.mouse.y * 1.8;
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
    window.removeEventListener('mouseup', this.onMouseUp);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    this.container.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    if (this.points) {
      this.points.geometry.dispose();
      if (this.material) this.material.dispose();
    }
  }
}
