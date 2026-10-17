import React, { useState, useEffect, useRef, useCallback } from 'react';
import { portfolioData } from '../../data/portfolioData';
import { RefreshCw, Move, Sparkles, Sliders } from 'lucide-react';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { PortraitParticleScene } from '../webgl/PortraitParticleScene';
import { soundEngine } from '../../audio/soundEngine';

export const ExperimentsView = () => {
  const [activeExp, setActiveExp] = useState(0);
  const canvasRef = useRef(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const portraitSceneRef = useRef(null);

  const createPortraitScene = useCallback((container) => {
    const scene = new PortraitParticleScene(container, '/arav-portrait-hero.jpg');
    portraitSceneRef.current = scene;
    return scene;
  }, []);

  const handleToggleScatter = () => {
    soundEngine.playClick();
    if (portraitSceneRef.current) {
      portraitSceneRef.current.toggleScatter();
    }
  };

  useEffect(() => {
    if (activeExp === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight || 360;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.03;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      if (activeExp === 1) {
        // Azure & White Kinetic Particle Flow
        const cx = w / 2;
        const cy = h / 2;
        const count = 190;

        for (let i = 0; i < count; i++) {
          const angle = i * 0.15 + time * 0.8;
          const radius = (i * 0.95) + Math.sin(time + i * 0.1) * 22;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * (radius * 0.6);

          const alpha = Math.min(i / count, 0.9);
          ctx.fillStyle = i % 2 === 0 ? `rgba(7, 129, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 + Math.sin(time * 2 + i) * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeExp === 2) {
        // Procedural Wave Topology (Azure & White lines)
        const lines = 20;
        const step = h / lines;

        for (let i = 0; i < lines; i++) {
          ctx.beginPath();
          const yBase = i * step + 20;
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(7, 129, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 1.3;

          for (let x = 0; x < w; x += 8) {
            const wave1 = Math.sin((x * 0.02) + time + i * 0.3) * 18;
            const wave2 = Math.cos((x * 0.04) - time * 0.5) * 10;
            const y = yBase + wave1 + wave2;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      } else if (activeExp === 3) {
        // Neural Graph Mesh (Azure & Cyan nodes)
        const nodes = [
          { x: w * 0.25, y: h * 0.3 },
          { x: w * 0.45, y: h * 0.65 },
          { x: w * 0.7, y: h * 0.35 },
          { x: w * 0.8, y: h * 0.7 },
          { x: w * 0.35, y: h * 0.8 }
        ];

        ctx.strokeStyle = 'rgba(7, 129, 255, 0.3)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        nodes.forEach((n, idx) => {
          const pulse = Math.sin(time * 3 + idx) * 3;
          ctx.fillStyle = idx % 2 === 0 ? '#0781ff' : '#38bdf8';
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
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-transparent flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <span>Experiments</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Interactive Prototypes
            </h1>
          </div>

          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-normal">
            Experiments in GPU point clouds, mathematical wave simulations, and real-time WebGL graphics.
          </p>
        </div>

        {/* Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Big Centerpiece Visualizer (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl bg-[#0a0a0c]/80 border border-white/10 p-6 sm:p-8 flex flex-col justify-between min-h-[500px] sm:min-h-[560px] shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs bg-black/80 border border-white/10 px-4 py-1.5 rounded-full text-gray-200 font-mono">
                <span className="font-bold">{portfolioData.experiments[activeExp].title}</span>
              </div>

              <div className="flex items-center gap-2">
                {activeExp === 0 && (
                  <button
                    onClick={handleToggleScatter}
                    className="px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-blue-400" />
                    <span>Scatter / Reform</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setInteractionCount(prev => prev + 1);
                  }}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
                  title="Restart simulation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Big Interactive Viewport */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center bg-black">
              {activeExp === 0 ? (
                <div className="w-full h-full" data-cursor="interact">
                  <WebGLCanvas createScene={createPortraitScene} className="w-full h-full" />
                </div>
              ) : (
                <canvas ref={canvasRef} className="w-full h-full block" />
              )}
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-blue-400" />
                <span>Interactive 3D orbit & proximity physics enabled</span>
              </span>
              <span className="text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">60 FPS GLSL</span>
            </div>
          </div>

          {/* Experiment Selectors (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3 justify-between">
            {portfolioData.experiments.map((exp, idx) => {
              const isSelected = activeExp === idx;
              return (
                <div
                  key={exp.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveExp(idx);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`cursor-pointer p-4 sm:p-5 rounded-2xl transition-all duration-300 flex-1 flex flex-col justify-between backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#0f1422] border border-blue-500/50 shadow-[0_4px_20px_rgba(7,129,255,0.14)] ring-1 ring-blue-500/30'
                      : 'bg-[#0a0a0f]/80 border border-white/[0.07] hover:border-white/20 hover:bg-[#12131c]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-semibold text-blue-400">
                        {exp.category}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-blue-300 bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 rounded-md font-medium">
                          Active Lab
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-white text-base mb-1 tracking-tight">
                      {exp.title}
                    </h4>

                    <p className="text-xs text-gray-300 mb-2 leading-relaxed font-normal">
                      {exp.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                    {exp.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-gray-400"
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
    </div>
  );
};

export default ExperimentsView;
