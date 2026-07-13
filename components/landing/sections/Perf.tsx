import * as React from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { RuntimeModeCards } from './RuntimeModeCards';
import { type Lang, perfT, pick } from '@/lib/landing-i18n';

interface PerfProps {
  lang: Lang;
}

export function Perf({ lang }: PerfProps) {
  return (
    <section className="perf" id="perf">
      <div className="section-inner">
        <SectionHeading
          eyebrow={pick(perfT.eyebrow, lang)}
          title={pick(perfT.title, lang)}
          subtitle={pick(perfT.subtitle, lang)}
        />
        <RuntimeModeCards lang={lang}/>
        <p className="perf-footnote">{pick(perfT.footnote, lang)}</p>
      </div>
    </section>
  );
}
