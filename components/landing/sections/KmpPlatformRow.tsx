import * as React from 'react';
import { type Lang, kmpT, pick } from '@/lib/landing-i18n';
import { asset } from '@/lib/site';

interface PlatformRow {
  k: keyof typeof kmpT;
  v: keyof typeof kmpT;
  via?: boolean;
}

interface Platform {
  id: string;
  name: string;
  icon?: React.ReactNode;
  logo?: string;
  isHero?: boolean;
  rows: PlatformRow[];
}

const PLATFORMS: Platform[] = [
  {
    id: 'android', name: 'Android',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M5.81 8.79l-1.55-2.68a.32.32 0 01.55-.32l1.57 2.71A8.85 8.85 0 0112 7c1.97 0 3.8.53 5.36 1.45l1.57-2.71a.32.32 0 11.55.32L17.93 8.79A8.05 8.05 0 0121 15.5H3a8.05 8.05 0 012.81-6.71zM8 13a.75.75 0 100-1.5.75.75 0 000 1.5zm8 0a.75.75 0 100-1.5.75.75 0 000 1.5z"/>
      </svg>
    ),
    rows: [
      { k: 'os_apis',    v: 'androidApis' },
      { k: 'native_ui',  v: 'androidUi' },
      { k: 'input',      v: 'androidInput' },
      { k: 'optimize',   v: 'androidOpt' },
      { k: 'package',    v: 'androidPkg' },
      { k: 'distribute', v: 'androidDist' },
    ],
  },
  {
    id: 'ios', name: 'iOS',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M16.5 3.5c0 1.5-1.2 2.7-2.7 2.6-.2-1.4 1.3-2.9 2.7-2.6zm3.4 12.7c-.8 1.8-1.8 3.7-3.5 3.7-1.6 0-2.1-1-3.9-1-1.9 0-2.4 1-3.9 1-1.7 0-3-1.9-3.8-3.7-1.6-3.4-1.7-7.5.3-9.8.9-1.1 2.3-1.7 3.5-1.7 1.4 0 2.3 1 3.9 1 1.5 0 2.5-1 3.9-1 1.2 0 2.5.6 3.4 1.7-3 1.7-2.5 5.9.1 6.8z"/>
      </svg>
    ),
    rows: [
      { k: 'os_apis',    v: 'iosApis' },
      { k: 'native_ui',  v: 'iosUi' },
      { k: 'input',      v: 'iosInput' },
      { k: 'optimize',   v: 'iosOpt' },
      { k: 'package',    v: 'iosPkg' },
      { k: 'distribute', v: 'iosDist' },
    ],
  },
  {
    id: 'web', name: 'Web',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/>
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
    rows: [
      { k: 'browser_apis', v: 'webApis' },
      { k: 'native_ui',    v: 'webUi' },
      { k: 'input',        v: 'webInput' },
      { k: 'optimize',     v: 'webOpt' },
      { k: 'package',      v: 'webPkg' },
      { k: 'distribute',   v: 'webDist' },
    ],
  },
  {
    id: 'desktop', name: 'Desktop',
    logo: '/assets/logo.png',
    isHero: true,
    rows: [
      { k: 'os_apis',    v: 'desktopApis',  via: true },
      { k: 'native_ui',  v: 'desktopUi',    via: true },
      { k: 'input',      v: 'desktopInput', via: true },
      { k: 'optimize',   v: 'desktopOpt',   via: true },
      { k: 'package',    v: 'desktopPkg',   via: true },
      { k: 'distribute', v: 'desktopDist',  via: true },
    ],
  },
];

interface KmpPlatformRowProps {
  lang: Lang;
}

export function KmpPlatformRow({ lang }: KmpPlatformRowProps) {
  return (
    <div className="kmp-row">
      {PLATFORMS.map((p) => (
        <div key={p.id} className={`kmp-card ${p.isHero ? 'is-hero' : ''}`}>
          <div className="kmp-card-glow" aria-hidden="true"/>
          <div className="kmp-card-head">
            <div className="kmp-card-icon">
              {p.logo ? <img src={asset(p.logo)} alt=""/> : p.icon}
            </div>
            <div className="kmp-card-name">{p.name}</div>
          </div>
          <div className="kmp-card-rows">
            {p.rows.map((r) => (
              <div key={r.k} className={`kmp-row-item ${r.via ? 'is-via' : ''}`}>
                <span className="kmp-row-k">{pick(kmpT[r.k] as { en: string; fr: string }, lang)}</span>
                <span className="kmp-row-v">
                  {r.via && <span className="kmp-via">{pick(kmpT.via, lang)}</span>}
                  {pick(kmpT[r.v] as { en: string; fr: string }, lang)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
