import React, { useState } from 'react';
import { Volume2, ExternalLink, X, Info } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

export const AudioCreditsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#0a0a0c] border border-white/10 p-6 sm:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <Volume2 className="w-5 h-5 text-[#b46f32]" />
            <h3 className="font-display font-bold text-lg text-white">Audio & Sound Credits</h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close credits"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Credits List */}
        <div className="space-y-4 text-xs font-mono">
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
              className="inline-flex items-center gap-1 text-[#b46f32] hover:underline pt-1 text-[11px]"
            >
              <span>View on Freesound.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Item 2 */}
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
              className="inline-flex items-center gap-1 text-[#b46f32] hover:underline pt-1 text-[11px]"
            >
              <span>View on Freesound.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Item 3 */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">ambient-bgm.mp3</span>
              <span className="text-[10px] text-gray-400">Ambient Background Music</span>
            </div>
            <p className="text-gray-400 text-[11px] font-sans">
              Deep space ambient atmospheric soundscape track.
            </p>
          </div>
        </div>

        {/* Footer info note */}
        <p className="text-[11px] text-gray-500 font-sans mt-5">
          All audio assets are used strictly for non-commercial portfolio and educational demonstration under fair use and open Creative Commons attribution.
        </p>
      </div>
    </div>
  );
};

export default AudioCreditsModal;
