import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';
import { Menu, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['hero', 'projects', 'skills', 'about', 'experiments', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 220 && rect.bottom >= 220) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navLinks = [
    { id: 'projects', label: 'Work' },
    { id: 'skills', label: 'Skills' },
    { id: 'about', label: 'About' },
    { id: 'experiments', label: 'Lab' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#07070a]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-transparent border-b border-transparent py-5 sm:py-7'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand / Name */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-3 group text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00f0ff] to-[#8b5cf6] p-[1.5px] flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#07070a] rounded-full flex items-center justify-center">
              <span className="font-display text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors">
                AG
              </span>
            </div>
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-tight text-white group-hover:text-[#00f0ff] transition-colors flex items-center gap-2">
              <span>Arav Gautam</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" title="Available for work" />
            </div>
            <div className="text-[11px] text-gray-400 font-normal hidden sm:block">
              Full-Stack Developer
            </div>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0e0e14]/80 border border-white/10 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-xs px-4 py-1.5 rounded-full transition-all duration-300 font-medium ${
                  isActive
                    ? 'text-black bg-[#00f0ff] shadow-md font-semibold'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={portfolioData.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-white/15 hover:border-[#00f0ff]/50 bg-white/[0.02] hover:bg-[#00f0ff]/10 text-gray-300 hover:text-white transition-all font-medium"
          >
            <span>Resume</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00f0ff]" />
          </a>

          <button
            onClick={() => scrollTo('contact')}
            className="text-xs px-4 py-2 rounded-full bg-white text-black font-semibold hover:bg-[#00f0ff] hover:shadow-lg transition-all duration-300"
          >
            Let's Talk
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <button
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#00f0ff]/50 focus:outline-none"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-200" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[290px] bg-[#07070a]/98 border-l border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <div className="mb-8 pt-4">
                <h3 className="font-display font-bold text-white text-lg">Arav Gautam</h3>
                <p className="text-xs text-gray-400">Full-Stack & Creative Developer</p>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  return (
                    <SheetClose asChild key={link.id}>
                      <button
                        onClick={() => scrollTo(link.id)}
                        className={`text-sm text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between font-medium ${
                          isActive
                            ? 'bg-[#00f0ff]/15 text-[#00f0ff] font-semibold'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />}
                      </button>
                    </SheetClose>
                  );
                })}
              </nav>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-3">
              <a
                href={portfolioData.personal.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full text-xs py-3 rounded-xl border border-white/15 bg-white/5 text-white font-medium hover:border-[#00f0ff]"
              >
                <span>View Resume</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#00f0ff]" />
              </a>
              <p className="text-[11px] text-center text-gray-400">
                Satna, India • VITS 2023–2027
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;