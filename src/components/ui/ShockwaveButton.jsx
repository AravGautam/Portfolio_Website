import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { soundEngine } from '../../audio/soundEngine';

/**
 * ShockwaveButton: Interactive pill button with radial expanding circular shockwave
 * from the exact click/touch coordinates, flipping between White and Black states,
 * with text smoothly emerging from behind, and executing route navigation.
 */
export const ShockwaveButton = ({
  textWhite = 'Explore Projects',
  textBlack = 'Explore Projects',
  onClick = null,
  onNavigate = null,
  navigateDelay = 300,
  className = '',
  initialColor = 'white'
}) => {
  const [isBlack, setIsBlack] = useState(initialColor === 'black');
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const navigateTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (navigateTimerRef.current) {
        clearTimeout(navigateTimerRef.current);
      }
    };
  }, []);

  const handleClick = (e) => {
    const button = buttonRef.current;
    if (!button) return;

    soundEngine.playClick();

    const rect = button.getBoundingClientRect();
    
    // Robust coordinate detection for mouse, touch, and keyboard activation
    let clientX = e.clientX;
    let clientY = e.clientY;
    if (clientX === undefined && e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    const clickX = (clientX !== undefined && !isNaN(clientX)) ? clientX - rect.left : rect.width / 2;
    const clickY = (clientY !== undefined && !isNaN(clientY)) ? clientY - rect.top : rect.height / 2;

    // Calculate maximum radius to completely envelope the button from (clickX, clickY)
    const maxRadius = Math.max(
      Math.hypot(clickX, clickY),
      Math.hypot(rect.width - clickX, clickY),
      Math.hypot(clickX, rect.height - clickY),
      Math.hypot(rect.width - clickX, rect.height - clickY)
    ) * 1.18;

    const nextIsBlack = !isBlack;
    const rippleId = Date.now() + Math.random();

    const newRipple = {
      id: rippleId,
      x: clickX,
      y: clickY,
      radius: maxRadius,
      color: nextIsBlack ? '#090a0f' : '#ffffff',
      shadow: nextIsBlack
        ? '0 0 28px 6px rgba(255, 255, 255, 0.45), inset 0 0 16px rgba(255, 255, 255, 0.2)'
        : '0 0 28px 6px rgba(0, 0, 0, 0.35), inset 0 0 16px rgba(0, 0, 0, 0.15)',
      isTurningBlack: nextIsBlack
    };

    setRipples((prev) => [...prev, newRipple]);
    setIsBlack(nextIsBlack);

    // Clean up finished ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 550);

    // Execute navigation / click action (allowing shockwave to visibly bloom first)
    const action = onNavigate || onClick;
    if (action) {
      if (navigateDelay > 0) {
        if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current);
        navigateTimerRef.current = setTimeout(() => {
          action(e, nextIsBlack);
        }, navigateDelay);
      } else {
        action(e, nextIsBlack);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      onMouseEnter={() => soundEngine.playHover()}
      className={`group relative overflow-hidden rounded-full font-mono text-xs sm:text-sm font-semibold select-none isolate cursor-pointer transition-all duration-300 px-7 py-3 sm:py-3.5 ${
        isBlack ? 'pill-btn-black-3d' : 'pill-btn-white-3d'
      } ${className}`}
      title={textWhite || 'Explore Projects'}
      aria-label={`${textWhite} (Interactive Shockwave Button)`}
    >
      {/* Expanding Circular Shockwaves */}
      {ripples.map((ripple) => (
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
            backgroundColor: ripple.color,
            boxShadow: ripple.shadow,
            transformOrigin: 'center center',
            zIndex: 1
          }}
        />
      ))}

      {/* Dual Text & Icon Container (Transitions from behind) */}
      <div className="relative z-10 overflow-hidden h-[24px] sm:h-[26px] min-w-[145px] sm:min-w-[160px] flex items-center justify-center pointer-events-none">
        {/* Layer 1: Black Content (Active when button is White) */}
        <div
          className="flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isBlack ? 'translateY(-135%) scale(0.95)' : 'translateY(0%) scale(1)',
            opacity: isBlack ? 0 : 1,
            color: '#000000',
            transitionDelay: isBlack ? '0s' : '0.06s'
          }}
        >
          <span className="font-semibold tracking-wide">{textWhite}</span>
          <span className="p-1 -mr-1 rounded-full group-hover:bg-black/10 transition-colors">
            <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>

        {/* Layer 2: White Content (Active when button is Black, emerges from behind) */}
        <div
          className="absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transform: isBlack ? 'translateY(0%) scale(1)' : 'translateY(135%) scale(0.95)',
            opacity: isBlack ? 1 : 0,
            color: '#ffffff',
            transitionDelay: isBlack ? '0.08s' : '0s'
          }}
        >
          <span className="font-semibold tracking-wide text-white drop-shadow-sm">{textBlack}</span>
          <span className="p-1 -mr-1 rounded-full group-hover:bg-white/10 transition-colors">
            <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </button>
  );
};

export default ShockwaveButton;
