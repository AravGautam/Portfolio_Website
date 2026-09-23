import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, LayoutList, Layers } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import SoundToggle from '../ui/SoundToggle';
import AGLogo from '../ui/AGLogo';
import { portfolioData } from '../../data/portfolioData';
import { scrollToElement } from '../../hooks/useLenis';

const NAV_ITEMS = [
  { id: 'hero', path: '/', label: 'HOME' },
  { id: 'about', path: '/about', label: 'ABOUT' },
  { id: 'projects', path: '/work', label: 'WORK' },
  { id: 'experience', path: '/experience', label: 'EXPERIENCE' },
  { id: 'experiments', path: '/experiments', label: 'LAB' },
  { id: 'contact', path: '/contact', label: 'CONTACT' },
];

export const Navbar = ({ viewMode = 'scroll', onToggleViewMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (viewMode === 'scroll') {
        const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'experiments', 'contact'];
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 250 && rect.bottom >= 250) {
              setActiveSection(sec === 'skills' ? 'about' : sec);
              break;
            }
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode]);

  const handleNavClick = (item) => {
    soundEngine.playClick();
    setMobileMenuOpen(false);

    if (viewMode === 'scroll') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          scrollToElement(item.id);
        }, 120);
      } else {
        scrollToElement(item.id);
      }
    } else {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3.5 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / AG Logo */}
        <button
          onClick={() => handleNavClick(NAV_ITEMS[0])}
          onMouseEnter={() => soundEngine.playHover()}
          className="flex items-center gap-3.5 group focus:outline-none text-left"
        >
          <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <AGLogo className="w-9 h-9" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white tracking-tight flex items-center gap-1.5">
              <span>{portfolioData.personal.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#b46f32]" />
            </div>
            <div className="font-mono text-[10px] text-gray-400 tracking-wider">
              SOFTWARE ENGINEER & CREATIVE DEV
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links (No Numbers) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-[#0a0a0c] border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
          {NAV_ITEMS.map((item) => {
            const isActive =
              viewMode === 'scroll'
                ? activeSection === item.id
                : location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                onMouseEnter={() => soundEngine.playHover()}
                className={`relative px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center focus:outline-none ${
                  isActive
                    ? 'text-white bg-[#b46f32] font-bold shadow-[0_0_12px_rgba(180,111,50,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Utilities: Mode Toggle + Audio + Resume */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* View Mode Switcher */}
          {onToggleViewMode && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleViewMode();
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-[#0a0a0c] border border-white/15 hover:border-[#b46f32]/50 text-gray-300 hover:text-[#b46f32] transition-all flex items-center gap-1.5 shadow-sm"
              title="Toggle between Continuous Scroll and Multi-Route View"
            >
              {viewMode === 'scroll' ? (
                <>
                  <LayoutList className="w-3.5 h-3.5 text-[#b46f32]" />
                  <span className="text-[11px] font-semibold">SCROLL</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-[#b46f32]" />
                  <span className="text-[11px] font-semibold">ROUTES</span>
                </>
              )}
            </button>
          )}

          <SoundToggle />

          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => soundEngine.playHover()}
            onClick={() => soundEngine.playClick()}
            className="text-xs font-mono px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-gray-200 hover:border-[#b46f32]/50 hover:text-[#b46f32] transition-all flex items-center gap-1.5"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#b46f32]" />
          </a>
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden items-center gap-2">
          {onToggleViewMode && (
            <button
              onClick={() => {
                soundEngine.playClick();
                onToggleViewMode();
              }}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-mono"
            >
              {viewMode === 'scroll' ? 'SCROLL' : 'ROUTES'}
            </button>
          )}

          <SoundToggle />

          <button
            onClick={() => {
              soundEngine.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-[65px] bg-black/95 border-b border-white/10 p-6 backdrop-blur-2xl flex flex-col gap-3 shadow-2xl">
          {NAV_ITEMS.map((item) => {
            const isActive =
              viewMode === 'scroll'
                ? activeSection === item.id
                : location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full py-3 px-4 rounded-xl text-left font-mono text-sm flex items-center justify-between border transition-all ${
                  isActive
                    ? 'bg-[#b46f32]/10 border-[#b46f32]/50 text-[#b46f32] font-bold'
                    : 'border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}

          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 w-full py-3 px-4 rounded-xl font-mono text-xs text-center border border-[#b46f32]/40 bg-[#b46f32]/10 text-white flex items-center justify-center gap-2"
          >
            <span>View Resume</span>
            <ArrowUpRight className="w-4 h-4 text-[#b46f32]" />
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;