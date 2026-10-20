'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { TopNav } from './sections/TopNav';
import { Hero } from './sections/Hero';
import { Pitch } from './sections/Pitch';
import { Features } from './sections/Features';
import { Accessibility } from './sections/Accessibility';
import { Perf } from './sections/Perf';
import { NativeParadox } from './sections/NativeParadox';
import { ShipPipeline } from './sections/ShipPipeline';
import { Community } from './sections/Community';
import { Footer } from './sections/Footer';
import type { Lang } from '@/lib/landing-i18n';

const ACCENT = '#5B8DEF';

interface LandingPageProps {
  lang?: Lang;
  stars?: number | null;
}

export function LandingPage({ lang = 'en', stars = null }: LandingPageProps) {
  // Cursor-following highlight on .feat-card, throttled to one write per frame
  useEffect(() => {
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      const e = last;
      const card = (e?.target as Element | null)?.closest?.('.feat-card') as HTMLElement | null;
      if (!e || !card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      document.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="landing-root">
      <TopNav lang={lang} />
      <Hero accent={ACCENT} lang={lang} stars={stars} />
      <Pitch lang={lang} />
      <Features lang={lang} />
      <Accessibility lang={lang} />
      <Perf lang={lang} />
      <NativeParadox lang={lang} />
      <ShipPipeline lang={lang} />
      <Community lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
