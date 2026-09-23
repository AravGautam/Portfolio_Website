import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchOrMobile = () => {
      return (
        window.innerWidth < 1024 ||
        window.matchMedia('(pointer: coarse)').matches ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };

    if (isTouchOrMobile()) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e) => {
      if (isTouchOrMobile()) {
        setIsVisible(false);
        return;
      }
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target;
      const isInteractive = (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a')
      );
      setIsPointer(isInteractive);

      // Contextual badge detection
      const badgeTarget = target.closest('[data-cursor]');
      if (badgeTarget) {
        setCursorText(badgeTarget.getAttribute('data-cursor') || '');
      } else {
        setCursorText('');
      }
    };

    const handleResize = () => {
      if (isTouchOrMobile()) {
        setIsVisible(false);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  // Format repeat label for circular SVG textPath
  const repeatText = cursorText
    ? `${cursorText} • ${cursorText} • ${cursorText} • `
    : '';

  return (
    <div className="hidden lg:block pointer-events-none select-none">
      {/* Primary Center Dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out flex items-center justify-center"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isClicked ? 0.75 : 1})`,
        }}
      >
        <div className="w-2 h-2 rounded-full bg-[#b46f32] shadow-[0_0_8px_#b46f32]" />
      </div>

      {/* Growing Transparent Outer Ring with Circular Rotating Text */}
      <div
        className="fixed top-0 left-0 rounded-full border border-[#b46f32]/40 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${
            isClicked ? 0.9 : 1
          })`,
          width: cursorText ? '84px' : isPointer ? '44px' : '28px',
          height: cursorText ? '84px' : isPointer ? '44px' : '28px',
          backgroundColor: cursorText
            ? 'rgba(6, 9, 19, 0.25)'
            : isPointer
            ? 'rgba(180, 111, 50, 0.08)'
            : 'transparent',
          backdropFilter: cursorText ? 'blur(1px)' : 'none',
        }}
      >
        {/* Circular Rotating SVG Text */}
        {cursorText && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center animate-[spin_8s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
              <path
                id="cursorTextCircle"
                d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="font-mono text-[9px] font-bold fill-[#b46f32] tracking-[0.18em]">
                <textPath href="#cursorTextCircle" startOffset="0%">
                  {repeatText}
                </textPath>
              </text>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCursor;