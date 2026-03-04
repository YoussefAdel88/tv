"use client";

import dynamic from 'next/dynamic';

const RetroTV = dynamic(() => import('./RetroTV'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw',
      height: '100vh',
      background: '#0D0D0D',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#FFB000',
      fontFamily: 'monospace',
      fontSize: '24px',
      letterSpacing: '4px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📺</div>
        <div>تلفزيون مصر 90s</div>
        <div style={{ fontSize: '14px', opacity: 0.5, marginTop: '8px', letterSpacing: '2px' }}>
          LOADING...
        </div>
      </div>
    </div>
  ),
});

export default function TVWrapper() {
  return <RetroTV />;
}
