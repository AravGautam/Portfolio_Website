import React, { useEffect } from 'react';
import { Volume2, ExternalLink, X, Type, Sparkles } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const AudioCreditsModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      window.__lenis?.stop();
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || 'unset';
        window.__lenis?.start();
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent="true"
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        data-lenis-prevent="true"
        className="relative w-full max-w-lg rounded-2xl bg-[#0a0a0c] border border-white/10 p-6 sm:p-8 shadow-2xl text-left max-h-[85vh] overflow-y-auto custom-skills-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#0781ff]" />
            <h3 className="font-display font-bold text-lg text-white">Audio & Typography Credits</h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close credits"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Credits List */}
        <div className="space-y-4 text-xs font-mono">
          {/* Custom Typography Credits */}
          <div className="p-3.5 rounded-xl bg-blue-500/[0.05] border border-blue-500/20 space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-semibold text-sm">Always in the Star</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                  Signature Script
                </span>
              </div>
              <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                Handcrafted by <strong className="text-white font-medium">Thomas Boucherie (BlackFridayFont FMF)</strong> in Rodrigues Island, Mauritius. Used for custom signature accents, interactive action buttons, and loading sequences.
              </p>
              <a
                href="https://blackfridayfont.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-cyan-300 hover:underline text-[11px]"
              >
                <span>Visit BlackFridayFont.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-cyan-400" />
                  <span className="text-white font-semibold text-sm">Geist Mono</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  Technical Monospace
                </span>
              </div>
              <p className="text-gray-300 text-[11px] font-sans leading-relaxed">
                Modern developer typeface designed by <strong className="text-white font-medium">Vercel</strong>. Used for high-precision code, technical tags, system handles, and metrics across the portfolio.
              </p>
              <a
                href="https://vercel.com/font"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 hover:underline text-[11px]"
              >
                <span>Learn about Geist Mono</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Item 1 */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">122276__zimbot__squirble9.wav</span>
              <span className="text-[10px] text-gray-400">Loading FX</span>
            </div>
            <p className="text-gray-400 text-[11px] font-sans">
              Authored by <strong className="text-gray-300">zimbot</strong> under Creative Commons on Freesound.
            </p>
            <a
              href="https://freesound.org/people/zimbot/sounds/122276/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0781ff] hover:underline pt-1 text-[11px]"
            >
              <span>View on Freesound.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Item 2: Default BGM */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">690365__xcreenplay__skyparty-invite.wav</span>
              <span className="text-[10px] text-gray-400">Default BGM</span>
            </div>
            <p className="text-gray-400 text-[11px] font-sans">
              Authored by <strong className="text-gray-300">xcreenplay</strong> under Creative Commons on Freesound.
            </p>
            <a
              href="https://freesound.org/people/xcreenplay/sounds/690365/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0781ff] hover:underline pt-1 text-[11px]"
            >
              <span>View on Freesound.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Item 3: Projects BGM */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">482961__yellowtree__super-strange-synths.wav</span>
              <span className="text-[10px] text-gray-400">Projects BGM</span>
            </div>
            <p className="text-gray-400 text-[11px] font-sans">
              Authored by <strong className="text-gray-300">yellowtree</strong> under Creative Commons on Freesound.
            </p>
            <a
              href="https://freesound.org/people/yellowtree/sounds/482961/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0781ff] hover:underline pt-1 text-[11px]"
            >
              <span>View on Freesound.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Item 4: Contact BGM */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">ambient-bgm.mp3</span>
              <span className="text-[10px] text-gray-400">Contact & Connection BGM</span>
            </div>
            <p className="text-gray-400 text-[11px] font-sans">
              Deep space ambient atmospheric soundscape track.
            </p>
          </div>
        </div>

        {/* Footer info note */}
        <p className="text-[11px] text-gray-500 font-sans mt-5">
          All audio, soundscapes, and typographic assets are used strictly for non-commercial portfolio and educational demonstration under fair use, open Creative Commons attribution, and personal creator licenses.
        </p>
      </div>
    </div>
  );
};

export default AudioCreditsModal;
