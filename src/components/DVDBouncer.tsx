"use client";

import { useEffect, useRef, useState } from 'react';

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3',
];

export function DVDBouncer() {
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [colorIndex, setColorIndex] = useState(0);
  const [hitCorner, setHitCorner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef({ x: 100, y: 100 });
  const velRef = useRef({ x: 2.5, y: 2 });

  const LOGO_WIDTH = 120;
  const LOGO_HEIGHT = 60;

  useEffect(() => {
    const animate = () => {
      const container = containerRef.current;
      if (!container) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      let { x, y } = posRef.current;
      let { x: vx, y: vy } = velRef.current;

      x += vx;
      y += vy;

      let bounced = false;
      let cornerHit = false;

      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
        bounced = true;
      } else if (x + LOGO_WIDTH >= containerWidth) {
        x = containerWidth - LOGO_WIDTH;
        vx = -Math.abs(vx);
        bounced = true;
      }

      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
        bounced = true;
      } else if (y + LOGO_HEIGHT >= containerHeight) {
        y = containerHeight - LOGO_HEIGHT;
        vy = -Math.abs(vy);
        bounced = true;
      }

      // Check corner hit
      if (
        (x <= 2 || x + LOGO_WIDTH >= containerWidth - 2) &&
        (y <= 2 || y + LOGO_HEIGHT >= containerHeight - 2)
      ) {
        cornerHit = true;
      }

      posRef.current = { x, y };
      velRef.current = { x: vx, y: vy };

      if (bounced) {
        setColorIndex(prev => (prev + 1) % COLORS.length);
      }

      if (cornerHit) {
        setHitCorner(true);
        setTimeout(() => setHitCorner(false), 500);
      }

      setPos({ x, y });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="dvd-bouncer-container"
    >
      {/* Dark background */}
      <div className="dvd-background" />
      
      {/* Corner flash effect */}
      {hitCorner && (
        <div className="corner-flash" />
      )}
      
      {/* DVD Logo */}
      <div
        className="dvd-logo"
        style={{
          left: pos.x,
          top: pos.y,
          color: COLORS[colorIndex],
          textShadow: `0 0 20px ${COLORS[colorIndex]}, 0 0 40px ${COLORS[colorIndex]}`,
        }}
      >
        <div className="dvd-logo-text">DVD</div>
        <div className="dvd-logo-subtitle">تلفزيون مصر</div>
        <div className="dvd-logo-year">90s</div>
      </div>
      
      {/* Loading message */}
      <div className="dvd-loading-message">
        <div className="dvd-msg-arabic">جاري تحميل المحتوى...</div>
        <div className="dvd-msg-english">Loading Egyptian 90s content...</div>
        <div className="dvd-msg-dots">
          <span className="dot-1">●</span>
          <span className="dot-2">●</span>
          <span className="dot-3">●</span>
        </div>
      </div>
      
      {/* Scanlines */}
      <div className="dvd-scanlines" />
    </div>
  );
}
