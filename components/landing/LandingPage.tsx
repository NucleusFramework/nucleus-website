'use client';

import * as React from 'react';
import { useEffect } from 'react';
import { TopNav } from './sections/TopNav';
import { Hero } from './sections/Hero';
import { Pitch } from './sections/Pitch';
import { Toolkits } from './sections/Toolkits';
import { Perf } from './sections/Perf';
import { NativeParadox } from './sections/NativeParadox';
import { InstallCTA } from './sections/InstallCTA';
import { Footer } from './sections/Footer';
import type { Lang } from '@/lib/landing-i18n';

// Hardcoded tweak defaults (tweaks panel removed from production build)
const TWEAK_DEFAULTS = {
  accent: '#5B8DEF',
  atomSpeed: 1,
  background: 'deep',
  density: 'comfortable',
  showStarfield: true,
} as const;

interface LandingPageProps {
  lang?: Lang;
}

export function LandingPage({ lang = 'en' }: LandingPageProps) {
  // Apply tweaks live + cursor highlight on .feat-card (ported from index.html script)
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', TWEAK_DEFAULTS.accent);
    document.body.dataset.bg = TWEAK_DEFAULTS.background;
    document.body.dataset.density = TWEAK_DEFAULTS.density;

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const card = target?.closest?.('.feat-card') as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('mousemove', onMove);
    return () => {
      document.removeEventListener('mousemove', onMove);
      delete document.body.dataset.bg;
      delete document.body.dataset.density;
      document.documentElement.style.removeProperty('--accent');
    };
  }, []);

  return (
    <div data-bg={TWEAK_DEFAULTS.background} data-density={TWEAK_DEFAULTS.density}>
      <TopNav lang={lang} />
      <Hero accent={TWEAK_DEFAULTS.accent} atomSpeed={TWEAK_DEFAULTS.atomSpeed} lang={lang} />
      <Pitch lang={lang} />
      <Toolkits lang={lang} />
      <Perf lang={lang} />
      <NativeParadox lang={lang} />
      <InstallCTA lang={lang} />
      <Footer lang={lang} />
    </div>
  );
}
