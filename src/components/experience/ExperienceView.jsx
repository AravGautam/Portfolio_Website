import React, { useCallback } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { ExperienceScene } from '../webgl/ExperienceScene';
import { Briefcase, GraduationCap, Award, Compass, Code, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const ExperienceView = () => {
  const createScene = useCallback((container) => {
    return new ExperienceScene(container);
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-transparent flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0781ff]" />
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
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-xs text-blue-400 bg-black/80 px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Career Trajectory</span>
              </span>
              <span className="font-mono text-xs text-gray-400">2023 — Present</span>
            </div>

            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

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
                onMouseEnter={() => soundEngine.playHover()}
                className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0c]/80 border border-blue-500/30 hover:border-blue-400 transition-all duration-300 shadow-2xl space-y-4 group relative overflow-hidden backdrop-blur-md"
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
                        <span className="inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </div>
                      <div className="font-mono text-xs text-blue-400 font-semibold">
                        {exp.company}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full font-bold border border-emerald-400/30 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Current Role
                  </span>
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
                      className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Education Milestone Card */}
            <div
              onMouseEnter={() => soundEngine.playHover()}
              className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0c]/80 border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-2xl space-y-4 group backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {portfolioData.education.degree}
                    </h3>
                    <div className="font-mono text-xs text-gray-400">
                      {portfolioData.education.institution}
                    </div>
                  </div>
                </div>

                <span className="font-mono text-xs text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full font-bold border border-blue-500/20">
                  CGPA {portfolioData.education.cgpa}
                </span>
              </div>

              <div className="font-mono text-[11px] text-blue-400 tracking-wider font-semibold">
                Duration: {portfolioData.education.duration}
              </div>

              <ul className="space-y-2 text-xs text-gray-300 font-normal pt-1">
                {portfolioData.education.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0781ff] mt-1.5 flex-shrink-0" />
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
