import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { scrollToElement } from '../../hooks/useLenis';

const NAV_ITEMS = [
  { id: 'hero', label: 'HOME' },
  { id: 'about', label: 'ABOUT' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'projects', label: 'WORK' },
  { id: 'experience', label: 'EXPERIENCE' },
  { id: 'experiments', label: 'LAB' },
  { id: 'contact', label: 'CONTACT' }
];

/**
 * Awwwards-Style Minimalist Telemetry Navigation Rail
 * Clean vertical section index docked safely on the right margin with audio feedback and smooth scroll.
 */
export const SpatialNavHUD = () => {
  const [activeSection, setActiveSection] = useState('hero');

  const scrollTo = (id) => {
    soundEngine.playClick();
    scrollToElement(id);
  };


  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'experiments', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Spatial Section Navigation"
      className="hidden 2xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-5 select-none pointer-events-none"
    >
      {/* Background Track Line */}
      <div className="absolute right-[5px] top-2 bottom-2 w-[1px] bg-white/10 -z-10" />

      {NAV_ITEMS.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            onMouseEnter={() => soundEngine.playHover()}
            className="group pointer-events-auto flex items-center gap-3 text-right focus:outline-none py-1"
          >
            {/* Hover Floating Label (No Number) */}
            <div
              className={`font-mono text-[10px] tracking-widest transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? 'text-[#b46f32] opacity-100 translate-x-0 font-bold'
                  : 'text-gray-500 opacity-0 group-hover:opacity-100 group-hover:text-gray-300 translate-x-2 group-hover:translate-x-0'
              }`}
            >
              <span>{item.label}</span>
            </div>

            {/* Indicator Node */}
            <div className="relative flex items-center justify-center">
              <div
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2.5 h-2.5 bg-[#b46f32] shadow-[0_0_8px_#b46f32]'
                    : 'w-1.5 h-1.5 bg-white/30 group-hover:bg-white/70 group-hover:scale-125'
                }`}
              />
            </div>
          </button>
        );
      })}
    </nav>
  );
};

export default SpatialNavHUD;

