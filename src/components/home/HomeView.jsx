import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import { ArrowRight, ArrowUpRight, Github, Linkedin, Twitter, Instagram, Mail, Code2, MapPin, Terminal, ChevronRight, Layers, Cpu } from 'lucide-react';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';

export const HomeView = () => {
  const navigate = useNavigate();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleExplore = (path) => {
    soundEngine.playClick();
    navigate(path);
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMouseOffset({ x, y });
  };

  const getSocialIcon = (id) => {
    switch (id) {
      case 'github': return <Github className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden pt-24 md:pt-28 pb-10 px-6 md:px-12 lg:px-16 bg-black"
    >
      {/* Normal Pristine Hero Developer Portrait */}
      <div
        className="absolute inset-x-0 bottom-0 top-14 md:top-8 flex items-end justify-center z-[2] select-none pointer-events-none"
      >
        <div
          className="relative w-full max-w-[440px] sm:max-w-[520px] lg:max-w-[620px] h-[72vh] sm:h-[78vh] lg:h-[84vh] flex items-end justify-center transition-transform duration-300"
          style={{
            transform: `perspective(1000px) rotateY(${mouseOffset.x * 0.25}deg) rotateX(${-mouseOffset.y * 0.2}deg)`,
          }}
        >
          {/* Static Image with multi-stop radial & linear edge-feathering masks for 100% invisible edges */}
          <img
            src="/arav-portrait-hero.jpg"
            alt="Arav Gautam - Software Engineer"
            className="w-full h-full object-contain object-bottom filter brightness-95 contrast-105 transition-all duration-300"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 72% 76% at 50% 46%, black 40%, rgba(0,0,0,0.7) 62%, rgba(0,0,0,0.15) 80%, transparent 95%)',
              maskImage: 'radial-gradient(ellipse 72% 76% at 50% 46%, black 40%, rgba(0,0,0,0.7) 62%, rgba(0,0,0,0.15) 80%, transparent 95%)',
            }}
          />

          {/* Vignette edge falloff overlay to ensure 100% black transition on any display */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/60 opacity-90" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/80 via-transparent to-black/80 opacity-90" />
        </div>
      </div>

      {/* Foreground UI Layer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center pt-2 pointer-events-none">
        
        {/* Left Column: Identity & Actions */}
        <div className="lg:col-span-5 space-y-6 text-left pointer-events-auto">
          
          {/* Developer Tag */}
          <div className="inline-flex items-center gap-2.5 text-xs font-mono font-medium text-[#b46f32] px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
            <span className="tracking-wider text-gray-300 font-semibold">ARAV GAUTAM</span>
          </div>

          {/* Large Bold Hero Typography */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-6xl xl:text-7xl font-display font-extrabold tracking-tight text-white leading-[1.05]">
              I'm Arav, a <br />
              <span className="text-[#b46f32]">
                Software Engineer
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-wider text-[#b46f32] uppercase font-bold">
              Backend Engineer Intern @ Dream Filler • Full-Stack Developer
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-sm text-gray-300 font-normal leading-relaxed max-w-md">
            {portfolioData.personal.tagline} Engineering distributed web platforms, 3D interactive graphics, and machine learning models.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <MagneticWrapper strength={0.3}>
              <button
                onClick={() => handleExplore('/work')}
                onMouseEnter={() => soundEngine.playHover()}
                className="text-xs font-mono font-bold px-7 py-3.5 rounded-full bg-[#b46f32] text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(180,111,50,0.5)] transition-all duration-300 shadow-xl flex items-center gap-2"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.25}>
              <button
                onClick={() => handleExplore('/contact')}
                onMouseEnter={() => soundEngine.playHover()}
                className="text-xs font-mono font-medium px-6 py-3.5 rounded-full border border-white/20 bg-[#0a0a0c] text-gray-200 hover:border-[#b46f32]/60 hover:text-[#b46f32] backdrop-blur-md transition-all duration-300 flex items-center gap-2"
              >
                <span>Get In Touch</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#b46f32]" />
              </button>
            </MagneticWrapper>
          </div>

          {/* Social Icons Row */}
          <div className="pt-2">
            <div className="text-[11px] font-mono text-gray-400 mb-2 uppercase tracking-wider font-semibold">
              Connect
            </div>
            <div className="flex items-center gap-2.5">
              {portfolioData.socialLinks.map((link) => (
                <MagneticWrapper key={link.id} strength={0.2}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => soundEngine.playHover()}
                    className="w-9 h-9 rounded-full bg-[#0a0a0c] border border-white/10 hover:border-[#b46f32]/60 hover:bg-[#b46f32]/10 text-gray-300 hover:text-[#b46f32] flex items-center justify-center transition-all duration-200 shadow-sm"
                    title={link.label}
                  >
                    {getSocialIcon(link.id)}
                  </a>
                </MagneticWrapper>
              ))}
            </div>
          </div>
        </div>

        {/* Center Spacer */}
        <div className="hidden lg:block lg:col-span-3 min-h-[300px] pointer-events-none" />

        {/* Right Column: Clean Highlights */}
        <div className="lg:col-span-4 space-y-4 text-left pointer-events-auto">
          {/* Quick Bio Link */}
          <div
            onClick={() => handleExplore('/about')}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#b46f32]/40 transition-all duration-300 cursor-pointer group backdrop-blur-md shadow-xl"
          >
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between mb-2">
              <span className="text-gray-300 font-semibold tracking-wider">ABOUT</span>
              <span className="text-gray-400 group-hover:text-[#b46f32] transition-colors flex items-center gap-0.5 text-[11px]">
                Read background <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">
              Computer Science student at VITS & Backend Engineer Intern at Dream Filler Company. Focus on high-throughput backend APIs and scalable systems.
            </p>
          </div>

          {/* Selected Work Link */}
          <div
            onClick={() => handleExplore('/work')}
            className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-[#b46f32]/40 transition-all duration-300 cursor-pointer group backdrop-blur-md shadow-xl"
          >
            <div className="text-xs font-mono text-gray-400 flex items-center justify-between mb-2">
              <span className="text-gray-300 font-semibold tracking-wider">SELECTED WORK</span>
              <span className="text-[#b46f32] flex items-center gap-0.5 text-[11px]">
                View 3D work <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="text-xs text-white font-medium">
              ML Predictive Platform & Real-Time Multiplayer Chess
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-normal">
              Full-stack architectures deployed with Python, Node.js, Socket.IO, and WebGL.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Highlights */}
      <div className="relative z-10 w-full max-w-7xl mx-auto pt-6 border-t border-white/10 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {portfolioData.personal.stats.map((stat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundEngine.playHover()}
              className="bg-[#0a0a0c] border border-white/5 hover:border-[#b46f32]/35 p-3.5 sm:p-4 rounded-xl backdrop-blur-md transition-all duration-300 group text-center sm:text-left cursor-default shadow-sm"
            >
              <div className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#b46f32] transition-colors">
                {stat.value}
              </div>
              <div className="text-xs font-semibold text-gray-200 mt-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] text-gray-400 mt-0.5 font-normal">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeView;


