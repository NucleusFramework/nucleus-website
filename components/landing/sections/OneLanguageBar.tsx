import * as React from 'react';
import { type Lang, oneLangT, pick } from '@/lib/landing-i18n';

interface OneLanguageBarProps {
  lang: Lang;
}

export function OneLanguageBar({ lang }: OneLanguageBarProps) {
  return (
    <div className="one-lang">
      <div className="one-lang-side one-lang-them">
        <span className="one-lang-tag">{pick(oneLangT.themTag, lang)}</span>
        <div className="one-lang-langs">
          <span className="one-lang-pill" data-lang="js">JS / TS / Dart</span>
          <span className="one-lang-bridge">IPC</span>
          <span className="one-lang-pill" data-lang="rs">Rust / C++ / Swift</span>
        </div>
        <div className="one-lang-cap">{pick(oneLangT.themCap, lang)}</div>
      </div>
      <div className="one-lang-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="one-lang-side one-lang-us">
        <span className="one-lang-tag one-lang-tag-hero">{pick(oneLangT.usTag, lang)}</span>
        <div className="one-lang-langs">
          <span className="one-lang-pill one-lang-pill-hero" data-lang="kt">Kotlin</span>
        </div>
        <div className="one-lang-cap">{pick(oneLangT.usCap, lang)}</div>
      </div>
    </div>
  );
}
