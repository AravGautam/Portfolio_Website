import React from 'react';
import { portfolioData } from '../../data/portfolioData';
import { MapPin, ExternalLink, Sparkles } from 'lucide-react';
import Education from './Education';
import Achievements from './Achievements';

const About = () => {
  return (
    <section id="about" className="relative py-28 px-6 md:px-12 bg-[#07070a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-3">
              Background & Education
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              About Me
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-300 bg-[#0e0e14] border border-white/10 px-4 py-2 rounded-full font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>{portfolioData.personal.location}</span>
          </div>
        </div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Bio Statement & Education */}
          <div className="lg:col-span-7 space-y-8">
            {/* Bio Card */}
            <div className="p-8 rounded-3xl bg-[#0e0e14]/70 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00f0ff] uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Career Focus & Background</span>
              </div>
              <h3 className="font-display font-bold text-2xl text-white mb-4">
                Full-Stack Engineer with an AI & Systems Focus
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                Computer Science student with hands-on experience in MERN stack development, algorithms, and machine learning concepts. Passionate about building efficient, user-focused applications and solving challenging engineering problems through clean, maintainable code.
              </p>

              {/* Status Indicator */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-xs text-gray-300 font-medium">
                  {portfolioData.personal.status}
                </span>
              </div>
            </div>

            {/* Education Card */}
            <Education />
          </div>

          {/* Right Column (5 cols): Milestones & Verified Resume */}
          <div className="lg:col-span-5 space-y-8">
            <Achievements />

            {/* Resume Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0e0e14] to-[#141026] border border-white/10 hover:border-white/30 transition-all duration-300 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                    Official Document
                  </span>
                  <span className="text-[11px] text-gray-400">PDF • Verified</span>
                </div>
                <h4 className="font-display font-bold text-xl text-white mb-2">
                  Technical Résumé
                </h4>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed font-normal">
                  Detailed summary of academic records, production code repositories, algorithmic problem-solving certifications, and technical proficiencies.
                </p>
              </div>

              <a
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-xs font-semibold py-3.5 px-6 rounded-full bg-white text-black hover:bg-[#00f0ff] transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Open Resume (Google Drive)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;