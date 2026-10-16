import React, { useState, useRef } from 'react';
import { soundEngine } from '../../audio/soundEngine';

/**
 * Interactive 3D Transformable Name
 * Shifts along X-axis on both sides with subtle Y-axis tilt on cursor hover
 */
const Interactive3DName = () => {
  const containerRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0px)',
    textShadow: '0 4px 30px rgba(7, 129, 255, 0.2)',
    transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), text-shadow 0.4s ease',
  });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // Normalize coordinates: x in [-0.5, 0.5], y in [-0.5, 0.5]
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // 3D rotations & translations:
    // - X-axis shift on both sides (rotateY tilts left/right, translateX moves with cursor)
    // - Subtle Y-axis movement (just enough to notice: rotateX +/- 6deg, translateY +/- 5px)
    const rotY = x * 22; // +/- 11 deg tilt
    const rotX = -y * 8; // subtle +/- 4 deg tilt (just enough to notice)
    const transX = x * 32; // +/- 16px lateral shift
    const transY = y * 8; // subtle +/- 4px vertical shift
    const transZ = 28; // pop out towards user in 3D space

    // Dynamic multi-layered 3D shadow shifting opposite to cursor
    const sx = -x * 18;
    const sy = -y * 8 + 4;
    const dynamicShadow = `
      ${sx * 0.2}px ${sy * 0.2}px 0px rgba(255, 255, 255, 0.15),
      ${sx * 0.5}px ${sy * 0.5}px 0px rgba(7, 129, 255, 0.35),
      ${sx * 0.8}px ${sy * 0.8}px 8px rgba(7, 129, 255, 0.3),
      ${sx * 1.2}px ${sy * 1.2}px 24px rgba(7, 129, 255, 0.4),
      0 20px 40px rgba(0, 0, 0, 0.7)
    `;

    setTransformStyle({
      transform: `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateX(${transX.toFixed(2)}px) translateY(${transY.toFixed(2)}px) translateZ(${transZ}px)`,
      textShadow: dynamicShadow,
      transition: 'transform 0.08s ease-out, text-shadow 0.08s ease-out',
    });
  };

  const handleMouseEnter = () => {
    soundEngine.playHover();
  };

  const handleMouseLeave = () => {
    setTransformStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0px)',
      textShadow: '0 4px 30px rgba(7, 129, 255, 0.2)',
      transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), text-shadow 0.4s ease',
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="explore"
      className="inline-block cursor-pointer select-none py-2 px-4"
      style={{ perspective: '1200px' }}
      aria-label="Arav Gautam - Software Engineer"
    >
      <h1
        className="text-[13vw] sm:text-[11vw] lg:text-[8.5rem] font-black leading-none text-white tracking-[-0.04em] uppercase font-display will-change-transform"
        style={transformStyle}
      >
        ARAV GAUTAM
      </h1>
    </div>
  );
};

export default Interactive3DName;
