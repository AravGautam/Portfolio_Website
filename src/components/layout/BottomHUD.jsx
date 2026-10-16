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
      {/* Subtle Fixed Bottom-Left Minimal Icon Dock */}
      <aside
        aria-label="Audio Controls and Site Credits"
        className="fixed bottom-5 left-5 sm:left-7 z-40 flex items-center gap-2 bg-[#0a0a0c]/80 border border-white/10 backdrop-blur-xl p-1.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 hover:border-[#0781ff]/40"
      >
        {/* Subtle Sound Icon */}
        <button
          onClick={toggleSound}
          onMouseEnter={() => soundEngine.playHover()}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
          title={muted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
        >
          {muted ? (
            <VolumeX className="w-3.5 h-3.5 text-gray-500 hover:text-gray-300 transition-colors" />
          ) : (
            <div className="flex items-end gap-[2px] h-3 w-3">
              <span className="w-[1.5px] bg-[#0781ff] rounded-full h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
              <span className="w-[1.5px] bg-[#0781ff] rounded-full h-2 animate-[pulse_1.1s_ease-in-out_infinite_0.2s]" />
              <span className="w-[1.5px] bg-[#0781ff] rounded-full h-2.5 animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
            </div>
          )}
        </button>

        <span className="w-[1px] h-3 bg-white/15" />

        {/* Subtle Credits Icon */}
        <button
          onClick={() => {
            soundEngine.playClick();
            setCreditsOpen(true);
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0781ff] hover:bg-white/10 transition-colors focus:outline-none"
          title="Audio & Project Credits"
          aria-label="View credits"
        >
          <Sparkles className="w-3.5 h-3.5 text-gray-400 hover:text-[#0781ff] transition-colors" />
        </button>
      </aside>

      {/* Audio & Project Credits Modal */}
      <AudioCreditsModal isOpen={creditsOpen} onClose={() => setCreditsOpen(false)} />
    </>
  );
};

export default BottomHUD;
