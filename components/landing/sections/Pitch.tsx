import * as React from 'react';
import { KmpPlatformRow } from './KmpPlatformRow';
import { OneLanguageBar } from './OneLanguageBar';
import { type Lang, pitchT, pick } from '@/lib/landing-i18n';

interface PitchProps {
  lang: Lang;
}

export function Pitch({ lang }: PitchProps) {
  return (
    <section className="pitch">
      <div className="section-inner">

        <div className="pitch-header">
          <h2 className="pitch-h">{pick(pitchT.title, lang)}</h2>
          <p className="pitch-sub">{pick(pitchT.sub, lang)}</p>
        </div>

        <KmpPlatformRow lang={lang}/>

        <OneLanguageBar lang={lang}/>
      </div>
    </section>
  );
}
