import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mail, Github, Linkedin, Twitter, Instagram, RotateCcw } from 'lucide-react';
import { portfolioData } from '../../data/portfolioData';
import { soundEngine } from '../../audio/soundEngine';

/**
 * IndividualDraggablePills:
 * Renders the "Available for Roles" badge and social pills (GitHub, LinkedIn, Twitter, Instagram, Email)
 * as individual, scattered 3D tactile pills.
 *
 * Each pill can be grabbed and dragged INDIVIDUALLY anywhere across the screen via mouse/touch.
 * Clicking without dragging triggers link navigation with a shockwave bloom.
 */
export const IndividualDraggablePills = () => {
  // Individual position offsets for each pill: { [id]: { x: 0, y: 0 } }
  const [positions, setPositions] = useState({});
  const [draggingId, setDraggingId] = useState(null);
  const [hasAnyMoved, setHasAnyMoved] = useState(false);
  const [ripples, setRipples] = useState({});

  const dragInfoRef = useRef({
    id: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    dist: 0
  });

  const PILLS = [
    {
      id: 'availability',
      type: 'badge',
      label: 'Available for Roles',
      icon: null,
      href: null,
      badgeDot: true,
      accent: 'emerald',
      initialOffset: { x: 0, y: 0 }
    },
    {
      id: 'email',
      type: 'link',
      label: 'Email',
      icon: <Mail className="w-3.5 h-3.5" />,
      href: `mailto:${portfolioData.personal.email}`,
      accent: 'blue',
      initialOffset: { x: 0, y: 0 }
    },
    {
      id: 'github',
      type: 'link',
      label: 'GitHub',
      icon: <Github className="w-3.5 h-3.5" />,
      href: portfolioData.socialLinks.find((s) => s.id === 'github')?.href || 'https://github.com/AravGautam',
      accent: 'slate',
      initialOffset: { x: 0, y: 0 }
    },
    {
      id: 'linkedin',
      type: 'link',
      label: 'LinkedIn',
      icon: <Linkedin className="w-3.5 h-3.5 text-blue-400" />,
      href: portfolioData.socialLinks.find((s) => s.id === 'linkedin')?.href || 'https://linkedin.com/in/aravgautam',
      accent: 'cyan',
      initialOffset: { x: 0, y: 0 }
    },
    {
      id: 'twitter',
      type: 'link',
      label: 'X (Twitter)',
      icon: <Twitter className="w-3.5 h-3.5" />,
      href: portfolioData.socialLinks.find((s) => s.id === 'twitter')?.href || 'https://twitter.com/arav_gautam',
      accent: 'sky',
      initialOffset: { x: 0, y: 0 }
    },
    {
      id: 'instagram',
      type: 'link',
      label: 'Instagram',
      icon: <Instagram className="w-3.5 h-3.5 text-pink-400" />,
      href: portfolioData.socialLinks.find((s) => s.id === 'instagram')?.href || 'https://instagram.com/aravgautam',
      accent: 'rose',
      initialOffset: { x: 0, y: 0 }
    }
  ];

  // Pointer Down on an individual pill
  const handlePointerDown = (e, pill) => {
    if (e.button !== undefined && e.button !== 0) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

    const currentPos = positions[pill.id] || { x: 0, y: 0 };

    dragInfoRef.current = {
      id: pill.id,
      startX: clientX,
      startY: clientY,
      originX: currentPos.x,
      originY: currentPos.y,
      dist: 0
    };

    setDraggingId(pill.id);
    soundEngine.playHover();
  };

  // Pointer Move (window-level)
  const handlePointerMove = useCallback((e) => {
    const { id, startX, startY, originX, originY } = dragInfoRef.current;
    if (!id) return;

    const clientX = e.clientX ?? (e.touches && e.touches[0].clientX);
    const clientY = e.clientY ?? (e.touches && e.touches[0].clientY);

    const dx = clientX - startX;
    const dy = clientY - startY;
    const dist = Math.hypot(dx, dy);
    dragInfoRef.current.dist = dist;

    if (dist > 6) {
      setHasAnyMoved(true);
    }

    setPositions((prev) => ({
      ...prev,
      [id]: {
        x: originX + dx,
        y: originY + dy,
        tilt: Math.min(Math.max(dx * 0.08, -14), 14)
      }
    }));
  }, []);

  // Pointer Up (window-level)
  const handlePointerUp = useCallback(() => {
    if (!dragInfoRef.current.id) return;
    dragInfoRef.current.id = null;
    setDraggingId(null);
  }, []);

  useEffect(() => {
    const onMove = (e) => handlePointerMove(e);
    const onUp = () => handlePointerUp();

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Click on pill (only triggers if NOT dragged)
  const handlePillClick = (e, pill) => {
    // If the mouse moved significantly, cancel navigation
    if (dragInfoRef.current.dist > 7) {
      e.preventDefault();
      return;
    }

    soundEngine.playClick();

    // Trigger shockwave bloom from touch point
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX !== undefined ? e.clientX - rect.left : rect.width / 2;
    const clickY = e.clientY !== undefined ? e.clientY - rect.top : rect.height / 2;
    const maxRadius = Math.max(
      Math.hypot(clickX, clickY),
      Math.hypot(rect.width - clickX, clickY),
      Math.hypot(clickX, rect.height - clickY),
      Math.hypot(rect.width - clickX, rect.height - clickY)
    ) * 1.25;

    const rippleId = Date.now() + Math.random();
    setRipples((prev) => ({
      ...prev,
      [pill.id]: {
        id: rippleId,
        x: clickX,
        y: clickY,
        radius: maxRadius
      }
    }));

    setTimeout(() => {
      setRipples((prev) => {
        const next = { ...prev };
        delete next[pill.id];
        return next;
      });
    }, 500);

    if (pill.href) {
      e.preventDefault();
      setTimeout(() => {
        if (pill.href.startsWith('mailto:')) {
          window.location.href = pill.href;
        } else {
          window.open(pill.href, '_blank', 'noopener,noreferrer');
        }
      }, 220);
    }
  };

  const handleResetAll = () => {
    soundEngine.playClick();
    setPositions({});
    setHasAnyMoved(false);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-4 select-none isolate">
      {/* Scattered Individual Pills Cluster Container */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-[850px] mx-auto px-4">
        {PILLS.map((pill) => {
          const pos = positions[pill.id] || { x: 0, y: 0, tilt: 0 };
          const isDragging = draggingId === pill.id;
          const ripple = ripples[pill.id];

          return (
            <div
              key={pill.id}
              onPointerDown={(e) => handlePointerDown(e, pill)}
              onClick={(e) => handlePillClick(e, pill)}
              style={{
                transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${pos.tilt || 0}deg) scale(${
                  isDragging ? 1.08 : 1
                })`,
                zIndex: isDragging ? 50 : 10,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
              className={`relative overflow-hidden group rounded-full font-mono text-xs font-semibold select-none touch-none transition-shadow duration-200 ${
                pill.id === 'availability'
                  ? 'pill-btn-3d px-4 py-2 border-emerald-400/30'
                  : 'pill-btn-3d px-3.5 py-2'
              } ${
                isDragging
                  ? 'shadow-[0_20px_40px_rgba(0,0,0,0.85)] border-white/30'
                  : 'hover:border-white/25 shadow-md'
              }`}
              title={`Drag ${pill.label} anywhere or click to open`}
            >
              {/* Expanding Shockwave on click */}
              {ripple && (
                <span
                  key={ripple.id}
                  className="absolute rounded-full pointer-events-none animate-shockwave-bloom"
                  style={{
                    left: `${ripple.x}px`,
                    top: `${ripple.y}px`,
                    width: `${ripple.radius * 2}px`,
                    height: `${ripple.radius * 2}px`,
                    marginLeft: `-${ripple.radius}px`,
                    marginTop: `-${ripple.radius}px`,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 0 28px 6px rgba(255, 255, 255, 0.45)',
                    transformOrigin: 'center center',
                    zIndex: 1
                  }}
                />
              )}

              {/* Pill Content */}
              <div className="relative z-10 flex items-center gap-2 pointer-events-none">
                {pill.badgeDot && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  </span>
                )}

                {pill.icon && (
                  <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                    {pill.icon}
                  </span>
                )}

                <span
                  className={`tracking-wide text-[11px] sm:text-xs transition-colors duration-200 ${
                    pill.id === 'availability'
                      ? 'text-emerald-300 font-semibold'
                      : 'text-gray-300 group-hover:text-white'
                  }`}
                >
                  {pill.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Drag Hint & Reset Positions Controller */}
      <div className="flex items-center gap-3 mt-3.5 text-xs font-mono text-gray-500 transition-opacity">
        <span className="text-[11px] text-gray-500">
          Tip: Grab and drag any pill individually across your screen
        </span>
        {hasAnyMoved && (
          <button
            onClick={handleResetAll}
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset pills</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default IndividualDraggablePills;
