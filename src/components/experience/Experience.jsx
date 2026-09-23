import React, { useCallback } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { ExperienceScene } from '../webgl/ExperienceScene';
import { Briefcase, GraduationCap, Award, Compass, Code, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const Experience = () => {
  const createScene = useCallback((container) => {
    return new ExperienceScene(container);
  }, []);

  return (
    <section id="experience" className="relative min-h-screen py-28 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5" />
              <span>EXPERIENCE, INTERNSHIPS & MILESTONES</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
              JOURNEY & EXPERIENCE.
            </h2>
          </div>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed font-normal">
            Production backend engineering at Dream Filler Company, academic computer science foundations, and algorithmic milestones.
          </p>
        </div>

        {/* 3D Career Highway + Structured Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: 3D Road of Career Journey (5 cols - Full Section Height) */}
          <div className="lg:col-span-5 relative min-h-[580px] lg:h-full lg:min-h-0 rounded-3xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-7 shadow-2xl">
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <span className="font-mono text-xs text-[#b46f32] bg-black px-3.5 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>CAREER HIGHWAY // 3D ROAD OF JOURNEY</span>
              </span>
              <span className="font-mono text-xs text-gray-400">2023 — PRESENT</span>
            </div>

            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

            <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/5 font-mono text-[11px] text-gray-400 pointer-events-none">
              <span>VITS CSE → DREAM FILLER INTERN</span>
              <span className="text-[#b46f32] font-bold">BACKEND ENGINEERING</span>
            </div>
          </div>

          {/* Right Column: Timeline Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Premier Current Internship Card: Dream Filler Company */}
            {portfolioData.experience && portfolioData.experience.map((exp) => (
              <div
                key={exp.id}
                onMouseEnter={() => soundEngine.playHover()}
                className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0c] border border-[#b46f32]/40 hover:border-[#b46f32] transition-all duration-300 shadow-2xl space-y-4 group relative overflow-hidden"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#b46f32]/15 border border-[#b46f32]/30 text-[#b46f32]">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-lg sm:text-xl text-white">
                          {exp.role}
                        </h3>
                        <span className="inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </div>
                      <div className="font-mono text-xs text-[#b46f32] font-semibold">
                        {exp.company}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono text-xs text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full font-bold border border-emerald-400/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    CURRENT INTERNSHIP
                  </span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-normal">
                  {exp.description}
                </p>

                <ul className="space-y-2 text-xs text-gray-300 font-normal pt-1 border-t border-white/5">
                  {exp.highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#b46f32] shrink-0 mt-0.5" />
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
              className="p-6 sm:p-7 rounded-3xl bg-[#0a0a0c] border border-white/10 hover:border-[#b46f32]/40 transition-all duration-300 shadow-xl space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#b46f32]/10 text-[#b46f32]">
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

                <span className="font-mono text-xs text-[#b46f32] bg-[#b46f32]/10 px-3 py-1 rounded-full font-bold border border-[#b46f32]/25">
                  CGPA {portfolioData.education.cgpa}
                </span>
              </div>

              <div className="font-mono text-[11px] text-[#b46f32] tracking-wider font-semibold">
                DURATION: {portfolioData.education.duration}
              </div>

              <ul className="space-y-2 text-xs text-gray-300 font-normal pt-1">
                {portfolioData.education.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32] mt-1.5 flex-shrink-0" />
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
                  className="p-5 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-[#b46f32]/40 transition-all duration-300 space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#b46f32] uppercase tracking-wider font-semibold">
                      {ach.category}
                    </span>
                    <Award className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#b46f32] transition-colors" />
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
            <div className="p-4 rounded-2xl bg-[#0a0a0c] border border-white/10 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5 text-gray-300">
                <Code className="w-4 h-4 text-[#b46f32]" />
                <span>DSA REPOSITORY: LeetCode, Codeforces, GeeksforGeeks</span>
              </div>
              <span className="text-[#b46f32] font-bold">200+ SOLVED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
