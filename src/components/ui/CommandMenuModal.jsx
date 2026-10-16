import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Command,
  Home,
  User,
  FolderGit2,
  Briefcase,
  FlaskConical,
  Mail,
  Copy,
  ExternalLink,
  Volume2,
  VolumeX,
  X,
  Github,
  Linkedin,
  Twitter,
  ArrowRight
} from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { soundEngine } from '../../audio/soundEngine';
import { showToast } from './Toast';

export const CommandMenuModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(soundEngine.isMuted());
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMuted(soundEngine.isMuted());
    const onMuteChange = (e) => setIsMuted(e.detail.muted);
    window.addEventListener('sound-mute-change', onMuteChange);
    return () => window.removeEventListener('sound-mute-change', onMuteChange);
  }, []);

  useEffect(() => {
    setIsMuted(soundEngine.isMuted());
    const onMuteChange = (e) => {
      setIsMuted(e.detail.muted);
    };
    window.addEventListener('sound-mute-change', onMuteChange);
    return () => window.removeEventListener('sound-mute-change', onMuteChange);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
      setIsMuted(soundEngine.isMuted());
    }
  }, [isOpen]);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        soundEngine.playClick();
        if (isOpen) {
          onClose();
        } else {
          // Open menu via custom event or state
          const event = new CustomEvent('toggle-command-menu');
          window.dispatchEvent(event);
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleNavigate = (_id, path) => {
    soundEngine.playClick();
    onClose();
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    soundEngine.playClick();
    navigator.clipboard.writeText(portfolioData.personal.email);
    showToast('Email copied: working.aravgautam@gmail.com');
    onClose();
  };

  const handleToggleSound = () => {
    soundEngine.playClick();
    const newMuted = soundEngine.toggleMute();
    setIsMuted(newMuted);
    showToast(newMuted ? 'Sound effects muted' : 'Sound effects enabled');
  };

  const COMMAND_ITEMS = [
    // Navigation
    { id: 'nav-home', category: 'Navigation', label: 'Go to Home', icon: Home, action: () => handleNavigate('hero', '/') },
    { id: 'nav-about', category: 'Navigation', label: 'Go to About Me', icon: User, action: () => handleNavigate('about', '/about') },
    { id: 'nav-work', category: 'Navigation', label: 'Go to Projects Showcase', icon: FolderGit2, action: () => handleNavigate('projects', '/work') },
    { id: 'nav-exp', category: 'Navigation', label: 'Go to Experience', icon: Briefcase, action: () => handleNavigate('experience', '/experience') },
    { id: 'nav-demos', category: 'Navigation', label: 'Go to Experiments (3D)', icon: FlaskConical, action: () => handleNavigate('experiments', '/experiments') },
    { id: 'nav-contact', category: 'Navigation', label: 'Go to Contact', icon: Mail, action: () => handleNavigate('contact', '/contact') },

    // Quick Actions
    { id: 'act-copy', category: 'Actions', label: 'Copy Email Address', icon: Copy, action: handleCopyEmail },
    {
      id: 'act-resume',
      category: 'Actions',
      label: 'View / Download Resume',
      icon: ExternalLink,
      action: () => {
        soundEngine.playClick();
        window.open(portfolioData.personal.resumeUrl, '_blank');
        onClose();
      }
    },
    { id: 'act-sound', category: 'Actions', label: isMuted ? 'Unmute Audio & Music' : 'Mute Audio & Music', icon: isMuted ? VolumeX : Volume2, action: handleToggleSound },

    // Live Demos
    {
      id: 'demo-fitness',
      category: 'Projects',
      label: 'Launch AI Fitness Tracker (Streamlit)',
      icon: ArrowRight,
      action: () => {
        soundEngine.playClick();
        window.open('https://personal-fitness-tracker-01.streamlit.app/', '_blank');
        onClose();
      }
    },
    {
      id: 'demo-chess',
      category: 'Projects',
      label: 'Play Real-Time Chess (WebSocket App)',
      icon: ArrowRight,
      action: () => {
        soundEngine.playClick();
        window.open('https://minorproject-chessmaster.vercel.app/', '_blank');
        onClose();
      }
    },

    // Socials
    {
      id: 'soc-github',
      category: 'Socials',
      label: 'GitHub Profile (@AravGautam)',
      icon: Github,
      action: () => {
        soundEngine.playClick();
        window.open('https://github.com/AravGautam/', '_blank');
        onClose();
      }
    },
    {
      id: 'soc-linkedin',
      category: 'Socials',
      label: 'LinkedIn Profile (Arav Gautam)',
      icon: Linkedin,
      action: () => {
        soundEngine.playClick();
        window.open('https://www.linkedin.com/in/arav-gautam-007swerty2024/', '_blank');
        onClose();
      }
    },
    {
      id: 'soc-twitter',
      category: 'Socials',
      label: 'Twitter / X (@_i_m_arav__)',
      icon: Twitter,
      action: () => {
        soundEngine.playClick();
        window.open('https://x.com/_i_m_arav__', '_blank');
        onClose();
      }
    }
  ];

  const filteredItems = COMMAND_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99990] bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 sm:pt-28 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#0a0a0c] border border-white/15 shadow-2xl overflow-hidden flex flex-col text-left animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, sections, projects, or links..."
            className="w-full bg-transparent text-sm font-mono text-white placeholder-gray-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/10 sm:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/5">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs font-mono text-gray-500">
              No matching commands found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => {
                    soundEngine.playHover();
                    setSelectedIndex(idx);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0781ff] text-white shadow-md'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                    <span className="text-xs font-mono font-medium">{item.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                      isSelected
                        ? 'bg-black/20 text-white'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3 text-blue-400" />
            <span>K</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandMenuModal;
