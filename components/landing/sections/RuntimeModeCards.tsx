'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.25): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } });
    }, { threshold });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, seen];
}

interface Stat {
  label: string;
  value: number;
  fmt: (n: number) => string | number;
  unit: string;
}

interface RuntimeModeCardProps {
  variant: string;
  tag: string;
  name: string;
  tagline: string;
  desc: string;
  stats: Stat[];
  throughputLabel: string;
  throughputPct: number;
  throughputNote: string;
  bestFor: string[];
  cliMod: string;
}

function RuntimeStat({ label, value, fmt, unit, active }: Stat & { active: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setV(value * eased);
      if (t < 1) requestAnimationFrame(tick);
      else setV(value);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <div className="rmode-stat">
      <div className="rmode-stat-v">{fmt(v)}<span className="rmode-stat-u">{unit}</span></div>
      <div className="rmode-stat-k">{label}</div>
    </div>
  );
}

function RuntimeModeCard({ variant, tag, name, tagline, desc, stats, throughputLabel, throughputPct, throughputNote, bestFor, cliMod }: RuntimeModeCardProps) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`rmode rmode-${variant}`}>
      <div className="rmode-glow" aria-hidden="true"/>
      <div className="rmode-head">
        <span className="rmode-tag">{tag}</span>
        <h3 className="rmode-name">{name}</h3>
        <p className="rmode-tagline">{tagline}</p>
      </div>

      <p className="rmode-desc">{desc}</p>

      <div className="rmode-stats">
        {stats.map((s, i) => (
          <RuntimeStat key={i} {...s} active={inView}/>
        ))}
      </div>

      <div className="rmode-thru">
        <div className="rmode-thru-head">
          <span className="rmode-thru-label">CPU throughput</span>
          <span className="rmode-thru-val">{throughputLabel}</span>
        </div>
        <div className="rmode-thru-track">
          <div
            className="rmode-thru-fill"
            style={{ width: inView ? `${throughputPct}%` : '0%' }}
          />
          <span className="rmode-thru-cpp" style={{ left: '96%' }} title="C++/Rust baseline">C++</span>
        </div>
        <div className="rmode-thru-note">{throughputNote}</div>
      </div>

      <div className="rmode-best">
        <div className="rmode-best-label">Best for</div>
        <div className="rmode-best-chips">
          {bestFor.map((b) => <span key={b} className="rmode-best-chip">{b}</span>)}
        </div>
      </div>

      <code className="rmode-mod">{cliMod}</code>
    </div>
  );
}

export function RuntimeModeCards() {
  return (
    <div className="rmode-grid">

      {/* ====== GraalVM Native Image ====== */}
      <RuntimeModeCard
        variant="native"
        tag="Closed world"
        name="GraalVM Native Image"
        tagline="Instant cold start. Tiny footprint."
        desc="Your whole app is AOT-compiled to a standalone binary. No JVM startup, no class loading — the process is alive in half a second. Smallest resident set on the market."
        stats={[
          { label: 'Cold start', value: 0.48, fmt: (n) => n.toFixed(2), unit: 's' },
          { label: 'RAM idle',   value: 60,   fmt: (n) => Math.round(n), unit: 'MB' },
          { label: 'Binary',     value: 38,   fmt: (n) => Math.round(n), unit: 'MB' },
        ]}
        throughputLabel="Very good · AOT compiled"
        throughputPct={82}
        throughputNote="GraalVM PGO + Compose IR optimizations"
        bestFor={['CLIs & small apps', 'Sandboxed targets', 'App Store / MSIX', 'Distribution-first']}
        cliMod="nucleus.graalvm-runtime"
      />

      {/* ====== JVM + AOT Cache ====== */}
      <RuntimeModeCard
        variant="aot"
        tag="Open world"
        name="JDK 25 + AOT Cache"
        tagline="JIT-blazing throughput. Normal start."
        desc="HotSpot's C2 JIT is the most mature compiler ever built. With JDK 25's AOT cache priming the class metadata, you skip the warm-up — and once your hot paths get profiled, throughput approaches what C++ and Rust deliver."
        stats={[
          { label: 'Cold start', value: 1.2,  fmt: (n) => n.toFixed(1), unit: 's' },
          { label: 'RAM idle',   value: 180,  fmt: (n) => Math.round(n), unit: 'MB' },
          { label: 'Binary',     value: 95,   fmt: (n) => Math.round(n), unit: 'MB' },
        ]}
        throughputLabel="≈ C++ / Rust on hot paths"
        throughputPct={96}
        throughputNote="HotSpot C2 · escape analysis · vectorization"
        bestFor={['Long-running apps', 'Data-heavy workloads', 'IDE-like tools', 'Reflection-heavy code']}
        cliMod="nucleus.aot-runtime"
      />
    </div>
  );
}
