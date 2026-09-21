import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { ProjectVisualizerScene } from '../webgl/ProjectVisualizer';
import ProjectModal from './ProjectModal';
import { ExternalLink, Github, ArrowRight, Eye, ChevronRight } from 'lucide-react';

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
    setActiveProjectIndex(index);
    if (visualizerRef.current) {
      visualizerRef.current.setVisualType(portfolioData.projects[index].visualType);
    }
  };

  return (
    <section id="projects" className="relative py-28 px-6 md:px-12 bg-[#07070a] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-3">
              Featured Work
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Selected Projects & Systems
            </h2>
          </div>

          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-normal">
            An interactive showcase of full-stack engineering, machine learning predictive models, and real-time WebSocket applications.
          </p>
        </div>

        {/* Interactive 3D Showcase Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column: Interactive 3D Visualizer Screen (7 cols) */}
          <div className="lg:col-span-7 relative rounded-3xl bg-[#0e0e14]/90 border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-8 min-h-[440px] shadow-2xl">
            {/* Top Scene Badge */}
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-black/60 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md text-gray-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
                <span>3D Interactive Environment</span>
              </div>

              <div className="text-xs text-gray-400 bg-black/60 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
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
                <span className="text-xs font-semibold text-[#00f0ff] tracking-wide block mb-1">
                  {activeProject.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white drop-shadow-md">
                  {activeProject.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedProject(activeProject)}
                className="text-xs font-semibold px-6 py-3 rounded-full bg-white text-black hover:bg-[#00f0ff] hover:shadow-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Project</span>
              </button>
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
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-[#0e0e14] border-[#00f0ff]/50 shadow-xl shadow-[#00f0ff]/10'
                      : 'bg-[#0e0e14]/50 border-white/5 hover:border-white/20 hover:bg-[#0e0e14]/80'
                  }`}
                >
                  {/* Active Indicator Bar */}
                  {isSelected && (
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#00f0ff] to-[#8b5cf6]" />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#00f0ff]">
                      {proj.category}
                    </span>
                    {isSelected && (
                      <span className="text-[11px] font-medium text-[#00f0ff] flex items-center gap-1">
                        <span>Viewing in 3D</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-display font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                    {proj.title}
                  </h4>

                  <p className="text-xs text-gray-400 mb-4 line-clamp-2 leading-relaxed font-normal">
                    {proj.shortDesc}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tags.slice(0, 4).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {proj.tags.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full text-gray-400">
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
                        className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white transition-colors font-medium"
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
                        className="flex items-center gap-1.5 text-xs text-[#00f0ff] hover:text-white transition-colors font-medium"
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
          <a
            href="https://github.com/AravGautam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold px-8 py-4 rounded-full border border-white/15 hover:border-white/40 bg-[#0e0e14] hover:bg-white/5 text-white transition-all duration-300 group shadow-lg"
          >
            <Github className="w-4 h-4 text-[#00f0ff]" />
            <span>Explore All Projects on GitHub</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#00f0ff]" />
          </a>
        </div>
      </div>

      {/* Expanded Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

export default Projects;