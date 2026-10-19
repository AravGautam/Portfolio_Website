import React, { useEffect, useRef, memo } from 'react';
import { Gradient } from '../webgl/StripeGradient';

const DEFAULT_COLORS = ['#222299', '#0781ff', '#000000', '#000055'];

/**
 * AuroraBackground
 * 
 * Recreates the iconic fluid 3D WebGL mesh gradient background
 * from https://advaitnair.org/ and Stripe, featuring deep midnight blues,
 * vibrant electric azure highlights, and silky undulating waves across the whole website.
 * 
 * Features a resilient architecture:
 * 1. Deep solid black fallback (#030308) as the permanent base
 * 2. Continuous GPU-accelerated fluid CSS aurora mesh so the flowing waves NEVER disappear
 * 3. 3D WebGL Mesh Canvas with automatic context loss and restoration recovery
 * 4. Ambient depth vignette for optimal contrast
 */
const AuroraBackground = ({
  colors = DEFAULT_COLORS,
  speed = 5e-5,
  className = '',
  opacity = 0.92
}) => {
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Apply colors to canvas CSS custom properties
    colors.forEach((col, idx) => {
      canvas.style.setProperty(`--gradient-color-${idx + 1}`, col);
    });

    const initWebGL = () => {
      try {
        if (gradientRef.current) {
          gradientRef.current.disconnect();
          gradientRef.current = null;
        }
        const gradientInstance = new Gradient();
        gradientRef.current = gradientInstance;
        gradientInstance.initGradient(canvas);
        if (speed) {
          gradientInstance.updateFrequency(speed);
        }
      } catch (err) {
        console.warn('[AuroraBackground] WebGL fallback active:', err);
      }
    };

    // Guard against unhandled WebGL context loss and auto-recover upon restore
    const handleContextLost = (e) => {
      e.preventDefault();
    };

    const handleContextRestored = () => {
      initWebGL();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    initWebGL();

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      if (gradientRef.current) {
        try {
          gradientRef.current.disconnect();
        } catch (e) {
          // safe cleanup
        }
        gradientRef.current = null;
      }
    };
  }, [colors, speed]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#030308] ${className}`}
      aria-hidden="true"
    >
      {/* Resilient Continuous CSS Fluid Aurora Mesh (Ensures flowing ambient waves NEVER disappear) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1: Vibrant Electric Azure */}
        <div
          className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vh] rounded-full blur-[100px] animate-aurora-blob-1 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(7, 129, 255, 0.42) 0%, rgba(29, 78, 216, 0.25) 50%, transparent 75%)'
          }}
        />

        {/* Blob 2: Deep Midnight Royal Indigo */}
        <div
          className="absolute top-[25%] -right-[15%] w-[85vw] h-[80vh] rounded-full blur-[120px] animate-aurora-blob-2 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34, 34, 153, 0.48) 0%, rgba(0, 0, 85, 0.35) 55%, transparent 80%)'
          }}
        />

        {/* Blob 3: Subtle Sky Horizon Bloom */}
        <div
          className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vh] rounded-full blur-[90px] animate-aurora-blob-3 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.32) 0%, rgba(30, 27, 75, 0.28) 50%, transparent 75%)'
          }}
        />
      </div>

      {/* 3D WebGL Mesh Canvas Blended Smoothly Over the Fluid Foundation */}
      <canvas
        ref={canvasRef}
        id="aurora-mesh-canvas"
        className="w-full h-full block relative z-[1] transition-opacity duration-1000"
        style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: 'transparent',
          opacity,
          '--gradient-color-1': colors[0] || '#222299',
          '--gradient-color-2': colors[1] || '#0781ff',
          '--gradient-color-3': colors[2] || '#000000',
          '--gradient-color-4': colors[3] || '#000055',
        }}
      />

      {/* Depth & Soft Ambient Vignette Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(3,3,8,0) 25%, rgba(3,3,8,0.45) 70%, rgba(3,3,8,0.92) 100%)'
        }}
      />
    </div>
  );
};

export default memo(AuroraBackground);

