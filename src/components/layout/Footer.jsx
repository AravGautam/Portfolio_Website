import React from 'react';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 px-6 md:px-12 bg-[#050508] border-t border-white/5 text-gray-400 text-xs font-normal">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="text-white font-display font-bold text-sm tracking-tight mb-1">
            Arav Gautam
          </div>
          <div>
            &copy; {new Date().getFullYear()} • Computer Science & Engineering Student at VITS, RGPV
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
            <span>Designed & Engineered by Arav</span>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-colors"
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