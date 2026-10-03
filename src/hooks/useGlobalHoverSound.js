import { useEffect, useRef } from 'react';
import { soundEngine } from '../audio/soundEngine';

/**
 * Global hover sound hook — attaches subtle audio feedback to every
 * interactive element across the portfolio without requiring manual wiring.
 */
export function useGlobalHoverSound() {
  const lastHoveredRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const interactiveSelector = [
      'button',
      'a',
      'input',
      'textarea',
      'select',
      'summary',
      '[role="button"]',
      '[role="link"]',
      '[role="tab"]',
      '[data-cursor]',
      '[data-hoverable]',
      '[data-interactive]',
      '[data-magnetic]',
      '.cursor-pointer',
      'nav button',
      'nav a'
    ].join(', ');

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      let hoverTarget = target.closest(interactiveSelector);

      if (!hoverTarget) {
        try {
          if (window.getComputedStyle(target).cursor === 'pointer') {
            hoverTarget = target;
          }
        } catch { /* ignore */ }
      }

      if (hoverTarget) {
        if (hoverTarget !== lastHoveredRef.current) {
          const now = Date.now();
          if (now - lastTimeRef.current > 35) {
            soundEngine.playHover();
            lastTimeRef.current = now;
          }
          lastHoveredRef.current = hoverTarget;
        }
      } else {
        lastHoveredRef.current = null;
      }
    };

    const handleMouseLeave = () => {
      lastHoveredRef.current = null;
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
}

export default useGlobalHoverSound;
