import * as React from 'react';
import Link from 'next/link';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { type Lang, shipT, pick } from '@/lib/landing-i18n';

interface ShipPipelineProps {
  lang: Lang;
}

const ACTIONS: Array<{ nameKey: keyof typeof shipT; descKey: keyof typeof shipT; accent: string }> = [
  { nameKey: 'a1Name', descKey: 'a1Desc', accent: 'blue' },
  { nameKey: 'a2Name', descKey: 'a2Desc', accent: 'gold' },
  { nameKey: 'a3Name', descKey: 'a3Desc', accent: 'gold' },
  { nameKey: 'a4Name', descKey: 'a4Desc', accent: 'purple' },
  { nameKey: 'a5Name', descKey: 'a5Desc', accent: 'cyan' },
  { nameKey: 'a6Name', descKey: 'a6Desc', accent: 'orange' },
];

export function ShipPipeline({ lang }: ShipPipelineProps) {
  const docsHref = lang === 'fr' ? '/fr/docs/packaging/ci-cd' : '/en/docs/packaging/ci-cd';
  const ubuntu = pick(shipT.osUbuntu, lang);
  const windows = pick(shipT.osWindows, lang);
  const macos = pick(shipT.osMacos, lang);

  return (
    <section className="ship" id="ship">
      <div className="section-inner">
        <SectionHeading
          eyebrow={pick(shipT.eyebrow, lang)}
          title={pick(shipT.title, lang)}
          subtitle={pick(shipT.subtitle, lang)}
        />

        {/* Pipeline visualization */}
        <div className="ship-pipe">
          <div className="ship-stage ship-stage-trigger">
            <div className="ship-stage-tag">{pick(shipT.stageTrigger, lang)}</div>
            <code className="ship-stage-cmd">{pick(shipT.stageTriggerLine, lang)}</code>
          </div>

          <ShipArrow />

          <div className="ship-stage ship-stage-build">
            <div className="ship-stage-tag">{pick(shipT.stageBuild, lang)}</div>
            <div className="ship-stage-title">{pick(shipT.stageBuildSub, lang)}</div>
            <div className="ship-matrix">
              <span className="ship-runner" data-os="ubuntu">{ubuntu} · amd64</span>
              <span className="ship-runner" data-os="ubuntu">{ubuntu} · arm64</span>
              <span className="ship-runner" data-os="windows">{windows} · amd64</span>
              <span className="ship-runner" data-os="windows">{windows} · arm64</span>
              <span className="ship-runner" data-os="macos">{macos} · arm64</span>
              <span className="ship-runner" data-os="macos">{macos} · x64</span>
            </div>
          </div>

          <ShipArrow />

          <div className="ship-stage ship-stage-sign">
            <div className="ship-stage-tag">{pick(shipT.stageSign, lang)}</div>
            <div className="ship-stage-title">{pick(shipT.stageSignSub, lang)}</div>
          </div>

          <ShipArrow />

          <div className="ship-stage ship-stage-release">
            <div className="ship-stage-tag">{pick(shipT.stageRelease, lang)}</div>
            <div className="ship-stage-title">{pick(shipT.stageReleaseSub, lang)}</div>
          </div>
        </div>

        {/* Action grid */}
        <div className="ship-actions-head">
          <span className="ship-actions-label">{pick(shipT.actionsLabel, lang)}</span>
          <span className="ship-actions-line" aria-hidden="true"/>
        </div>

        <div className="ship-actions">
          {ACTIONS.map(({ nameKey, descKey, accent }) => (
            <div key={nameKey} className={`ship-action ship-action-${accent}`}>
              <div className="ship-action-head">
                <span className="ship-action-dot" aria-hidden="true"/>
                <code className="ship-action-name">{pick(shipT[nameKey] as { en: string; fr: string }, lang)}</code>
              </div>
              <p className="ship-action-desc">{pick(shipT[descKey] as { en: string; fr: string }, lang)}</p>
            </div>
          ))}
        </div>

        <div className="ship-cta">
          <Link href={docsHref} className="ship-cta-link">
            {pick(shipT.ctaDocs, lang)}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ShipArrow() {
  return (
    <div className="ship-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
        <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
