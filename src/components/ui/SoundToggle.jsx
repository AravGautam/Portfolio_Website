import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../audio/soundEngine';
import { Volume2, VolumeX } from 'lucide-react';

const SoundToggle = () => {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(soundEngine.isMuted());
  }, []);

  const toggleSound = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      soundEngine.playClick();
    }
  };

  return (
    <button
      onClick={toggleSound}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-[#b46f32]/40 bg-white/[0.03] hover:bg-[#b46f32]/10 text-gray-300 hover:text-white transition-all text-xs font-mono group focus:outline-none"
      title={muted ? "Unmute Sound (Synthesized Web Audio)" : "Mute Sound"}
      aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
      ) : (
        <div className="flex items-end gap-[2px] h-3 w-3.5">
          <span className="w-[2px] bg-[#b46f32] rounded-full h-full animate-[pulse_0.8s_ease-in-out_infinite]" />
          <span className="w-[2px] bg-[#b46f32] rounded-full h-2 animate-[pulse_1.1s_ease-in-out_infinite_0.2s]" />
          <span className="w-[2px] bg-[#b46f32] rounded-full h-3 animate-[pulse_0.9s_ease-in-out_infinite_0.4s]" />
          <span className="w-[2px] bg-[#b46f32] rounded-full h-1.5 animate-[pulse_1.2s_ease-in-out_infinite_0.1s]" />
        </div>
      )}
      <span className="text-[11px] font-medium hidden sm:inline">
        {muted ? "MUTED" : "AUDIO ON"}
      </span>
    </button>
  );
};

export default SoundToggle;
