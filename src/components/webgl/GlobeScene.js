import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

/**
 * Ultra-High Quality 3D Earth Globe
 * - High-res textured Earth sphere with NASA dark surface & continental city lights
 * - Luminous atmospheric cyan rim glow & graticule meridians
 * - Geospatial pinpoint at Satna, Madhya Pradesh, India (24.5854° N, 80.8293° E)
 * - Pulsating concentric sonar radar rings & flowing global data transmission arcs
 * - Interactive mouse/touch 3D drag rotation + smooth idle drift
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    dirLight.position.set(15, 10, 20);
    this.scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    backLight.position.set(-15, -10, -10);
    this.scene.add(backLight);
  }

  initEarthMesh() {
    const textureLoader = new THREE.TextureLoader();

    // High-resolution Earth texture
    const earthTexture = textureLoader.load('/earth-dark.jpg', () => {
      // Re-render when texture is ready
    });

    const earthGeo = new THREE.SphereGeometry(this.globeRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.7,
      metalness: 0.1,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 0.12
    });

    this.earthSphere = new THREE.Mesh(earthGeo, earthMat);
    this.globeGroup.add(this.earthSphere);

    // Wireframe Graticule Meridians
    const graticuleGeo = new THREE.SphereGeometry(this.globeRadius + 0.05, 36, 18);
    const graticuleMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    this.graticule = new THREE.Mesh(graticuleGeo, graticuleMat);
    this.globeGroup.add(this.graticule);
  }

  initAtmosphericGlow() {
    // Glowing Atmospheric Rim Halo
    const haloGeo = new THREE.RingGeometry(this.globeRadius + 0.3, this.globeRadius + 0.9, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide
    });
    this.halo = new THREE.Mesh(haloGeo, haloMat);
    this.scene.add(this.halo);
  }

  initSatnaPinpoint() {
    // Coordinates for Satna, Madhya Pradesh, India
    const satnaLat = 24.5854;
    const satnaLon = 80.8293;
    this.satnaPos = this.latLongToVector3(satnaLat, satnaLon, this.globeRadius + 0.15);

    this.satnaGroup = new THREE.Group();
    this.satnaGroup.position.copy(this.satnaPos);
    this.satnaGroup.lookAt(this.satnaPos.clone().multiplyScalar(2));

    // Concentric Sonar Pulse Rings
    this.sonarRings = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(0.3 + i * 0.35, 0.35 + i * 0.35, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.userData = { phase: i * 0.33 };
      this.satnaGroup.add(ring);
      this.sonarRings.push(ring);
    }

    // Glowing Core Beacon Dot
    const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.satnaGroup.add(new THREE.Mesh(coreGeo, coreMat));

    // Crosshair target
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.7 });
    const crossPoints = [
      new THREE.Vector3(-1.2, 0, 0), new THREE.Vector3(1.2, 0, 0),
      new THREE.Vector3(0, -1.2, 0), new THREE.Vector3(0, 1.2, 0)
    ];
    const crossGeo = new THREE.BufferGeometry().setFromPoints(crossPoints);
    this.satnaGroup.add(new THREE.LineSegments(crossGeo, lineMat));

    this.globeGroup.add(this.satnaGroup);

    // Initial orientation: Orient Satna, MP, India directly towards the camera!
    this.globeGroup.rotation.y = -Math.PI * 0.72;
    this.globeGroup.rotation.x = 0.28;
  }

  initTransmissionArcs() {
    this.arcGroup = new THREE.Group();
    this.arcs = [];

    const hubs = [
      { lat: 51.5074, lon: -0.1278 },  // London
      { lat: 37.7749, lon: -122.4194 }, // San Francisco
      { lat: 35.6762, lon: 139.6503 }, // Tokyo
      { lat: 1.3521, lon: 103.8198 },  // Singapore
      { lat: -33.8688, lon: 151.2093 } // Sydney
    ];

    hubs.forEach((hub, idx) => {
      const endPos = this.latLongToVector3(hub.lat, hub.lon, this.globeRadius + 0.1);
      const midPoint = this.satnaPos.clone().add(endPos).multiplyScalar(0.5);
      const dist = this.satnaPos.distanceTo(endPos);
      midPoint.setLength(this.globeRadius + Math.min(dist * 0.32, 3.5));

      const curve = new THREE.QuadraticBezierCurve3(this.satnaPos, midPoint, endPos);
      const points = curve.getPoints(40);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.45
      });
      const arcLine = new THREE.Line(arcGeo, arcMat);
      this.arcGroup.add(arcLine);

      // Flowing data packet
      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 8, 8),
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
      this.globeGroup.rotation.y += delta * 0.03;
    }

    // Sonar pulse rings
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

    if (this.halo) {
      this.halo.rotation.z = this.time * 0.05;
    }

    // Interactive camera parallax
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
  }
}
