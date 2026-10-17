import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';
import AudioCreditsModal from '../ui/AudioCreditsModal';

export const BottomHUD = () => {
  const [muted, setMuted] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  useEffect(() => {
    setMuted(soundEngine.isMuted());
    const onMuteChange = (e) => {
      setMuted(e.detail.muted);
    };
    window.addEventListener('sound-mute-change', onMuteChange);
    return () => window.removeEventListener('sound-mute-change', onMuteChange);
  }, []);

  const toggleSound = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundEngine.playClick();
    }
  };

  return (
    <>
      {/* Subtle Fixed Bottom-Left 3D Blister Pill Dock */}
      <aside
        aria-label="Audio Controls and Site Credits"
        className="fixed bottom-5 left-5 sm:left-7 z-40 flex items-center gap-1.5 pill-nav-chassis p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300"
      >
        {/* Subtle Sound Icon Pill */}
        <button
          onClick={toggleSound}
          onMouseEnter={() => soundEngine.playHover()}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all focus:outline-none cursor-pointer ${
            muted ? 'bg-white/5 border border-white/10 text-gray-400' : 'bg-white/10 hover:bg-white/15 border border-white/20 text-white'
          }`}
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          )}
        </button>

        <span className="w-[1px] h-3 bg-white/15" />

        {/* Subtle Credits Icon Pill */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setCreditsOpen(true);
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all focus:outline-none cursor-pointer"
          title="Audio & Project Credits"
          aria-label="View credits"
        >
          <Sparkles className="w-3.5 h-3.5 text-gray-400 hover:text-white transition-colors" />
        </button>
      </aside>

      {/* Audio & Project Credits Modal */}
      <AudioCreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </>
  );
};

export default BottomHUD;
