import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

/**
 * 3D Obsidian Rubik's Cube
 * Precision Beveled Extrusion & Studio Overhead Illumination
 * Seamless card integration with zero rectangular seams and authentic organic light streak
 */
const RubiksCube3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    RectAreaLightUniformsLib.init();

    const getDimensions = () => {
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 360;
      return { w, h };
    };

    let { w: width, h: height } = getDimensions();

    const scene = new THREE.Scene();

    // Calibrated camera: fov 60 with z=6.2 provides majestic scale without any edge clipping
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.domElement.setAttribute('data-cursor', 'cube');
    container.appendChild(renderer.domElement);

    // Studio RectAreaLight from top-right: casts broad sheen across top facets
    const topRectLight = new THREE.RectAreaLight(0xffffff, 85, 20, 20);
    topRectLight.position.set(8, 12, 6);
    topRectLight.rotation.set(1.5 * Math.PI, Math.PI / 4, 0);
    scene.add(topRectLight);

    // Directional glint light for crisp specular edge highlights
    const directGlint = new THREE.DirectionalLight(0xffffff, 4.5);
    directGlint.position.set(6, 10, 8);
    scene.add(directGlint);

    // Subtle blue-tinted fill light from bottom-left for depth
    const blueBounce = new THREE.DirectionalLight(0x4080ff, 1.8);
    blueBounce.position.set(-8, -6, 4);
    scene.add(blueBounce);

    // Soft ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambientLight);

    // Hierarchical groups: outerGroup for mouse tilt/drag, innerGroup for continuous spin
    const outerGroup = new THREE.Group();
    const innerGroup = new THREE.Group();
    outerGroup.add(innerGroup);
    scene.add(outerGroup);

    // Initial natural isometric angle matching parthh.in reference
    outerGroup.rotation.x = 0.42;
    outerGroup.rotation.y = -0.52;

    // Precision 4-arc beveled extrusion geometry matching reference
    const shape = new THREE.Shape();
    shape.absarc(1e-5, 1e-5, 1e-5, -Math.PI / 2, -Math.PI, true);
    shape.absarc(1e-5, 0.82002, 1e-5, Math.PI, Math.PI / 2, true);
    shape.absarc(0.82002, 0.82002, 1e-5, Math.PI / 2, 0, true);
    shape.absarc(0.82002, 1e-5, 1e-5, 0, -Math.PI / 2, true);

    const subGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.82,
      bevelEnabled: true,
      bevelSegments: 32,
      steps: 1,
      bevelSize: 0.08999,
      bevelThickness: 0.09,
      curveSegments: 16,
    });
    subGeo.center();

    // Rich obsidian titanium chrome material matching parthh.in aesthetic
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      metalness: 0.88,
      roughness: 0.16,
    });

    // 27 Beveled sub-cubes arranged in a 3x3x3 grid with authentic hairline seam spacing
    const spacing = 1.03;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          const mesh = new THREE.Mesh(subGeo, subMat);
          mesh.position.set(
            (x - 1) * spacing,
            (y - 1) * spacing,
            (z - 1) * spacing
          );
          innerGroup.add(mesh);
        }
      }
    }

    // Pointer Interaction (Smooth Drag & Parallax)
    let isDragging = false;
    let lastPointer = { x: 0, y: 0 };
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      lastPointer = { x: e.clientX, y: e.clientY };
      if (container.setPointerCapture) {
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    };

    const onPointerUp = (e) => {
      isDragging = false;
      if (container.releasePointerCapture) {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    };

    const onPointerMove = (e) => {
      if (isDragging) {
        const deltaX = (e.clientX - lastPointer.x) * 0.012;
        const deltaY = (e.clientY - lastPointer.y) * 0.012;

        const deltaRotation = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(deltaY, deltaX, 0, 'XYZ')
        );
        outerGroup.quaternion.multiplyQuaternions(deltaRotation, outerGroup.quaternion);

        lastPointer = { x: e.clientX, y: e.clientY };
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetTiltX = normY * 0.2;
        targetTiltY = normX * 0.2;
      }
    };

    const onMouseLeave = () => {
      targetTiltX = 0;
      targetTiltY = 0;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // Continuous Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Continuous 3D spin on innerGroup matching parthh.in: 0.004 rad/frame
      innerGroup.rotation.x += 0.004;
      innerGroup.rotation.y += 0.004;
      innerGroup.rotation.z += 0.004;

      if (!isDragging) {
        outerGroup.rotation.x += (0.42 + targetTiltX - outerGroup.rotation.x) * 0.05;
        outerGroup.rotation.y += (-0.52 + targetTiltY - outerGroup.rotation.y) * 0.05;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const { w, h } = getDimensions();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animId);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      subGeo.dispose();
      subMat.dispose();
    };
  }, []);

  return (
    <div
      data-cursor="drag"
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
    >
      {/* Soft Studio Radial Spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 55% 48%, rgba(255, 255, 255, 0.12) 0%, rgba(59, 130, 246, 0.05) 35%, transparent 70%)',
          zIndex: 0,
        }}
      />

      {/* 
        Authentic Soft Angled Light Streak (Direct from parthh.in reference):
        Organic 50-degree rotated beam with smooth gaussian blur and zero rectangular borders
      */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[50deg] pointer-events-none"
        style={{ width: '130%', height: '170px', filter: 'blur(45px)', zIndex: 0 }}
      >
        <div
          className="w-full h-full opacity-35"
          style={{
            background: 'white',
            maskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,1))',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* 100% Transparent WebGL Canvas */}
      <div
        ref={mountRef}
        data-cursor="cube"
        className="relative z-10 w-full h-full flex items-center justify-center cursor-none select-none"
      />
    </div>
  );
};

export default RubiksCube3D;
