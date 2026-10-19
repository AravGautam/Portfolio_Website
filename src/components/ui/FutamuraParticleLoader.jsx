import React, { useEffect, useRef } from 'react';

/**
 * Precision Chronometer & Orbital Particle Loader
 * 
 * Entire loader (ticks, circular tracks, progress arc, lead beacon, and celestial particles)
 * is projected through the exact same dynamic 3D perspective so the loader moves in total unison with the particles.
 * 
 * Minimalist display: Strictly tabular percentage number only. Zero pills, zero blinking lights.
 */
const FutamuraParticleLoader = ({ progress = 0 }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const progressRef = useRef(progress);
  const displayProgressRef = useRef(progress);

  // Keep target progress ref updated without re-running the animation setup
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = 240;
    let height = 240;
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width || 240;
      height = rect.height || 240;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateSize();

    // Streamlined set of 42 celestial micro-sparks gliding along the orbital perimeter
    const particleCount = 42;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const radiusOffset = (Math.random() - 0.5) * 10;
      const zOffset = (Math.random() - 0.5) * 10;
      const speed = 0.007 + Math.random() * 0.012;
      const size = 0.9 + Math.random() * 1.5;
      const isAccent = Math.random() < 0.45;
      const brightness = 0.5 + Math.random() * 0.5;
      const wavePhase = Math.random() * Math.PI * 2;

      particles.push({
        angle,
        radiusOffset,
        zOffset,
        speed,
        size,
        isAccent,
        brightness,
        wavePhase,
      });
    }

    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseRef.current.targetX = nx * 0.22;
      mouseRef.current.targetY = -ny * 0.22;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let time = 0;

    const render = () => {
      time += 0.016;

      // Smooth progress lerp for fluid 60fps gauge movement
      const targetP = Math.min(100, Math.max(0, progressRef.current));
      displayProgressRef.current += (targetP - displayProgressRef.current) * 0.12;
      const currentProgress = displayProgressRef.current;

      // Mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const trackRadius = width * 0.35;
      const tickInner = trackRadius + 14;
      const tickOuter = trackRadius + 21;
      const innerGuideRadius = trackRadius - 16;

      // Unified 3D Tilt: The loader moves in total synchrony with the particles
      const tiltX = 0.14 + mouseRef.current.y + Math.sin(time * 1.8) * 0.035;
      const tiltY = mouseRef.current.x + Math.cos(time * 1.4) * 0.03;

      const fov = 420;
      const cosY = Math.cos(tiltY);
      const sinY = Math.sin(tiltY);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);

      // 3D Perspective Projection for all loader elements
      const project = (x, y, z = 0) => {
        // Yaw
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Pitch
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        const scale = fov / (fov + z2);
        return {
          x: centerX + x1 * scale,
          y: centerY + y2 * scale,
          scale,
          depth: z2,
        };
      };

      // 1. Central Ambient Radial Glow
      const centerProj = project(0, 0, 0);
      const centerGlow = ctx.createRadialGradient(
        centerProj.x,
        centerProj.y,
        0,
        centerProj.x,
        centerProj.y,
        trackRadius * 1.15 * centerProj.scale
      );
      centerGlow.addColorStop(0, 'rgba(56, 189, 248, 0.06)');
      centerGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.015)');
      centerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = centerGlow;
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, trackRadius * 1.15 * centerProj.scale, 0, Math.PI * 2);
      ctx.fill();

      // 2. Precision Outer Chronometer Calibration Ticks (60 units) in 3D Perspective
      const totalTicks = 60;
      const activeTicksFloat = (currentProgress / 100) * totalTicks;

      ctx.save();
      for (let i = 0; i < totalTicks; i++) {
        const tickAngle = -Math.PI / 2 + (i / totalTicks) * Math.PI * 2;
        const cosA = Math.cos(tickAngle);
        const sinA = Math.sin(tickAngle);

        const isMajor = i % 5 === 0;
        const extraLength = isMajor ? 3 : 0;

        const p1 = project(cosA * tickInner, sinA * tickInner, 0);
        const p2 = project(cosA * (tickOuter + extraLength), sinA * (tickOuter + extraLength), 0);

        const isActive = i <= activeTicksFloat;
        const isNearHead = Math.abs(i - activeTicksFloat) < 1.5;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (isActive) {
          if (isNearHead) {
            ctx.strokeStyle = '#ffffff';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.lineWidth = (isMajor ? 2.2 : 1.6) * p1.scale;
          } else {
            ctx.strokeStyle = isMajor ? '#38bdf8' : 'rgba(56, 189, 248, 0.65)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = isMajor ? 6 : 2;
            ctx.lineWidth = (isMajor ? 1.8 : 1.2) * p1.scale;
          }
        } else {
          ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.22)' : 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = (isMajor ? 1.4 : 1.0) * p1.scale;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
      }
      ctx.restore();

      // 3. Background Hairline Track in 3D Perspective
      ctx.save();
      ctx.beginPath();
      const trackSteps = 80;
      for (let i = 0; i <= trackSteps; i++) {
        const angle = (i / trackSteps) * Math.PI * 2;
        const pt = project(trackRadius * Math.cos(angle), trackRadius * Math.sin(angle), 0);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1.8 * centerProj.scale;
      ctx.stroke();
      ctx.restore();

      // 4. Subtle Inner Dashed Track in 3D Perspective
      ctx.save();
      ctx.beginPath();
      const innerSteps = 60;
      for (let i = 0; i <= innerSteps; i++) {
        const angle = (i / innerSteps) * Math.PI * 2;
        const pt = project(innerGuideRadius * Math.cos(angle), innerGuideRadius * Math.sin(angle), 0);
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.setLineDash([3, 7]);
      ctx.lineDashOffset = -time * 6;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.lineWidth = 1 * centerProj.scale;
      ctx.stroke();
      ctx.restore();

      // 5. Active Sweeping Circular Progress Arc in 3D Perspective
      if (currentProgress > 0) {
        ctx.save();
        const startAngle = -Math.PI / 2;
        const sweepAngle = (currentProgress / 100) * Math.PI * 2;
        const endAngle = startAngle + sweepAngle;
        const arcSteps = Math.max(12, Math.floor((currentProgress / 100) * 90));

        // Radiant Outer Glow Arc
        ctx.beginPath();
        for (let i = 0; i <= arcSteps; i++) {
          const angle = startAngle + (i / arcSteps) * sweepAngle;
          const pt = project(trackRadius * Math.cos(angle), trackRadius * Math.sin(angle), 0);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.8 * centerProj.scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
        ctx.shadowBlur = 14;
        ctx.stroke();

        // Inner White Specular Highlight Core
        ctx.beginPath();
        for (let i = 0; i <= arcSteps; i++) {
          const angle = startAngle + (i / arcSteps) * sweepAngle;
          const pt = project(trackRadius * Math.cos(angle), trackRadius * Math.sin(angle), 0);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.3 * centerProj.scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 0;
        ctx.stroke();

        // Luminous Leading Head Spark
        const headPt = project(trackRadius * Math.cos(endAngle), trackRadius * Math.sin(endAngle), 0);

        // Expanding Soft Pulse Halo
        const pulse = 1 + Math.sin(time * 7) * 0.3;
        ctx.beginPath();
        ctx.arc(headPt.x, headPt.y, 6.5 * pulse * headPt.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.fill();

        // Solid Center Beacon Core
        ctx.beginPath();
        ctx.arc(headPt.x, headPt.y, 3.4 * headPt.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 14;
        ctx.fill();

        // Micro-sparks trailing the leading progress head in real-time
        for (let s = 0; s < 6; s++) {
          const trailOffset = (s + 1) * 0.05 + Math.sin(time * 8 + s) * 0.02;
          const trailAngle = endAngle - trailOffset;
          const r = trackRadius + (Math.sin(time * 6 + s * 2) - 0.5) * 7;
          const z = (Math.cos(time * 5 + s) - 0.5) * 6;
          const trailProj = project(r * Math.cos(trailAngle), r * Math.sin(trailAngle), z);

          ctx.beginPath();
          ctx.arc(trailProj.x, trailProj.y, Math.max(0.6, (1.3 - s * 0.18) * trailProj.scale), 0, Math.PI * 2);
          ctx.fillStyle = s % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(255, 255, 255, 0.9)';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        ctx.restore();
      }

      // 6. Orbital Celestial Sparks Gliding Along the Exact Same 3D Contour
      ctx.save();
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.angle += p.speed;

        const wave = Math.sin(p.angle * 2.5 + time * 2.2 + p.wavePhase) * 3.5;
        const r = trackRadius + p.radiusOffset + wave;
        const z = p.zOffset + Math.sin(p.angle * 2 + time * 2) * 5;

        const proj = project(r * Math.cos(p.angle), r * Math.sin(p.angle), z);

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        if (p.isAccent) {
          ctx.fillStyle = `rgba(56, 189, 248, ${p.brightness * 0.9})`;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 5;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.brightness * 0.75})`;
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 3;
        }
        ctx.fill();
      }
      ctx.restore();

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
  }, []);

  const paddedPercent = String(Math.min(100, Math.floor(progress))).padStart(3, '0');

  return (
    <div className="relative w-[220px] h-[220px] sm:w-[240px] sm:h-[240px] flex items-center justify-center select-none my-1">
      {/* 2D Canvas with DPR scaling */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />

      {/* Centered Readout: Bold Tabular Number only, ZERO subtitles, ZERO blinking lights */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-center">
        <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-white drop-shadow-[0_0_18px_rgba(56,189,248,0.45)] tabular-nums select-none">
          {paddedPercent}%
        </span>
      </div>
    </div>
  );
};

export default FutamuraParticleLoader;
