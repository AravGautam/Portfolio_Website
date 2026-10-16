import React, { useEffect, useRef } from 'react';
import { Gradient } from '../webgl/StripeGradient';

/**
 * AuroraBackground
 * 
 * Recreates the iconic fluid 3D WebGL mesh gradient background
 * from https://advaitnair.org/ and Stripe, featuring deep midnight blues,
 * vibrant electric azure highlights, and silky undulating waves across the whole website.
 */
const AuroraBackground = ({
  colors = ['#222299', '#0781ff', '#000000', '#000055'],
  speed = 5e-5,
  className = '',
  opacity = 0.95
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

    let gradientInstance = null;
    try {
      gradientInstance = new Gradient();
      gradientRef.current = gradientInstance;
      gradientInstance.initGradient(canvas);
      if (speed) {
        gradientInstance.updateFrequency(speed);
      }
    } catch (err) {
      console.warn('[AuroraBackground] WebGL initialization fallback:', err);
    }

    return () => {
      if (gradientRef.current) {
        try {
          gradientRef.current.disconnect();
        } catch (e) {
          // cleanup safe
        }
        gradientRef.current = null;
      }
    };
  }, [colors, speed]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black ${className}`}
      aria-hidden="true"
    >
      {/* 3D WebGL Mesh Canvas */}
      <canvas
        ref={canvasRef}
        id="aurora-mesh-canvas"
        className="w-full h-full block transition-opacity duration-1000"
        style={{
          width: '100vw',
          height: '100vh',
          opacity,
          '--gradient-color-1': colors[0] || '#222299',
          '--gradient-color-2': colors[1] || '#0781ff',
          '--gradient-color-3': colors[2] || '#000000',
          '--gradient-color-4': colors[3] || '#000055',
        }}
      />

      {/* Depth & Soft Vignette Layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0.7) 100%)'
        }}
      />
    </div>
  );
};

export default AuroraBackground;
