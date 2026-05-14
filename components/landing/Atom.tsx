'use client';

import * as React from 'react';

/* ============================================================
   <Atom /> — animated electron atom centerpiece
   ============================================================
   SVG-based, uses <animateMotion> for electrons riding their
   elliptical paths, CSS for global slow rotation + nucleus
   pulse. Accepts a `speed` prop (multiplier).
   ============================================================ */

interface AtomProps {
  speed?: number;
  size?: number;
  accent?: string;
}

// random-ish star positions inside a 540px radius
const STAR_FIELD: Array<[number, number, number, number]> = [
  [-230, -180, 1.2, 0.6], [200, -210, 1.5, 0.8], [-150, 220, 1, 0.5],
  [240, 140, 1.3, 0.7], [-260, 50, 1, 0.4], [180, -110, 0.9, 0.6],
  [-90, -240, 1.1, 0.7], [220, 220, 1.4, 0.5], [-200, 160, 0.8, 0.4],
  [60, -260, 1.2, 0.6], [-240, -60, 1, 0.5], [120, 240, 1.1, 0.7],
  [260, -20, 1.5, 0.9], [-180, -120, 0.9, 0.5], [80, 200, 1.2, 0.6],
  [-50, -200, 1, 0.4], [200, 60, 1.3, 0.8], [-220, 230, 1.1, 0.5],
  [40, -150, 0.8, 0.4], [160, 180, 1.4, 0.7],
];

