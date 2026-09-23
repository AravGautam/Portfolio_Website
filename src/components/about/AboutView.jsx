import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { SkillsConstellationScene } from '../webgl/SkillsConstellation3D';
import Education from './Education';
import Achievements from './Achievements';
import { Terminal, Shield, Cpu, Code2, Sparkles, ExternalLink, MapPin, CheckCircle2, Layers, Database, Code, Brain } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';

export const AboutView = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const constellationRef = useRef(null);

  const createScene = useCallback((container) => {
    const scene = new SkillsConstellationScene(container, portfolioData.skillCategories);
    constellationRef.current = scene;
    return scene;
  }, []);

  const categoryFrequencies = {
    all: 440,
    languages: 528,
    frontend: 639,
    backend: 741,
    database: 852,
    ai_data: 963
  };

  const handleCategoryClick = (catId) => {
    soundEngine.playClick();
    if (typeof soundEngine.playNote === 'function') {
      soundEngine.playNote(categoryFrequencies[catId] || 528);
    }
    setActiveCategory(catId);
    if (constellationRef.current) {
      constellationRef.current.highlightCategory(catId === 'all' ? null : catId);
    }
  };


  const getCategoryIcon = (id) => {
    switch (id) {
      case 'languages': return <Code className="w-3.5 h-3.5 text-[#b46f32]" />;
      case 'frontend': return <Layers className="w-3.5 h-3.5 text-[#c27a3c]" />;
      case 'backend': return <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />;
      case 'database': return <Database className="w-3.5 h-3.5 text-[#60a5fa]" />;
      case 'ai_data': return <Brain className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-[#b46f32]" />;
    }
  };

  const filteredSkills = activeCategory === 'all'
    ? portfolioData.skillCategories.flatMap(c => c.skills)
    : portfolioData.skillCategories.find(c => c.id === activeCategory)?.skills || [];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-black flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              <span>TECHNICAL IDENTITY & ARCHITECTURE</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight uppercase">
              ABOUT ARAV GAUTAM.
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#0a0a0c] border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-[#b46f32]" />
            <span>{portfolioData.personal.location}</span>
          </div>
        </div>

        {/* Profile Dossier + Bio Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column (5 cols): Clean Developer Profile & Visual Dossier */}
          <div className="lg:col-span-5 relative rounded-3xl bg-[#0a0a0c] border border-white/10 overflow-hidden flex flex-col justify-between p-6 sm:p-7 shadow-2xl">
            {/* Top Telemetry Tag */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs bg-black border border-white/10 px-3.5 py-1.5 rounded-full text-gray-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
                <span className="font-mono text-[11px]">DEVELOPER DOSSIER</span>
              </div>
              <span className="font-mono text-[11px] text-[#b46f32] bg-[#b46f32]/10 px-3 py-1 rounded-full border border-[#b46f32]/25">
                VITS CSE '27
              </span>
            </div>

            {/* Profile Photo Display - Proportionate, Uncropped, Executive Portrait */}
            <div className="relative my-2 w-full max-w-[280px] sm:max-w-[310px] mx-auto aspect-[4/5] rounded-2xl overflow-hidden flex items-center justify-center bg-black border border-white/10 group shadow-xl">
              <img
                src="/arav-formal-dark.jpg"
                alt="Arav Gautam - Backend Engineer"
                className="w-full h-full object-cover object-top filter brightness-100 contrast-105 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Bottom Developer Quick Facts Grid */}
            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-400 block text-[10px] uppercase">Current Role</span>
                <span className="text-[#b46f32] font-bold text-[11px] mt-0.5 block truncate">Backend Intern</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-400 block text-[10px] uppercase">Company</span>
                <span className="text-emerald-400 font-bold text-[11px] mt-0.5 flex items-center gap-1 truncate">
                  <CheckCircle2 className="w-3 h-3 shrink-0" /> Dream Filler
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-400 block text-[10px] uppercase">Focus</span>
                <span className="text-gray-200 font-bold text-[11px] mt-0.5 block truncate">Scalable APIs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="text-gray-400 block text-[10px] uppercase">Specialty</span>
                <span className="text-sky-400 font-bold text-[11px] mt-0.5 block truncate">Systems & 3D</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Bio Statement & Trajectory */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0a0a0c] border border-white/10 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#b46f32] uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Career Focus & Trajectory</span>
              </div>

              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
                Backend Engineer & Systems Architect
              </h3>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                {portfolioData.personal.bio}
              </p>

              {/* 3 Metrics Highlight Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mb-6">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#b46f32]/40 transition-colors">
                  <div className="text-base sm:text-lg font-display font-bold text-[#b46f32]">Dream Filler</div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">Backend Intern</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors">
                  <div className="text-xl sm:text-2xl font-display font-bold text-white">200+</div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">DSA Solved</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 col-span-2 sm:col-span-1 hover:border-blue-500/30 transition-colors">
                  <div className="text-xl sm:text-2xl font-display font-bold text-[#60a5fa]">7.8</div>
                  <div className="text-xs font-mono text-gray-400 mt-0.5">CGPA (VITS)</div>
                </div>
              </div>

              {/* Core Architectural Pillars */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 block">Engineering Pillars</span>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200">
                    ⚡ High-Throughput REST APIs
                  </span>
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200">
                    🗄️ Relational & NoSQL Schema Design
                  </span>
                  <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-gray-200">
                    🌐 Real-Time WebSockets & Three.js
                  </span>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-gray-300 font-medium">
                {portfolioData.personal.status}
              </span>
            </div>
          </div>
        </div>

        {/* 3D Skills Constellation Interactive Matrix */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#b46f32]" />
                <span>TECHNICAL EXPERTISE</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                Skills & Technologies
              </h2>
            </div>
            <p className="text-xs font-mono text-gray-400">
              Interactive 3D map of languages, frameworks, runtime engines, and architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* 3D Constellation Viewport (5 cols) */}
            <div
              className="lg:col-span-5 relative rounded-3xl bg-[#0a0a0c] border border-white/10 p-6 flex flex-col justify-between min-h-[380px] shadow-2xl overflow-hidden"
              data-cursor="NODE"
            >
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 text-xs bg-black/70 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-200 backdrop-blur-md font-mono font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#b46f32]" />
                  <span>3D Skills Graph</span>
                </div>
              </div>

              {/* 3D WebGL Canvas */}
              <div className="absolute inset-0 z-0">
                <WebGLCanvas createScene={createScene} className="w-full h-full" />
              </div>

              <div className="relative z-10 text-xs text-gray-300 font-mono bg-black/70 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md pointer-events-none">
                Select any category to highlight associated skills and connections.
              </div>
            </div>

            {/* Category Filter Chips & Skills Matrix Grid (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                <MagneticWrapper strength={0.25}>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`text-xs font-mono px-4 py-2 rounded-full transition-all duration-200 border font-medium ${
                      activeCategory === 'all'
                        ? 'bg-[#b46f32] text-white font-bold border-[#b46f32] shadow-md shadow-[#b46f32]/20'
                        : 'bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-[#b46f32]/40'
                    }`}
                  >
                    All Skills
                  </button>
                </MagneticWrapper>

                {portfolioData.skillCategories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <MagneticWrapper key={cat.id} strength={0.25}>
                      <button
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`text-xs font-mono px-4 py-2 rounded-full transition-all duration-200 border flex items-center gap-2 font-medium ${
                          isActive
                            ? 'bg-[#b46f32] text-white font-bold border-[#b46f32] shadow-md shadow-[#b46f32]/20'
                            : 'bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-[#b46f32]/40'
                        }`}
                      >
                        {getCategoryIcon(cat.id)}
                        <span>{cat.name}</span>
                      </button>
                    </MagneticWrapper>
                  );
                })}
              </div>

              {/* Skills Matrix Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-2">
                {filteredSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-[#b46f32]/30 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-display font-bold text-white group-hover:text-[#b46f32] transition-colors text-sm">
                        {skill.name}
                      </h4>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                        {skill.tag}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mb-3 leading-relaxed font-normal">
                      {skill.desc}
                    </p>

                    {/* Proficiency Meter Bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#b46f32] rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Education & Milestones Row - Balanced 6/6 Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (6 cols): Formal Education & Verified Resume */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <Education />

            {/* Technical Resume Card */}
            <div className="p-7 sm:p-8 rounded-3xl bg-[#0a0a0c] border border-white/10 hover:border-[#b46f32]/40 transition-all duration-300 shadow-2xl flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold text-[#b46f32] uppercase tracking-wider">
                    Official Document
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">PDF • Verified</span>
                </div>
                <h4 className="font-display font-bold text-xl text-white mb-2">
                  Technical Résumé
                </h4>
                <p className="text-xs text-gray-300 mb-6 leading-relaxed font-normal">
                  Detailed record of academic coursework, backend service repositories, algorithmic certifications, and engineering credentials.
                </p>
              </div>

              <a
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-xs font-mono font-bold py-3.5 px-6 rounded-full bg-white text-black hover:bg-[#b46f32] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Open Resume (Google Drive)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column (6 cols): Key Milestones & Leadership */}
          <div className="lg:col-span-6">
            <Achievements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
