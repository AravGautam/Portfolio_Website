import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { ProjectVisualizerScene } from '../webgl/ProjectVisualizer';
import ProjectModal from './ProjectModal';
import { ExternalLink, Github, ArrowRight, Eye, ChevronRight } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';

const Projects = () => {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const visualizerRef = useRef(null);

  const activeProject = portfolioData.projects[activeProjectIndex];

  const createScene = useCallback((container) => {
    const scene = new ProjectVisualizerScene(container, portfolioData.projects[0].visualType);
    visualizerRef.current = scene;
    return scene;
  }, []);

  const handleSelectProject = (index) => {
    if (index === activeProjectIndex) return;
    soundEngine.playWhoosh();
    setActiveProjectIndex(index);
    if (visualizerRef.current) {
      visualizerRef.current.setVisualType(portfolioData.projects[index].visualType);
    }
  };

  const handleOpenModal = (project) => {
    soundEngine.playWhoosh();
    setSelectedProject(project);
  };

  return (
    <section id="projects" className="relative py-28 px-6 md:px-12 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b46f32]" />
              <span>FEATURED WORK</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Selected Projects & Systems
            </h2>
          </div>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed font-normal">
            Production full-stack platforms, machine learning predictive models, and real-time WebSocket applications.
          </p>
        </div>

        {/* Interactive 3D Showcase Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column: Interactive 3D Visualizer Screen (7 cols) */}
          <div
            className="lg:col-span-7 relative rounded-3xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8 min-h-[440px] shadow-2xl"
            data-cursor="DRAG"
          >
            {/* Top Scene Badge */}
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-black border border-white/10 px-3.5 py-1.5 rounded-full text-gray-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
                <span>3D Interactive Visualizer</span>
              </div>

              <div className="text-xs text-gray-300 bg-black border border-white/10 px-3.5 py-1.5 rounded-full font-mono">
                {activeProject.category}
              </div>
            </div>

            {/* 3D WebGL Canvas Layer */}
            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

            {/* Bottom Scene Controller & Expand Trigger */}
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
                  onClick={() => handleOpenModal(activeProject)}
                  className="text-xs font-mono font-bold px-6 py-3 rounded-full bg-[#b46f32] text-white hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Project</span>
                </button>
              </MagneticWrapper>
            </div>
          </div>

          {/* Right Column: Project Selector Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {portfolioData.projects.map((proj, idx) => {
              const isSelected = activeProjectIndex === idx;
              return (
                <div
                  key={proj.id}
                  onClick={() => handleSelectProject(idx)}
                  onMouseEnter={() => soundEngine.playHover()}
                  data-cursor="SELECT"
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#0a0a0c] border-[#b46f32] shadow-xl'
                      : 'bg-black/60 border-white/5 hover:border-white/20 hover:bg-[#0a0a0c]'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#b46f32]" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-semibold text-[#b46f32]">
                      {proj.category}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-mono font-medium text-[#b46f32] flex items-center gap-1">
                        <span>Viewing in 3D</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-display font-bold text-white mb-2 group-hover:text-[#b46f32] transition-colors">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-gray-300 mb-4 line-clamp-2 leading-relaxed font-normal">
                    {proj.shortDesc}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tags.slice(0, 4).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {proj.tags.length > 4 && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full text-gray-400">
                        +{proj.tags.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-4 pt-3 border-t border-white/5">
                    {proj.githubLink && (
                      <a
                        href={proj.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => soundEngine.playHover()}
                        className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors font-medium font-mono"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Source Code</span>
                      </a>
                    )}
                    {proj.liveLink && (
                      <a
                        href={proj.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => soundEngine.playHover()}
                        className="flex items-center gap-1.5 text-xs text-[#b46f32] hover:text-white transition-colors font-medium font-mono"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global GitHub CTA */}
        <div className="text-center pt-8 border-t border-white/5">
          <MagneticWrapper strength={0.25}>
            <a
              href="https://github.com/AravGautam"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              className="inline-flex items-center gap-2 text-xs font-mono font-semibold px-8 py-4 rounded-full border border-white/15 hover:border-[#b46f32]/50 bg-[#0a0a0c] hover:bg-white/5 text-white transition-all duration-300 group shadow-lg"
            >
              <Github className="w-4 h-4 text-[#b46f32]" />
              <span>Explore All Projects on GitHub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#b46f32]" />
            </a>
          </MagneticWrapper>
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
    </section>
  );
};

export default Projects;