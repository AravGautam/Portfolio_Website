import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import { RefreshCw, Move, Sparkles, Sliders, Zap, Waves, Radio, FlaskConical } from 'lucide-react';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { PortraitParticleScene } from '../webgl/PortraitParticleScene';
import { QuantumVortexScene } from '../webgl/QuantumVortexScene';
import { WaveTopologyScene } from '../webgl/WaveTopologyScene';
import { NeuralMeshScene } from '../webgl/NeuralMeshScene';
import VisitorSignatureGuestbook from './VisitorSignatureGuestbook';
import { soundEngine } from '../../audio/soundEngine';

export const ExperimentsView = () => {
  const [activeExp, setActiveExp] = useState(0);
  const currentSceneRef = useRef(null);
  const location = useLocation();

  // Scroll to hash target on mount or when hash changes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.hash]);

  // Instantiates the active 3D WebGL Three.js Scene
  const createScene = useCallback((container, renderer) => {
    let scene = null;
    if (activeExp === 0) {
      scene = new PortraitParticleScene(container, '/arav-portrait-hero.jpg');
    } else if (activeExp === 1) {
      scene = new QuantumVortexScene(container);
    } else if (activeExp === 2) {
      scene = new WaveTopologyScene(container);
    } else if (activeExp === 3) {
      scene = new NeuralMeshScene(container);
    }
    currentSceneRef.current = scene;
    return scene;
  }, [activeExp]);

  // Primary interactive trigger for active 3D model
  const handleTriggerAction = () => {
    soundEngine.playClick();
    const scene = currentSceneRef.current;
    if (!scene) return;

    if (activeExp === 0 && typeof scene.toggleScatter === 'function') {
      scene.toggleScatter();
    } else if (activeExp === 1 && typeof scene.triggerSupernova === 'function') {
      scene.triggerSupernova();
    } else if (activeExp === 2 && typeof scene.triggerPulse === 'function') {
      scene.triggerPulse();
    } else if (activeExp === 3 && typeof scene.triggerCascade === 'function') {
      scene.triggerCascade();
    }
  };

  const getActionBtnLabel = () => {
    switch (activeExp) {
      case 0:
        return { label: 'Scatter / Reform', icon: <Sliders className="w-3.5 h-3.5 text-cyan-400" /> };
      case 1:
        return { label: 'Supernova Explosion', icon: <Zap className="w-3.5 h-3.5 text-cyan-400" /> };
      case 2:
        return { label: 'Pulse Wave', icon: <Waves className="w-3.5 h-3.5 text-cyan-400" /> };
      case 3:
        return { label: 'Neural Cascade', icon: <Radio className="w-3.5 h-3.5 text-cyan-400" /> };
      default:
        return { label: 'Trigger Interaction', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> };
    }
  };

  const getStatusBarText = () => {
    switch (activeExp) {
      case 0:
        return 'Interactive 3D orbit & LiDAR depth dispersion enabled';
      case 1:
        return 'Singularity gravitational field & cursor deflection active';
      case 2:
        return 'Kinetic surface mesh & cursor proximity elevation active';
      case 3:
        return 'Synaptic network & electrical action potentials active';
      default:
        return 'Interactive 3D orbit & proximity physics enabled';
    }
  };

  const actionBtn = getActionBtnLabel();

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-transparent flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div id="labs" className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 scroll-mt-32">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span>Creative Labs</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Labs & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">Prototypes</span>
            </h1>
          </div>

          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-normal">
            Real-time WebGL experiments in GPU point clouds, gravitational singularity physics, procedural waveforms, and 3D synaptic neural meshes.
          </p>
        </div>

        {/* Experiment Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Big Centerpiece 3D Visualizer (8 cols) */}
          <div className="lg:col-span-8 relative rounded-3xl bg-[#0a0a0c]/85 border border-white/10 p-6 sm:p-8 flex flex-col justify-between min-h-[500px] sm:min-h-[560px] shadow-2xl overflow-hidden backdrop-blur-xl">
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs bg-black/80 border border-white/10 px-4 py-1.5 rounded-full text-gray-200 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-bold">{portfolioData.experiments[activeExp].title}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerAction}
                  className="px-4 py-1.5 rounded-full pill-btn-3d text-xs font-mono text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:border-cyan-400/40"
                  title="Trigger interactive physics action"
                >
                  {actionBtn.icon}
                  <span>{actionBtn.label}</span>
                </button>

                <button
                  onClick={() => {
                    handleTriggerAction();
                  }}
                  className="w-8 h-8 rounded-full pill-btn-3d flex items-center justify-center text-gray-300 hover:text-white transition-all cursor-pointer"
                  title="Trigger simulation impulse"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Big 3D WebGL Viewport */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center bg-black/90 shadow-inner">
              <div key={activeExp} className="w-full h-full cursor-grab active:cursor-grabbing" data-cursor="interact">
                <WebGLCanvas createScene={createScene} className="w-full h-full" />
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/5 text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-cyan-400" />
                <span>{getStatusBarText()}</span>
              </span>
              <span className="text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                60 FPS WebGL
              </span>
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
                    if (activeExp === idx) return;
                    soundEngine.playClick();
                    setActiveExp(idx);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`cursor-pointer p-4 sm:p-5 rounded-2xl transition-all duration-300 flex-1 flex flex-col justify-between backdrop-blur-md ${
                    isSelected
                      ? 'bg-[#0f172a] border border-cyan-500/50 shadow-[0_4px_24px_rgba(56,189,248,0.2)] ring-1 ring-cyan-500/40'
                      : 'bg-[#0a0a0f]/80 border border-white/[0.07] hover:border-white/20 hover:bg-[#12131c]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-semibold text-cyan-400">
                        {exp.category}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 rounded-md font-semibold">
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

        {/* Visitor Signature Guestbook & Remembrance Wall */}
        <div id="signatures" className="scroll-mt-28">
          <VisitorSignatureGuestbook />
        </div>
      </div>
    </div>
  );
};

export default ExperimentsView;
