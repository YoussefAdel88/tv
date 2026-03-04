"use client";

import { useEffect, useRef } from 'react';

interface StaticNoiseProps {
  intensity?: number;
}

export function StaticNoise({ intensity = 1 }: StaticNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let frame = 0;

    const drawStatic = () => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Random grayscale noise
        const noise = Math.random() * 255 * intensity;
        
        // Add some color tint for vintage feel
        const r = noise * 0.9;
        const g = noise * 0.85;
        const b = noise * 0.7;
        
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = 255;
      }

      // Add horizontal scan lines occasionally
      if (frame % 3 === 0) {
        const lineY = Math.floor(Math.random() * height);
        for (let x = 0; x < width; x++) {
          const idx = (lineY * width + x) * 4;
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 200;
          data[idx + 3] = 180;
        }
      }

      // Add vertical interference lines
      if (frame % 7 === 0) {
        const lineX = Math.floor(Math.random() * width);
        for (let y = 0; y < height; y++) {
          const idx = (y * width + lineX) * 4;
          data[idx] = 200;
          data[idx + 1] = 200;
          data[idx + 2] = 150;
          data[idx + 3] = 150;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add "CHANNEL" text overlay occasionally
      if (frame % 30 < 5) {
        ctx.fillStyle = `rgba(255, 255, 200, ${0.3 * intensity})`;
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NO SIGNAL', width / 2, height / 2);
        ctx.font = '14px monospace';
        ctx.fillText('لا يوجد إشارة', width / 2, height / 2 + 30);
      }

      frame++;
      animFrameRef.current = requestAnimationFrame(drawStatic);
    };

    drawStatic();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <div className="static-noise-container">
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="static-canvas"
      />
      {/* Overlay effects */}
      <div className="static-vignette" />
      <div className="static-flicker" />
    </div>
  );
}
