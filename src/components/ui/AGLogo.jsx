import React from 'react';

/**
 * Custom Stylized AG Monogram Logo
 * Vector-faithful representation of Arav Gautam's custom typography glyph.
 */
export const AGLogo = ({ className = "w-8 h-8", glow = true }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-[#b46f32]/20 blur-sm rounded-full -z-10" />
      )}
      <svg
        viewBox="0 0 120 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_8px_rgba(180,111,50,0.5)]"
      >
        <defs>
          <linearGradient id="agGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b46f32" />
          </linearGradient>
        </defs>

        {/* Letter A with curved fang legs & flared serif */}
        <path
          d="M 38 18 
             C 43 18, 52 18, 56 18 
             C 54 22, 53 26, 52 30 
             C 58 42, 62 60, 60 76 
             C 59 83, 56 89, 53 93 
             C 53 87, 54 81, 53 76 
             C 50 62, 45 47, 43 47 
             C 41 47, 36 62, 33 76 
             C 32 81, 33 87, 33 93 
             C 30 89, 27 83, 26 76 
             C 24 60, 28 42, 34 30 
             C 33 26, 32 22, 30 18 
             Z
             M 43 36 
             L 37 57 
             L 49 57 
             Z"
          fill="url(#agGradient)"
        />

        {/* Letter G with crescent claw & inner bar */}
        <path
          d="M 68 18 
             L 94 18 
             L 94 38 
             C 91 38, 86 38, 86 38 
             C 86 32, 85 27, 80 27 
             C 74 27, 72 35, 72 48 
             C 72 63, 76 75, 83 83 
             C 87 87, 91 90, 95 93 
             C 87 90, 79 84, 73 75 
             C 67 65, 65 52, 66 38 
             C 66 26, 68 18, 68 18 
             Z
             M 84 52 
             L 94 52 
             L 94 70 
             L 84 70 
             Z"
          fill="url(#agGradient)"
        />
      </svg>
    </div>
  );
};

export default AGLogo;

