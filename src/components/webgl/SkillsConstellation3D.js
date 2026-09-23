import * as THREE from 'three';

/**
 * 3D Spatial Skills Constellation Scene
 * Visualizes skill categories as orbital constellation nodes with glowing dynamic energy vectors.
 */
export class SkillsConstellationScene {
  constructor(container, categories = []) {
    this.container = container;
    this.categories = categories;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, this.width / this.height, 0.1, 1000);
    this.camera.position.z = 28;

    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.time = 0;
    this.nodes = [];
    this.highlightedCategory = null;

    this.initConstellation();
    this.bindEvents();
  }

  initConstellation() {
    this.group = new THREE.Group();
    const nodeGeo = new THREE.IcosahedronGeometry(0.6, 1);
    const subNodeGeo = new THREE.SphereGeometry(0.3, 8, 8);

    const categoryColors = [0x00f0ff, 0x38bdf8, 0x2563eb, 0x10b981, 0x34d399];

    this.categories.forEach((cat, catIdx) => {
      const angle = (catIdx / this.categories.length) * Math.PI * 2;
      const radius = 10;
      const catX = Math.cos(angle) * radius;
      const catY = Math.sin(angle) * (radius * 0.65);
      const catZ = (Math.sin(angle * 2) * 3);

      const color = categoryColors[catIdx % categoryColors.length];
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true
      });

      const hubMesh = new THREE.Mesh(nodeGeo, mat);
      hubMesh.position.set(catX, catY, catZ);
      hubMesh.userData = { categoryId: cat.id, isHub: true, name: cat.name };
      this.group.add(hubMesh);
      this.nodes.push(hubMesh);

      // Core glow
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 8, 8),
        new THREE.MeshBasicMaterial({ color: color })
      );
      hubMesh.add(core);

      // Child skill nodes orbiting around hub
      cat.skills.forEach((skill, sIdx) => {
        const subAngle = (sIdx / cat.skills.length) * Math.PI * 2;
        const subDist = 2.6;
        const sx = catX + Math.cos(subAngle) * subDist;
        const sy = catY + Math.sin(subAngle) * subDist;
        const sz = catZ + (Math.sin(subAngle) * 1.5);

        const subMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.7
        });

        const subMesh = new THREE.Mesh(subNodeGeo, subMat);
        subMesh.position.set(sx, sy, sz);
        subMesh.userData = { categoryId: cat.id, skillName: skill.name, parentHub: hubMesh };
        this.group.add(subMesh);
        this.nodes.push(subMesh);

        // Branch line from hub to skill node
        const branchPoints = [hubMesh.position, subMesh.position];
        const branchGeo = new THREE.BufferGeometry().setFromPoints(branchPoints);
        const branchMat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.3
        });
        const branchLine = new THREE.Line(branchGeo, branchMat);
        this.group.add(branchLine);
      });
    });

    // Outer boundary halo
    const haloGeo = new THREE.RingGeometry(12, 12.05, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    this.halo = new THREE.Mesh(haloGeo, haloMat);
    this.group.add(this.halo);

    this.scene.add(this.group);
  }

  highlightCategory(categoryId) {
    this.highlightedCategory = categoryId;
    this.nodes.forEach(node => {
      if (!categoryId || node.userData.categoryId === categoryId) {
        node.scale.set(1.4, 1.4, 1.4);
      } else {
        node.scale.set(0.7, 0.7, 0.7);
      }
    });
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

    if (this.group) {
      this.group.rotation.y = this.time * 0.1 + this.mouse.x * 0.3;
      this.group.rotation.x = Math.sin(this.time * 0.08) * 0.08 - this.mouse.y * 0.2;
    }

    if (this.halo) {
      this.halo.rotation.z = this.time * 0.05;
    }

    // Gentle node pulsing
    this.nodes.forEach((node) => {
      if (node.userData.isHub) {
        node.rotation.y += 0.02;
        node.rotation.x += 0.01;
      }
    });
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.container.removeEventListener('mousemove', this.onMouseMove);
  }
}
