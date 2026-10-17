import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Command } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
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
          {/* Brand Left: Ꮧ𝓖 Monogram */}
          <button
            onClick={handleLogoClick}
            onMouseEnter={() => soundEngine.playHover()}
            className="flex items-center text-white hover:text-blue-400 transition-all focus:outline-none cursor-pointer group px-3 py-1.5 rounded-full hover:bg-white/5"
            aria-label="Home"
          >
            <span className="font-display font-bold text-xl tracking-wide select-none">Ꮧ𝓖</span>
          </button>

          {/* Center Floating Island Navbar */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-1.5 pill-nav-chassis px-2 py-1.5 rounded-full backdrop-blur-2xl"
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
                      ? 'bg-white text-black font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.25)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Command Menu */}
          <div className="hidden md:flex items-center gap-2">
            {/* Command Menu (Cmd + K) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setCommandOpen(true);
              }}
              onMouseEnter={() => soundEngine.playHover()}
              className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all focus:outline-none cursor-pointer"
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
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Open Command Menu"
            >
              <Command className="w-4 h-4 text-blue-400" />
            </button>

            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white focus:outline-none cursor-pointer"
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
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-black/95 border-b border-white/10 p-6 backdrop-blur-2xl flex flex-col gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === '/work' && location.pathname === '/projects');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full py-3 px-5 rounded-xl text-left font-mono text-xs tracking-wider flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
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