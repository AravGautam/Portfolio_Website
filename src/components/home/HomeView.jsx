import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioData } from '../../data/portfolioData';
import {
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Copy,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Crosshair,
  Cpu,
  Layers,
  Send,
} from 'lucide-react';
import RubiksCube3D from './RubiksCube3D';
import LuxuryChronometerWatch from './LuxuryChronometerWatch';
import InteractiveEarthGlobe from './InteractiveEarthGlobe';
import Interactive3DName from './Interactive3DName';
import MagneticWrapper from '../ui/MagneticWrapper';
import { soundEngine } from '../../audio/soundEngine';
import { showToast } from '../ui/Toast';
import InfiniteMarquee from '../ui/InfiniteMarquee';

// Vector SVG Flag Icons for zero-emoji precision Retina rendering
const UkFlag = () => (
  <svg className="w-4 h-3 rounded-xs shrink-0 shadow-xs" viewBox="0 0 60 30">
    <clipPath id="uk-clip">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" clipPath="url(#uk-clip)" />
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
  </svg>
);

const IndiaFlag = () => (
  <svg className="w-4 h-3 rounded-xs overflow-hidden shrink-0 shadow-xs" viewBox="0 0 60 30">
    <rect width="60" height="10" fill="#FF9933" />
    <rect y="10" width="60" height="10" fill="#FFFFFF" />
    <rect y="20" width="60" height="10" fill="#138808" />
    <circle cx="30" cy="15" r="3.5" fill="none" stroke="#000080" strokeWidth="0.8" />
  </svg>
);

const UsaFlag = () => (
  <svg className="w-4 h-3 rounded-xs overflow-hidden shrink-0 shadow-xs" viewBox="0 0 60 30">
    <rect width="60" height="30" fill="#B22234" />
    <path d="M0,4.6 h60 M0,9.2 h60 M0,13.8 h60 M0,18.4 h60 M0,23 h60 M0,27.6 h60" stroke="#fff" strokeWidth="2.3" />
    <rect width="25" height="16" fill="#3C3B6E" />
  </svg>
);

export const HomeView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Scale');
  const [liveTimeStr, setLiveTimeStr] = useState('');
  const [activeLocation, setActiveLocation] = useState('india');
  const [isDesktop, setIsDesktop] = useState(false);

  const TIMEZONE_CONFIG = {
    uk: { label: 'UK', flag: UkFlag, tz: 'Europe/London', offset: 'UTC+1', badge: 'BST' },
    india: { label: 'India', flag: IndiaFlag, tz: 'Asia/Kolkata', offset: 'UTC+5:30', badge: 'IST' },
    usa: { label: 'USA', flag: UsaFlag, tz: 'America/New_York', offset: 'UTC-4', badge: 'EDT' },
  };

  const activeTzObj = TIMEZONE_CONFIG[activeLocation] || TIMEZONE_CONFIG.india;

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const [liveTimes, setLiveTimes] = useState({
    india: '',
    uk: '',
    usa: '',
  });

  // Live real-time clocks for each timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const inStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const ukStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const usStr = now.toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      setLiveTimeStr(inStr);
      setLiveTimes({
        india: inStr,
        uk: ukStr,
        usa: usStr,
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleExplore = (path) => {
    soundEngine.playClick();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(portfolioData.personal.email);
    showToast('Email copied: working.aravgautam@gmail.com');
  };

  const scrollToBento = () => {
    soundEngine.playClick();
    const el = document.getElementById('bento-showcase');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getSocialIcon = (id) => {
    switch (id) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const ARCHITECTURE_TABS = [
    {
      id: 'Scale',
      label: 'Scale',
      tagline: 'High Throughput',
      title: 'Architectures',
      titleItalic: 'you can trust.',
      detail: 'Engineered for 100k+ concurrent requests, non-blocking asynchronous event loops, and robust microservices.',
      pills: ['100k+ Concurrency', 'Sub-15ms p99', 'Node.js • Express'],
    },
    {
      id: 'Database',
      label: 'Database',
      tagline: 'Low Latency',
      title: 'Optimized Schemas',
      titleItalic: '& aggregation pipelines.',
      detail: 'Compound indexing strategies, B-tree query tuning, and Redis caching for millisecond data retrieval.',
      pills: ['MongoDB Aggregations', 'Compound Indices', 'Redis Caching'],
    },
    {
      id: 'Real-Time',
      label: 'Real-Time',
      tagline: 'Instant Sync',
      title: 'WebSocket Engines',
      titleItalic: 'with zero desync.',
      detail: 'Bi-directional Socket.IO event architecture with instant room synchronization and FIDE state validation.',
      pills: ['Socket.IO', 'Bi-Directional State', 'Sub-10ms Sync'],
    },
    {
      id: 'Security',
      label: 'Security',
      tagline: 'Zero-Trust',
      title: 'Zero-Trust Auth',
      titleItalic: '& hardened endpoints.',
      detail: 'Cryptographic JWT session validation, bcrypt salt rounds, strict payload sanitization, and rate limiting.',
      pills: ['JWT Rotation', 'Bcrypt Auth', 'Rate Limiting'],
    },
  ];

  const currentTabObj = ARCHITECTURE_TABS.find((t) => t.id === activeTab) || ARCHITECTURE_TABS[0];

  return (
    <div className="relative min-h-screen bg-transparent select-none">
      
      {/* =========================================================================
          SECTION 1: HERO VIEWPORT (The Big Interactive 3D "ARAV GAUTAM" Screen)
          ========================================================================= */}
      <section className="relative w-full min-h-[96vh] flex flex-col justify-between items-center text-center px-4 sm:px-6 md:px-12 pt-32 pb-8 overflow-hidden">
        
        {/* Center Typographic Core */}
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center my-auto space-y-5 pt-6">
          {/* Interactive 3D Transformable Name */}
          <Interactive3DName />

          {/* Dual-Font Tagline */}
          <div className="space-y-2 max-w-3xl mx-auto">
            <p className="text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase text-gray-400 font-mono">
              I design and build backend systems that
            </p>
            <p className="font-serif text-3xl sm:text-5xl md:text-6xl italic text-white lowercase leading-tight">
              deliver real performance & scale.
            </p>
          </div>

          {/* Grounded Bio */}
          <p className="text-sm sm:text-base text-gray-300 font-normal leading-relaxed max-w-xl mx-auto pt-1">
            Backend Engineer Intern at Dream Filler Company and Computer Science student. Specialized in high-throughput REST APIs, scalable database schemas, and clean distributed architectures.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <MagneticWrapper strength={0.25}>
              <button
                onClick={() => handleExplore('/work')}
                onMouseEnter={() => soundEngine.playHover()}
                className="text-xs sm:text-sm font-semibold px-7 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-all duration-200 flex items-center gap-2 shadow-xl hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.25}>
              <button
                onClick={() => handleExplore('/about')}
                onMouseEnter={() => soundEngine.playHover()}
                className="text-xs sm:text-sm font-semibold px-6 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 backdrop-blur-md transition-all duration-200 flex items-center gap-2 shadow-sm hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>About Me</span>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.25}>
              <button
                onClick={handleCopyEmail}
                onMouseEnter={() => soundEngine.playHover()}
                className="text-xs sm:text-sm font-semibold px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/10 backdrop-blur-md transition-all duration-200 flex items-center gap-2 cursor-pointer"
                title="Copy email to clipboard"
              >
                <Copy className="w-3.5 h-3.5 text-blue-400" />
                <span>Copy Email</span>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={0.25}>
              <a
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playClick()}
                className="text-xs sm:text-sm font-semibold px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/10 backdrop-blur-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Resume</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
              </a>
            </MagneticWrapper>
          </div>

          {/* Social Links Row */}
          <div className="flex items-center gap-2.5 pt-1">
            {portfolioData.socialLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
                title={link.label}
              >
                {getSocialIcon(link.id)}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Corner Markers & Scroll Down Indicator */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          {/* Bottom Left: Location */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-gray-400">
            <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-left">
              <span className="text-white font-medium">BASED IN</span> Madhya Pradesh, INDIA
            </div>
          </div>

          {/* Center: Scroll Down Prompt Button */}
          <button
            onClick={scrollToBento}
            onMouseEnter={() => soundEngine.playHover()}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono text-gray-300 transition-all hover:scale-105 cursor-pointer"
          >
            <span>Scroll down to explore</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
          </button>

          {/* Bottom Right: Specialization */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-gray-400">
            <div className="text-right hidden sm:block">
              <span className="text-white font-medium">SPECIALIZATION</span> Backend & Systems
            </div>
            <div className="w-7 h-7 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 5-TILE MASTER BENTO GRID (Authentic Parth-Inspired Layout)
          Row 1: Tile 1 (Profile/Cube) | Tile 2 (Backend Intern) | Tile 3 (Let's Connect)
          Row 2: Tile 4 (Earth Globe / Timezones) | Tile 5 (Architectures)
          Center: Precision CNC Carved Chronometer Watch with 100% Genuine Box Cutouts
          ========================================================================= */}
      <section id="bento-showcase" className="relative w-full pt-6 pb-12 px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="max-w-[1400px] w-full mx-auto space-y-4">
          
          {/* Section Subheader Markers */}
          <div className="flex items-center justify-between px-2 pb-1 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#0781ff]" />
              <span>CORE SHOWCASE</span>
            </div>
            <span className="font-mono text-xs text-gray-500">EXPERIENCE & CRAFT</span>
          </div>

          <div className="relative w-full">
            
            {/* TOP ROW: 3 TILES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch relative">

              {/* -------------------------------------------------------------------
                  TILE 1 (Top-Left, 3 cols): ARAV GAUTAM & 3D RUBIK'S CUBE (h-[420px])
                  ------------------------------------------------------------------- */}
              <div className="lg:col-span-3 w-full h-[420px] rounded-[26px] bg-[#0a0a0f]/90 border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between overflow-hidden group shadow-[inset_0_0_80px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 isolate">
                {/* Header Info */}
                <div className="relative z-10 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight flex items-baseline gap-1.5">
                      <span>Arav</span>
                      <span className="font-serif italic font-normal text-gray-300">Gautam</span>
                    </h2>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 tracking-wider">
                      <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                      <span>MP, INDIA</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-300 font-semibold">{liveTimeStr || '12:30 PM'}</span>
                    </div>
                  </div>
                </div>

                {/* 3D Segmented Obsidian Rubik's Cube */}
                <div data-cursor="drag" className="relative z-10 flex-1 w-full flex items-center justify-center my-0.5">
                  <RubiksCube3D />
                </div>

                {/* Bottom Socials */}
                <div className="relative z-10 pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {portfolioData.socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => soundEngine.playHover()}
                        className="w-7 h-7 rounded-full bg-white/[0.04] hover:bg-white/[0.12] border border-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
                        title={link.label}
                      >
                        {getSocialIcon(link.id)}
                      </a>
                    ))}
                  </div>
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">
                    3D Engine
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------------------------
                  TILE 2 (Top-Center, 6 cols): BACKEND ENGINEER INTERN @ DREAM FILLER (h-[420px])
                  Physical circular cutout at bottom-center via radial-gradient mask!
                  All text strictly kept in upper 50% so ZERO text is behind the watch!
                  ------------------------------------------------------------------- */}
              <div
                style={
                  isDesktop
                    ? {
                        maskImage:
                          'radial-gradient(circle 160px at 50% calc(100% + 8px), transparent 0, transparent 160px, black 160.5px)',
                        WebkitMaskImage:
                          'radial-gradient(circle 160px at 50% calc(100% + 8px), transparent 0, transparent 160px, black 160.5px)',
                      }
                    : undefined
                }
                className="lg:col-span-6 w-full h-[420px] rounded-[26px] bg-[#0a0a0f]/90 border border-white/10 hover:border-white/20 p-6 sm:p-7 flex flex-col justify-between overflow-hidden group shadow-[inset_0_0_80px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 isolate relative"
              >
                {/* Upper Section: Content strictly located in the top portion */}
                <div className="relative z-10 space-y-4">
                  {/* Top Bar with Badges and Explore Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-white/5">
                        <Crosshair className="w-3 h-3 text-blue-400" />
                      </div>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-mono">
                        DETAIL-DRIVEN SYSTEMS
                      </span>
                    </div>

                    <button
                      onClick={() => handleExplore('/experience')}
                      onMouseEnter={() => soundEngine.playHover()}
                      className="px-3.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-[11px] flex items-center gap-1 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Explore Experience</span>
                      <ArrowUpRight className="w-3 h-3 text-blue-400" />
                    </button>
                  </div>

                  {/* Primary Headline & Authentic Grounded Description */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white tracking-tight leading-tight">
                      Backend Engineer Intern{' '}<br />
                      <span className="font-serif italic font-normal text-blue-400">
                        @ Dream Filler
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 font-normal leading-relaxed max-w-xl">
                      Engineering scalable backend architectures, high-performance RESTful APIs, and robust data management layers.
                    </p>
                  </div>
                </div>

                {/* Bottom area: Completely empty, allowing the 160px circular cutout to breathe without any text collisions! */}
                <div className="h-6" />
              </div>

              {/* -------------------------------------------------------------------
                  TILE 3 (Top-Right, 3 cols): LET'S CONNECT / BUILD SOMETHING (h-[420px])
                  ------------------------------------------------------------------- */}
              <div className="lg:col-span-3 w-full h-[420px] rounded-[26px] bg-[#0a0a0f]/90 border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between overflow-hidden group shadow-[inset_0_0_80px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 isolate">
                {/* Top Status */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
                    GET IN TOUCH
                  </span>
                </div>

                {/* Middle Headline */}
                <div className="relative z-10 space-y-1.5 my-auto py-2">
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white uppercase tracking-tight leading-none">
                    LET'S BUILD SOMETHING
                  </h3>
                  <p className="font-serif italic text-lg sm:text-xl text-gray-200">
                    that actually works.
                  </p>
                  <p className="text-xs text-gray-400 font-normal leading-relaxed pt-1">
                    Open for backend engineering roles, high-throughput architectures, and collaborative builds.
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="relative z-10 space-y-2 pt-2 border-t border-white/[0.06]">
                  <button
                    data-cursor="copy"
                    onClick={handleCopyEmail}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition-all flex items-center justify-between cursor-none group/email"
                    title="Click to copy email address"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Crosshair className="w-3 h-3 text-blue-400 shrink-0 group-hover/email:rotate-45 transition-transform" />
                      <span className="font-mono text-[11px] text-white font-medium truncate">
                        {portfolioData.personal.email}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-wider text-gray-500 group-hover/email:text-blue-400 hidden sm:inline ml-1">
                      COPY
                    </span>
                  </button>

                  <button
                    onClick={() => handleExplore('/contact')}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="w-full py-2.5 rounded-xl bg-white text-black hover:bg-gray-200 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Connect Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* BOTTOM ROW: 2 TILES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch relative mt-4">

              {/* -------------------------------------------------------------------
                  TILE 4 (Bottom-Left): ADAPTABLE ACROSS TIME ZONES & 3D EARTH GLOBE (h-[320px])
                  Physical circular cutout at top-right via radial-gradient mask!
                  Content contours organically along the clock circumference arc (~16px margin).
                  Earth globe is large, prominent, and optimal for 3D drag interaction.
                  ------------------------------------------------------------------- */}
              <div
                style={
                  isDesktop
                    ? {
                        maskImage:
                          'radial-gradient(circle 160px at calc(100% + 8px) -8px, transparent 0, transparent 160px, black 160.5px)',
                        WebkitMaskImage:
                          'radial-gradient(circle 160px at calc(100% + 8px) -8px, transparent 0, transparent 160px, black 160.5px)',
                      }
                    : undefined
                }
                className="w-full h-[320px] rounded-[26px] bg-[#0a0a0f]/90 border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between overflow-hidden group shadow-[inset_0_0_80px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 isolate relative"
              >
                {/* Main Body: Earth Globe on Left + Contoured Timezone Controls on Right */}
                <div className="relative z-10 flex-1 flex items-center justify-between gap-4 my-auto">
                  {/* Left: 3D Dotted Particle Earth Globe (Large, Prominent & Interactive) */}
                  <div
                    data-cursor="drag"
                    className="relative w-[210px] sm:w-[235px] lg:w-[250px] h-[210px] sm:h-[235px] lg:h-[250px] shrink-0 flex items-center justify-center touch-none select-none"
                  >
                    <div className="absolute inset-2 bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent rounded-full blur-2xl pointer-events-none -z-10" />
                    <InteractiveEarthGlobe
                      activeLocation={activeLocation}
                      onLocationSelect={(loc) => setActiveLocation(loc)}
                    />
                  </div>

                  {/* Right: Info & Stepped Live Timezone Cards that contour the clock circumference */}
                  <div className="flex-1 flex flex-col justify-between h-full py-1 items-start lg:items-end">
                    {/* Header hugging the clock edge at the top */}
                    <div className="space-y-0.5 max-w-[210px] lg:mr-[140px] text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                          AVAILABLE GLOBALLY
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-display font-bold text-white leading-tight">
                        Adaptable across{' '}
                        <span className="font-serif italic font-normal text-blue-400 block sm:inline">
                          time zones
                        </span>
                      </h3>
                    </div>

                    {/* Small & Compact Timezone Buttons - Positioned close to watch circumference */}
                    <div className="flex flex-col gap-1.5 w-full items-start lg:items-end pt-1">
                      {/* UK: Along upper clock arc */}
                      {(() => {
                        const item = TIMEZONE_CONFIG.uk;
                        const isSelected = activeLocation === 'uk';
                        const FlagComponent = item.flag;
                        return (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setActiveLocation('uk');
                            }}
                            onMouseEnter={() => soundEngine.playHover()}
                            className={`group/btn relative isolate text-[11px] rounded-lg flex items-center justify-between px-2.5 py-1 border transition-all duration-200 cursor-pointer w-[150px] sm:w-[160px] lg:mr-[115px] ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-[0_4px_16px_rgba(255,255,255,0.2)] font-semibold'
                                : 'bg-black/60 text-gray-300 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <FlagComponent />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <span
                              className={`font-mono text-[10px] ${
                                isSelected ? 'text-black font-bold' : 'text-gray-400'
                              }`}
                            >
                              {liveTimes.uk || item.badge}
                            </span>
                          </button>
                        );
                      })()}

                      {/* India: Middle clock arc */}
                      {(() => {
                        const item = TIMEZONE_CONFIG.india;
                        const isSelected = activeLocation === 'india';
                        const FlagComponent = item.flag;
                        return (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setActiveLocation('india');
                            }}
                            onMouseEnter={() => soundEngine.playHover()}
                            className={`group/btn relative isolate text-[11px] rounded-lg flex items-center justify-between px-2.5 py-1 border transition-all duration-200 cursor-pointer w-[150px] sm:w-[160px] lg:mr-[80px] ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-[0_4px_16px_rgba(255,255,255,0.2)] font-semibold'
                                : 'bg-black/60 text-gray-300 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <FlagComponent />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <span
                              className={`font-mono text-[10px] ${
                                isSelected ? 'text-black font-bold' : 'text-gray-400'
                              }`}
                            >
                              {liveTimes.india || item.badge}
                            </span>
                          </button>
                        );
                      })()}

                      {/* USA: Lower clock arc */}
                      {(() => {
                        const item = TIMEZONE_CONFIG.usa;
                        const isSelected = activeLocation === 'usa';
                        const FlagComponent = item.flag;
                        return (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setActiveLocation('usa');
                            }}
                            onMouseEnter={() => soundEngine.playHover()}
                            className={`group/btn relative isolate text-[11px] rounded-lg flex items-center justify-between px-2.5 py-1 border transition-all duration-200 cursor-pointer w-[150px] sm:w-[160px] lg:mr-[45px] ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-[0_4px_16px_rgba(255,255,255,0.2)] font-semibold'
                                : 'bg-black/60 text-gray-300 border-white/10 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <FlagComponent />
                              <span className="font-medium">{item.label}</span>
                            </div>
                            <span
                              className={`font-mono text-[10px] ${
                                isSelected ? 'text-black font-bold' : 'text-gray-400'
                              }`}
                            >
                              {liveTimes.usa || item.badge}
                            </span>
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Bottom Remote Status Row */}
                <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
                    <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                    <span className="text-white font-medium uppercase tracking-wider text-[11px]">REMOTE</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-300 font-semibold text-[11px]">
                      {activeTzObj.label} ({activeTzObj.badge})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                    {activeTzObj.offset}
                  </span>
                </div>
              </div>

              {/* -------------------------------------------------------------------
                  TILE 5 (Bottom-Right): ARCHITECTURES YOU CAN TRUST (h-[320px])
                  Physical circular cutout at top-left via radial-gradient mask!
                  Clearance precision-tuned with comfortable luxury breathing room!
                  ------------------------------------------------------------------- */}
              <div
                style={
                  isDesktop
                    ? {
                        maskImage:
                          'radial-gradient(circle 160px at -8px -8px, transparent 0, transparent 160px, black 160.5px)',
                        WebkitMaskImage:
                          'radial-gradient(circle 160px at -8px -8px, transparent 0, transparent 160px, black 160.5px)',
                      }
                    : undefined
                }
                className="w-full h-[320px] rounded-[26px] bg-[#0a0a0f]/90 border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between overflow-hidden group shadow-[inset_0_0_80px_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all duration-300 isolate relative"
              >
                {/* Upper Section: Contours organically around the clock arc at top-left with generous breathing room */}
                <div className="relative z-10 space-y-2">
                  {/* Tabs Row: Placed alongside clock arc at the top with comfortable clearance */}
                  <div className="flex items-center justify-between gap-2 pl-0 lg:pl-[185px]">
                    <div className="flex items-center gap-1 p-0.5 rounded-full bg-black/60 border border-white/10">
                      {ARCHITECTURE_TABS.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            soundEngine.playClick();
                            setActiveTab(tab.id);
                          }}
                          onMouseEnter={() => soundEngine.playHover()}
                          className={`px-2.5 py-0.5 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer ${
                            activeTab === tab.id
                              ? 'bg-[#181922] text-white font-semibold border border-white/20 shadow-sm'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-blue-400/90 hidden sm:inline">
                      {currentTabObj.tagline}
                    </span>
                  </div>

                  {/* Architecture Spec Card: Heading, description, and pills contoured along clock circle */}
                  <div className="space-y-1">
                    {/* Heading: Comfortable clearance from clock */}
                    <h4 className="text-lg sm:text-xl font-display font-bold text-white tracking-tight leading-tight pl-0 lg:pl-[170px]">
                      {currentTabObj.title}{' '}
                      <span className="font-serif italic font-normal text-gray-300">
                        {currentTabObj.titleItalic}
                      </span>
                    </h4>

                    {/* Description: Comfortable clearance from clock */}
                    <p className="text-xs text-gray-400 leading-relaxed font-normal pl-0 lg:pl-[145px] max-w-xl">
                      {currentTabObj.detail}
                    </p>

                    {/* Pills: Generous clearance ensuring pills NEVER feel squeezed or behind the clock */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5 pl-0 lg:pl-[120px]">
                      {currentTabObj.pills.map((pill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-gray-300"
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div className="relative z-10 flex items-center justify-end pt-2 border-t border-white/[0.06]">
                  <button
                    onClick={() => handleExplore('/work')}
                    onMouseEnter={() => soundEngine.playHover()}
                    className="px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-mono text-xs flex items-center gap-1.5 transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Explore Architectures</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>
              </div>

            </div>

            {/* -------------------------------------------------------------------
                PRECISION CNC CHASSIS & CENTRAL LUXURY CHRONOMETER WATCH
                Outer ring w-[320px] h-[320px] matches the 160px mask cutouts on all 3 cards!
                Watch sits in the center with a uniform 25px floating dark channel!
                ------------------------------------------------------------------- */}
            <div className="hidden lg:flex absolute left-1/2 top-[428px] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-white/20 bg-[#030308] items-center justify-center z-[70] shadow-[0_28px_80px_rgba(0,0,0,0.98),inset_0_0_40px_rgba(0,0,0,0.95)] pointer-events-auto">
              <div className="w-[270px] h-[270px] rounded-full border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
                <LuxuryChronometerWatch timezone={activeTzObj.tz} />
              </div>
            </div>

            {/* -------------------------------------------------------------------
                MOBILE CHRONOMETER WATCH (Rendered neatly between rows on phones)
                ------------------------------------------------------------------- */}
            <div className="flex lg:hidden justify-center my-3">
              <div className="w-[240px] h-[240px] rounded-full border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
                <LuxuryChronometerWatch timezone={activeTzObj.tz} />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: INFINITE MARQUEE
          ========================================================================= */}
      <div className="w-full pb-8">
        <InfiniteMarquee />
      </div>

    </div>
  );
};

export default HomeView;
