import * as THREE from 'three';

/**
 * 3D Spatial Skills Constellation Scene
 * Visualizes skill categories as orbital constellation nodes with glowing dynamic energy vectors.
 * Supports interactive raycasting, node clicking, smooth focus rotation, and bidirectional sync.
 */
export class SkillsConstellationScene {
  constructor(container, categories = [], onNodeClick = null) {
    this.container = container;
    this.categories = categories;
    this.onNodeClick = onNodeClick;
    this.width = container.clientWidth || 600;
    this.height = container.clientHeight || 400;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(52, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 0, 27);

    // Interaction & Animation State
    this.time = 0;
    this.nodes = [];
    this.hitObjects = [];
    this.shockwaves = [];
    this.hoveredNode = null;
    this.focusedCategoryId = null;

    // Smooth Euler Rotation Targets
    this.currentRotationY = 0;
    this.targetRotationY = 0;
    this.currentRotationX = 0;
    this.targetRotationX = 0;
    this.currentPositionY = 0;
    this.targetPositionY = 0;

    // Pointer Tracking
    this.pointer = new THREE.Vector2(-999, -999);
    this.raycaster = new THREE.Raycaster();
    this.isPointerDown = false;
    this.pointerStart = { x: 0, y: 0 };
    this.isDragging = false;
    this.autoSpinSpeed = 0.08;
    this.idleTimer = 0;

    this.initLights();
    this.initConstellation();
    this.initTooltip();
    this.bindEvents();
  }

  initLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 60);
    pointLight.position.set(0, 5, 20);
    this.scene.add(pointLight);
  }

  initConstellation() {
    this.group = new THREE.Group();

    const nodeGeo = new THREE.IcosahedronGeometry(0.7, 1);
    const subNodeGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const hitGeoHub = new THREE.SphereGeometry(1.6, 8, 8);
    const hitGeoSub = new THREE.SphereGeometry(0.9, 8, 8);
    const invisibleMat = new THREE.MeshBasicMaterial({ visible: false });

    const categoryColors = [0x00f0ff, 0x38bdf8, 0x2563eb, 0x10b981, 0x34d399];

    this.categories.forEach((cat, catIdx) => {
      const angle = (catIdx / this.categories.length) * Math.PI * 2;
      const radius = 9.5;
      const catX = Math.cos(angle) * radius;
      const catY = Math.sin(angle) * (radius * 0.55);
      const catZ = Math.sin(angle * 2) * 2.8;

      const color = categoryColors[catIdx % categoryColors.length];

      // Hub wireframe shell
      const wireMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.85
      });
      const hubMesh = new THREE.Mesh(nodeGeo, wireMat);
      hubMesh.position.set(catX, catY, catZ);

      // Core glowing center
      const coreMat = new THREE.MeshBasicMaterial({ color: color });
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.38, 12, 12), coreMat);
      hubMesh.add(core);

      // Orbiting decorative pulse ring
      const ringGeo = new THREE.RingGeometry(0.9, 0.98, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      hubMesh.add(ring);

      // Invisible generous hit target for raycasting
      const hubHit = new THREE.Mesh(hitGeoHub, invisibleMat);
      hubHit.position.copy(hubMesh.position);
      hubHit.userData = {
        isHub: true,
        categoryId: cat.id,
        name: cat.name,
        angle: angle,
        color: color,
        visualMesh: hubMesh,
        index: catIdx
      };
      hubMesh.userData = hubHit.userData;
      this.group.add(hubHit);
      this.hitObjects.push(hubHit);

      this.group.add(hubMesh);
      this.nodes.push(hubMesh);

      // Satellite skill nodes orbiting around the hub
      cat.skills.forEach((skill, sIdx) => {
        const subAngle = (sIdx / cat.skills.length) * Math.PI * 2;
        const subDist = 2.7;
        const sx = catX + Math.cos(subAngle) * subDist;
        const sy = catY + Math.sin(subAngle) * (subDist * 0.9);
        const sz = catZ + Math.sin(subAngle * 2) * 1.2;

        const subMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.85
        });

        const subMesh = new THREE.Mesh(subNodeGeo, subMat);
        subMesh.position.set(sx, sy, sz);

        // Core inner glow
        const subCore = new THREE.Mesh(
          new THREE.SphereGeometry(0.18, 8, 8),
          new THREE.MeshBasicMaterial({ color: color })
        );
        subMesh.add(subCore);

        // Invisible generous hit target for satellite node
        const subHit = new THREE.Mesh(hitGeoSub, invisibleMat);
        subHit.position.copy(subMesh.position);
        subHit.userData = {
          isSkill: true,
          categoryId: cat.id,
          categoryName: cat.name,
          skillName: skill.name,
          hubAngle: angle,
          angle: subAngle,
          color: color,
          visualMesh: subMesh,
          parentHub: hubMesh,
          index: sIdx
        };
        subMesh.userData = subHit.userData;
        this.group.add(subHit);
        this.hitObjects.push(subHit);

        this.group.add(subMesh);
        this.nodes.push(subMesh);

        // Dynamic vector energy line connecting hub to skill
        const branchPoints = [hubMesh.position, subMesh.position];
        const branchGeo = new THREE.BufferGeometry().setFromPoints(branchPoints);
        const branchMat = new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.35
        });
        const branchLine = new THREE.Line(branchGeo, branchMat);
        this.group.add(branchLine);
      });
    });

    // Outer boundary halo
    const haloGeo = new THREE.RingGeometry(12.5, 12.56, 80);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    this.halo = new THREE.Mesh(haloGeo, haloMat);
    this.group.add(this.halo);

    this.scene.add(this.group);
  }

  initTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className =
      'absolute z-30 pointer-events-none px-3 py-1.5 rounded-xl bg-black/90 border border-blue-500/50 text-white shadow-2xl backdrop-blur-md transition-opacity duration-150 opacity-0 -translate-x-1/2 -translate-y-full select-none';
    this.tooltip.innerHTML = `
      <div id="constellation-tooltip-cat" class="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold leading-none mb-1"></div>
      <div id="constellation-tooltip-title" class="text-xs font-display font-bold text-white leading-tight"></div>
      <div class="text-[9px] font-mono text-gray-400 mt-0.5 leading-none">Click to focus & inspect</div>
    `;
    this.container.appendChild(this.tooltip);

    this.tooltipCatEl = this.tooltip.querySelector('#constellation-tooltip-cat');
    this.tooltipTitleEl = this.tooltip.querySelector('#constellation-tooltip-title');
  }

  bindEvents() {
    this.onPointerMove = (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.pointer.set(x, y);

      if (this.isPointerDown) {
        const dx = e.clientX - this.pointerStart.x;
        const dy = e.clientY - this.pointerStart.y;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          this.isDragging = true;
          this.targetRotationY += dx * 0.006;
          this.targetRotationX += dy * 0.004;
          this.targetRotationX = Math.max(-0.6, Math.min(0.6, this.targetRotationX));
          this.pointerStart = { x: e.clientX, y: e.clientY };
          this.idleTimer = 0;
        }
      }

      this.checkRaycastHover();
    };

    this.onPointerDown = (e) => {
      this.isPointerDown = true;
      this.isDragging = false;
      this.pointerStart = { x: e.clientX, y: e.clientY };
    };

    this.onPointerUp = (e) => {
      if (!this.isDragging) {
        this.handlePointerClick(e);
      }
      this.isPointerDown = false;
    };

    this.onPointerLeave = () => {
      this.isPointerDown = false;
      this.pointer.set(-999, -999);
      this.clearHover();
    };

    this.container.addEventListener('pointermove', this.onPointerMove);
    this.container.addEventListener('pointerdown', this.onPointerDown);
    this.container.addEventListener('pointerup', this.onPointerUp);
    this.container.addEventListener('pointerleave', this.onPointerLeave);
  }

  checkRaycastHover() {
    if (this.isDragging) {
      this.clearHover();
      return;
    }

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hitObjects, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const data = hit.object.userData;
      const targetMesh = data.visualMesh;

      if (this.hoveredNode !== targetMesh) {
        this.clearHover();
        this.hoveredNode = targetMesh;
        if (targetMesh) {
          targetMesh.scale.set(1.4, 1.4, 1.4);
        }
      }

      // Update cursor
      this.container.style.cursor = 'pointer';
      this.container.setAttribute('data-cursor', 'SELECT');

      // Update Tooltip
      if (this.tooltip && targetMesh) {
        if (data.isHub) {
          this.tooltipCatEl.textContent = 'Category Cluster';
          this.tooltipTitleEl.textContent = data.name;
        } else {
          this.tooltipCatEl.textContent = data.categoryName || 'Skill Node';
          this.tooltipTitleEl.textContent = data.skillName;
        }

        // Project 3D position to 2D screen coordinates
        const tempV = new THREE.Vector3();
        targetMesh.getWorldPosition(tempV);
        tempV.project(this.camera);

        const sx = (tempV.x * 0.5 + 0.5) * this.width;
        const sy = (-tempV.y * 0.5 + 0.5) * this.height;

        this.tooltip.style.left = `${Math.round(sx)}px`;
        this.tooltip.style.top = `${Math.round(sy - 12)}px`;
        this.tooltip.style.opacity = '1';
      }
    } else {
      this.clearHover();
    }
  }

  clearHover() {
    if (this.hoveredNode) {
      const data = this.hoveredNode.userData;
      if (this.focusedCategoryId) {
        const isFocused = data.categoryId === this.focusedCategoryId;
        const baseScale = isFocused ? 1.3 : 0.7;
        this.hoveredNode.scale.set(baseScale, baseScale, baseScale);
      } else {
        this.hoveredNode.scale.set(1.0, 1.0, 1.0);
      }
      this.hoveredNode = null;
    }
    this.container.style.cursor = 'grab';
    this.container.setAttribute('data-cursor', 'DRAG');
    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
    }
  }

  handlePointerClick(e) {
    const rect = this.container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    const clickPointer = new THREE.Vector2(x, y);

    this.raycaster.setFromCamera(clickPointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.hitObjects, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const data = hit.object.userData;

      // Spawn shockwave ring at clicked node
      const hitWorldPos = new THREE.Vector3();
      hit.object.getWorldPosition(hitWorldPos);
      this.createShockwave(hitWorldPos, data.color || 0x00f0ff);

      // Focus constellation to bring this node to the front
      this.focusNode(data);

      // Trigger node click callback for UI synchronization
      if (typeof this.onNodeClick === 'function') {
        this.onNodeClick(data);
      }
    }
  }

  createShockwave(position, color) {
    const ringGeo = new THREE.RingGeometry(0.3, 0.45, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(position);
    ring.lookAt(this.camera.position);

    this.scene.add(ring);
    this.shockwaves.push({
      mesh: ring,
      scale: 1,
      opacity: 0.95
    });
  }

  focusNode(nodeData) {
    const hubAngle = nodeData.hubAngle !== undefined ? nodeData.hubAngle : nodeData.angle;
    this.focusedCategoryId = nodeData.categoryId;
    this.idleTimer = 0;

    // Calculate target rotation Y to bring the hub directly front-facing (+Z)
    const targetY = -hubAngle - Math.PI / 2;

    // Shortest rotational delta
    let diff = (targetY - this.currentRotationY) % (Math.PI * 2);
    if (diff < -Math.PI) diff += Math.PI * 2;
    if (diff > Math.PI) diff -= Math.PI * 2;

    this.targetRotationY = this.currentRotationY + diff;

    // Centering Y offset
    if (nodeData.visualMesh) {
      this.targetPositionY = -nodeData.visualMesh.position.y * 0.4;
    }

    // Highlight nodes in this category
    this.highlightCategory(nodeData.categoryId);
  }

  focusCategory(categoryId) {
    const hub = this.hitObjects.find(
      (obj) => obj.userData.isHub && obj.userData.categoryId === categoryId
    );
    if (hub) {
      this.focusNode(hub.userData);
    } else {
      this.resetFocus();
    }
  }

  focusSkill(skillName) {
    const skillObj = this.hitObjects.find(
      (obj) => obj.userData.isSkill && obj.userData.skillName === skillName
    );
    if (skillObj) {
      this.focusNode(skillObj.userData);
      if (skillObj.userData.visualMesh) {
        skillObj.userData.visualMesh.scale.set(1.7, 1.7, 1.7);
      }
    }
  }

  resetFocus() {
    this.focusedCategoryId = null;
    this.targetPositionY = 0;
    this.targetRotationX = 0;
    this.highlightCategory(null);
  }

  highlightCategory(categoryId) {
    this.focusedCategoryId = categoryId;
    this.nodes.forEach((node) => {
      const isMatch = !categoryId || node.userData.categoryId === categoryId;
      const targetScale = isMatch ? (node.userData.isHub ? 1.35 : 1.25) : 0.65;
      node.scale.set(targetScale, targetScale, targetScale);
    });
  }

  update(delta) {
    this.time += delta;
    this.idleTimer += delta;

    // Gentle ambient drift when idle
    if (!this.isPointerDown && !this.isDragging) {
      if (!this.focusedCategoryId) {
        this.targetRotationY += delta * this.autoSpinSpeed;
      } else {
        // Subtle breathing float when focused
        this.targetRotationX = Math.sin(this.time * 0.6) * 0.04;
      }
    }

    // Smooth Euler Interpolation
    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.08;
    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;
    this.currentPositionY += (this.targetPositionY - this.currentPositionY) * 0.08;

    if (this.group) {
      this.group.rotation.y = this.currentRotationY;
      this.group.rotation.x = this.currentRotationX;
      this.group.position.y = this.currentPositionY;
    }

    if (this.halo) {
      this.halo.rotation.z = this.time * 0.04;
    }

    // Pulse node rings and hubs
    this.nodes.forEach((node) => {
      if (node.userData.isHub) {
        node.rotation.y += 0.015;
        node.rotation.x += 0.008;
      }
    });

    // Update active shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.scale += delta * 7;
      sw.opacity -= delta * 1.8;
      sw.mesh.scale.set(sw.scale, sw.scale, sw.scale);
      sw.mesh.material.opacity = Math.max(0, sw.opacity);

      if (sw.opacity <= 0) {
        this.scene.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        sw.mesh.material.dispose();
        this.shockwaves.splice(i, 1);
      }
    }
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  destroy() {
    this.container.removeEventListener('pointermove', this.onPointerMove);
    this.container.removeEventListener('pointerdown', this.onPointerDown);
    this.container.removeEventListener('pointerup', this.onPointerUp);
    this.container.removeEventListener('pointerleave', this.onPointerLeave);

    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }

    // Dispose shockwaves
    this.shockwaves.forEach((sw) => {
      this.scene.remove(sw.mesh);
      sw.mesh.geometry.dispose();
      sw.mesh.material.dispose();
    });
    this.shockwaves = [];
  }
}
