import React, { useCallback } from 'react';
import WebGLCanvas from '../webgl/WebGLCanvas';
import { HeroParticlesScene } from '../webgl/HeroParticles';
import { portfolioData } from '../../data/portfolioData';
import { ArrowDown, ArrowUpRight } from 'lucide-react';

const Hero = () => {
  const createScene = useCallback((container) => {
    return new HeroParticlesScene(container);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between items-center overflow-hidden pt-32 pb-14 px-6 md:px-12 bg-[#07070a]"
    >
      {/* 3D WebGL Particle Cloud */}
      <div className="absolute inset-0 z-0">
        <WebGLCanvas createScene={createScene} className="w-full h-full" />
      </div>

      {/* Subtle lighting vignette */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07070a] via-transparent to-[#07070a]/50 z-0" />

      {/* Top subtle badge */}
      <div className="relative z-10 text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-gray-300 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
          <span>Full-Stack Engineer & Creative Developer</span>
        </div>
      </div>

      {/* Main Center Typography */}
      <div className="relative z-10 my-auto text-center max-w-4xl mx-auto pointer-events-none select-none px-4">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight text-white mb-6 uppercase leading-none">
          <span className="block drop-shadow-2xl">ARAV</span>
          <span className="block bg-gradient-to-r from-white via-gray-200 to-[#00f0ff] bg-clip-text text-transparent">
            GAUTAM
          </span>
        </h1>

        <p className="text-base sm:text-xl text-gray-300 font-normal max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow">
          Building resilient full-stack systems, machine learning workflows, and interactive web experiences.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
          <button
            onClick={() => scrollToSection('projects')}
            className="text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full bg-white text-black hover:bg-[#00f0ff] hover:shadow-xl transition-all duration-300 shadow-lg"
          >
            Explore Work
          </button>

          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-medium px-7 py-3.5 rounded-full border border-white/15 bg-white/[0.03] text-gray-200 hover:border-white/40 hover:text-white backdrop-blur-md transition-all duration-300 flex items-center gap-2"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-4 h-4 text-[#00f0ff]" />
          </a>
        </div>
      </div>

      {/* Bottom Highlights & Metrics Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto pt-8 border-t border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {portfolioData.personal.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#0e0e14]/60 border border-white/5 hover:border-white/20 p-4 sm:p-5 rounded-2xl backdrop-blur-md transition-all duration-300 group text-center sm:text-left"
            >
              <div className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-gray-200 mt-1">
                {stat.label}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5 font-normal">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => scrollToSection('projects')}
            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;