import { useEffect } from 'react';
import Lenis from 'lenis';

export const scrollToElement = (elementOrId) => {
  if (typeof window === 'undefined') return;
  const el = typeof elementOrId === 'string'
    ? document.getElementById(elementOrId.replace('#', ''))
    : elementOrId;
  if (!el) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -70, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Lenis Inertial Smooth Scrolling Hook
 */
export const useLenis = () => {
  useEffect(() => {
    // Only initialize smooth scroll on non-touch devices
    if (window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);
};