export function Atom({ speed = 1, size = 560, accent = '#5B8DEF' }: AtomProps) {
  // Speed multiplier: bigger = slower (period is divided by speed)
  const s = (sec: number) => `${(sec / speed).toFixed(2)}s`;

  return (
    <div className="atom-wrap" style={{ width: size, height: size }}>
      <svg
        viewBox="-280 -280 560 560"
        width={size}
        height={size}
        className="atom-svg"
        aria-hidden="true"
      >
        <defs>
          {/* orbit gradients — pulled from logo orbits */}
          <linearGradient id="orbA" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4FBFE0" />
            <stop offset="50%" stopColor="#9B7BFF" />
            <stop offset="100%" stopColor="#FF6F9C" />
          </linearGradient>
          <linearGradient id="orbB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C5BFF" />
            <stop offset="55%" stopColor="#B062FF" />
            <stop offset="100%" stopColor="#FF7A59" />
          </linearGradient>
          <linearGradient id="orbC" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#5B8DEF" />
            <stop offset="60%" stopColor="#4FD1E0" />
            <stop offset="100%" stopColor="#9B7BFF" />
          </linearGradient>

          {/* electron sphere gradients */}
          <radialGradient id="elBlue" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#DCEBFF" />
            <stop offset="40%" stopColor="#7AB0FF" />
            <stop offset="100%" stopColor="#2B5BD0" />
          </radialGradient>
          <radialGradient id="elPurple" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#F0E4FF" />
            <stop offset="40%" stopColor="#B488FF" />
            <stop offset="100%" stopColor="#5A2FD0" />
          </radialGradient>
          <radialGradient id="elOrange" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFE6CF" />
            <stop offset="40%" stopColor="#FFA86E" />
            <stop offset="100%" stopColor="#D14A1A" />
          </radialGradient>
          <radialGradient id="elPink" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#FFE0EC" />
            <stop offset="40%" stopColor="#FF80A8" />
            <stop offset="100%" stopColor="#C8366B" />
          </radialGradient>

          {/* nucleus */}
          <radialGradient id="nucCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="35%" stopColor="#E9F2FF" />
            <stop offset="65%" stopColor="#7AB0FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#5B8DEF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nucGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5B8DEF" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#5B8DEF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#5B8DEF" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
            <stop offset="50%" stopColor={accent} stopOpacity="0.05" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>

          {/* orbit paths — full ellipses as SVG paths so <animateMotion> works */}
          {/* Orbit A: 230 x 78, tilted ~12° */}
          <path
            id="pathA"
            d="M -230 0 a 230 78 0 1 0 460 0 a 230 78 0 1 0 -460 0"
            transform="rotate(12)"
          />
          {/* Orbit B: 220 x 85, tilted -58° */}
          <path
            id="pathB"
            d="M -220 0 a 220 85 0 1 0 440 0 a 220 85 0 1 0 -440 0"
            transform="rotate(-58)"
          />
          {/* Orbit C: 235 x 72, tilted 62° */}
          <path
            id="pathC"
            d="M -235 0 a 235 72 0 1 0 470 0 a 235 72 0 1 0 -470 0"
            transform="rotate(62)"
          />
        </defs>

        {/* outer halo */}
        <circle cx="0" cy="0" r="270" fill="url(#haloGlow)" />

        {/* faint stars */}
        <g className="atom-stars" opacity="0.55">
          {STAR_FIELD.map((p, i) => (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={p[2]}
              fill="#B8C5DE"
              opacity={p[3]}
              style={{
                animation: `atomTwinkle ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </g>

        {/* slow global rotation wrap (keeps composition feeling alive) */}
        <g style={{ animation: `atomGlobalSpin ${s(120)} linear infinite`, transformOrigin: '0 0' }}>

          {/* === Orbit A === */}
          <g className="atom-orbit-group">
            <use href="#pathA" fill="none" stroke="url(#orbA)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            {/* stroke "shadow" / glow underlay */}
            <use href="#pathA" fill="none" stroke="url(#orbA)" strokeWidth="6" strokeLinecap="round" opacity="0.18" />
            {/* electron */}
            <circle r="11" fill="url(#elPink)" style={{ filter: 'drop-shadow(0 0 10px #FF7AAA)' }}>
              <animateMotion dur={s(7.5)} repeatCount="indefinite" rotate="auto">
                <mpath href="#pathA" />
              </animateMotion>
            </circle>
          </g>

          {/* === Orbit B === */}
          <g className="atom-orbit-group">
            <use href="#pathB" fill="none" stroke="url(#orbB)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <use href="#pathB" fill="none" stroke="url(#orbB)" strokeWidth="6" strokeLinecap="round" opacity="0.18" />
            <circle r="10" fill="url(#elPurple)" style={{ filter: 'drop-shadow(0 0 10px #9B7BFF)' }}>
              <animateMotion dur={s(9)} repeatCount="indefinite" rotate="auto" begin="-2s">
                <mpath href="#pathB" />
              </animateMotion>
            </circle>
            <circle r="9" fill="url(#elOrange)" style={{ filter: 'drop-shadow(0 0 10px #FF7A59)' }}>
              <animateMotion dur={s(9)} repeatCount="indefinite" rotate="auto" begin="-5.5s">
                <mpath href="#pathB" />
              </animateMotion>
            </circle>
          </g>

          {/* === Orbit C === */}
          <g className="atom-orbit-group">
            <use href="#pathC" fill="none" stroke="url(#orbC)" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
            <use href="#pathC" fill="none" stroke="url(#orbC)" strokeWidth="6" strokeLinecap="round" opacity="0.18" />
            <circle r="9" fill="url(#elBlue)" style={{ filter: 'drop-shadow(0 0 10px #5B8DEF)' }}>
              <animateMotion dur={s(11)} repeatCount="indefinite" rotate="auto" begin="-3.5s">
                <mpath href="#pathC" />
              </animateMotion>
            </circle>
          </g>
        </g>

        {/* nucleus — stays still in the center; layered glow */}
        <circle cx="0" cy="0" r="120" fill="url(#nucGlow)" className="nucleus-bg-glow" />
        <circle cx="0" cy="0" r="50" fill="url(#nucCore)" className="nucleus-core" />
        <circle cx="0" cy="0" r="6" fill="#FFFFFF" className="nucleus-bright" />
      </svg>

      <style>{`
        .atom-wrap {
          position: relative;
          display: inline-block;
        }
        .atom-svg {
          display: block;
          overflow: visible;
        }
        .nucleus-core {
          transform-origin: 0 0;
          animation: nucleusPulse 3.4s ease-in-out infinite;
        }
        .nucleus-bright {
          animation: nucleusBright 3.4s ease-in-out infinite;
          filter: drop-shadow(0 0 16px #FFF) drop-shadow(0 0 32px #5B8DEF);
        }
        .nucleus-bg-glow {
          animation: nucleusBgPulse 4s ease-in-out infinite;
        }
        @keyframes nucleusPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.92; }
        }
        @keyframes nucleusBright {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.85; }
        }
        @keyframes nucleusBgPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes atomGlobalSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes atomTwinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
