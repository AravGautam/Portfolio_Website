import React, { useEffect, useRef } from 'react';

/**
 * High-Performance 120fps Custom Cursor
 * - Hardware lerp tracking via requestAnimationFrame (0ms React re-render overhead)
 * - Default: Crisp solid white dot + smooth trailing ring
 * - Hover on components / interactive elements / cube / cards:
 *   - Fully expands into a prominent 84px solid white badge
 *   - Center dot smoothly scales to 0 (no weird double-dot glitch)
 *   - Bold black typography inside ("DRAG", "ROTATING", "EXPLORE", "VIEW", "COPY", "OPEN", "CLICK")
 *   - On mouse hold: provides tactile scale compression (0.91) and dynamic state ('ROTATING', 'COPIED')
 * - Desktop native cursor strictly hidden via unlayered CSS so browser hand never appears
 */
const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    // Disable on touch / mobile devices
    if (
      typeof window === 'undefined' ||
      window.innerWidth < 1024 ||
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isMouseDown = false;
    let isVisible = false;
    let currentMode = 'default'; // 'default' | 'badge'
    let currentLabel = '';

    const updateHoverState = (target) => {
      if (!target || !(target instanceof Element)) {
        currentMode = 'default';
        currentLabel = '';
        return;
      }

      // 1. Explicit data-cursor attribute
      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        const val = (cursorTarget.getAttribute('data-cursor') || 'drag').toLowerCase();
        currentMode = 'badge';
        if (val === 'drag') {
          currentLabel = isMouseDown ? 'ROTATING' : 'DRAG';
        } else if (val === 'explore') {
          currentLabel = 'EXPLORE';
        } else if (val === 'view') {
          currentLabel = 'VIEW';
        } else if (val === 'copy') {
          currentLabel = isMouseDown ? 'COPIED' : 'COPY';
        } else if (val === 'open') {
          currentLabel = 'OPEN';
        } else {
          currentLabel = val.toUpperCase();
        }
        return;
      }

      // 2. Three.js Canvas / 3D WebGL element
      const isCanvas = target.closest('canvas');
      if (isCanvas) {
        currentMode = 'badge';
        currentLabel = isMouseDown ? 'ROTATING' : 'DRAG';
        return;
      }

      // 3. Links, Buttons, Inputs, Interactive Elements
      const isClickable = target.closest(
        'a, button, [role="button"], [role="link"], input, select, textarea, .cursor-pointer, [data-interactive]'
      );
      if (isClickable) {
        currentMode = 'badge';
        const text = (isClickable.textContent || '').trim().toLowerCase();
        const href = isClickable.getAttribute('href') || '';
        const title = (isClickable.getAttribute('title') || '').toLowerCase();
        const isExternal =
          isClickable.matches('a[target="_blank"]') ||
          href.startsWith('http') ||
          href.includes('drive.google') ||
          text.includes('resume');

        if (text.includes('copy') || text.includes('email') || title.includes('copy')) {
          currentLabel = isMouseDown ? 'COPIED' : 'COPY';
        } else if (isExternal || text.includes('resume') || isClickable.querySelector('svg.lucide-external-link, svg.lucide-arrow-up-right')) {
          currentLabel = 'OPEN';
        } else if (text.includes('project') || text.includes('work') || text.includes('demo') || text.includes('code')) {
          currentLabel = 'VIEW';
        } else if (text.includes('explore') || text.includes('philosophy')) {
          currentLabel = 'EXPLORE';
        } else if (text.includes('contact') || text.includes('connect')) {
          currentLabel = 'CONNECT';
        } else if (isClickable.closest('nav')) {
          currentLabel = 'GO';
        } else {
          currentLabel = 'CLICK';
        }
        return;
      }

      // 4. Home Page Bento Cards & Major Sections
      const isBentoCard = target.closest(
        '.rounded-3xl, .rounded-2xl, [data-card], article, section#bento-showcase > div > div > div'
      );
      if (isBentoCard) {
        currentMode = 'badge';
        const cardText = (isBentoCard.textContent || '').toLowerCase();
        if (cardText.includes('arav gautam') || isBentoCard.querySelector('canvas')) {
          currentLabel = isMouseDown ? 'ROTATING' : 'DRAG';
        } else if (cardText.includes('philosophy') || cardText.includes('watch') || cardText.includes('systems')) {
          currentLabel = 'EXPLORE';
        } else if (cardText.includes("let's build") || cardText.includes('available for work')) {
          currentLabel = 'CONNECT';
        } else if (cardText.includes('experience') || cardText.includes('engineer')) {
          currentLabel = 'VIEW';
        } else {
          currentLabel = 'EXPLORE';
        }
        return;
      }

      // Default state
      currentMode = 'default';
      currentLabel = '';
    };

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      updateHoverState(e.target);
    };

    const onMouseDown = (e) => {
      isMouseDown = true;
      updateHoverState(e.target);
    };

    const onMouseUp = (e) => {
      isMouseDown = false;
      updateHoverState(e.target);
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.body.addEventListener('mouseleave', onMouseLeave, { passive: true });

    let animId;
    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const render = () => {
      // 1:1 Instant tracking for center dot
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${
        currentMode === 'badge' ? 0 : 1
      })`;

      // Smooth damped lerp for follower ring/badge
      ringX = lerp(ringX, mouseX, 0.28);
      ringY = lerp(ringY, mouseY, 0.28);

      const isBadge = currentMode === 'badge';
      const ringSize = isBadge ? 84 : 34;
      const ringScale = isMouseDown ? 0.91 : 1;

      ring.style.width = `${ringSize}px`;
      ring.style.height = `${ringSize}px`;
      ring.style.backgroundColor = isBadge ? '#ffffff' : 'transparent';
      ring.style.borderColor = isBadge ? '#ffffff' : 'rgba(255, 255, 255, 0.35)';
      ring.style.boxShadow = isBadge
        ? '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.25)'
        : 'none';
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;

      label.textContent = currentLabel;
      label.style.opacity = isBadge ? '1' : '0';

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none select-none z-[999999]">
      {/* Crisp White Center Dot (scales to 0 when badge expands) */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] pointer-events-none z-[999999] opacity-0 transition-[transform,opacity] duration-200 ease-out will-change-transform"
      />

      {/* Smooth Trailing Follower Ring / Expands into Large Solid White Badge */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[999998] opacity-0 transition-[width,height,background-color,border-color,box-shadow,opacity] duration-220 ease-out will-change-transform flex items-center justify-center text-center overflow-hidden"
        style={{
          width: '34px',
          height: '34px',
        }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[11px] font-black tracking-widest text-black uppercase transition-opacity duration-150 leading-none pointer-events-none select-none"
        />
      </div>
    </div>
  );
};

export default CustomCursor;