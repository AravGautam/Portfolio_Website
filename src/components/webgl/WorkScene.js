import * as THREE from 'three';

/**
 * 3D Spatial Project Visualizer Scene (Synchronized with ProjectVisualizer)
 * Dynamically constructs project-specific visual systems:
 * - 0: Neural AI Network (AI Fitness Platform)
 * - 1: Chess Matrix Grid (Real-time Chess Platform)
 * - 2: Distributed Systems Hub (MERN Architecture Suite)
 */
export class WorkScene {
  constructor(container, activeIndex = 0) {
    this.container = container;
    this.activeIndex = activeIndex;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 500;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 2, 22);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.time = 0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xff6b00, 2.0);
    dirLight1.position.set(10, 20, 15);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00d8ff, 2.0);
    dirLight2.position.set(-10, -10, -10);
    this.scene.add(dirLight2);

    this.currentGroup = new THREE.Group();
    this.scene.add(this.currentGroup);

    this.buildSceneForIndex(this.activeIndex);
    this.bindEvents();
  }

  setActiveProject(index) {
    if (this.activeIndex === index) return;
    this.activeIndex = index;

    while (this.currentGroup.children.length > 0) {
      const obj = this.currentGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.currentGroup.remove(obj);
    }

    this.buildSceneForIndex(index);
  }

  buildSceneForIndex(index) {
    if (index === 0) {
      this.buildNeuralScene();
    } else if (index === 1) {
      this.buildChessMatrixScene();
    } else {
      this.buildDistributedScene();
    }
  }

  buildNeuralScene() {
    // Central glowing core
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x0a192f,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const coreIcosa = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2, 2), coreMat);
    this.currentGroup.add(coreIcosa);

    const innerCore = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xff6b00 })
    );
    this.currentGroup.add(innerCore);

    // Synaptic nodes
    const nodeCount = 50;
    const nodePositions = [];
    const sphereGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, emissive: 0xff6b00, emissiveIntensity: 0.9 });
    const cyanMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, emissive: 0x00f0ff, emissiveIntensity: 0.9 });

    for (let i = 0; i < nodeCount; i++) {
      const radius = 4.5 + Math.sin(i * 1.5) * 2.2;
      const theta = (i / nodeCount) * Math.PI * 2 * 3.5;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      const pos = new THREE.Vector3(x, y, z);
      nodePositions.push(pos);

      const mesh = new THREE.Mesh(sphereGeo, i % 3 === 0 ? orangeMat : cyanMat);
      mesh.position.copy(pos);
      this.currentGroup.add(mesh);
    }

    // Lines
    const linePairs = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 3.8) {
          linePairs.push(nodePositions[i], nodePositions[j]);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePairs);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.4 });
    this.currentGroup.add(new THREE.LineSegments(lineGeo, lineMat));

    // Gimbal Rings
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(7.2, 0.04, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.5 })
    );
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(8.0, 0.04, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.6 })
    );
    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    this.currentGroup.add(ring1);
    this.currentGroup.add(ring2);
  }

  buildChessMatrixScene() {
    const boardSize = 8;
    const tileSpacing = 1.35;
    const boardOffset = (boardSize * tileSpacing) / 2 - tileSpacing / 2;
    const tileGeo = new THREE.BoxGeometry(1.2, 0.25, 1.2);

    const darkTileMat = new THREE.MeshStandardMaterial({ color: 0x050b14, emissive: 0x0a1f38, roughness: 0.3 });
    const lightTileMat = new THREE.MeshStandardMaterial({ color: 0x132742, emissive: 0x00f0ff, emissiveIntensity: 0.25 });

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c < boardSize; c++) {
        const isDark = (r + c) % 2 === 1;
        const tile = new THREE.Mesh(tileGeo, isDark ? darkTileMat : lightTileMat);
        tile.position.set(c * tileSpacing - boardOffset, 0, r * tileSpacing - boardOffset);
        this.currentGroup.add(tile);
      }
    }

    const grid = new THREE.GridHelper(26, 26, 0xff6b00, 0x004488);
    grid.position.y = -1.2;
    this.currentGroup.add(grid);

    this.currentGroup.rotation.x = 0.55;
    this.currentGroup.rotation.y = 0.35;
  }

  buildDistributedScene() {
    const reactorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0xff6b00,
      emissiveIntensity: 0.9,
      roughness: 0.1
    });
    const reactorCore = new THREE.Mesh(new THREE.OctahedronGeometry(2.0, 0), reactorMat);
    this.currentGroup.add(reactorCore);

    const reactorWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.6, 1),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.6 })
    );
    this.currentGroup.add(reactorWire);

    const podPositions = [
      new THREE.Vector3(-6.5, 2.5, 0),
      new THREE.Vector3(6.5, 2.5, 0),
      new THREE.Vector3(0, -4.5, 3.5),
      new THREE.Vector3(0, 4.5, -3.5)
    ];

    podPositions.forEach((pos, idx) => {
      const color = idx % 2 === 0 ? 0x00f0ff : 0xff6b00;
      const pod = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.9, 0),
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.7 })
      );
      pod.position.copy(pos);
      this.currentGroup.add(pod);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), pos]);
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
      this.currentGroup.add(new THREE.Line(lineGeo, lineMat));
    });

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(9.5, 0.04, 16, 80),
      new THREE.MeshBasicMaterial({ color: 0xff6b00, transparent: true, opacity: 0.4 })
    );
    ring.rotation.x = Math.PI / 2.5;
    this.currentGroup.add(ring);
  }

  bindEvents() {
    this.onMouseMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.targetMouse.set(x, y);
    };

    this.container.addEventListener('mousemove', this.onMouseMove);
  }

  update(delta) {
    this.time += delta;
    this.mouse.lerp(this.targetMouse, 0.05);

    if (this.currentGroup) {
      this.currentGroup.rotation.y = this.time * 0.15 + this.mouse.x * 0.4;
      this.currentGroup.rotation.x = this.mouse.y * 0.3;
    }

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
    while (this.currentGroup.children.length > 0) {
      const obj = this.currentGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      this.currentGroup.remove(obj);
    }
  }
}
