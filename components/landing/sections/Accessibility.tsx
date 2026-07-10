'use client';

import * as React from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { type Lang, accessibilityT, pick } from '@/lib/landing-i18n';

interface A11yCardProps {
  id: string;
  name: React.ReactNode;
  reader: React.ReactNode;
  api: React.ReactNode;
  tag: React.ReactNode;
  children: React.ReactNode;
}

function A11yCard({ id, name, reader, api, tag, children }: A11yCardProps) {
  return (
    <div className={`a11y-card a11y-card-${id}`}>
      <div className="a11y-window">{children}</div>
      <div className="a11y-meta">
        <div className="a11y-meta-line">
          <span className="a11y-meta-name">{name}</span>
          <span className="a11y-meta-tag">{tag}</span>
        </div>
        <div className="a11y-meta-row">
          <span className="a11y-meta-reader">{reader}</span>
          <span className="a11y-meta-sep">·</span>
          <code className="a11y-meta-api">{api}</code>
        </div>
      </div>
    </div>
  );
}

/* ---- macOS preview ---- */
function MacOSPreview({ lang }: { lang: Lang }) {
  return (
    <div className="a11y-pv a11y-pv-macos">
      <div className="a11y-pv-bg-macos" />
      <div className="a11y-chrome a11y-chrome-macos">
        <span className="a11y-tl a11y-tl-r" />
        <span className="a11y-tl a11y-tl-y" />
        <span className="a11y-tl a11y-tl-g" />
        <span className="a11y-chrome-title">{pick(accessibilityT.pv_settings, lang)}</span>
      </div>
      <div className="a11y-body a11y-body-macos">
        <div className="a11y-mac-row">
          <span className="a11y-mac-label">{pick(accessibilityT.pv_account, lang)}</span>
          <span className="a11y-mac-badge">{pick(accessibilityT.pv_active, lang)}</span>
        </div>
        <div className="a11y-mac-row is-focused">
          <span className="a11y-mac-label">{pick(accessibilityT.pv_voiceOver, lang)}</span>
          <span className="a11y-mac-switch is-on"><i /></span>
        </div>
        <div className="a11y-mac-hint">
          <span className="a11y-mac-hint-dot" />
          {pick(accessibilityT.pv_focusHint, lang)}
        </div>
      </div>
    </div>
  );
}

/* ---- Windows preview ---- */
function WindowsPreview({ lang }: { lang: Lang }) {
  return (
    <div className="a11y-pv a11y-pv-windows">
      <div className="a11y-pv-bg-windows" />
      <div className="a11y-chrome a11y-chrome-windows">
        <span className="a11y-chrome-title">{pick(accessibilityT.pv_easeOfAccess, lang)}</span>
        <span className="a11y-windows-controls">
          <span className="a11y-windows-ctrl">─</span>
          <span className="a11y-windows-ctrl">▢</span>
          <span className="a11y-windows-ctrl a11y-windows-close">✕</span>
        </span>
      </div>
      <div className="a11y-body a11y-body-windows">
        <div className="a11y-windows-card">
          <div className="a11y-windows-row">
            <div>
              <div className="a11y-windows-row-title">{pick(accessibilityT.pv_narrator, lang)}</div>
              <div className="a11y-windows-row-sub">{pick(accessibilityT.pv_describe, lang)}</div>
            </div>
            <span className="a11y-windows-switch is-on"><i /></span>
          </div>
        </div>
        <div className="a11y-windows-focus">
          <span className="a11y-windows-focus-ring" />
          <span>{pick(accessibilityT.pv_focusedElement, lang)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Linux preview ---- */
function LinuxPreview({ lang }: { lang: Lang }) {
  return (
    <div className="a11y-pv a11y-pv-linux">
      <div className="a11y-chrome a11y-chrome-linux">
        <span className="a11y-linux-back">‹</span>
        <span className="a11y-chrome-title">{pick(accessibilityT.pv_accessibility, lang)}</span>
        <span className="a11y-linux-menu">⋮</span>
      </div>
      <div className="a11y-body a11y-body-linux">
        <div className="a11y-linux-row">
          <span>{pick(accessibilityT.pv_screenReader, lang)}</span>
          <span className="a11y-linux-switch is-on"><i /></span>
        </div>
        <div className="a11y-linux-row is-orca">
          <span className="a11y-linux-orca-icon">O</span>
          <span>{pick(accessibilityT.pv_orca, lang)}</span>
        </div>
        <div className="a11y-linux-hint">
          {pick(accessibilityT.pv_atspi, lang)}
        </div>
      </div>
    </div>
  );
}

interface AccessibilityProps {
  lang: Lang;
}

export function Accessibility({ lang }: AccessibilityProps) {
  return (
    <section className="accessibility" id="accessibility">
      <div className="section-inner">
        <SectionHeading
          eyebrow={pick(accessibilityT.eyebrow, lang)}
          title={pick(accessibilityT.title, lang)}
          subtitle={pick(accessibilityT.subtitle, lang)}
        />

        <div className="a11y-grid">
          <A11yCard
            id="macos"
            name={pick(accessibilityT.macosName, lang)}
            reader={pick(accessibilityT.macosReader, lang)}
            api={pick(accessibilityT.macosApi, lang)}
            tag={pick(accessibilityT.macosTag, lang)}
          >
            <MacOSPreview lang={lang} />
          </A11yCard>

          <A11yCard
            id="windows"
            name={pick(accessibilityT.windowsName, lang)}
            reader={pick(accessibilityT.windowsReader, lang)}
            api={pick(accessibilityT.windowsApi, lang)}
            tag={pick(accessibilityT.windowsTag, lang)}
          >
            <WindowsPreview lang={lang} />
          </A11yCard>

          <A11yCard
            id="linux"
            name={pick(accessibilityT.linuxName, lang)}
            reader={pick(accessibilityT.linuxReader, lang)}
            api={pick(accessibilityT.linuxApi, lang)}
            tag={pick(accessibilityT.linuxTag, lang)}
          >
            <LinuxPreview lang={lang} />
          </A11yCard>
        </div>

        <div className="a11y-footnote">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {pick(accessibilityT.footnote, lang)}
        </div>
      </div>
    </section>
  );
}
