import React, { useEffect, useRef } from 'react';

export const FilmGrain = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const width = 128;
    const height = 128;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const buffer32 = new Uint32Array(imgData.data.buffer);

    let frame = 0;
    const render = () => {
      frame++;
      if (frame % 2 === 0) {
        const len = buffer32.length;
        for (let i = 0; i < len; i++) {
          if (Math.random() < 0.12) {
            // Subtle monochrome grain noise
            buffer32[i] = (Math.random() * 255) | 0;
          } else {
            buffer32[i] = 0;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9990] opacity-[0.035] w-full h-full object-cover mix-blend-screen select-none"
    />
  );
};

export default FilmGrain;
