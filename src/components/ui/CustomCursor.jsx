import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices (width >= 1024px and non-touch fine pointer)
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
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a')
      );
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

  return (
    <div className="hidden lg:block">
      {/* Primary Dot */}
      <div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#00f0ff] pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isClicked ? 0.7 : isPointer ? 1.5 : 1})`,
        }}
      />

      {/* Trailing Outer Ring */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#00f0ff]/50 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isClicked ? 1.3 : isPointer ? 1.8 : 1})`,
          backgroundColor: isPointer ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
        }}
      />
    </div>
  );
};

export default CustomCursor;