import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 4;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => onComplete(), 600);
          }, 250);
          return 100;
        }
        return next;
      });
    }, 35);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#07070a] flex flex-col items-center justify-center p-6 select-none transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#8b5cf6]/15 via-[#00f0ff]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center text-center">
        {/* Hindi Greeting नमस्ते */}
        <div className="mb-6">
          <h1
            className="text-6xl sm:text-7xl font-bold bg-gradient-to-r from-purple-300 via-cyan-200 to-white bg-clip-text text-transparent mb-2 tracking-wide"
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              lineHeight: '1.2',
              filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.35))'
            }}
          >
            नमस्ते
          </h1>
          <p className="text-gray-400 text-sm tracking-wide font-normal">
            Welcome to my digital space
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-64 sm:w-72 bg-white/5 h-1 rounded-full overflow-hidden mb-3 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#00f0ff] via-[#8b5cf6] to-white transition-all duration-150 ease-out rounded-full shadow-lg shadow-[#00f0ff]/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* English NAMASTE + Progress below bar */}
        <div className="flex items-center justify-between w-64 sm:w-72 text-xs text-gray-400 font-mono tracking-widest">
          <span className="text-gray-300 font-semibold tracking-[0.25em]">NAMASTE</span>
          <span className="text-[#00f0ff] font-medium">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;