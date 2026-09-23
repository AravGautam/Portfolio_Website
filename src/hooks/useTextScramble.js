import { useState, useCallback, useRef } from 'react';
import { soundEngine } from '../audio/soundEngine';

const GLYPHS = 'ABCDEF0123456789!@#$%^&*<>[]{}~/\\';

/**
 * Custom Hook for Awwwards-style Kinetic Text Scramble
 */
export const useTextScramble = (originalText) => {
  const [displayText, setDisplayText] = useState(originalText);
  const frameRef = useRef(null);

  const trigger = useCallback(() => {
    soundEngine.playHover();
    let iteration = 0;
    const maxIterations = originalText.length * 2.5;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    const scramble = () => {
      setDisplayText(() => {
        return originalText
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 2.5) {
              return originalText[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('');
      });

      if (iteration < maxIterations) {
        iteration += 1;
        frameRef.current = requestAnimationFrame(scramble);
      } else {
        setDisplayText(originalText);
      }
    };

    frameRef.current = requestAnimationFrame(scramble);
  }, [originalText]);

  return { displayText, trigger };
};
