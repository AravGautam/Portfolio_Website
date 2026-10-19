import React, { useState, useRef, useEffect } from 'react';
import { soundEngine } from '../../audio/soundEngine';

/**
 * ShockwaveButton: Premium 3D tactile pill button with dynamic radial shockwave bloom
 * emanating from the exact mouse/touch coordinate, flipping between White and Dark states,
 * accompanied by 3D rotating tumbler text emerging from beneath with depth perspective.
 */
export const ShockwaveButton = ({
  text = '',
  textWhite = null,
  textBlack = null,
  icon = null,
  iconWhite = null,
  iconBlack = null,
  onClick = null,
  onNavigate = null,
  navigateDelay = 240,
  className = '',
  initialColor = 'black', // 'black' (dark pill default) or 'white' (white pill default)
  active = null,          // Controlled active state (e.g. for Navbar items)
  autoReset = false,      // If true, resets back to initial color after shockwave action
  resetDelay = 1200,
  title = '',
  ariaLabel = '',
  type = 'button',
  disabled = false,
  children = null
}) => {
  const isControlled = active !== null;
  const [internalIsWhite, setInternalIsWhite] = useState(initialColor === 'white');
  const [overrideIsWhite, setOverrideIsWhite] = useState(null);

  // Sync with external active prop changes
  useEffect(() => {
    setOverrideIsWhite(null);
  }, [active]);

  // Keep internal in sync if initialColor changes
  useEffect(() => {
    if (!isControlled && overrideIsWhite === null) {
      setInternalIsWhite(initialColor === 'white');
    }
  }, [initialColor, isControlled, overrideIsWhite]);

  const isWhite = overrideIsWhite !== null ? overrideIsWhite : (isControlled ? active : internalIsWhite);

  const [ripples, setRipples] = useState([]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingTarget, setRollingTarget] = useState(null); // 'white' or 'dark'

  const buttonRef = useRef(null);
  const timerRef = useRef(null);
  const resetTimerRef = useRef(null);
  const rollTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (rollTimerRef.current) clearTimeout(rollTimerRef.current);
    };
  }, []);

  // Determine display contents
  const primaryText = text || (typeof children === 'string' ? children : '');
  const displayTextWhite = textWhite || primaryText;
  const displayTextDark = textBlack || primaryText;

  const displayIconWhite = iconWhite || icon;
  const displayIconDark = iconBlack || icon;

  const handleClick = (e) => {
    if (disabled) return;
    const button = buttonRef.current;
    if (!button) return;

    soundEngine.playClick();

    const rect = button.getBoundingClientRect();

    // Accurate coordinate detection for mouse, touch, and synthetic activation
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
    ) * 1.25;

    const nextIsWhite = !isWhite;
    const rippleId = Date.now() + Math.random();

    // Blooming shockwave inherits the target opposite color
    const newRipple = {
      id: rippleId,
      x: clickX,
      y: clickY,
      radius: maxRadius,
      color: nextIsWhite ? '#ffffff' : '#0c0e17',
      shadow: nextIsWhite
        ? '0 0 32px 8px rgba(255, 255, 255, 0.4), inset 0 0 16px rgba(255, 255, 255, 0.25)'
        : '0 0 32px 8px rgba(0, 0, 0, 0.6), inset 0 0 16px rgba(0, 0, 0, 0.4)',
      isWhiteRipple: nextIsWhite
    };

    setRipples((prev) => [...prev, newRipple]);

    // Trigger immediate color state change
    setOverrideIsWhite(nextIsWhite);
    if (!isControlled) {
      setInternalIsWhite(nextIsWhite);
    } else {
      // Auto-clear override state for controlled buttons so they resync with prop
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setOverrideIsWhite(null);
      }, Math.max(navigateDelay + 60, 300));
    }

    // Trigger 3D tumbler rolling text animation
    setIsRolling(true);
    setRollingTarget(nextIsWhite ? 'white' : 'dark');
    if (rollTimerRef.current) clearTimeout(rollTimerRef.current);
    rollTimerRef.current = setTimeout(() => {
      setIsRolling(false);
      setRollingTarget(null);
    }, 420);

    // Auto reset back to original color with return shockwave if enabled
    if (autoReset) {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        const btn = buttonRef.current;
        const returnIsWhite = initialColor === 'white';
        if (btn) {
          const r = btn.getBoundingClientRect();
          const resetRippleId = Date.now() + Math.random();
          const resetMaxRadius = Math.max(r.width, r.height) * 1.25;
          setRipples((prev) => [
            ...prev,
            {
              id: resetRippleId,
              x: r.width / 2,
              y: r.height / 2,
              radius: resetMaxRadius,
              color: returnIsWhite ? '#ffffff' : '#0c0e17',
              shadow: returnIsWhite
                ? '0 0 32px 8px rgba(255, 255, 255, 0.4), inset 0 0 16px rgba(255, 255, 255, 0.25)'
                : '0 0 32px 8px rgba(0, 0, 0, 0.6), inset 0 0 16px rgba(0, 0, 0, 0.4)',
              isWhiteRipple: returnIsWhite
            }
          ]);
          setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== resetRippleId));
          }, 520);

          setIsRolling(true);
          setRollingTarget(returnIsWhite ? 'white' : 'dark');
          setTimeout(() => {
            setIsRolling(false);
            setRollingTarget(null);
          }, 420);
        }
        setInternalIsWhite(returnIsWhite);
        setOverrideIsWhite(null);
      }, resetDelay);
    }

    // Clean up finished ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 520);

    // Execute navigation / click action or form submit
    const action = onNavigate || onClick;
    if (action) {
      if (onNavigate && navigateDelay > 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          action(e, nextIsWhite);
        }, navigateDelay);
      } else {
        action(e, nextIsWhite);
      }
    } else if (type === 'submit' && button.form) {
      if (typeof button.form.requestSubmit === 'function') {
        button.form.requestSubmit();
      } else {
        button.form.submit();
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={() => soundEngine.playHover()}
      className={`group relative overflow-hidden rounded-full select-none isolate transition-all duration-300 ${
        !className.includes('font-') ? 'font-mono' : ''
      } ${
        !/\btext-(xs|sm|base|lg|xl)\b/.test(className) ? 'text-xs' : ''
      } ${
        !/\bfont-(normal|medium|semibold|bold|extrabold)\b/.test(className) ? 'font-semibold' : ''
      } ${
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      } ${
        isWhite ? 'pill-btn-white-3d text-black' : 'pill-btn-3d text-gray-200 hover:text-white'
      } ${className}`}
      title={title || primaryText}
      aria-label={ariaLabel || title || primaryText}
    >
      {/* Expanding Circular Shockwaves blooming from touch point */}
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

      {/* 3D Perspective Rotating Tumbler Text Container */}
      <div
        className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none text-rotate-3d-stage"
        style={{ perspective: '450px' }}
      >
        {/* Layer A: Dark Text (Active when Button is White) */}
        <div
          className={`flex items-center justify-center gap-2 ${
            isRolling
              ? rollingTarget === 'white'
                ? 'animate-roll-in-beneath'
                : 'animate-roll-out-up'
              : isWhite
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
          style={{
            color: '#05070a'
          }}
        >
          {displayTextWhite && <span>{displayTextWhite}</span>}
          {displayIconWhite && (
            <span className="shrink-0 transition-transform duration-300">
              {displayIconWhite}
            </span>
          )}
          {children && typeof children !== 'string' && children}
        </div>

        {/* Layer B: Light Text (Active when Button is Dark) */}
        <div
          className={`absolute inset-0 flex items-center justify-center gap-2 ${
            isRolling
              ? rollingTarget === 'dark'
                ? 'animate-roll-in-beneath'
                : 'animate-roll-out-up'
              : !isWhite
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none'
          }`}
          style={{
            color: '#f1f5f9'
          }}
        >
          {displayTextDark && <span>{displayTextDark}</span>}
          {displayIconDark && (
            <span className="shrink-0 transition-transform duration-300">
              {displayIconDark}
            </span>
          )}
          {children && typeof children !== 'string' && children}
        </div>
      </div>
    </button>
  );
};

export default ShockwaveButton;
