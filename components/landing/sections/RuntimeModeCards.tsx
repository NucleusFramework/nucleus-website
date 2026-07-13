'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { type Lang, rmodeT, pick } from '@/lib/landing-i18n';

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
  bestForLabel: string;
  cpuThruLabel: string;
  cppLabel: string;
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

function RuntimeModeCard({ variant, tag, name, tagline, desc, stats, throughputLabel, throughputPct, throughputNote, bestFor, bestForLabel, cpuThruLabel, cppLabel, cliMod }: RuntimeModeCardProps) {
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
          <span className="rmode-thru-label">{cpuThruLabel}</span>
          <span className="rmode-thru-val">{throughputLabel}</span>
        </div>
        <div className="rmode-thru-track">
          <div
            className="rmode-thru-fill"
            style={{ width: inView ? `${throughputPct}%` : '0%' }}
          />
          <span className="rmode-thru-cpp" style={{ left: '96%' }} title={cppLabel}>C++</span>
        </div>
        <div className="rmode-thru-note">{throughputNote}</div>
      </div>

      <div className="rmode-best">
        <div className="rmode-best-label">{bestForLabel}</div>
        <div className="rmode-best-chips">
          {bestFor.map((b) => <span key={b} className="rmode-best-chip">{b}</span>)}
        </div>
      </div>

      <code className="rmode-mod">{cliMod}</code>
    </div>
  );
}

interface RuntimeModeCardsProps {
  lang: Lang;
}

export function RuntimeModeCards({ lang }: RuntimeModeCardsProps) {
  const cpuThruLabel = pick(rmodeT.cpuThroughput, lang);
  const cppLabel = pick(rmodeT.cppBaseline, lang);
  const bestForLabel = pick(rmodeT.bestFor, lang);
  const coldStart = pick(rmodeT.nativeColdStart, lang);
  const ram = pick(rmodeT.nativeRam, lang);
  const binary = pick(rmodeT.nativeBinary, lang);

  return (
    <div className="rmode-grid">

      {/* ====== GraalVM Native Image ====== */}
      <RuntimeModeCard
        variant="native"
        tag={pick(rmodeT.nativeTag, lang)}
        name={pick(rmodeT.nativeName, lang)}
        tagline={pick(rmodeT.nativeTagline, lang)}
        desc={pick(rmodeT.nativeDesc, lang)}
        stats={[
          { label: coldStart, value: 0.2,  fmt: (n) => n.toFixed(1), unit: 's' },
          { label: ram,       value: 35,   fmt: (n) => Math.round(n), unit: 'MB' },
          { label: binary,    value: 40,   fmt: (n) => Math.round(n), unit: 'MB' },
        ]}
        throughputLabel={pick(rmodeT.nativeThruLabel, lang)}
        throughputPct={82}
        throughputNote={pick(rmodeT.nativeThruNote, lang)}
        bestFor={[
          pick(rmodeT.nativeBest1, lang),
          pick(rmodeT.nativeBest2, lang),
          pick(rmodeT.nativeBest3, lang),
          pick(rmodeT.nativeBest4, lang),
        ]}
        bestForLabel={bestForLabel}
        cpuThruLabel={cpuThruLabel}
        cppLabel={cppLabel}
        cliMod="nucleus.graalvm-runtime"
      />

      {/* ====== JVM + AOT Cache ====== */}
      <RuntimeModeCard
        variant="aot"
        tag={pick(rmodeT.aotTag, lang)}
        name={pick(rmodeT.aotName, lang)}
        tagline={pick(rmodeT.aotTagline, lang)}
        desc={pick(rmodeT.aotDesc, lang)}
        stats={[
          { label: coldStart, value: 1.0,  fmt: (n) => n.toFixed(1), unit: 's' },
          { label: ram,       value: 120,  fmt: (n) => Math.round(n), unit: 'MB' },
          { label: binary,    value: 60,   fmt: (n) => Math.round(n), unit: 'MB' },
        ]}
        throughputLabel={pick(rmodeT.aotThruLabel, lang)}
        throughputPct={96}
        throughputNote={pick(rmodeT.aotThruNote, lang)}
        bestFor={[
          pick(rmodeT.aotBest1, lang),
          pick(rmodeT.aotBest2, lang),
          pick(rmodeT.aotBest3, lang),
          pick(rmodeT.aotBest4, lang),
        ]}
        bestForLabel={bestForLabel}
        cpuThruLabel={cpuThruLabel}
        cppLabel={cppLabel}
        cliMod="nucleus.aot-runtime"
      />
    </div>
  );
}
