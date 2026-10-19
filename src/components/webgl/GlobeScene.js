import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

/**
 * Ultra-High Quality Realistic 3D Earth Globe (Contact Page)
 * - 100% Real NASA satellite Earth texture mapping (true natural continents, oceans, vegetation, deserts)
 * - Night city lights on the dark hemisphere with warm golden illumination
 * - Specular water reflection so oceans glisten under sunlight while land remains natural matte
 * - Clean, simple, and realistic: NO thick artificial blue glow rings or heavy halos
 * - Geospatial pinpoint at Satna, Madhya Pradesh, India (24.5854° N, 80.8293° E)
 * - Concentric sonar radar rings & radiant location glow beacon
 * - Physics drag-to-rotate, auto-drift, and dynamic responsive camera fitting
 */
export class GlobeScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.baseCameraDistance = 26.0;
    this.camera.position.set(0, 0, this.baseCameraDistance);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.time = 0;

    this.globeRadius = 9.2;
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    this.sunPosition = new THREE.Vector3(18.0, 12.0, 16.0);

    this.initLighting();
    this.initEarthMesh();
    this.initSatnaPinpoint();
    this.bindEvents();

    this.resize(this.width, this.height);
  }

  latLongToVector3(lat, lon, radius = this.globeRadius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  initLighting() {
    // Subtle deep-space ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    this.scene.add(ambientLight);

    // Primary sunlight directional light
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    sunLight.position.copy(this.sunPosition);
    this.scene.add(sunLight);

    // Subtle cool rim light
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.4);
    rimLight.position.set(-18.0, -10.0, -12.0);
    this.scene.add(rimLight);
  }

  initEarthMesh() {
    const textureLoader = new THREE.TextureLoader();

    // 1. Real NASA Satellite Earth Texture (true natural colors: deep blue oceans, forests, deserts, snow)
    this.dayTexture = textureLoader.load('/earth-real.jpg', () => {
      if (this.earthMat) this.earthMat.needsUpdate = true;
    });
    this.dayTexture.wrapS = THREE.RepeatWrapping;
    this.dayTexture.wrapT = THREE.ClampToEdgeWrapping;
    this.dayTexture.minFilter = THREE.LinearMipmapLinearFilter;
    this.dayTexture.magFilter = THREE.LinearFilter;

    // 2. Specular Ocean Reflection Map (water reflects sunlight, land stays matte)
    this.specularTexture = textureLoader.load('/earth-specular.jpg', () => {
      if (this.earthMat) this.earthMat.needsUpdate = true;
    });
    this.specularTexture.wrapS = THREE.RepeatWrapping;
    this.specularTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 3. Night City Lights Map (twinkling amber city lights on the night hemisphere)
    this.lightsTexture = textureLoader.load('/earth-lights.png', () => {
      if (this.earthMat) this.earthMat.needsUpdate = true;
    });
    this.lightsTexture.wrapS = THREE.RepeatWrapping;
    this.lightsTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Photorealistic Day/Night Earth Shader (Simple, Natural, Realistic)
    const earthGeo = new THREE.SphereGeometry(this.globeRadius, 64, 64);
    this.earthMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        uniform sampler2D dayMap;
        uniform sampler2D specularMap;
        uniform sampler2D lightsMap;
        uniform vec3 sunPosition;
        uniform vec3 cameraWorldPosition;

        void main() {
          vec4 dayColor = texture2D(dayMap, vUv);
          vec4 specColor = texture2D(specularMap, vUv);
          vec4 lightsColor = texture2D(lightsMap, vUv);

          vec3 normal = normalize(vWorldNormal);
          vec3 sunDir = normalize(sunPosition);
          vec3 viewDir = normalize(cameraWorldPosition - vWorldPosition);

          // Sunlight incidence angle
          float sunDot = dot(normal, sunDir);

          // Smooth twilight terminator between day and night
          float dayFactor = smoothstep(-0.12, 0.18, sunDot);

          // Daylight diffuse shading
          float diffuse = max(sunDot, 0.0);
          float ambient = 0.12;
          vec3 litDay = dayColor.rgb * (ambient + diffuse * 0.92);

          // Realistic ocean specular glint (sun glisten on water)
          vec3 halfDir = normalize(sunDir + viewDir);
          float specFactor = pow(max(dot(normal, halfDir), 0.0), 28.0);
          vec3 sunGlint = vec3(1.0, 0.95, 0.85) * specFactor * specColor.r * 0.9 * max(sunDot, 0.0);

          // Night side city lights (amber/gold cities glowing in darkness)
          float nightFactor = 1.0 - smoothstep(-0.18, 0.08, sunDot);
          vec3 nightLights = lightsColor.rgb * vec3(1.0, 0.86, 0.62) * nightFactor * 1.5;

          // Natural day + night blending
          vec3 surface = mix(nightLights, litDay + sunGlint, dayFactor);

          // Ultra-subtle, natural atmospheric horizon edge (NO thick blue ring!)
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 4.2);
          vec3 subtleRim = vec3(0.2, 0.5, 0.95) * fresnel * 0.28 * max(sunDot + 0.35, 0.0);

          gl_FragColor = vec4(surface + subtleRim, 1.0);
        }
      `,
      uniforms: {
        dayMap: { value: this.dayTexture },
        specularMap: { value: this.specularTexture },
        lightsMap: { value: this.lightsTexture },
        sunPosition: { value: this.sunPosition },
        cameraWorldPosition: { value: this.camera.position }
      }
    });

    this.earthSphere = new THREE.Mesh(earthGeo, this.earthMat);
    this.globeGroup.add(this.earthSphere);
  }

  initSatnaPinpoint() {
    // Coordinates for Satna, Madhya Pradesh, India
    const satnaLat = 24.5854;
    const satnaLon = 80.8293;
    this.satnaPos = this.latLongToVector3(satnaLat, satnaLon, this.globeRadius + 0.14);

    this.satnaGroup = new THREE.Group();
    this.satnaGroup.position.copy(this.satnaPos);
    this.satnaGroup.lookAt(this.satnaPos.clone().multiplyScalar(2));

    // 1. Concentric Sonar Pulse Rings in Clean Sky-Blue
    this.sonarRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(0.32 + i * 0.38, 0.40 + i * 0.38, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = { phase: i * 0.33 };
      this.satnaGroup.add(ring);
      this.sonarRings.push(ring);
    }

    // 2. Luminous Glow Halo Disk around the core (glowing aura on the location)
    const glowGeo = new THREE.RingGeometry(0.05, 0.7, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.locationGlowHalo = new THREE.Mesh(glowGeo, glowMat);
    this.satnaGroup.add(this.locationGlowHalo);

    // 3. Glowing Core Beacon Dot (Pure White center with soft cyan aura)
    const coreGeo = new THREE.SphereGeometry(0.24, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.satnaGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const auraGeo = new THREE.SphereGeometry(0.42, 16, 16);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.beaconAura = new THREE.Mesh(auraGeo, auraMat);
    this.satnaGroup.add(this.beaconAura);

    // 4. Outer Target Crosshair lines in Clean Sky-Blue
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const crossPoints = [
      new THREE.Vector3(-1.25, 0, 0), new THREE.Vector3(1.25, 0, 0),
      new THREE.Vector3(0, -1.25, 0), new THREE.Vector3(0, 1.25, 0)
    ];
    const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
    this.satnaGroup.add(new THREE.LineSegments(crossGeo, lineMat));

    this.globeGroup.add(this.satnaGroup);

    // Initial orientation: Orient Satna, MP, India directly towards the camera
    this.globeGroup.rotation.y = -Math.PI * 0.72;
    this.globeGroup.rotation.x = 0.28;
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

    this.onTouchStart = (e) => {
      if (e.touches.length > 0) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    this.onTouchMove = (e) => {
      if (this.isDragging && e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

        this.globeGroup.rotation.y += deltaX * 0.005;
        this.globeGroup.rotation.x += deltaY * 0.005;

        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    this.container.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onMouseUp);

    this.container.addEventListener('mouseenter', () => soundEngine.playRadarPing());
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.05);

    // Keep camera world position updated in shader
    if (this.earthMat && this.earthMat.uniforms.cameraWorldPosition) {
      this.earthMat.uniforms.cameraWorldPosition.value.copy(this.camera.position);
    }

    // Smooth idle auto-drift when not dragging
    if (!this.isDragging) {
      this.globeGroup.rotation.y += delta * 0.035;
    }

    // Concentric Sonar pulse rings animation on Satna, MP, India
    if (this.sonarRings) {
      this.sonarRings.forEach((ring) => {
        const progress = (this.time * 0.8 + ring.userData.phase) % 1;
        const scale = 0.5 + progress * 2.2;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = Math.max(0, (1 - progress) * 0.85);
      });
    }

    // Radiant beacon glow pulsation on user's location
    if (this.beaconAura) {
      const pulse = 1.0 + Math.sin(this.time * 3.2) * 0.22;
      this.beaconAura.scale.set(pulse, pulse, pulse);
    }
    if (this.locationGlowHalo) {
      const haloPulse = 1.0 + Math.sin(this.time * 2.2) * 0.14;
      this.locationGlowHalo.scale.set(haloPulse, haloPulse, 1);
    }

    // Interactive subtle parallax response to mouse cursor
    this.camera.position.x = this.mouse.x * 1.2;
    this.camera.position.y = this.mouse.y * 0.8;
    this.camera.position.z = this.baseCameraDistance || 26.0;
    this.camera.lookAt(0, 0, 0);
  }

  resize(width, height) {
    if (!width || !height) return;
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;

    // Dynamically calculate camera Z so the real Earth globe is comfortably framed and prominent
    const aspect = width / height;
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const targetRadius = this.globeRadius * 1.15;

    let distance;
    if (aspect < 1.0) {
      distance = targetRadius / (Math.tan(fovRad / 2) * aspect);
    } else {
      distance = targetRadius / Math.tan(fovRad / 2);
    }

    this.baseCameraDistance = Math.max(distance, 22.5);
    this.camera.position.z = this.baseCameraDistance;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.container.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    this.container.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onMouseUp);

    if (this.earthSphere) {
      this.earthSphere.geometry.dispose();
      if (this.earthSphere.material) this.earthSphere.material.dispose();
    }
    if (this.dayTexture) this.dayTexture.dispose();
    if (this.specularTexture) this.specularTexture.dispose();
    if (this.lightsTexture) this.lightsTexture.dispose();
  }
}

export default GlobeScene;
