import React, { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { Sparkles, RefreshCw } from 'lucide-react';

const Experiments = () => {
  const [activeExp, setActiveExp] = useState(0);
  const canvasRef = useRef(null);
  const [interactionCount, setInteractionCount] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight || 320;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      // Clean dark canvas fill
      ctx.fillStyle = '#0a0a10';
      ctx.fillRect(0, 0, w, h);

      if (activeExp === 0) {
        // Kinetic Particle Flow
        const cx = w / 2;
        const cy = h / 2;
        const count = 180;

        for (let i = 0; i < count; i++) {
          const angle = i * 0.15 + time * 0.8;
          const radius = (i * 0.9) + Math.sin(time + i * 0.1) * 20;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * (radius * 0.6);

          const alpha = Math.min(i / count, 0.9);
          ctx.fillStyle = i % 2 === 0 ? `rgba(0, 240, 255, ${alpha})` : `rgba(139, 92, 246, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.8 + Math.sin(time * 2 + i) * 1, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeExp === 1) {
        // Wave Topology
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
        ctx.lineWidth = 1.2;

        const lines = 18;
        const step = h / lines;

        for (let i = 0; i < lines; i++) {
          ctx.beginPath();
          const yBase = i * step + 20;

          for (let x = 0; x < w; x += 8) {
            const wave1 = Math.sin((x * 0.02) + time + i * 0.3) * 16;
            const wave2 = Math.cos((x * 0.04) - time * 0.5) * 8;
            const y = yBase + wave1 + wave2;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else {
        // Neural Graph Mesh
        const nodes = [
          { x: w * 0.25, y: h * 0.3 },
          { x: w * 0.45, y: h * 0.6 },
          { x: w * 0.7, y: h * 0.35 },
          { x: w * 0.8, y: h * 0.7 },
          { x: w * 0.35, y: h * 0.8 }
        ];

        // Draw connections
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Draw nodes
        nodes.forEach((n, idx) => {
          const pulse = Math.sin(time * 3 + idx) * 3;
          ctx.fillStyle = idx % 2 === 0 ? '#00f0ff' : '#8b5cf6';
          ctx.beginPath();
          ctx.arc(n.x, n.y, 6 + pulse, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [activeExp, interactionCount]);

  return (
    <section id="experiments" className="relative py-28 px-6 md:px-12 bg-[#07070a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-3">
              Creative Sandbox
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Interactive Lab
            </h2>
          </div>

          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-normal">
            Small interactive experiments exploring creative coding, mathematical waveforms, and real-time graphics.
          </p>
        </div>

        {/* Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Active Canvas (7 cols) */}
          <div className="lg:col-span-7 relative rounded-3xl bg-[#0e0e14]/90 border border-white/10 p-6 flex flex-col justify-between min-h-[380px] shadow-2xl overflow-hidden">
            <div className="relative z-10 flex items-center justify-between pointer-events-none mb-4">
              <div className="flex items-center gap-2 text-xs bg-black/70 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                <span>{portfolioData.experiments[activeExp].title}</span>
              </div>

              <button
                onClick={() => setInteractionCount(prev => prev + 1)}
                className="pointer-events-auto text-xs p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                title="Restart simulation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Interactive Canvas */}
            <div className="relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-white/5">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400">
              <span>Real-Time Canvas Simulation</span>
              <span className="text-[#00f0ff] font-medium">Active</span>
            </div>
          </div>

          {/* Experiment Selectors (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {portfolioData.experiments.map((exp, idx) => {
              const isSelected = activeExp === idx;
              return (
                <div
                  key={exp.id}
                  onClick={() => setActiveExp(idx)}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#0e0e14] border-[#00f0ff]/50 shadow-xl shadow-[#00f0ff]/10 scale-[1.01]'
                      : 'bg-[#0e0e14]/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#00f0ff]">
                      {exp.category}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-black bg-[#00f0ff] px-2 py-0.5 rounded-full font-bold">
                        Active
                      </span>
                    )}
                  </div>

                  <h4 className="font-display font-bold text-white text-base mb-1.5">
                    {exp.title}
                  </h4>

                  <p className="text-xs text-gray-400 mb-3 leading-relaxed font-normal">
                    {exp.desc}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experiments;
