import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundEngine } from '../../audio/soundEngine';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const canvasContainerRef = useRef(null);
  const completedRef = useRef(false);

  // Attempt audio autoplay immediately; unlock on first gesture
  useEffect(() => {
    soundEngine.initContext();
    soundEngine.playBGM('default');
    soundEngine.playLoadingSound();

    const unlock = () => {
      soundEngine.initContext();
      soundEngine.playBGM('default');
      soundEngine.playLoadingSound();
      soundEngine.speakGreeting("Namaste. Welcome to Arav Gautam's portfolio.");
    };

    ['click', 'pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel'].forEach(evt =>
      window.addEventListener(evt, unlock, { once: true, passive: true })
    );

    return () => {
      ['click', 'pointerdown', 'touchstart', 'keydown', 'mousemove', 'wheel'].forEach(evt =>
        window.removeEventListener(evt, unlock)
      );
      soundEngine.finishLoadingScreen();
    };
  }, []);

  // 3D Kinetic Torus Sculpture
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xb46f32, 3.5);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    rimLight.position.set(-6, -6, -6);
    scene.add(rimLight);

    const coreLight = new THREE.PointLight(0xc27a3c, 2.5, 12);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const knotGeo = new THREE.TorusKnotGeometry(1.65, 0.38, 160, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d12,
      emissive: 0x110903,
      roughness: 0.18,
      metalness: 0.92,
      wireframe: false
    });
    const knotMesh = new THREE.Mesh(knotGeo, knotMat);
    mainGroup.add(knotMesh);

    const wireGeo = new THREE.TorusKnotGeometry(1.68, 0.39, 90, 16, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xb46f32,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    mainGroup.add(wireMesh);

    const coreOrbGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const coreOrbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreOrb = new THREE.Mesh(coreOrbGeo, coreOrbMat);
    mainGroup.add(coreOrb);

    const ringGeo = new THREE.TorusGeometry(3.1, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xb46f32,
      transparent: true,
      opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.8;
    mainGroup.add(ring);

    const particleCount = 140;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      pPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPositions[i + 2] = r * Math.cos(phi);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffaa44,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(pGeo, pMat);
    mainGroup.add(particles);

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      knotMesh.rotation.x = time * 0.35 + mouse.y * 0.5;
      knotMesh.rotation.y = time * 0.45 + mouse.x * 0.5;
      wireMesh.rotation.x = knotMesh.rotation.x;
      wireMesh.rotation.y = knotMesh.rotation.y;
      ring.rotation.z = time * 0.15;
      particles.rotation.y = time * 0.08;

      const breath = 1 + Math.sin(time * 3) * 0.12;
      coreOrb.scale.setScalar(breath);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
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
      [knotGeo, knotMat, wireGeo, wireMat, coreOrbGeo, coreOrbMat, ringGeo, ringMat, pGeo, pMat].forEach(r => r.dispose());
    };
  }, []);

  // Smooth Progress bar
  useEffect(() => {
    const startTime = Date.now();
    const duration = 2200;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const linearRatio = Math.min(elapsed / duration, 1);

      let easedRatio;
      if (linearRatio < 0.85) {
        easedRatio = 1 - Math.pow(1 - (linearRatio / 0.85), 2.2);
        setProgress(Math.floor(easedRatio * 88));
      } else {
        const subRatio = (linearRatio - 0.85) / 0.15;
        easedRatio = 0.88 + subRatio * 0.12;
        setProgress(Math.min(100, Math.floor(easedRatio * 100)));
      }

      if (linearRatio >= 1) {
        clearInterval(interval);
        setProgress(100);
        setIsReady(true);
      }
    }, 25);

    return () => clearInterval(interval);
  }, []);

  // Auto-transition as soon as loading hits 100% — no button, no gating
  useEffect(() => {
    if (isReady && !completedRef.current) {
      completedRef.current = true;
      const timer = setTimeout(() => {
        setFadeOut(true);
        soundEngine.finishLoadingScreen();
        setTimeout(() => onComplete(), 500);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isReady, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-between p-6 sm:p-10 select-none transition-opacity duration-600 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Header */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between text-xs font-mono text-gray-400">
        <span className="text-gray-300 font-medium tracking-widest">ARAV GAUTAM</span>
        <span className="text-gray-500 tracking-wider">PORTFOLIO '26</span>
      </div>

      {/* Center 3D Sculpture */}
      <div className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center my-auto">
        <div
          ref={canvasContainerRef}
          className="w-full max-w-[500px] sm:max-w-[620px] h-[340px] sm:h-[440px] flex items-center justify-center pointer-events-none -my-2"
        />

        {/* Greeting */}
        <div className="mb-5">
          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 tracking-wide select-none"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              lineHeight: '1.15',
              textShadow: '0 0 30px rgba(180, 111, 50, 0.4)'
            }}
          >
            नमस्ते
          </h1>
          <p className="text-xs sm:text-sm tracking-[0.2em] uppercase font-mono text-gray-400 font-medium">
            Arav Gautam • Software Engineer
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 bg-white/[0.08] h-1 rounded-full overflow-hidden mb-3 relative">
          <div
            className="h-full bg-[#b46f32] transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(180,111,50,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between w-64 sm:w-80 text-[11px] text-gray-500 font-mono">
          <span>Loading</span>
          <span className="text-gray-400">{progress}%</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full max-w-4xl flex justify-center text-[11px] font-mono text-gray-500">
        <span>Clean Code • Distributed Systems • 3D Experiences</span>
      </div>
    </div>
  );
};

export default LoadingScreen;