import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Reusable WebGL Canvas Component
 * Manages Three.js renderer lifecycle, IntersectionObserver pause/resume, and responsive resizing.
 */
export const WebGLCanvas = ({
  createScene,
  className = "w-full h-full",
  sceneRef = null,
  onSceneReady = null
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isVisible = true;
    let animationFrameId = null;
    let lastTime = performance.now();

    // Setup High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: "high-performance"
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Initialize custom scene instance
    const sceneInstance = createScene(container);
    if (sceneRef) {
      sceneRef.current = sceneInstance;
    }
    if (onSceneReady) {
      onSceneReady(sceneInstance);
    }

    // Animation Loop with delta timing
    const renderLoop = (now) => {
      if (isVisible && sceneInstance) {
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        sceneInstance.update(delta);
        renderer.render(sceneInstance.scene, sceneInstance.camera);
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height);
          sceneInstance.resize(width, height);
        }
      }
    });
    resizeObserver.observe(container);

    // IntersectionObserver to pause when out of viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            lastTime = performance.now();
          }
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Clean teardown
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (sceneInstance && typeof sceneInstance.destroy === 'function') {
        sceneInstance.destroy();
      }

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [createScene, sceneRef, onSceneReady]);

  return <div ref={containerRef} className={`relative overflow-hidden ${className}`} />;
};

export default WebGLCanvas;
