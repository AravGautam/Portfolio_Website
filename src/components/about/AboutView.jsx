import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { SkillsConstellationScene } from '../webgl/SkillsConstellation3D';
import Education from './Education';
import Achievements from './Achievements';
import { Sparkles, ExternalLink, MapPin, Layers, Database, Code, Brain, Cpu } from 'lucide-react';
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

  const handleSkillCardClick = (skill, idx) => {
    soundEngine.playClick();
    if (typeof soundEngine.playNote === 'function') {
      soundEngine.playNote(400 + (idx % 8) * 80);
    }
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'languages': return <Code className="w-3.5 h-3.5 text-blue-400" />;
      case 'frontend': return <Layers className="w-3.5 h-3.5 text-sky-400" />;
      case 'backend': return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
      case 'database': return <Database className="w-3.5 h-3.5 text-cyan-400" />;
      case 'ai_data': return <Brain className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const filteredSkills = activeCategory === 'all'
    ? portfolioData.skillCategories.flatMap(c => c.skills)
    : portfolioData.skillCategories.find(c => c.id === activeCategory)?.skills || [];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 md:px-12 bg-transparent flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full relative z-10 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0781ff]" />
              <span>Background</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              About Me
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-300 bg-[#0a0a0c]/80 border border-white/10 px-5 py-3 rounded-full backdrop-blur-md">
            <MapPin className="w-3.5 h-3.5 text-blue-400" />
            <span>{portfolioData.personal.location}</span>
          </div>
        </div>

        {/* Main Story & Large Editorial Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Clean Framed Portrait */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden bg-[#0a0a0c] border border-white/15 shadow-2xl group">
              <img
                src="/arav-portrait-hero.jpg"
                alt="Arav Gautam - Software Engineer"
                className="w-full h-full object-cover object-[center_20%] filter brightness-100 contrast-105 transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle ambient lighting vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              
              {/* Floating Profile Badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-black/75 border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-white font-display font-bold text-sm tracking-wide">Arav Gautam</div>
                  <div className="text-gray-400 text-xs font-mono mt-0.5">Software Engineer</div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Dream Filler</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Editorial Story */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack & Backend Developer</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight leading-tight">
              Crafting reliable backends and scalable web systems.
            </h2>

            <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                I'm a Computer Science student at Vindhya Institute of Technology and Science (VITS) and currently working as a Backend Engineer Intern at Dream Filler Company.
              </p>
              <p>
                My engineering focus centers on architecting high-throughput RESTful APIs, designing scalable database schemas, and building backend services that perform smoothly under load. I also enjoy working with real-time WebSockets, distributed queues, and 3D web graphics.
              </p>
              <p>
                Outside of building production features, I consistently practice data structures and algorithms on LeetCode and Codeforces, build prototypes, and keep up with modern software design patterns.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-display font-bold text-white">200+</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">DSA Solved</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-display font-bold text-blue-400">7.8</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">B.Tech CGPA</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
                <div className="text-2xl sm:text-3xl font-display font-bold text-emerald-400">2027</div>
                <div className="text-xs text-gray-400 font-mono mt-0.5">Graduation</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-semibold px-6 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>View Resume</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400 px-4 py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{portfolioData.personal.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3D Skills Constellation & Interactive Matrix */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0781ff]" />
                <span>MY SKILLSET</span>
              </div>
              <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-white">
                The Magic <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">Behind</span>
              </h3>
            </div>
            <p className="text-xs font-mono text-gray-400">
              Interactive 3D graph and categorized breakdown of tools and languages.
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
                  <span className="w-2 h-2 rounded-full bg-[#0781ff]" />
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
                    className={`text-xs font-mono px-4 py-2.5 rounded-full transition-all duration-200 border font-medium ${activeCategory === 'all'
                        ? 'bg-[#0781ff] text-white font-bold border-[#0781ff] shadow-md shadow-[#0781ff]/25'
                        : 'bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-blue-500/40'
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
                        className={`text-xs font-mono px-4 py-2.5 rounded-full transition-all duration-200 border flex items-center gap-2 font-medium ${isActive
                            ? 'bg-[#0781ff] text-white font-bold border-[#0781ff] shadow-md shadow-[#0781ff]/25'
                            : 'bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-blue-500/40'
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
                    onClick={() => handleSkillCardClick(skill, idx)}
                    className="p-4 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-blue-500/30 transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-display font-bold text-white group-hover:text-blue-400 transition-colors text-sm">
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
                        className="h-full bg-[#0781ff] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(7,129,255,0.5)]"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          {/* Left Column (6 cols): Education */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Education />
          </div>

          {/* Right Column (6 cols): Milestones & Leadership */}
          <div className="lg:col-span-6">
            <Achievements />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
