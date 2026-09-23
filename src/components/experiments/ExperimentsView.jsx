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
    const scene = new PortraitParticleScene(container, '/arav-developer-hero.jpg');
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
        // Bronze & White Kinetic Particle Flow
        const cx = w / 2;
        const cy = h / 2;
        const count = 190;

        for (let i = 0; i < count; i++) {
          const angle = i * 0.15 + time * 0.8;
          const radius = (i * 0.95) + Math.sin(time + i * 0.1) * 22;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * (radius * 0.6);

          const alpha = Math.min(i / count, 0.9);
          ctx.fillStyle = i % 2 === 0 ? `rgba(180, 111, 50, ${alpha})` : `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.beginPath();
          ctx.arc(x, y, 2 + Math.sin(time * 2 + i) * 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (activeExp === 2) {
        // Procedural Wave Topology (Bronze & White lines)
        const lines = 20;
        const step = h / lines;

        for (let i = 0; i < lines; i++) {
          ctx.beginPath();
          const yBase = i * step + 20;
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(180, 111, 50, 0.6)' : 'rgba(255, 255, 255, 0.35)';
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
        // Neural Graph Mesh (Orange & Navy nodes)
        const nodes = [
          { x: w * 0.25, y: h * 0.3 },
          { x: w * 0.45, y: h * 0.65 },
          { x: w * 0.7, y: h * 0.35 },
          { x: w * 0.8, y: h * 0.7 },
          { x: w * 0.35, y: h * 0.8 }
        ];

        ctx.strokeStyle = 'rgba(29, 78, 216, 0.3)';
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
          ctx.fillStyle = idx % 2 === 0 ? '#b46f32' : '#3b82f6';
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
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-black flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CREATIVE CODE & GRAPHICS SANDBOX</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-display font-extrabold text-white tracking-tight uppercase">
              TECHNICAL LABORATORY.
            </h1>
          </div>

          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-normal">
            Experiments in GPU point-clouds, mathematical wave manifolds, volumetric depth, and real-time graphics.
          </p>
        </div>

        {/* Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Big Centerpiece Visualizer (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl bg-[#0a0a0c] border border-white/10 p-6 sm:p-8 flex flex-col justify-between min-h-[500px] sm:min-h-[560px] shadow-2xl overflow-hidden">
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs bg-black/80 border border-white/10 px-4 py-1.5 rounded-full text-gray-300 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
                <span className="font-bold">EXPERIMENT: {portfolioData.experiments[activeExp].title.toUpperCase()}</span>
              </div>

              <div className="flex items-center gap-2">
                {activeExp === 0 && (
                  <button
                    onClick={handleToggleScatter}
                    className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#b46f32]/10 border border-[#b46f32]/40 text-[#b46f32] hover:bg-[#b46f32] hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Scatter / Reform</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setInteractionCount(prev => prev + 1);
                  }}
                  className="text-xs p-2.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors"
                  title="Restart simulation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Big Interactive Viewport */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center bg-black">
              {activeExp === 0 ? (
                <div className="w-full h-full" data-cursor="DRAG">
                  <WebGLCanvas createScene={createPortraitScene} className="w-full h-full" />
                </div>
              ) : (
                <canvas ref={canvasRef} className="w-full h-full block" />
              )}
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#b46f32]" />
                <span>Interactive 3D orbit & proximity physics enabled</span>
              </span>
              <span className="text-[#b46f32] font-bold">60 FPS GLSL</span>
            </div>
          </div>

          {/* Experiment Selectors (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 justify-between">
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
                  className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex-1 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0a0a0c] border-[#b46f32]/60 shadow-xl shadow-[#b46f32]/15 scale-[1.01]'
                      : 'bg-[#0a0a0c]/50 border-white/5 hover:border-white/20 hover:bg-[#0a0a0c]/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-[#b46f32]">
                        {exp.category}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-white bg-[#b46f32] px-2.5 py-0.5 rounded-full font-bold">
                          ACTIVE LAB
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-bold text-white text-base mb-1">
                      {exp.title}
                    </h4>

                    <p className="text-xs text-gray-300 mb-2 leading-relaxed font-normal">
                      {exp.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {exp.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
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
