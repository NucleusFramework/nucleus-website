'use client';

import * as React from 'react';
import { useState } from 'react';

interface Row {
  key: string;
  electron: { v: number; label: string };
  nucleus: { v: number; label: string };
}

const ROWS: Row[] = [
  { key: 'Cold start', electron: { v: 2500, label: '~2.5 s' }, nucleus: { v: 500, label: '~0.5 s' } },
  { key: 'RAM at idle', electron: { v: 350, label: '~350 MB' }, nucleus: { v: 60, label: '~60 MB' } },
  { key: 'Binary size', electron: { v: 180, label: '~180 MB' }, nucleus: { v: 38, label: '~38 MB' } },
];

export function ComparisonBars() {
  const [, setHover] = useState<string | null>(null);
  const max = Math.max(...ROWS.flatMap((r) => [r.electron.v, r.nucleus.v]));

  return (
    <div className="compare">
      <div className="compare-header">
        <span className="compare-title">Real-world numbers, side-by-side</span>
        <div className="compare-legend">
          <span className="compare-leg compare-leg-old"><span className="compare-leg-sw" /> Electron baseline</span>
          <span className="compare-leg compare-leg-new"><span className="compare-leg-sw" /> Nucleus + GraalVM</span>
        </div>
      </div>
      {ROWS.map((r) => (
        <div key={r.key} className="compare-row" onMouseEnter={() => setHover(r.key)} onMouseLeave={() => setHover(null)}>
          <div className="compare-key">{r.key}</div>
          <div className="compare-bars">
            <div className="compare-bar-row">
              <span className="compare-bar-tag">Electron</span>
              <div className="compare-track">
                <div className="compare-fill compare-fill-old" style={{ width: `${(r.electron.v / max) * 100}%` }} />
              </div>
              <span className="compare-bar-val">{r.electron.label}</span>
            </div>
            <div className="compare-bar-row">
              <span className="compare-bar-tag">Nucleus</span>
              <div className="compare-track">
                <div className="compare-fill compare-fill-new" style={{ width: `${(r.nucleus.v / max) * 100}%` }} />
              </div>
              <span className="compare-bar-val">{r.nucleus.label}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
