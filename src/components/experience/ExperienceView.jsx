import React, { useState, useRef, useCallback } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { ExperienceScene } from '../webgl/ExperienceScene';
import { Briefcase, GraduationCap, Award, Code, CheckCircle2, X } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const ExperienceView = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const sceneRef = useRef(null);

  const createScene = useCallback((container) => {
    const scene = new ExperienceScene(container, {
      onSelectMilestone: (milestone) => {
        setSelectedMilestone(milestone);
      }
    });
    sceneRef.current = scene;
    return scene;
  }, []);

  const handleCloseMilestone = () => {
    soundEngine.playClick();
    setSelectedMilestone(null);
    sceneRef.current?.clearSelection();
  };

  const handleCardClick = (milestoneId) => {
    soundEngine.playClick();
    sceneRef.current?.selectMilestone(milestoneId);
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-transparent flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <span>Experience</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Work & Experience
            </h1>
          </div>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed font-normal">
            Backend engineering at Dream Filler Company, computer science education, and problem solving.
          </p>
        </div>

        {/* 3D Timeline Visualizer + Structured Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Road of Career Journey (5 cols - Full Section Height) */}
          <div className="lg:col-span-5 relative min-h-[580px] lg:h-full lg:min-h-0 rounded-3xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-7 card-cyber-static">
            {/* Top Bar Header */}
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-xs text-blue-400 bg-black/80 px-3.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 shadow-md">
                <span>Career Trajectory</span>
              </span>
              <span className="font-mono text-xs text-gray-400 bg-black/60 px-2.5 py-1.5 rounded-lg border border-white/5">
                Interactive Highway
              </span>
            </div>

            {/* WebGL 3D Scenic Highway Canvas */}
            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

            {/* Interactive Milestone Detail Inspection Modal Overlay */}
            {selectedMilestone && (
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                className="relative z-20 my-auto p-5 sm:p-6 rounded-2xl bg-[#0b0d14]/95 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl space-y-3.5 animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/30 rounded-xl flex flex-col items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[9px] font-mono font-bold text-blue-400 tracking-wider uppercase leading-none">
                        {selectedMilestone.badgeTop || 'STEP'}
                      </span>
                      <span className="text-base font-bold text-white leading-tight font-mono mt-0.5">
                        {selectedMilestone.badgeNum || '1'}
                      </span>
                    </div>

                    <div>
                      <span className="font-mono text-xs font-semibold text-blue-400 tracking-wider block">
                        {selectedMilestone.epoch}
                      </span>
                      <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight leading-snug mt-0.5">
                        {selectedMilestone.title}
                      </h3>
                      <div className="font-mono text-xs text-gray-400">
                        {selectedMilestone.subtitle}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCloseMilestone}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white shrink-0 cursor-pointer transition-colors"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-200 leading-relaxed font-normal">
                  {selectedMilestone.details?.summary || selectedMilestone.desc}
                </p>

                {selectedMilestone.details?.bullets && (
                  <ul
                    data-lenis-prevent="true"
                    onWheel={(e) => e.stopPropagation()}
                    className="space-y-2 text-xs text-gray-300 border-t border-white/10 pt-2.5 max-h-[240px] overflow-y-auto overscroll-contain pr-1"
                  >
                    {selectedMilestone.details.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {selectedMilestone.details?.tags && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                    {selectedMilestone.details.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end pt-1">
                  <button
                    onClick={handleCloseMilestone}
                    className="text-xs font-mono px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Footer Bar */}
            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[11px] text-gray-400 pointer-events-none">
              <span>VITS CSE → Dream Filler Intern</span>
              <span className="text-blue-400 font-bold">Backend Engineering</span>
            </div>
          </div>

          {/* Right Column: Timeline Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Premier Current Internship Card: Dream Filler Company */}
            {portfolioData.experience && portfolioData.experience.map((exp) => (
              <div
                key={exp.id}
                onClick={() => handleCardClick('dream-filler')}
                onMouseEnter={() => soundEngine.playHover()}
                className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0c]/80 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 shadow-2xl space-y-4 group relative overflow-hidden backdrop-blur-md cursor-pointer"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                          {exp.role}
                        </h3>
                      </div>
                      <div className="font-mono text-xs text-blue-400 font-semibold">
                        {exp.company}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-lg font-bold border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
                      Current Role
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  {exp.description}
                </p>

                <ul className="space-y-2 text-xs text-gray-300 font-normal pt-1 border-t border-white/5">
                  {exp.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {exp.skills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Education Milestone Card */}
            <div
              onClick={() => handleCardClick('vits-cse')}
              onMouseEnter={() => soundEngine.playHover()}
              className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0c]/80 border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-2xl space-y-4 group backdrop-blur-md cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0 mt-0.5 sm:mt-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="font-display font-bold text-base sm:text-lg text-white">
                        {portfolioData.education.degree}
                      </h3>
                      <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg font-bold border border-blue-500/20 whitespace-nowrap shrink-0 inline-flex items-center">
                        CGPA {portfolioData.education.cgpa}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-gray-400 mt-1">
                      {portfolioData.education.institution}
                    </div>
                  </div>
                </div>
              </div>

              <div className="font-mono text-[11px] text-blue-400 tracking-wider font-semibold">
                Duration: {portfolioData.education.duration}
              </div>

              <ul className="space-y-2 text-xs text-gray-300 font-normal pt-1">
                {portfolioData.education.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Achievements & Problem Solving Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {portfolioData.achievements.filter(a => a.category !== 'Professional Experience').map((ach, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => soundEngine.playHover()}
                  className="p-5 rounded-2xl bg-[#0a0a0c]/80 border border-white/5 hover:border-blue-500/30 transition-all duration-300 space-y-2 group backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                      {ach.category}
                    </span>
                    <Award className="w-3.5 h-3.5 text-gray-500 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <h4 className="font-display font-bold text-sm text-white">
                    {ach.title}
                  </h4>

                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {ach.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Competitive Programming Badge */}
            <div className="p-4 rounded-2xl bg-[#0a0a0c]/80 border border-white/10 flex items-center justify-between text-xs font-mono shadow-md backdrop-blur-md">
              <div className="flex items-center gap-2.5 text-gray-300">
                <Code className="w-4 h-4 text-blue-400" />
                <span>DSA Practice: LeetCode, Codeforces, GeeksforGeeks</span>
              </div>
              <span className="text-blue-400 font-bold">200+ Solved</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExperienceView;
