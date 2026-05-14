import * as React from 'react';
import { Atom } from '@/components/landing/Atom';
import { type Lang, heroT, pick } from '@/lib/landing-i18n';

interface HeroProps {
  accent: string;
  atomSpeed: number;
  lang: Lang;
}

export function Hero({ accent, atomSpeed, lang }: HeroProps) {
  return (
    <section className="hero">
      <div className="hero-bg-aurora" aria-hidden="true" />
      <div className="hero-grid-overlay" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-h1">{pick(heroT.h1, lang)}</h1>

          <p className="hero-sub">{pick(heroT.sub, lang)}</p>

          <div className="hero-cta">
            <a href="/docs/start/install" className="btn btn-primary">
              {pick(heroT.ctaPrimary, lang)}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#install" className="btn btn-ghost">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v9m0 0l3-3m-3 3L5 8M3 13h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {pick(heroT.ctaSecondary, lang)}
            </a>
            <a
              href="https://github.com/NucleusFramework/Nucleus"
              className="hero-stars"
              target="_blank"
              rel="noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              <span className="hero-stars-num">2.4k</span>
              <span className="hero-stars-label">{pick(heroT.stars, lang)}</span>
            </a>
          </div>
        </div>

        <div className="hero-atom-col">
          <Atom speed={atomSpeed} size={580} accent={accent} />
          <div className="hero-atom-labels" aria-hidden="true">
            <div className="hero-atom-label hero-label-tl">
              <span className="hero-label-key">{pick(heroT.coldStart, lang)}</span>
              <span className="hero-label-val">~0.5<span className="hero-label-unit">s</span></span>
            </div>
            <div className="hero-atom-label hero-label-tr">
              <span className="hero-label-key">{pick(heroT.ram, lang)}</span>
              <span className="hero-label-val">60<span className="hero-label-unit">MB</span></span>
            </div>
            <div className="hero-atom-label hero-label-bl">
              <span className="hero-label-key">{pick(heroT.modules, lang)}</span>
              <span className="hero-label-val">30<span className="hero-label-unit">+</span></span>
            </div>
            <div className="hero-atom-label hero-label-br">
              <span className="hero-label-key">{pick(heroT.formats, lang)}</span>
              <span className="hero-label-val">16</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
