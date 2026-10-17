import React from 'react';
import { ArrowUp } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

const Footer = () => {
  const scrollToTop = () => {
    soundEngine.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-6 md:px-12 bg-black/60 backdrop-blur-md border-t border-white/10 text-gray-400 text-xs font-normal">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-white font-display font-bold text-sm tracking-tight mb-1 flex items-center gap-2">
            <span>Arav Gautam</span>
            <span className="text-blue-400 font-mono text-[10px]">&lt;/&gt;</span>
          </div>
          <div className="font-mono text-[11px] text-gray-400">
            &copy; {new Date().getFullYear()} • Computer Science & Engineering Student at VITS, RGPV
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300 font-mono text-xs">
            <span>Designed & Engineered by Arav</span>
          </div>

          <button
            onClick={scrollToTop}
            onMouseEnter={() => soundEngine.playHover()}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-blue-400 text-gray-300 hover:text-blue-400 transition-all cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;