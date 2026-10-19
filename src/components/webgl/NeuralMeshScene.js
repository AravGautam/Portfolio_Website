import * as THREE from 'three';

/**
 * NeuralMeshScene:
 * Real-time 3D interactive holographic neural network & synaptic mesh.
 * Features 3D spatial neurons, dynamically firing electrical action potentials,
 * cursor proximity magnetism, cascade discharge surges, and 3D orbit controls.
 */
export class NeuralMeshScene {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 26);

    this.rotationGroup = new THREE.Group();
    this.scene.add(this.rotationGroup);

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.time = 0;
    this.cascadePulse = 0;

    this.initNetwork();
    this.bindEvents();
  }

  initNetwork() {
    const nodeCount = 130;
    this.nodeCount = nodeCount;
    this.nodes = [];

    // Distribute nodes in a 3D volumetric sphere
    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 8.5 + 2.0;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      this.nodes.push({
        origPos: new THREE.Vector3(x, y, z),
        currentPos: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4,
          (Math.random() - 0.5) * 0.4
        ),
        activity: Math.random(),
        baseSize: Math.random() * 0.4 + 0.3
      });
    }

    // Node Points Mesh
    const pointsGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(nodeCount * 3);
    const colorArray = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      posArray[i * 3] = this.nodes[i].currentPos.x;
      posArray[i * 3 + 1] = this.nodes[i].currentPos.y;
      posArray[i * 3 + 2] = this.nodes[i].currentPos.z;

      colorArray[i * 3] = 0.22;
      colorArray[i * 3 + 1] = 0.74;
      colorArray[i * 3 + 2] = 0.97;
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    this.pointsGeo = pointsGeo;

    // Glowing point texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, '#38bdf8');
    grad.addColorStop(0.7, '#0284c7');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pointTex = new THREE.CanvasTexture(canvas);

    const pointsMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      map: pointTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    this.rotationGroup.add(this.pointsMesh);

    // Synaptic Connections Lines
    this.maxLines = 450;
    const linePositions = new Float32Array(this.maxLines * 6);
    const lineColors = new Float32Array(this.maxLines * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    this.lineGeo = lineGeo;

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    this.rotationGroup.add(this.lineMesh);

    // Electrical Impulse Action Potential Sparks
    const sparkCount = 35;
    this.sparkCount = sparkCount;
    this.sparks = [];
    for (let i = 0; i < sparkCount; i++) {
      this.sparks.push({
        from: Math.floor(Math.random() * nodeCount),
        to: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: Math.random() * 1.5 + 0.8
      });
    }

    const sparkGeo = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    this.sparkGeo = sparkGeo;

    const sparkMat = new THREE.PointsMaterial({
      size: 1.2,
      color: 0xffffff,
      map: pointTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.sparkMesh = new THREE.Points(sparkGeo, sparkMat);
    this.rotationGroup.add(this.sparkMesh);
  }

  triggerCascade() {
    this.cascadePulse = 1.0;
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes[i].activity = 1.0;
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

    this.mouse.lerp(this.targetMouse, 0.08);

    if (!this.isDragging) {
      this.rotationGroup.rotation.y += 0.22 * delta;
      this.rotationGroup.rotation.x = Math.sin(this.time * 0.35) * 0.2 + this.mouse.y * 0.3;
    }

    const mouseWorldX = this.mouse.x * 9;
    const mouseWorldY = this.mouse.y * 9;

    const posArray = this.pointsGeo.attributes.position.array;
    const colorArray = this.pointsGeo.attributes.color.array;

    // Update node positions and gentle Brownian float
    for (let i = 0; i < this.nodeCount; i++) {
      const node = this.nodes[i];

      // Cursor magnetic pull
      const distToMouse = Math.hypot(node.currentPos.x - mouseWorldX, node.currentPos.y - mouseWorldY);
      if (distToMouse < 6) {
        node.activity = Math.min(node.activity + delta * 2.5, 1.0);
        const pull = (1 - distToMouse / 6) * 0.5 * delta;
        node.currentPos.x += (mouseWorldX - node.currentPos.x) * pull;
        node.currentPos.y += (mouseWorldY - node.currentPos.y) * pull;
      } else {
        node.activity = Math.max(node.activity - delta * 0.6, 0.1);
      }

      // Spring return to origPos
      node.currentPos.x += (node.origPos.x - node.currentPos.x) * delta * 1.5;
      node.currentPos.y += (node.origPos.y - node.currentPos.y) * delta * 1.5;
      node.currentPos.z += (node.origPos.z - node.currentPos.z) * delta * 1.5;

      posArray[i * 3] = node.currentPos.x;
      posArray[i * 3 + 1] = node.currentPos.y;
      posArray[i * 3 + 2] = node.currentPos.z;

      // Color based on neural activity
      const act = Math.min(node.activity + this.cascadePulse, 1.0);
      colorArray[i * 3] = 0.2 + act * 0.8;
      colorArray[i * 3 + 1] = 0.74 + act * 0.26;
      colorArray[i * 3 + 2] = 0.97 + act * 0.03;
    }

    this.pointsGeo.attributes.position.needsUpdate = true;
    this.pointsGeo.attributes.color.needsUpdate = true;

    // Update Synaptic Line Segments
    const linePos = this.lineGeo.attributes.position.array;
    const lineCol = this.lineGeo.attributes.color.array;
    let lineIdx = 0;
    const connectionDist = 4.6;

    for (let i = 0; i < this.nodeCount && lineIdx < this.maxLines; i++) {
      for (let j = i + 1; j < this.nodeCount && lineIdx < this.maxLines; j++) {
        const n1 = this.nodes[i];
        const n2 = this.nodes[j];
        const dist = n1.currentPos.distanceTo(n2.currentPos);

        if (dist < connectionDist) {
          const lOffset = lineIdx * 6;
          linePos[lOffset] = n1.currentPos.x;
          linePos[lOffset + 1] = n1.currentPos.y;
          linePos[lOffset + 2] = n1.currentPos.z;

          linePos[lOffset + 3] = n2.currentPos.x;
          linePos[lOffset + 4] = n2.currentPos.y;
          linePos[lOffset + 5] = n2.currentPos.z;

          const alpha = (1 - dist / connectionDist) * 0.65 + this.cascadePulse * 0.35;
          lineCol[lOffset] = 0.02 * alpha;
          lineCol[lOffset + 1] = 0.52 * alpha;
          lineCol[lOffset + 2] = 0.78 * alpha;

          lineCol[lOffset + 3] = 0.22 * alpha;
          lineCol[lOffset + 4] = 0.74 * alpha;
          lineCol[lOffset + 5] = 0.97 * alpha;

          lineIdx++;
        }
      }
    }

    // Zero out unused lines
    for (let i = lineIdx * 6; i < this.maxLines * 6; i++) {
      linePos[i] = 0;
      lineCol[i] = 0;
    }

    this.lineGeo.attributes.position.needsUpdate = true;
    this.lineGeo.attributes.color.needsUpdate = true;

    // Update Electrical Impulse Sparks along Synapses
    const sparkPositions = this.sparkGeo.attributes.position.array;
    for (let i = 0; i < this.sparkCount; i++) {
      const sp = this.sparks[i];
      sp.progress += sp.speed * delta;
      if (sp.progress >= 1.0) {
        sp.progress = 0;
        sp.from = Math.floor(Math.random() * this.nodeCount);
        sp.to = Math.floor(Math.random() * this.nodeCount);
      }

      const p1 = this.nodes[sp.from].currentPos;
      const p2 = this.nodes[sp.to].currentPos;

      sparkPositions[i * 3] = p1.x + (p2.x - p1.x) * sp.progress;
      sparkPositions[i * 3 + 1] = p1.y + (p2.y - p1.y) * sp.progress;
      sparkPositions[i * 3 + 2] = p1.z + (p2.z - p1.z) * sp.progress;
    }
    this.sparkGeo.attributes.position.needsUpdate = true;

    if (this.cascadePulse > 0) {
      this.cascadePulse = Math.max(0, this.cascadePulse - delta * 0.9);
    }
  }

  destroy() {
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.pointsGeo.dispose();
    this.lineGeo.dispose();
    this.sparkGeo.dispose();
  }
}

export default NeuralMeshScene;
