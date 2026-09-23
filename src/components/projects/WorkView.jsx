import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { ProjectVisualizerScene } from '../webgl/ProjectVisualizer';
import ProjectModal from './ProjectModal';
import { ExternalLink, Github, ChevronRight, Layers, Eye } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';

export const WorkView = () => {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const visualizerRef = useRef(null);

  const activeProject = portfolioData.projects[activeProjectIdx];

  const createScene = useCallback((container) => {
    const scene = new ProjectVisualizerScene(container, portfolioData.projects[0].visualType);
    visualizerRef.current = scene;
    return scene;
  }, []);

  const handleSelectProject = (index) => {
    if (index === activeProjectIdx) return;
    soundEngine.playWhoosh();
    setActiveProjectIdx(index);
    if (visualizerRef.current) {
      visualizerRef.current.setVisualType(portfolioData.projects[index].visualType);
    }
  };

  const handleOpenDetail = (project) => {
    soundEngine.playWhoosh();
    setSelectedProject(project);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-black flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              <span>FEATURED ENGINEERING WORK</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight uppercase">
              SELECTED PROJECTS.
            </h1>
          </div>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed font-normal">
            Production full-stack platforms, machine learning predictive models, and real-time systems engineered by Arav.
          </p>
        </div>

        {/* Spatial Project Workspace: 3D Visualizer (Left) + Project Dossier (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column: Interactive 3D Spatial Visualizer (7 cols) */}
          <div
            className="lg:col-span-7 relative min-h-[440px] sm:min-h-[520px] rounded-3xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8 shadow-2xl"
            data-cursor="DRAG"
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-black border border-white/10 px-3.5 py-1.5 rounded-full text-gray-200 font-medium font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
                <span>3D VISUALIZER: {activeProject.title.toUpperCase()}</span>
              </div>
              <span className="font-mono text-xs text-[#b46f32] font-bold">{activeProject.category}</span>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

            {/* Bottom Interaction Bar */}
            <div className="relative z-10 flex flex-wrap items-end justify-between gap-4 pt-28 pointer-events-auto">
              <div>
                <span className="text-xs font-mono font-semibold text-[#b46f32] tracking-wide block mb-1">
                  {activeProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-md">
                  {activeProject.title}
                </h3>
              </div>

              <MagneticWrapper strength={0.3}>
                <button
                  onClick={() => handleOpenDetail(activeProject)}
                  className="text-xs font-mono font-bold px-6 py-3 rounded-full bg-[#b46f32] text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Project</span>
                </button>
              </MagneticWrapper>
            </div>
          </div>

          {/* Right Column: Project Details & Selector Matrix (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
            {/* Active Project Highlight Card */}
            <div className="p-7 rounded-3xl bg-[#0a0a0c] border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-[#b46f32] font-bold">
                  {activeProject.category}
                </span>
                <span className="text-xs font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                  {activeProject.index}
                </span>
              </div>

              <h3 className="font-display font-bold text-2xl text-white">
                {activeProject.title}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed font-normal">
                {activeProject.shortDesc}
              </p>

              {/* Stats Highlights */}
              <div className="grid grid-cols-3 gap-2.5 py-2">
                {activeProject.stats.map((st, sIdx) => (
                  <div key={sIdx} className="p-2.5 rounded-xl bg-black border border-white/5 text-center">
                    <div className="font-mono font-bold text-sm text-[#b46f32]">{st.value}</div>
                    <div className="font-mono text-[9px] text-gray-400 uppercase mt-0.5">{st.label}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenDetail(activeProject)}
                  className="flex-1 py-3 rounded-full bg-white text-black font-mono font-bold text-xs hover:bg-[#b46f32] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>Explore Architecture</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {activeProject.githubLink && (
                  <a
                    href={activeProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full border border-white/15 bg-white/5 text-white hover:border-[#b46f32] hover:text-[#b46f32] transition-all"
                    title="View Source Code"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

                {activeProject.liveLink && (
                  <a
                    href={activeProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full border border-white/15 bg-white/5 text-white hover:border-[#b46f32] hover:text-[#b46f32] transition-all"
                    title="Open Live Deployment"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Switcher Tabs */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] text-gray-400 uppercase tracking-widest px-1">
                SWITCH PROJECT ENVIRONMENT
              </div>
              <div className="grid grid-cols-3 gap-2">
                {portfolioData.projects.map((proj, pIdx) => {
                  const isCur = activeProjectIdx === pIdx;
                  return (
                    <button
                      key={proj.id}
                      onClick={() => handleSelectProject(pIdx)}
                      className={`p-3 rounded-xl border font-mono text-xs text-left transition-all ${
                        isCur
                          ? 'bg-[#0a0a0c] border-[#b46f32] text-white font-bold shadow-lg'
                          : 'bg-black/60 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div className="text-[9px] text-[#b46f32] font-bold">{proj.index}</div>
                      <div className="truncate font-semibold mt-0.5">{proj.title.split(' ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => {
            soundEngine.playWhoosh();
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
};

export default WorkView;
