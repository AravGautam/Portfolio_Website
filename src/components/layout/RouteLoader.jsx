import React, { useState, useEffect } from 'react';
import { soundEngine } from '../../audio/soundEngine';

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789@#$&%';

export const RouteLoader = ({ routeName, isVisible, onFinished }) => {
  const [scrambled, setScrambled] = useState(routeName);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setOpacity(0);
      return;
    }

    setOpacity(1);
    const target = (routeName || 'HOME').toUpperCase();
    let iteration = 0;
    const maxIterations = target.length * 2;

    const interval = setInterval(() => {
      setScrambled(
        target
          .split('')
          .map((char, index) => {
            if (index < iteration / 2) {
              return target[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      iteration += 1;
      if (iteration > maxIterations) {
        clearInterval(interval);
        setScrambled(target);
        setTimeout(() => {
          setOpacity(0);
          setTimeout(() => {
            if (typeof onFinished === 'function') {
              onFinished();
            }
          }, 200);
        }, 120);
      }
    }, 25);

    // Guaranteed fallback auto-dismiss after 600ms so it can NEVER get stuck
    const safetyTimeout = setTimeout(() => {
      clearInterval(interval);
      setScrambled(target);
      setOpacity(0);
      if (typeof onFinished === 'function') {
        onFinished();
      }
    }, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
  }, [routeName, isVisible]);

  if (!isVisible && opacity === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-[9990] bg-[#030308]/60 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none transition-opacity duration-250 ${
        opacity === 0 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3 select-none">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
          <span>LOADING ROUTE</span>
        </div>

        <h2 className="text-5xl sm:text-7xl font-script font-bold text-white tracking-widest drop-shadow-[0_0_24px_rgba(7,129,255,0.4)]">
          {scrambled}
        </h2>

        <div className="w-32 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="w-full h-full bg-[#0781ff]" />
        </div>
      </div>
    </div>
  );
};

export default RouteLoader;

