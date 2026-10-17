import React, { useState, useCallback, useRef, useEffect } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { SkillsConstellationScene } from '../webgl/SkillsConstellation3D';
import Education from './Education';
import Achievements from './Achievements';
import { Sparkles, ExternalLink, MapPin, Layers, Database, Code, Brain, Cpu, ChevronUp, ChevronDown } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';

export const AboutView = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [highlightedSkill, setHighlightedSkill] = useState(null);
  const constellationRef = useRef(null);
  const skillsContainerRef = useRef(null);

  const categoryFrequencies = {
    all: 440,
    languages: 528,
    frontend: 639,
    backend: 741,
    database: 852,
    ai_data: 963
  };

  const handleNodeClick = useCallback((nodeData) => {
    const { categoryId, skillName } = nodeData;

    soundEngine.playClick();
    if (typeof soundEngine.playNote === 'function') {
      soundEngine.playNote(categoryFrequencies[categoryId] || 528);
    }

    setActiveCategory(categoryId);

    if (constellationRef.current) {
      constellationRef.current.highlightCategory(categoryId);
    }

    if (skillName) {
      setHighlightedSkill(skillName);
      setTimeout(() => setHighlightedSkill(null), 2500);

      setTimeout(() => {
        if (skillsContainerRef.current) {
          const cardId = `skill-card-${skillName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
          const cardEl = document.getElementById(cardId);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      }, 70);
    } else {
      setTimeout(() => {
        if (skillsContainerRef.current) {
          skillsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
  }, []);

  const createScene = useCallback((container) => {
    const scene = new SkillsConstellationScene(
      container,
      portfolioData.skillCategories,
      handleNodeClick
    );
    constellationRef.current = scene;
    return scene;
  }, [handleNodeClick]);

  // Dedicated uninhibited wheel scroll listener to guarantee smooth scrolling
  useEffect(() => {
    const container = skillsContainerRef.current;
    if (!container) return;

    const onWheel = (e) => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;

      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const atTop = container.scrollTop <= 0;
      const atBottom = container.scrollTop >= maxScroll - 1;

      // Scroll within bounds and isolate from parent Lenis interference
      if ((isScrollingDown && !atBottom) || (isScrollingUp && !atTop)) {
        e.stopPropagation();
        container.scrollTop += e.deltaY;
      }
    };

    container.addEventListener('wheel', onWheel, { passive: true });
    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [activeCategory]);

  const handleCategoryClick = (catId) => {
    soundEngine.playClick();
    if (typeof soundEngine.playNote === 'function') {
      soundEngine.playNote(categoryFrequencies[catId] || 528);
    }
    setActiveCategory(catId);
    if (constellationRef.current) {
      constellationRef.current.highlightCategory(catId === 'all' ? null : catId);
      if (catId !== 'all') {
        constellationRef.current.focusCategory(catId);
      } else {
        constellationRef.current.resetFocus();
      }
    }
    if (skillsContainerRef.current) {
      skillsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSkillCardClick = (skill, idx) => {
    soundEngine.playClick();
    if (typeof soundEngine.playNote === 'function') {
      soundEngine.playNote(400 + (idx % 8) * 80);
    }
    setHighlightedSkill(skill.name);
    setTimeout(() => setHighlightedSkill(null), 2500);

    if (constellationRef.current) {
      constellationRef.current.focusSkill(skill.name);
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
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
                <div className="text-2xl sm:text-3xl font-display font-bold text-blue-400">7.85</div>
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
                className="pill-btn-white-3d text-xs font-mono font-semibold px-6 py-3 text-black flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>View Resume</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="pill-btn-3d flex items-center gap-2 text-xs font-mono text-gray-300 px-4 py-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
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
            <div className="lg:col-span-5 relative rounded-3xl bg-[#0a0a0c] border border-white/10 p-6 flex flex-col justify-between min-h-[460px] shadow-2xl overflow-hidden">
              <div className="relative z-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 text-xs bg-black/70 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-200 backdrop-blur-md font-mono font-medium">
                  <span>3D Skills Graph</span>
                </div>
                <div className="text-[10px] font-mono text-gray-400 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full backdrop-blur-md">
                  Click node to inspect
                </div>
              </div>

              {/* 3D WebGL Canvas */}
              <div className="absolute inset-0 z-0">
                <WebGLCanvas createScene={createScene} className="w-full h-full" />
              </div>

              <div className="relative z-10 text-xs text-gray-300 font-mono bg-black/70 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md pointer-events-none flex items-center justify-between">
                <span>Click any 3D node to rotate and scroll to that skill.</span>
              </div>
            </div>

            {/* Category Filter Chips & Skills Matrix Grid (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category Filter Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <MagneticWrapper strength={0.25}>
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className={`text-xs font-mono px-4 py-2 rounded-full transition-all duration-300 font-medium cursor-pointer ${
                        activeCategory === 'all'
                          ? 'pill-btn-dented text-white font-bold'
                          : 'pill-btn-3d text-gray-300 hover:text-white'
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
                          className={`text-xs font-mono px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 font-medium cursor-pointer ${
                            isActive
                              ? 'pill-btn-dented text-white font-bold'
                              : 'pill-btn-3d text-gray-300 hover:text-white'
                          }`}
                        >
                          {getCategoryIcon(cat.id)}
                          <span>{cat.name}</span>
                        </button>
                      </MagneticWrapper>
                    );
                  })}
                </div>

                {/* Skills Matrix Cards Viewport */}
                <div
                  ref={skillsContainerRef}
                  data-lenis-prevent="true"
                  onWheel={(e) => e.stopPropagation()}
                  tabIndex={0}
                  role="region"
                  aria-label="Skills Matrix Cards"
                  className="h-[390px] overflow-y-auto overscroll-contain pr-2 custom-skills-scrollbar relative focus:outline-none"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-2">
                    {filteredSkills.map((skill, idx) => {
                      const isHighlighted = highlightedSkill === skill.name;
                      const cardId = `skill-card-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                      return (
                        <div
                          key={`${skill.name}-${idx}`}
                          id={cardId}
                          onClick={() => handleSkillCardClick(skill, idx)}
                          className={`p-4 rounded-2xl bg-[#0a0a0c] border transition-all duration-300 group cursor-pointer ${
                            isHighlighted
                              ? 'border-blue-400 bg-blue-950/40 shadow-[0_0_25px_rgba(7,129,255,0.45)] ring-1 ring-blue-400/50 scale-[1.02]'
                              : 'border-white/5 hover:border-blue-500/30 hover:bg-white/[0.02]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="font-display font-bold text-white group-hover:text-blue-400 transition-colors text-sm flex items-center gap-2">
                              <span>{skill.name}</span>
                              {isHighlighted && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              )}
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
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status footer with scroll prompt and interactive buttons */}
              <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mt-3 pt-2.5 border-t border-white/5">
                <span className="text-gray-400">
                  Showing {filteredSkills.length} skills in {activeCategory === 'all' ? 'All Skills' : portfolioData.skillCategories.find(c => c.id === activeCategory)?.name}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[#0781ff] flex items-center gap-1.5 font-medium">
                    Scroll to view all
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (skillsContainerRef.current) {
                          skillsContainerRef.current.scrollBy({ top: -140, behavior: 'smooth' });
                        }
                      }}
                      aria-label="Scroll skills up"
                      className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                      title="Scroll Up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (skillsContainerRef.current) {
                          skillsContainerRef.current.scrollBy({ top: 140, behavior: 'smooth' });
                        }
                      }}
                      aria-label="Scroll skills down"
                      className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
                      title="Scroll Down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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
