import React, { useEffect } from 'react';
import { X, ExternalLink, Github, CheckCircle2, Cpu, Check } from 'lucide-react';

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeInUp">
      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c12] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between gap-4 bg-[#12121c]/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-[#00f0ff] uppercase tracking-wider px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30">
                {project.category}
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-display font-bold text-white">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-colors"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          {/* Key Metric Highlights */}
          {project.stats && (
            <div className="grid grid-cols-3 gap-4">
              {project.stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-[#161622] border border-white/5 p-4 rounded-2xl text-center"
                >
                  <div className="font-display text-xl sm:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Project Summary */}
          <div>
            <h4 className="text-xs font-semibold text-[#00f0ff] uppercase tracking-wider mb-3">
              About the Project
            </h4>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
              {project.fullDesc}
            </p>
          </div>

          {/* Key Features */}
          {project.features && (
            <div>
              <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider mb-4">
                Key Features & Implementation
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, fIdx) => (
                  <div
                    key={fIdx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-300 leading-normal">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, tIdx) => (
                <span
                  key={tIdx}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#161622] border border-white/10 text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-6 sm:p-8 border-t border-white/10 bg-[#12121c]/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-6 py-3 rounded-full bg-[#00f0ff] text-black hover:bg-white transition-all flex items-center gap-2 shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Demo</span>
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium px-6 py-3 rounded-full border border-white/15 bg-white/5 text-white hover:border-white/40 transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
          </div>

          <button
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
