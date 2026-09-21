import React, { useState, useCallback, useRef } from 'react';
import { portfolioData } from '../../data/portfolioData';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { SkillsConstellationScene } from '../webgl/SkillsConstellation3D';
import { Sparkles, Layers, Cpu, Database, Code, Brain } from 'lucide-react';

const SkillsConstellation = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const constellationRef = useRef(null);

  const createScene = useCallback((container) => {
    const scene = new SkillsConstellationScene(container, portfolioData.skillCategories);
    constellationRef.current = scene;
    return scene;
  }, []);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    if (constellationRef.current) {
      constellationRef.current.highlightCategory(catId === 'all' ? null : catId);
    }
  };

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'languages': return <Code className="w-3.5 h-3.5 text-[#00f0ff]" />;
      case 'frontend': return <Layers className="w-3.5 h-3.5 text-[#8b5cf6]" />;
      case 'backend': return <Cpu className="w-3.5 h-3.5 text-[#3b82f6]" />;
      case 'database': return <Database className="w-3.5 h-3.5 text-pink-400" />;
      case 'ai_data': return <Brain className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" />;
    }
  };

  const filteredSkills = activeCategory === 'all'
    ? portfolioData.skillCategories.flatMap(c => c.skills)
    : portfolioData.skillCategories.find(c => c.id === activeCategory)?.skills || [];

  return (
    <section id="skills" className="relative py-28 px-6 md:px-12 bg-[#07070a] border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#00f0ff] mb-3">
              Technical Expertise
            </div>
            <h2 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
              Skills & Technologies
            </h2>
          </div>

          <p className="text-sm text-gray-400 max-w-md leading-relaxed font-normal">
            An interactive 3D map of languages, frameworks, runtime engines, and data architectures I work with.
          </p>
        </div>

        {/* 3D WebGL Constellation + Matrix Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* 3D Constellation Viewport (5 cols) */}
          <div className="lg:col-span-5 relative rounded-3xl bg-[#0e0e14]/80 border border-white/10 p-6 flex flex-col justify-between min-h-[380px] shadow-2xl overflow-hidden">
            <div className="relative z-10 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 text-xs bg-black/60 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-300 backdrop-blur-md font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                <span>3D Skills Graph</span>
              </div>
            </div>

            {/* 3D WebGL Canvas */}
            <div className="absolute inset-0 z-0">
              <WebGLCanvas createScene={createScene} className="w-full h-full" />
            </div>

            <div className="relative z-10 text-xs text-gray-400 bg-black/70 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md pointer-events-none">
              Select any category above to highlight associated skills and connections.
            </div>
          </div>

          {/* Category Filter Chips & Skills Matrix Grid (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => handleCategoryClick('all')}
                className={`text-xs px-4 py-2 rounded-full transition-all duration-200 border font-medium ${
                  activeCategory === 'all'
                    ? 'bg-[#00f0ff] text-black font-semibold border-[#00f0ff] shadow-md'
                    : 'bg-[#0e0e14] text-gray-300 border-white/10 hover:border-white/30'
                }`}
              >
                All Skills
              </button>

              {portfolioData.skillCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`text-xs px-4 py-2 rounded-full transition-all duration-200 border flex items-center gap-2 font-medium ${
                      isActive
                        ? 'bg-[#00f0ff] text-black font-semibold border-[#00f0ff] shadow-md'
                        : 'bg-[#0e0e14] text-gray-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {getCategoryIcon(cat.id)}
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Skills Matrix Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-2">
              {filteredSkills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0e0e14]/70 border border-white/5 hover:border-white/20 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="font-display font-bold text-white group-hover:text-[#00f0ff] transition-colors text-sm">
                      {skill.name}
                    </h4>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                      {skill.tag}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mb-3 leading-relaxed font-normal">
                    {skill.desc}
                  </p>

                  {/* Proficiency Meter Bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00f0ff] to-[#8b5cf6] rounded-full transition-all duration-500"
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
