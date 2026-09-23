import { useEffect, useRef } from 'react';
import { soundEngine } from '../audio/soundEngine';

/**
 * Custom hook to attach global hover and interaction sound effects to any
 * hoverable section, card, button, link, and interactive element across the entire portfolio.
 */
export function useGlobalHoverSound() {
  const lastHoveredRef = useRef(null);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Unlock Web Audio on first user gesture
    const unlockAudio = () => {
      soundEngine.initContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('pointermove', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
    window.addEventListener('pointermove', unlockAudio, { once: true, passive: true });
    window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

    // Selector for all hoverable sections, cards, and interactive components
    const interactiveSelector = [
      'a',
      'button',
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
      'nav a',
      'section',
      'article',
      '[class*="hover:"]',
      '[class*="group"]'
    ].join(', ');

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof Element)) return;

      // Find nearest hoverable container or interactive element
      let hoverTarget = target.closest(interactiveSelector);

      // Check computed pointer cursor as fallback
      if (!hoverTarget) {
        try {
          const computedCursor = window.getComputedStyle(target).cursor;
          if (computedCursor === 'pointer') {
            hoverTarget = target;
          }
        } catch {
          // Ignore
        }
      }

      if (hoverTarget) {
        // Only trigger if we entered a different hoverable element
        if (hoverTarget !== lastHoveredRef.current) {
          const now = Date.now();
          // Rate-limit to prevent audio distortion on rapid mouse sweeps
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
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('pointermove', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);
}

export default useGlobalHoverSound;
