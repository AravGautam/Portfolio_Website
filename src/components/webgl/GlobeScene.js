import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

/**
 * Ultra-High Quality 3D Earth Globe (Contact Page)
 * - Deep space obsidian navy oceanic sphere with NASA dark surface
 * - Luminous continental landmass particle matrix (Fibonacci-distributed points from topology)
 * - Volumetric spherical atmosphere glow shader (soft Fresnel bloom in electric royal azure)
 * - Astronomical graticule meridians & geodesic latitude/longitude mesh
 * - Geospatial pinpoint at Satna, Madhya Pradesh, India (24.5854° N, 80.8293° E)
 * - Concentric expanding sonar radar rings & flowing intercontinental data transmission arcs
 * - Physics-based 3D drag rotation + smooth idle drift & camera parallax
 */
export class GlobeScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 26);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.time = 0;

    this.globeRadius = 9.5;
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    this.initLighting();
    this.initEarthMesh();
    this.initContinentalParticles();
    this.initAtmosphericGlow();
    this.initSatnaPinpoint();
    this.initTransmissionArcs();
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

  initLighting() {
    // Balanced lighting for deep obsidian surface and luminous land particles
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    keyLight.position.set(16, 12, 18);
    this.scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0781ff, 1.1);
    rimLight.position.set(-18, -12, -12);
    this.scene.add(rimLight);
  }

  initEarthMesh() {
    const textureLoader = new THREE.TextureLoader();

    // High-resolution dark Earth texture
    const earthTexture = textureLoader.load('/earth-dark.jpg');
    earthTexture.wrapS = THREE.RepeatWrapping;
    earthTexture.wrapT = THREE.ClampToEdgeWrapping;

    // 1. Core Sphere: Deep space obsidian navy oceans (eliminates greenish murky tint)
    const earthGeo = new THREE.SphereGeometry(this.globeRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      color: 0x030715,
      roughness: 0.85,
      metalness: 0.15,
      emissive: new THREE.Color(0x021838),
      emissiveIntensity: 0.4
    });

    this.earthSphere = new THREE.Mesh(earthGeo, earthMat);
    this.globeGroup.add(this.earthSphere);

    // 2. Wireframe Graticule Meridians in deep royal azure
    const graticuleGeo = new THREE.SphereGeometry(this.globeRadius + 0.06, 36, 18);
    const graticuleMat = new THREE.MeshBasicMaterial({
      color: 0x0781ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    this.graticule = new THREE.Mesh(graticuleGeo, graticuleMat);
    this.globeGroup.add(this.graticule);
  }

  initContinentalParticles() {
    // Soft circular glowing particle texture
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.9)');
      grad.addColorStop(0.7, 'rgba(7, 129, 255, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
      return new THREE.CanvasTexture(canvas);
    };

    const circleTexture = createCircleTexture();

    const buildPoints = (imgData, mapWidth, mapHeight) => {
      const particleCount = 36000;
      const positions = [];
      const colors = [];

      const landDotColor = new THREE.Color(0xe0f2fe);   // Crisp luminous cyan-white
      const landAccentColor = new THREE.Color(0x38bdf8); // Radiant electric azure

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
        const rawVal = imgData[(py * mapWidth + px) * 4];

        const isLand = rawVal > 0;

        if (isLand) {
          const r = this.globeRadius + 0.12;
          const pos = this.latLongToVector3(lat, lon, r);
          positions.push(pos.x, pos.y, pos.z);

          // Alternating bright white and electric azure highlights
          if (Math.random() < 0.45) {
            colors.push(landDotColor.r, landDotColor.g, landDotColor.b);
          } else {
            colors.push(landAccentColor.r, landAccentColor.g, landAccentColor.b);
          }
        }
      }

      const pointsGeo = new THREE.BufferGeometry();
      pointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      pointsGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const pointsMat = new THREE.PointsMaterial({
        size: 0.22,
        map: circleTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      this.pointsMesh = new THREE.Points(pointsGeo, pointsMat);
      this.globeGroup.add(this.pointsMesh);
    };

    // Sample from topology texture for exact landmass contours
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
      buildPoints(imgData, canvas.width, canvas.height);
    };
  }

  initAtmosphericGlow() {
    // 1. Outer Volumetric Atmosphere Shader (Soft Fresnel Bloom, NO flat cardboard ring!)
    const outerAtmosphereGeo = new THREE.SphereGeometry(this.globeRadius * 1.14, 64, 64);
    const outerAtmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          // Fresnel rim: reaches maximum at glancing silhouette edges, fades smoothly to zero
          float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.4);
          gl_FragColor = vec4(glowColor, intensity * 0.82);
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(0x0781ff) } // Radiant Electric Azure
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    this.outerAtmosphere = new THREE.Mesh(outerAtmosphereGeo, outerAtmosphereMat);
    this.scene.add(this.outerAtmosphere);

    // 2. Inner Horizon Twilight Rim Shader (subtle cyan planetary limb on front surface)
    const innerRimGeo = new THREE.SphereGeometry(this.globeRadius + 0.02, 64, 64);
    const innerRimMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 rimColor;
        void main() {
          float intensity = pow(1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.6);
          gl_FragColor = vec4(rimColor, intensity * 0.65);
        }
      `,
      uniforms: {
        rimColor: { value: new THREE.Color(0x38bdf8) } // Cyan Azure
      },
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false
    });

    this.innerRim = new THREE.Mesh(innerRimGeo, innerRimMat);
    this.globeGroup.add(this.innerRim);
  }

  initSatnaPinpoint() {
    // Coordinates for Satna, Madhya Pradesh, India
    const satnaLat = 24.5854;
    const satnaLon = 80.8293;
    this.satnaPos = this.latLongToVector3(satnaLat, satnaLon, this.globeRadius + 0.16);

    this.satnaGroup = new THREE.Group();
    this.satnaGroup.position.copy(this.satnaPos);
    this.satnaGroup.lookAt(this.satnaPos.clone().multiplyScalar(2));

    // Concentric Sonar Pulse Rings in Electric Azure
    this.sonarRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(0.32 + i * 0.38, 0.38 + i * 0.38, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = { phase: i * 0.33 };
      this.satnaGroup.add(ring);
      this.sonarRings.push(ring);
    }

    // Glowing Core Beacon Dot (Pure White)
    const coreGeo = new THREE.SphereGeometry(0.26, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.satnaGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Outer Target Crosshair lines in Electric Azure
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 });
    const crossPoints = [
      new THREE.Vector3(-1.3, 0, 0), new THREE.Vector3(1.3, 0, 0),
      new THREE.Vector3(0, -1.3, 0), new THREE.Vector3(0, 1.3, 0)
    ];
    const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
    this.satnaGroup.add(new THREE.LineSegments(crossGeo, lineMat));

    this.globeGroup.add(this.satnaGroup);

    // Initial orientation: Orient Satna, MP, India directly towards the camera
    this.globeGroup.rotation.y = -Math.PI * 0.72;
    this.globeGroup.rotation.x = 0.28;
  }

  initTransmissionArcs() {
    this.arcGroup = new THREE.Group();
    this.arcs = [];

    const hubs = [
      { lat: 51.5074, lon: -0.1278 },   // London
      { lat: 37.7749, lon: -122.4194 }, // San Francisco
      { lat: 35.6762, lon: 139.6503 },  // Tokyo
      { lat: 1.3521, lon: 103.8198 },   // Singapore
      { lat: -33.8688, lon: 151.2093 }  // Sydney
    ];

    hubs.forEach((hub, idx) => {
      const endPos = this.latLongToVector3(hub.lat, hub.lon, this.globeRadius + 0.1);
      const midPoint = this.satnaPos.clone().add(endPos).multiplyScalar(0.5);
      const dist = this.satnaPos.distanceTo(endPos);
      midPoint.setLength(this.globeRadius + Math.min(dist * 0.32, 3.8));

      const curve = new THREE.QuadraticBezierCurve3(this.satnaPos, midPoint, endPos);
      const points = curve.getPoints(45);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x0781ff,
        transparent: true,
        opacity: 0.55
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      this.arcGroup.add(arcLine);

      // Flowing photon packet
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      this.arcGroup.add(packet);

      this.arcs.push({ curve, packet, speed: 0.35 + idx * 0.08 });
    });

    this.globeGroup.add(this.arcGroup);
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

    // Idle auto-drift when not dragging
    if (!this.isDragging) {
      this.globeGroup.rotation.y += delta * 0.035;
    }

    // Concentric Sonar pulse rings animation
    if (this.sonarRings) {
      this.sonarRings.forEach((ring) => {
        const progress = (this.time * 0.8 + ring.userData.phase) % 1;
        const scale = 0.5 + progress * 2.2;
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = Math.max(0, 1 - progress);
      });
    }

    // Flowing packets along transmission arcs
    if (this.arcs) {
      this.arcs.forEach((arc) => {
        const t = (this.time * arc.speed) % 1;
        const pt = arc.curve.getPoint(t);
        arc.packet.position.copy(pt);
      });
    }

    // Subtle parallax response to mouse cursor
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
    this.container.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onMouseUp);

    if (this.earthSphere) {
      this.earthSphere.geometry.dispose();
      this.earthSphere.material.dispose();
    }
    if (this.pointsMesh) {
      this.pointsMesh.geometry.dispose();
      this.pointsMesh.material.dispose();
    }
    if (this.outerAtmosphere) {
      this.outerAtmosphere.geometry.dispose();
      this.outerAtmosphere.material.dispose();
    }
  }
}

export default GlobeScene;
