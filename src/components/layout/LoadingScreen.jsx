import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { soundEngine } from '../../audio/soundEngine';
import FutamuraParticleLoader from '../ui/FutamuraParticleLoader';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const canvasContainerRef = useRef(null);
  const completedRef = useRef(false);

  // Audio lifecycle: start ambient BGM and loading sound; unlock on first gesture
  // Spoken voice greeting removed per user request
  useEffect(() => {
    soundEngine.initContext();
    soundEngine.startLoadingScreen();
    soundEngine.playBGM('default');

    const unlock = () => {
      soundEngine.initContext();
      soundEngine.playBGM('default');
    };

    ['click', 'pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel'].forEach((evt) =>
      window.addEventListener(evt, unlock, { once: true, passive: true })
    );

    return () => {
      ['click', 'pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel'].forEach((evt) =>
        window.removeEventListener(evt, unlock)
      );
    };
  }, []);

  // 3D Obsidian Rubik's Cube with Precision Beveled Extrusion & Seamless Studio Illumination
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    RectAreaLightUniformsLib.init();

    const getDimensions = () => {
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 240;
      return { w, h };
    };

    let { w: width, h: height } = getDimensions();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2));
    renderer.setClearColor(0x000000, 0); // 100% transparent - seamless integration
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);

    // 1. Studio RectAreaLight from top-right
    const topRectLight = new THREE.RectAreaLight(0xffffff, 110, 22, 22);
    topRectLight.position.set(10, 15, 0);
    topRectLight.rotation.set(1.5 * Math.PI, Math.PI / 4, 0);
    scene.add(topRectLight);

    // 2. Soft bottom bounce RectAreaLight
    const bottomRectLight = new THREE.RectAreaLight(0xffffff, 4.0, 20, 20);
    bottomRectLight.position.set(0, -20, 0);
    bottomRectLight.rotation.set(Math.PI / 2, 0, 0);
    scene.add(bottomRectLight);

    // 3. Directional glint light for crisp specular edge highlights
    const directGlint = new THREE.DirectionalLight(0xffffff, 5.5);
    directGlint.position.set(7, 13, 5);
    scene.add(directGlint);

    // 4. Subtle ambient fill
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(ambientLight);

    // Hierarchical groups: outerGroup for tilt, innerGroup for continuous spin
    const outerGroup = new THREE.Group();
    const innerGroup = new THREE.Group();
    outerGroup.add(innerGroup);
    scene.add(outerGroup);

    outerGroup.rotation.x = 0.42;
    outerGroup.rotation.y = -0.52;

    // Precision 4-arc beveled extrusion geometry matching parthh.in reference
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

    const subMat = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 1.0,
      roughness: 0.018,
    });

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

    let targetX = 0;
    let targetY = 0;
    const onMouseMove = (e) => {
      targetY = (e.clientX / window.innerWidth - 0.5) * 0.25;
      targetX = -(e.clientY / window.innerHeight - 0.5) * 0.2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();

      // Continuous 3D multi-axis rotation
      innerGroup.rotation.x += 0.0035;
      innerGroup.rotation.y += 0.0045;
      innerGroup.rotation.z += 0.0025;

      outerGroup.rotation.x = 0.42 + targetX + Math.sin(elapsed * 1.2) * 0.02;
      outerGroup.rotation.y = -0.52 + targetY;
      innerGroup.position.y = Math.sin(elapsed * 1.5) * 0.04;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const { w, h } = getDimensions();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      subGeo.dispose();
      subMat.dispose();
    };
  }, []);

  // Deliberate Luxury Loading Progression: 4.6 seconds of immersive cinematic experience
  useEffect(() => {
    const startTime = Date.now();
    const duration = 4600;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linearRatio = Math.min(elapsed / duration, 1);

      // Smooth multi-stage easing curve that moves with confidence and eases gracefully into completion
      let easedRatio;
      if (linearRatio < 0.75) {
        easedRatio = Math.pow(linearRatio / 0.75, 1.35) * 0.78;
        setProgress(Math.floor(easedRatio * 100));
      } else {
        const subRatio = (linearRatio - 0.75) / 0.25;
        easedRatio = 0.78 + (1 - Math.pow(1 - subRatio, 2.4)) * 0.22;
        setProgress(Math.min(100, Math.floor(easedRatio * 100)));
      }

      if (linearRatio >= 1) {
        clearInterval(interval);
        setProgress(100);
        setIsReady(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  // Cinematic exit transition when ready
  useEffect(() => {
    if (isReady && !completedRef.current) {
      completedRef.current = true;
      const timer = setTimeout(() => {
        setFadeOut(true);
        soundEngine.playWhoosh();
        soundEngine.finishLoadingScreen();
        setTimeout(() => onComplete(), 750);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#050608] flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden select-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        fadeOut ? 'opacity-0 scale-[1.03] blur-sm pointer-events-none' : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* 
        Seamless Full-Viewport Ambient Atmosphere:
        Spans the entire viewport so there are ZERO clipped div edges, zero rectangles, and zero box boundaries
      */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 950px 750px at 50% 36%, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.012) 42%, transparent 78%)',
        }}
      />

      {/* Top Header */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between text-xs font-mono text-gray-400 pt-2 px-2">
        <span className="text-gray-300 font-semibold tracking-widest">ARAV GAUTAM</span>
        <span className="text-gray-500 tracking-wider">PORTFOLIO '26</span>
      </div>

      {/* Center 3D Obsidian Rubik's Cube, Namaste Headline & Precision Circular Loader */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center my-auto space-y-1 sm:space-y-2">
        {/* 
          100% Transparent 3D Obsidian Rubik's Cube Viewport
        */}
        <div
          ref={canvasContainerRef}
          className="relative z-10 w-full max-w-md h-[180px] sm:h-[210px] flex items-center justify-center pointer-events-none select-none"
        />

        {/* Primary Namaste Greeting Headline */}
        <div className="space-y-0.5 pt-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-wide select-none drop-shadow-[0_4px_30px_rgba(255,255,255,0.2)]">
            नमस्ते
          </h1>
          <p className="font-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase text-gray-400 font-medium">
            ARAV GAUTAM • PORTFOLIO 2026
          </p>
        </div>

        {/* 
          Precision Chronometer & Orbital Particle Loader
        */}
        <FutamuraParticleLoader progress={progress} />
      </div>

      {/* Bottom spacer to keep perfect vertical balance without footer text */}
      <div className="relative z-10 w-full max-w-5xl h-6 pointer-events-none" />
    </div>
  );
};

export default LoadingScreen;