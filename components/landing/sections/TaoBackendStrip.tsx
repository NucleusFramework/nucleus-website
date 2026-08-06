import * as React from 'react';
import { type Lang, taoStripT, pick } from '@/lib/landing-i18n';

interface TaoFeature {
  icon: React.ReactNode;
  titleKey: keyof typeof taoStripT;
  descKey: keyof typeof taoStripT;
}

const FEATURES: TaoFeature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 15l5-4 4 3 4-5 5 6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    titleKey: 'textureTitle',
    descKey: 'textureDesc',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <rect x="3" y="4" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <rect x="11" y="12" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M8 12v2M16 12V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    titleKey: 'nativeTitle',
    descKey: 'nativeDesc',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <path d="M3 12c3-5 6-5 9-1s6 4 9-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M3 17c3-5 6-5 9-1s6 4 9-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5"/>
      </svg>
    ),
    titleKey: 'waylandTitle',
    descKey: 'waylandDesc',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
        <circle cx="8" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M3 12c0 4 2 7 5 8M21 12c0-4-2-7-5-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    titleKey: 'touchTitle',
    descKey: 'touchDesc',
  },
];

interface TaoBackendStripProps {
  lang: Lang;
}

export function TaoBackendStrip({ lang }: TaoBackendStripProps) {
  return (
    <div className="tao-strip">
      <div className="tao-strip-head">
        <div className="tao-strip-badge">
          <span className="tao-strip-spark">
            <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor">
              <path d="M8 0l1.6 5.4L15 7l-5.4 1.6L8 14l-1.6-5.4L1 7l5.4-1.6L8 0z"/>
            </svg>
          </span>
          {pick(taoStripT.badge, lang)}
          <span className="tao-strip-new">{pick(taoStripT.badgeNew, lang)}</span>
        </div>
        <p className="tao-strip-lede">{pick(taoStripT.lede, lang)}</p>
      </div>
      <div className="tao-strip-grid">
        {FEATURES.map((f) => (
          <div key={f.titleKey} className="tao-feat">
            <div className="tao-feat-icon">{f.icon}</div>
            <div className="tao-feat-title">{pick(taoStripT[f.titleKey], lang)}</div>
            <div className="tao-feat-desc">{pick(taoStripT[f.descKey], lang)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
