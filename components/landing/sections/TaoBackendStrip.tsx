import * as React from 'react';

interface TaoFeature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FEATURES: TaoFeature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M3 12c3-5 6-5 9-1s6 4 9-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M3 17c3-5 6-5 9-1s6 4 9-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    title: 'Native Wayland',
    desc: 'First-class Wayland support — no XWayland fallback, fractional scaling, gestures.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 12c0 4 2 7 5 8M21 12c0-4-2-7-5-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    title: 'Multi-touch & gestures',
    desc: 'Pinch, swipe, rotate — every Compose pointer event carries pressure, tilt and source.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M15 4l5 5-10 10H5v-5L15 4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M13 6l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Pen & stylus',
    desc: 'Pressure-sensitive input on every OS — Wacom, Surface Pen, Apple Pencil sidecar.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <rect x="2.5" y="4.5" width="9" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="13" y="12.5" width="8.5" height="7" rx="1" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 12v3M16 12V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    title: 'Per-monitor HiDPI',
    desc: 'Mixed-DPI setups handled transparently. Drag a window between displays, it adapts.',
  },
];

export function TaoBackendStrip() {
  return (
    <div className="tao-strip">
      <div className="tao-strip-head">
        <div className="tao-strip-badge">
          <span className="tao-strip-spark">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
              <path d="M8 0l1.6 5.4L15 7l-5.4 1.6L8 14l-1.6-5.4L1 7l5.4-1.6L8 0z"/>
            </svg>
          </span>
          Powered by Tao
          <span className="tao-strip-new">New backend · 2.0</span>
        </div>
        <p className="tao-strip-lede">
          Tao is the Rust windowing layer underpinning Tauri 2. Nucleus 2.0 makes it the default — bringing modern desktop primitives that JBR can&apos;t reach: Wayland, multi-touch, pen and stylus input, and a ~60&nbsp;MB resident footprint on a GraalVM Hello World.
        </p>
      </div>
      <div className="tao-strip-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="tao-feat">
            <div className="tao-feat-icon">{f.icon}</div>
            <div className="tao-feat-title">{f.title}</div>
            <div className="tao-feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
