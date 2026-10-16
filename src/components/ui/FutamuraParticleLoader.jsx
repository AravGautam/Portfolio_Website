import React, { useEffect, useRef } from 'react';

/**
 * 3D Organic Particle Orbital Halo Progress Ring
 * Inspired by Kojiro Futamura (futamura.dev)
 * - 1,600+ 3D undulating celestial particles in an organic noisy circular orbit
 * - Concentric dashed calibration circle
 * - Smooth sweeping circular progress arc with luminous head
 * - Centered 3-digit percentage readout ("000%" -> "100%") and technical phase descriptor
 */
const FutamuraParticleLoader = ({ progress = 0, statusText = 'Loading Data' }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 260;
    let height = 260;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 260;
      height = rect.height || 260;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    // Generate 1,600 3D orbital particles
    const particleCount = 1600;
    const particles = [];
    const baseRadius = width * 0.38;

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.05;
      const radiusOffset = (Math.random() - 0.5) * 26; // band thickness
      const speed = 0.004 + Math.random() * 0.006;
      const size = 0.75 + Math.random() * 1.4;
      const isAccent = Math.random() < 0.18; // 18% cyan/azure sparks
      const brightness = 0.35 + Math.random() * 0.65;
      const noisePhase = Math.random() * 100;

      particles.push({
        angle,
        radiusOffset,
        speed,
        size,
        isAccent,
        brightness,
        noisePhase,
      });
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = nx * 0.25;
      mouseRef.current.targetY = -ny * 0.25;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const currentBaseRadius = width * 0.38;
      const innerTrackRadius = currentBaseRadius - 20;

      // 1. Concentric Inner Dashed Track (matching futamura.dev)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerTrackRadius, 0, Math.PI * 2);
      ctx.setLineDash([2, 5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 2. Active Sweeping Circular Progress Arc
      if (progress > 0) {
        ctx.save();
        const startAngle = -Math.PI / 2;
        const sweepAngle = (Math.min(100, progress) / 100) * Math.PI * 2;
        const endAngle = startAngle + sweepAngle;

        ctx.beginPath();
        ctx.arc(centerX, centerY, innerTrackRadius, startAngle, endAngle);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.6;
        ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Glowing leading head dot
        const headX = centerX + Math.cos(endAngle) * innerTrackRadius;
        const headY = centerY + Math.sin(endAngle) * innerTrackRadius;
        ctx.beginPath();
        ctx.arc(headX, headY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.restore();
      }

      // 3. Render 3D Undulating Organic Particle Cloud
      const cameraDist = 300;
      const rotX = 0.22 + mouseRef.current.y;
      const rotY = mouseRef.current.x;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.angle += p.speed;

        // Organic multi-harmonic noise displacement
        const wave =
          Math.sin(p.angle * 6 + time * 2.8 + p.noisePhase) * 8 +
          Math.cos(p.angle * 12 - time * 1.6) * 5;

        const r = currentBaseRadius + p.radiusOffset + wave;
        const z = Math.sin(p.angle * 4 + time * 2.2) * 14;

        // 3D Rotation Transform
        const x0 = r * Math.cos(p.angle);
        const y0 = r * Math.sin(p.angle);
        const z0 = z;

        // Yaw (rotY) & Pitch (rotX)
        const x1 = x0 * Math.cos(rotY) + z0 * Math.sin(rotY);
        const z1 = -x0 * Math.sin(rotY) + z0 * Math.cos(rotY);

        const y2 = y0 * Math.cos(rotX) - z1 * Math.sin(rotX);
        const z2 = y0 * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Perspective Projection
        const scale = cameraDist / (cameraDist + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;
        const pSize = Math.max(0.4, p.size * scale);
        const alpha = Math.min(1, Math.max(0.08, p.brightness * (scale * 0.85)));

        ctx.beginPath();
        ctx.arc(projX, projY, pSize, 0, Math.PI * 2);
        if (p.isAccent) {
          ctx.fillStyle = `rgba(147, 197, 253, ${alpha * 0.9})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onResize = () => {
      updateSize();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
    };
  }, [progress]);

  const paddedPercent = String(Math.min(100, Math.floor(progress))).padStart(3, '0');

  return (
    <div className="relative w-[230px] h-[230px] sm:w-[260px] sm:h-[260px] flex items-center justify-center select-none my-2">
      {/* 3D Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Centered Readout (matching futamura.dev: "087%" and dynamic status) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
        <span className="font-mono text-2xl sm:text-3xl font-extrabold tracking-widest text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]">
          {paddedPercent}%
        </span>
        <span className="font-mono text-[9px] sm:text-[10px] text-gray-400 font-medium tracking-widest uppercase mt-1 px-3 truncate max-w-[170px]">
          {statusText}
        </span>
      </div>
    </div>
  );
};

export default FutamuraParticleLoader;
