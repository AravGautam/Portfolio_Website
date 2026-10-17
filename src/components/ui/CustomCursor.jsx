import React, { useEffect, useRef } from 'react';

/**
 * High-Performance 120fps Custom Cursor
 * - Hardware lerp tracking via requestAnimationFrame (0ms React re-render overhead)
 * - Default state: SVG target cursor matching user specification (crisp white center dot,
 *   subtle luminous halo, and thin outer circular ring border)
 * - Hover state: Smoothly expands into a prominent badge with context-aware text in the center
 * - Strict context mapping:
 *   - ONLY the Rubik's Cube can rotate -> 'ROTATE' / 'ROTATING'
 *   - Project Visualizers -> 'EXPLORE'
 *   - Experience Highway -> 'INSPECT' / 'EXPLORE'
 *   - 3D Experiments -> 'INTERACT'
 *   - Modals & Command Menu -> 'SELECT', 'CLOSE', 'COPY', 'OPEN' (NEVER 'DRAG')
 *   - Navigation & Links -> 'GO', 'VIEW', 'OPEN', 'CONNECT'
 */
export const CustomCursor = () => {
  const cursorSvgRef = useRef(null);
  const badgeRef = useRef(null);
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

    const cursorSvg = cursorSvgRef.current;
    const badge = badgeRef.current;
    const label = labelRef.current;
    if (!cursorSvg || !badge || !label) return;

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

      // 1. Inside Modals, Command Menu, Dialogs, or Overlays
      const isInsideModal = target.closest(
        '.fixed.inset-0, [role="dialog"], [data-lenis-prevent], [data-modal]'
      );
      if (isInsideModal) {
        // If hovering over input, select, textarea, or search field
        if (target.closest('input, textarea, select')) {
          currentMode = 'default';
          currentLabel = '';
          return;
        }

        // If hovering over interactive buttons / links inside modal
        const modalClickable = target.closest(
          'a, button, [role="button"], [role="link"], .cursor-pointer'
        );
        if (modalClickable) {
          currentMode = 'badge';
          const text = (modalClickable.textContent || '').trim().toLowerCase();
          const title = (modalClickable.getAttribute('title') || '').toLowerCase();
          const ariaLabel = (modalClickable.getAttribute('aria-label') || '').toLowerCase();
          const href = modalClickable.getAttribute('href') || '';

          if (
            text === 'close' ||
            title.includes('close') ||
            ariaLabel.includes('close') ||
            modalClickable.querySelector('svg.lucide-x')
          ) {
            currentLabel = 'CLOSE';
          } else if (text.includes('copy') || title.includes('copy')) {
            currentLabel = isMouseDown ? 'COPIED' : 'COPY';
          } else if (
            text.includes('resume') ||
            href.startsWith('http') ||
            modalClickable.matches('a[target="_blank"]')
          ) {
            currentLabel = 'OPEN';
          } else if (text.includes('sound') || text.includes('mute')) {
            currentLabel = 'SOUND';
          } else {
            currentLabel = 'SELECT';
          }
          return;
        }

        // Inside modal backdrop or container
        currentMode = 'default';
        currentLabel = '';
        return;
      }

      // 2. Explicit data-cursor attribute
      const cursorTarget = target.closest('[data-cursor]');
      if (cursorTarget) {
        const val = (cursorTarget.getAttribute('data-cursor') || '').toLowerCase();
        currentMode = 'badge';

        // ONLY the Rubik's Cube can rotate
        if (val === 'cube') {
          currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
        } else if (val === 'drag') {
          // If legacy drag is present on cube, allow rotate; otherwise default to explore
          if (cursorTarget.closest('#hero, .bento-cube, [data-component="rubiks-cube"]')) {
            currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
          } else {
            currentLabel = 'EXPLORE';
          }
        } else if (val === 'inspect') {
          currentLabel = 'INSPECT';
        } else if (val === 'explore') {
          currentLabel = 'EXPLORE';
        } else if (val === 'interact') {
          currentLabel = 'INTERACT';
        } else if (val === 'view') {
          currentLabel = 'VIEW';
        } else if (val === 'select') {
          currentLabel = 'SELECT';
        } else if (val === 'copy') {
          currentLabel = isMouseDown ? 'COPIED' : 'COPY';
        } else if (val === 'open') {
          currentLabel = 'OPEN';
        } else {
          currentLabel = val.toUpperCase();
        }
        return;
      }

      // 3. Rubik's Cube 3D Model (The ONLY rotatable model)
      const isCube = target.closest(
        '#rubiks-cube, [data-component="rubiks-cube"], .bento-cube'
      );
      if (isCube) {
        currentMode = 'badge';
        currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
        return;
      }

      // 4. 3D Highway Experience
      const isExperienceHighway = target.closest(
        '#experience canvas, [data-component="experience-highway"]'
      );
      if (isExperienceHighway) {
        // If hovering over a milestone board hitbox (cursor pointer)
        const isHoveringBoard = window.getComputedStyle(isExperienceHighway).cursor === 'pointer';
        currentMode = isHoveringBoard ? 'badge' : 'default';
        currentLabel = isHoveringBoard ? 'INSPECT' : '';
        return;
      }

      // 5. 3D Project Visualizer (Work / Projects Showcase)
      const isProjectVisualizer = target.closest(
        '#projects canvas, #work canvas, [data-component="project-visualizer"]'
      );
      if (isProjectVisualizer) {
        currentMode = 'badge';
        currentLabel = 'EXPLORE';
        return;
      }

      // 6. 3D Experiments (Particle physics / shaders)
      const isExperiment = target.closest(
        '#experiments canvas, .experiment-canvas'
      );
      if (isExperiment) {
        currentMode = 'badge';
        currentLabel = 'INTERACT';
        return;
      }

      // 7. General Canvas Fallback (Non-cube canvas)
      const isCanvas = target.closest('canvas');
      if (isCanvas) {
        // Check if this canvas is the Rubik's Cube canvas
        if (isCanvas.closest('#hero') || isCanvas.getAttribute('data-cursor') === 'cube') {
          currentMode = 'badge';
          currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
        } else {
          currentMode = 'badge';
          currentLabel = 'EXPLORE';
        }
        return;
      }

      // 8. Interactive Links, Buttons, and Clickable Elements
      const isClickable = target.closest(
        'a, button, [role="button"], [role="link"], select, textarea, .cursor-pointer, [data-interactive]'
      );
      if (isClickable) {
        if (isClickable.matches('input, textarea')) {
          currentMode = 'default';
          currentLabel = '';
          return;
        }

        currentMode = 'badge';
        const text = (isClickable.textContent || '').trim().toLowerCase();
        const href = isClickable.getAttribute('href') || '';
        const title = (isClickable.getAttribute('title') || '').toLowerCase();
        const ariaLabel = (isClickable.getAttribute('aria-label') || '').toLowerCase();
        const isExternal =
          isClickable.matches('a[target="_blank"]') ||
          href.startsWith('http') ||
          href.includes('drive.google') ||
          text.includes('resume');

        if (text.includes('copy') || text.includes('email') || title.includes('copy')) {
          currentLabel = isMouseDown ? 'COPIED' : 'COPY';
        } else if (
          text === 'close' ||
          title.includes('close') ||
          ariaLabel.includes('close') ||
          isClickable.querySelector('svg.lucide-x')
        ) {
          currentLabel = 'CLOSE';
        } else if (text.includes('inspect')) {
          currentLabel = 'INSPECT';
        } else if (
          isExternal ||
          text.includes('resume') ||
          isClickable.querySelector('svg.lucide-external-link, svg.lucide-arrow-up-right')
        ) {
          currentLabel = 'OPEN';
        } else if (
          text.includes('project') ||
          text.includes('work') ||
          text.includes('demo') ||
          text.includes('code')
        ) {
          currentLabel = 'VIEW';
        } else if (text.includes('explore') || text.includes('philosophy')) {
          currentLabel = 'EXPLORE';
        } else if (text.includes('contact') || text.includes('connect')) {
          currentLabel = 'CONNECT';
        } else if (isClickable.closest('nav')) {
          currentLabel = 'GO';
        } else {
          currentLabel = 'SELECT';
        }
        return;
      }

      // 9. Bento Cards & Showcase Cards
      const isBentoCard = target.closest(
        '[data-card], section#bento-showcase > div > div > div'
      );
      if (isBentoCard) {
        if (
          isBentoCard.querySelector('[data-cursor="cube"]') ||
          isBentoCard.id === 'cube-card'
        ) {
          currentMode = 'badge';
          currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
          return;
        }

        currentMode = 'badge';
        const cardText = (isBentoCard.textContent || '').toLowerCase();
        if (
          cardText.includes('philosophy') ||
          cardText.includes('systems') ||
          cardText.includes('chronometer') ||
          cardText.includes('watch')
        ) {
          currentLabel = 'EXPLORE';
        } else if (cardText.includes("let's build") || cardText.includes('available for work')) {
          currentLabel = 'CONNECT';
        } else if (
          cardText.includes('project') ||
          cardText.includes('experience') ||
          cardText.includes('education')
        ) {
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
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    document.body.addEventListener('mouseleave', onMouseLeave, { passive: true });

    let animId;
    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const render = () => {
      const isBadge = currentMode === 'badge';

      // 1. Authentic parthh.in SVG Mouse Pointer: Instant 1:1 hardware tracking
      if (cursorSvg) {
        if (!isVisible || isBadge) {
          cursorSvg.style.opacity = '0';
          cursorSvg.style.transform = `translate3d(${mouseX - 5.5}px, ${mouseY - 3.2}px, 0) scale(0)`;
        } else {
          cursorSvg.style.opacity = '1';
          cursorSvg.style.transform = `translate3d(${mouseX - 5.5}px, ${mouseY - 3.2}px, 0) scale(${
            isMouseDown ? 0.92 : 1
          })`;
        }
      }

      // 2. Pure Clean Solid White Expanded Circular Badge: Smooth damped lerp tracking
      ringX = lerp(ringX, mouseX, 0.28);
      ringY = lerp(ringY, mouseY, 0.28);

      if (badge) {
        if (!isVisible || !isBadge) {
          badge.style.opacity = '0';
          badge.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(0)`;
        } else {
          badge.style.opacity = '1';
          badge.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${
            isMouseDown ? 0.92 : 1
          })`;
        }
      }

      if (label) {
        label.textContent = currentLabel;
        label.style.opacity = isBadge ? '1' : '0';
      }

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
      {/* 1. Authentic parthh.in SVG Mouse Pointer (Default State) */}
      <div
        ref={cursorSvgRef}
        className="fixed top-0 left-0 w-6 h-9 pointer-events-none z-[999999] opacity-0 transition-[opacity,transform] duration-150 ease-out will-change-transform"
        style={{
          transformOrigin: '5.5px 3.2px',
        }}
      >
        <svg
          width="24"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <filter id="parth-cursor-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.45" />
            </filter>
          </defs>
          <path
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1.2"
            strokeLinejoin="round"
            filter="url(#parth-cursor-shadow)"
            d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.35Z"
          />
        </svg>
      </div>

      {/* 2. Pure Clean Solid White Expanded Circular Badge (NO Grayish Effect) */}
      <div
        ref={badgeRef}
        className="fixed top-0 left-0 w-[82px] h-[82px] rounded-full bg-white pointer-events-none z-[999998] opacity-0 transition-[opacity,transform] duration-200 ease-out will-change-transform flex items-center justify-center text-center overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.45),0_2px_10px_rgba(0,0,0,0.15)]"
      >
        <span
          ref={labelRef}
          className="font-mono text-[11px] font-black tracking-widest text-black uppercase transition-opacity duration-150 leading-none pointer-events-none select-none px-1"
        />
      </div>
    </div>
  );
};

export default CustomCursor;