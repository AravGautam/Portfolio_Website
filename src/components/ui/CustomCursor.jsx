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
  const penSvgRef = useRef(null);
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
    const penSvg = penSvgRef.current;
    const badge = badgeRef.current;
    const label = labelRef.current;
    if (!cursorSvg || !badge || !label) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isMouseDown = false;
    let isVisible = false;
    let currentMode = 'default'; // 'default' | 'badge' | 'pen'
    let currentLabel = '';

    const updateHoverState = (target) => {
      if (!target || !(target instanceof Element)) {
        currentMode = 'default';
        currentLabel = '';
        return;
      }

      // 0. Signature Drawing Pad / Canvas Check: Precision Pen Stylus (Never obscure with badge)
      const isDrawingCanvas = target.closest(
        '[data-cursor="pen"], [data-cursor="draw"], [data-signature-pad], .signature-pad, .signature-canvas, canvas.cursor-crosshair, canvas.touch-none'
      );
      if (isDrawingCanvas) {
        currentMode = 'pen';
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
        if (val === 'pen' || val === 'draw') {
          currentMode = 'pen';
          currentLabel = '';
          return;
        }
        if (val === 'default' || val === 'mouse' || val === 'none') {
          currentMode = 'default';
          currentLabel = '';
          return;
        }
        if (val === 'cube') {
          currentMode = 'badge';
          currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
          return;
        }
        if (val === 'copy') {
          currentMode = 'badge';
          currentLabel = isMouseDown ? 'COPIED' : 'COPY';
          return;
        }
        if (val === 'explore') {
          currentMode = 'badge';
          currentLabel = 'EXPLORE';
          return;
        }
        if (val === 'interact') {
          currentMode = 'badge';
          currentLabel = 'INTERACT';
          return;
        }
        if (val === 'view') {
          currentMode = 'badge';
          currentLabel = 'VIEW';
          return;
        }
        if (val === 'open') {
          currentMode = 'badge';
          currentLabel = 'OPEN';
          return;
        }
        currentMode = 'badge';
        currentLabel = val.toUpperCase();
        return;
      }

      // 3. Rubik's Cube 3D Model: STRICTLY the ONLY model that rotates
      const isCube = target.closest(
        '#rubiks-cube, [data-component="rubiks-cube"], .bento-cube'
      );
      if (isCube) {
        currentMode = 'badge';
        currentLabel = isMouseDown ? 'ROTATING' : 'ROTATE';
        return;
      }

      // 4. 3D Project Visualizer & 3D Experiments Viewports
      const is3DViewport = target.closest(
        '#projects canvas, #work canvas, #experiments canvas, [data-component="project-visualizer"]'
      );
      if (is3DViewport) {
        currentMode = 'badge';
        currentLabel = 'INTERACT';
        return;
      }

      // 5. Interactive Links, Buttons, and Clickable Elements
      const isClickable = target.closest(
        'a, button, [role="button"], [role="link"], select, .cursor-pointer, [data-interactive]'
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

        // Dedicated Navbar Island Rules
        if (isClickable.closest('nav')) {
          if (text.includes('project') || text.includes('work')) {
            currentLabel = 'VIEW';
          } else if (text.includes('contact') || text.includes('connect')) {
            currentLabel = 'CONNECT';
          } else {
            currentLabel = 'GO';
          }
          return;
        }

        if (text.includes('copy') || text.includes('email') || title.includes('copy')) {
          currentLabel = isMouseDown ? 'COPIED' : 'COPY';
        } else if (
          text === 'close' ||
          title.includes('close') ||
          ariaLabel.includes('close') ||
          isClickable.querySelector('svg.lucide-x')
        ) {
          currentLabel = 'CLOSE';
        } else if (
          isExternal ||
          text.includes('resume') ||
          isClickable.querySelector('svg.lucide-external-link, svg.lucide-arrow-up-right')
        ) {
          currentLabel = 'OPEN';
        } else if (
          text.includes('project') ||
          text.includes('work') ||
          text.includes('experience') ||
          text.includes('demo') ||
          text.includes('code')
        ) {
          currentLabel = 'VIEW';
        } else if (text.includes('contact') || text.includes('connect')) {
          currentLabel = 'CONNECT';
        } else {
          currentLabel = 'SELECT';
        }
        return;
      }

      // Default state: Authentic crisp SVG mouse pointer (No badge on static cards or text)
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
      const isPen = currentMode === 'pen';

      // 1. Authentic SVG Mouse Pointer (Default State)
      if (cursorSvg) {
        if (!isVisible || isBadge || isPen) {
          cursorSvg.style.opacity = '0';
          cursorSvg.style.transform = `translate3d(${mouseX - 5.5}px, ${mouseY - 3.2}px, 0) scale(0)`;
        } else {
          cursorSvg.style.opacity = '1';
          cursorSvg.style.transform = `translate3d(${mouseX - 5.5}px, ${mouseY - 3.2}px, 0) scale(${
            isMouseDown ? 0.92 : 1
          })`;
        }
      }

      // 2. Pure Clean Solid White Expanded Circular Badge (Interactive 3D / Buttons)
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

      // 3. Precision Stylus / Pen SVG Cursor (tip aligned at mouseX, mouseY)
      if (penSvg) {
        if (!isVisible || !isPen) {
          penSvg.style.opacity = '0';
          penSvg.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0) scale(0)`;
        } else {
          penSvg.style.opacity = '1';
          penSvg.style.transform = `translate3d(${mouseX - 2}px, ${mouseY - 2}px, 0) scale(${
            isMouseDown ? 0.94 : 1
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

      {/* 2. Pure Clean Solid White Expanded Circular Badge (Interactive 3D Elements / Buttons) */}
      <div
        ref={badgeRef}
        className="fixed top-0 left-0 w-[82px] h-[82px] rounded-full bg-white pointer-events-none z-[999998] opacity-0 transition-[opacity,transform] duration-200 ease-out will-change-transform flex items-center justify-center text-center overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.45),0_2px_10px_rgba(0,0,0,0.15)]"
      >
        <span
          ref={labelRef}
          className="font-mono text-[11px] font-black tracking-widest text-black uppercase transition-opacity duration-150 leading-none pointer-events-none select-none px-1"
        />
      </div>

      {/* 3. Sleek Precision Stylus / Pen SVG Cursor (Drawing & Signature Pad Mode) */}
      <div
        ref={penSvgRef}
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[999999] opacity-0 transition-[opacity,transform] duration-150 ease-out will-change-transform"
        style={{
          transformOrigin: '2px 2px',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <filter id="pen-cursor-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.55" />
            </filter>
          </defs>
          <g filter="url(#pen-cursor-shadow)">
            {/* Pen Nib Body */}
            <path
              d="M2 2L7.5 3.8L18.8 15.1C19.5 15.8 19.5 17 18.8 17.7L17.7 18.8C17 19.5 15.8 19.5 15.1 18.8L3.8 7.5L2 2Z"
              fill="#080a10"
              stroke="#ffffff"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Stylus barrel highlight */}
            <path d="M6 6L16 16" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" strokeLinecap="round" />
            {/* Active Nib Tip */}
            <path d="M2 2L4.5 4.5" stroke="#38bdf8" strokeWidth="1.4" strokeLinecap="round" />
            {/* Small ink breathing ring */}
            <circle cx="9" cy="9" r="0.75" fill="#38bdf8" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default CustomCursor;