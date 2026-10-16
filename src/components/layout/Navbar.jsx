import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Command, ArrowUpRight } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import { portfolioData } from '../../data/portfolioData';
import CommandMenuModal from '../ui/CommandMenuModal';

const NAV_ITEMS = [
  { id: 'hero', path: '/', label: 'Home' },
  { id: 'about', path: '/about', label: 'About' },
  { id: 'projects', path: '/work', label: 'Projects' },
  { id: 'experience', path: '/experience', label: 'Experience' },
  { id: 'experiments', path: '/experiments', label: 'Experiments' },
  { id: 'contact', path: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggleCommand = () => setCommandOpen((prev) => !prev);
    window.addEventListener('toggle-command-menu', handleToggleCommand);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('toggle-command-menu', handleToggleCommand);
    };
  }, []);

  const handleNavClick = (item) => {
    soundEngine.playClick();
    setMobileMenuOpen(false);
    navigate(item.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    soundEngine.playClick();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-3 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl' : 'py-4 bg-transparent'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 flex items-center justify-between">
          {/* Brand Left: Clean Arav Gautam with status dot */}
          <button
            onClick={handleLogoClick}
            onMouseEnter={() => soundEngine.playHover()}
            className="flex items-center gap-2.5 text-white hover:text-blue-400 transition-colors focus:outline-none cursor-pointer group"
            aria-label="Home"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-display font-bold text-lg tracking-tight">Arav Gautam</span>
          </button>

          {/* Center Floating Island Navbar */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1 bg-[#0c0d12]/90 border border-white/10 px-2 py-1.5 rounded-full backdrop-blur-2xl shadow-xl"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === '/work' && location.pathname === '/projects');

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-mono font-medium transition-all duration-200 flex items-center focus:outline-none cursor-pointer ${
                    isActive
                      ? 'text-black bg-white font-bold shadow-md'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Resume + Command Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Resume Button */}
            <a
              href={portfolioData.personal.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => soundEngine.playHover()}
              onClick={() => soundEngine.playClick()}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Resume</span>
              <ArrowUpRight className="w-3 h-3 text-gray-400" />
            </a>

            {/* Command Menu (Cmd + K) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCommandOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors focus:outline-none cursor-pointer"
              title="Command Menu (Cmd+K)"
              aria-label="Open Command Menu"
            >
              <Command className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Right Controls: Command & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setCommandOpen(true);
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Open Command Menu"
            >
              <Command className="w-4 h-4 text-blue-400" />
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-blue-400 transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Command Menu Modal */}
        <CommandMenuModal
          isOpen={commandOpen}
          onClose={() => setCommandOpen(false)}
        />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-black/95 border-b border-white/10 p-6 backdrop-blur-2xl flex flex-col gap-2.5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/work' && location.pathname === '/projects');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full py-3 px-4 rounded-xl text-left font-mono text-xs tracking-wider flex items-center justify-between border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-500/15 border-blue-500/60 text-white font-bold'
                    : 'border-white/5 text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#0781ff]" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
    </>
  );
};

export default Navbar;