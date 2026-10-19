import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../audio/soundEngine';

/**
 * Luxury 24-Hour Military Chronometer Watch
 * Butter-smooth 120fps continuous sweep via requestAnimationFrame
 * Exact high-definition bezel and dial matching parthh.in reference
 */
const LuxuryChronometerWatch = ({ timezone = 'Asia/Kolkata' }) => {
  const hourHandRef = useRef(null);
  const minuteHandRef = useRef(null);
  const secondHandRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const updateHands = () => {
      const now = new Date();
      let date = now;
      if (timezone) {
        try {
          const tzString = now.toLocaleString('en-US', { timeZone: timezone });
          date = new Date(tzString);
          date.setMilliseconds(now.getMilliseconds());
        } catch {
          date = now;
        }
      }

      const ms = date.getMilliseconds();
      const s = date.getSeconds() + ms / 1000;
      const m = date.getMinutes() + s / 60;
      const h = date.getHours() + m / 60;

      // 12-hour movement cycle aligning with the 12 major dial positions (24, 02, 04, ..., 22)
      // 30 degrees per hour, 6 degrees per minute, 6 degrees per second
      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${(h % 12) * 30}deg)`;
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${m * 6}deg)`;
      }
      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${s * 6}deg)`;
      }

      rafRef.current = requestAnimationFrame(updateHands);
    };

    rafRef.current = requestAnimationFrame(updateHands);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [timezone]);

  return (
    <div
      onMouseEnter={() => soundEngine.playHover?.()}
      className="relative w-full h-full rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center transition-transform duration-300 hover:scale-[1.02] shadow-[0_24px_70px_rgba(0,0,0,0.95)] cursor-none group/watch"
    >
      <div className="relative w-full h-full aspect-square">
        {/* Dial Face */}
        <img
          src="/clock/clockDial.png"
          alt="Clock dial"
          className="w-full h-full object-contain pointer-events-none select-none"
          loading="eager"
          draggable={false}
        />

        {/* Hour Hand */}
        <div
          ref={hourHandRef}
          className="absolute inset-0 pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <img
            src="/clock/hourHand.png"
            alt="Hour hand"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Minute Hand */}
        <div
          ref={minuteHandRef}
          className="absolute inset-0 pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <img
            src="/clock/minuteHand.png"
            alt="Minute hand"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Second Hand */}
        <div
          ref={secondHandRef}
          className="absolute inset-0 pointer-events-none"
          style={{ willChange: 'transform' }}
        >
          <img
            src="/clock/secondHand.png"
            alt="Second hand"
            className="w-full h-full object-contain select-none"
            draggable={false}
          />
        </div>

        {/* Subtle Crystal Glass Sheen Reflection */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default LuxuryChronometerWatch;
