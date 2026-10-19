import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Command, ChevronDown, FlaskConical, PenTool } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import CommandMenuModal from '../ui/CommandMenuModal';
import ShockwaveButton from '../ui/ShockwaveButton';

const NAV_ITEMS = [
  { id: 'hero', path: '/', label: 'Home' },
  { id: 'about', path: '/about', label: 'About' },
  { id: 'projects', path: '/work', label: 'Projects' },
  { id: 'experience', path: '/experience', label: 'Experience' },
  { id: 'contact', path: '/contact', label: 'Contact' },
];

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggleCommand = () => setCommandOpen((prev) => !prev);
    window.addEventListener('toggle-command-menu', handleToggleCommand);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleClickOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('toggle-command-menu', handleToggleCommand);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (item) => {
    soundEngine.playClick();
    setMobileMenuOpen(false);
    setMoreOpen(false);
    navigate(item.path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMoreItemClick = (path, hashId) => {
    soundEngine.playClick();
    setMoreOpen(false);
    setMobileMenuOpen(false);
    if (location.pathname === path) {
      const el = document.getElementById(hashId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`${path}#${hashId}`);
    }
  };

  const handleLogoClick = () => {
    soundEngine.playClick();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isMoreActive = location.pathname === '/experiments';

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
            <span className="font-display font-bold text-3xl tracking-wide select-none">Ꮧ𝓖</span>
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
                <ShockwaveButton
                  key={item.id}
                  text={item.label}
                  active={isActive}
                  initialColor={isActive ? 'white' : 'black'}
                  onNavigate={() => handleNavClick(item)}
                  navigateDelay={220}
                  className="px-4 py-1.5 rounded-full text-xs font-mono font-medium h-[32px] min-w-[72px]"
                />
              );
            })}

            {/* More Menu Pill (contains Labs & Signatures in one route) */}
            <div className="relative" ref={moreRef}>
              <ShockwaveButton
                text="More"
                active={isMoreActive}
                initialColor={isMoreActive ? 'white' : 'black'}
                onClick={() => {
                  soundEngine.playClick();
                  setMoreOpen((prev) => !prev);
                }}
                icon={
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`}
                  />
                }
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium h-[32px] flex items-center gap-1 cursor-pointer"
              />

              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 p-1.5 rounded-2xl bg-[#0b0d14]/95 border border-white/12 backdrop-blur-2xl shadow-2xl flex flex-col gap-1 z-50">
                  <button
                    onClick={() => handleMoreItemClick('/experiments', 'labs')}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">Labs</span>
                      <span className="text-[10px] text-gray-400">3D WebGL Prototypes</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleMoreItemClick('/experiments', 'signatures')}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-mono text-gray-300 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white">Signatures</span>
                      <span className="text-[10px] text-gray-400">Guestbook Wall</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Controls: Command Menu */}
          <div className="hidden md:flex items-center gap-2">
            <ShockwaveButton
              icon={<Command className="w-3.5 h-3.5" />}
              initialColor="black"
              autoReset={true}
              resetDelay={800}
              onClick={() => {
                soundEngine.playClick();
                setCommandOpen(true);
              }}
              className="w-9 h-9 min-w-[36px] p-0 flex items-center justify-center rounded-full"
              title="Command Menu (Cmd+K)"
              ariaLabel="Open Command Menu"
            />
          </div>

          {/* Mobile Right Controls: Command & Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <ShockwaveButton
              icon={<Command className="w-4 h-4 text-blue-400" />}
              initialColor="black"
              autoReset={true}
              resetDelay={800}
              onClick={() => {
                soundEngine.playClick();
                setCommandOpen(true);
              }}
              className="w-9 h-9 min-w-[36px] p-0 flex items-center justify-center rounded-full"
              ariaLabel="Open Command Menu"
            />

            <button
              onClick={() => {
                soundEngine.playClick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="w-9 h-9 rounded-full pill-btn-3d flex items-center justify-center text-gray-300 hover:text-white focus:outline-none cursor-pointer"
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
                <ShockwaveButton
                  key={item.id}
                  text={item.label}
                  active={isActive}
                  initialColor={isActive ? 'white' : 'black'}
                  onNavigate={() => handleNavClick(item)}
                  navigateDelay={220}
                  className="w-full py-3 px-5 rounded-xl text-left font-mono text-xs tracking-wider h-[44px]"
                />
              );
            })}

            {/* Mobile More Section (Labs & Signatures) */}
            <div className="pt-2 mt-1 border-t border-white/10 flex flex-col gap-1.5">
              <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-gray-500">
                More
              </div>
              <button
                onClick={() => handleMoreItemClick('/experiments', 'labs')}
                className={`w-full py-2.5 px-4 rounded-xl text-left font-mono text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  location.pathname === '/experiments' ? 'bg-white/10 text-white font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Labs</span>
                </span>
                <span className="text-[10px] text-gray-500">3D Prototypes</span>
              </button>
              <button
                onClick={() => handleMoreItemClick('/experiments', 'signatures')}
                className="w-full py-2.5 px-4 rounded-xl text-left font-mono text-xs flex items-center justify-between text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
              >
                <span className="flex items-center gap-2">
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Signatures</span>
                </span>
                <span className="text-[10px] text-gray-500">Guestbook</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;