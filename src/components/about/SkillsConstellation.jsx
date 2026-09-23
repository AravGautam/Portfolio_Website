import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { SkillsConstellationScene } from '../webgl/SkillsConstellation3D';
import { Sparkles, Layers, Cpu, Database, Code, Brain } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';

const SkillsConstellation = () => {
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
    <section id="skills" className="relative py-28 px-6 md:px-12 bg-black border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#b46f32] mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#b46f32]" />
              <span>TECHNICAL EXPERTISE</span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Skills & Technologies
            </h2>
          </div>

          <p className="text-sm text-gray-300 max-w-md leading-relaxed font-normal">
            An interactive 3D map of languages, frameworks, runtime engines, and data architectures I work with. Click any category or skill node.
          </p>
        </div>

        {/* 3D WebGL Constellation + Matrix Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* 3D Constellation Viewport (5 cols) */}
          <div
            className="lg:col-span-5 relative rounded-3xl bg-[#0a0a0c] border border-white/10 p-6 flex flex-col justify-between min-h-[380px] card-cyber-shadow overflow-hidden"
            data-cursor="NODE"
          >
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-black/70 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-200 backdrop-blur-md font-mono font-medium shadow-md">
                <span className="w-2 h-2 rounded-full bg-[#b46f32]" />
                <span>3D Skills Graph</span>
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

            <div className="relative z-10 text-xs text-gray-300 font-mono bg-black/70 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md pointer-events-none">
              Select any category above to highlight associated skills and connections in 3D.
            </div>
          </div>

          {/* Category Filter Chips & Skills Matrix Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              <MagneticWrapper strength={0.25}>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`text-xs font-mono px-4 py-2.5 rounded-full transition-all duration-200 border font-medium cursor-pointer shadow-sm ${
                    activeCategory === 'all'
                      ? 'bg-[#b46f32] text-white font-bold border-[#b46f32] shadow-lg shadow-[#b46f32]/25 scale-[1.02]'
                      : 'bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-[#b46f32]/50 hover:bg-white/5'
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
                      type="button"
                      onClick={() => handleCategoryClick(cat.id)}
                      onMouseEnter={() => soundEngine.playHover()}
                      className={`text-xs font-mono px-4 py-2.5 rounded-full transition-all duration-200 border flex items-center gap-2 font-medium cursor-pointer shadow-sm ${
                        isActive
                          ? 'bg-[#b46f32] text-white font-bold border-[#b46f32] shadow-lg shadow-[#b46f32]/25 scale-[1.02]'
                          : 'bg-[#0a0a0c] text-gray-300 border-white/10 hover:border-[#b46f32]/50 hover:bg-white/5'
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
                  onMouseEnter={() => soundEngine.playHover()}
                  className="p-4 rounded-2xl bg-[#0a0a0c] border border-white/5 hover:border-[#b46f32]/40 transition-all duration-200 group cursor-pointer card-cyber-shadow"
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
                      className="h-full bg-[#b46f32] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(180,111,50,0.6)]"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default SkillsConstellation;


