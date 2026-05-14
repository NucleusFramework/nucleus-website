'use client';

import * as React from 'react';
import { useState } from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';
import { type Lang, toolkitsT, pick } from '@/lib/landing-i18n';

interface ToolkitCardProps {
  id: string;
  name: string;
  style: string;
  os: string;
  module: string;
  isNew?: boolean;
  newLabel: string;
  children?: React.ReactNode;
  onHover: (id: string | null) => void;
  hovered: string | null;
}

function ToolkitCard({ id, name, style, os, module: mod, isNew, newLabel, children, onHover, hovered }: ToolkitCardProps) {
  return (
    <div
      className={`tk-card tk-card-${id} ${hovered === id ? 'is-hovered' : ''} ${hovered && hovered !== id ? 'is-dimmed' : ''}`}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="tk-window">
        {children}
      </div>
      <div className="tk-meta">
        <div className="tk-meta-line">
          <span className="tk-meta-name">{name}</span>
          {isNew && <span className="tk-meta-new">{newLabel}</span>}
        </div>
        <div className="tk-meta-style">{style}</div>
        <div className="tk-meta-bottom">
          <span className="tk-meta-os">{os}</span>
          <code className="tk-meta-module">{mod}</code>
        </div>
      </div>
    </div>
  );
}

/* ---- macOS 26 (Liquid Glass) ---- */
function MacOS26Preview({ lang }: { lang: Lang }) {
  return (
    <div className="tk-pv tk-pv-macos26">
      <div className="tk-pv-bg-macos"/>
      <div className="tk-chrome tk-chrome-macos">
        <span className="tk-tl tk-tl-r"/>
        <span className="tk-tl tk-tl-y"/>
        <span className="tk-tl tk-tl-g"/>
        <span className="tk-chrome-title">{pick(toolkitsT.pv_settings, lang)}</span>
      </div>
      <div className="tk-body tk-body-macos">
        <div className="tk-mac-sidebar">
          <div className="tk-mac-side-item is-active">
            <span className="tk-mac-side-dot" style={{ background: '#007AFF' }}/>
            {pick(toolkitsT.pv_general, lang)}
          </div>
          <div className="tk-mac-side-item">
            <span className="tk-mac-side-dot" style={{ background: '#FF3B30' }}/>
            {pick(toolkitsT.pv_appearance, lang)}
          </div>
          <div className="tk-mac-side-item">
            <span className="tk-mac-side-dot" style={{ background: '#34C759' }}/>
            {pick(toolkitsT.pv_network, lang)}
          </div>
        </div>
        <div className="tk-mac-content">
          <div className="tk-mac-card">
            <div className="tk-mac-row">
              <span>{pick(toolkitsT.pv_darkMode, lang)}</span>
              <span className="tk-mac-switch is-on"><i/></span>
            </div>
          </div>
          <button className="tk-mac-btn">{pick(toolkitsT.pv_continue, lang)}</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Fluent (Windows 11) ---- */
function FluentPreview({ lang }: { lang: Lang }) {
  return (
    <div className="tk-pv tk-pv-fluent">
      <div className="tk-pv-bg-fluent"/>
      <div className="tk-chrome tk-chrome-fluent">
        <span className="tk-chrome-title">{pick(toolkitsT.pv_settingsNucleus, lang)}</span>
        <span className="tk-fluent-controls">
          <span className="tk-fluent-ctrl">─</span>
          <span className="tk-fluent-ctrl">▢</span>
          <span className="tk-fluent-ctrl tk-fluent-close">✕</span>
        </span>
      </div>
      <div className="tk-body tk-body-fluent">
        <div className="tk-fluent-nav">
          <span className="tk-fluent-nav-item is-active">
            <i/> {pick(toolkitsT.pv_appearance, lang)}
          </span>
          <span className="tk-fluent-nav-item"><i/> {pick(toolkitsT.pv_system, lang)}</span>
        </div>
        <div className="tk-fluent-card">
          <div className="tk-fluent-row">
            <div>
              <div className="tk-fluent-row-title">{pick(toolkitsT.pv_darkMode, lang)}</div>
              <div className="tk-fluent-row-sub">{pick(toolkitsT.pv_followSystem, lang)}</div>
            </div>
            <span className="tk-fluent-switch is-on"><i/></span>
          </div>
          <div className="tk-fluent-divider"/>
          <div className="tk-fluent-row">
            <div className="tk-fluent-row-title">{pick(toolkitsT.pv_accent, lang)}</div>
            <span className="tk-fluent-chev">›</span>
          </div>
        </div>
        <button className="tk-fluent-btn">{pick(toolkitsT.pv_save, lang)}</button>
      </div>
    </div>
  );
}

/* ---- Yaru (Ubuntu) ---- */
function YaruPreview({ lang }: { lang: Lang }) {
  return (
    <div className="tk-pv tk-pv-yaru">
      <div className="tk-chrome tk-chrome-yaru">
        <span className="tk-yaru-back">‹</span>
        <span className="tk-chrome-title">{pick(toolkitsT.pv_settings, lang)}</span>
        <span className="tk-yaru-menu">⋮</span>
      </div>
      <div className="tk-body tk-body-yaru">
        <div className="tk-yaru-section">{pick(toolkitsT.pv_appearance, lang)}</div>
        <div className="tk-yaru-card">
          <div className="tk-yaru-row">
            <span>{pick(toolkitsT.pv_darkStyle, lang)}</span>
            <span className="tk-yaru-switch is-on"><i/></span>
          </div>
          <div className="tk-yaru-divider"/>
          <div className="tk-yaru-row">
            <span>{pick(toolkitsT.pv_accentColor, lang)}</span>
            <div className="tk-yaru-accents">
              <span style={{ background: '#E95420' }} className="is-on"/>
              <span style={{ background: '#77216F' }}/>
              <span style={{ background: '#3584E4' }}/>
            </div>
          </div>
        </div>
        <button className="tk-yaru-btn">{pick(toolkitsT.pv_apply, lang)}</button>
      </div>
    </div>
  );
}

/* ---- Jewel (IntelliJ) ---- */
function JewelPreview({ lang }: { lang: Lang }) {
  return (
    <div className="tk-pv tk-pv-jewel">
      <div className="tk-chrome tk-chrome-jewel">
        <span className="tk-jewel-tab is-active">{pick(toolkitsT.pv_settings, lang)}</span>
        <span className="tk-jewel-tab">{pick(toolkitsT.pv_editor, lang)}</span>
        <span className="tk-jewel-tab">{pick(toolkitsT.pv_plugins, lang)}</span>
      </div>
      <div className="tk-body tk-body-jewel">
        <div className="tk-jewel-tree">
          <div className="tk-jewel-tree-item is-expanded">▾ {pick(toolkitsT.pv_appearance, lang)}</div>
          <div className="tk-jewel-tree-item is-child is-selected">{pick(toolkitsT.pv_theme, lang)}</div>
          <div className="tk-jewel-tree-item is-child">{pick(toolkitsT.pv_colors, lang)}</div>
          <div className="tk-jewel-tree-item">▸ {pick(toolkitsT.pv_editor, lang)}</div>
          <div className="tk-jewel-tree-item">▸ {pick(toolkitsT.pv_keymap, lang)}</div>
        </div>
        <div className="tk-jewel-panel">
          <div className="tk-jewel-label">{pick(toolkitsT.pv_theme, lang)}</div>
          <div className="tk-jewel-select">
            <span>Darcula</span>
            <span>▾</span>
          </div>
          <div className="tk-jewel-actions">
            <button className="tk-jewel-btn">{pick(toolkitsT.pv_cancel, lang)}</button>
            <button className="tk-jewel-btn tk-jewel-btn-primary">{pick(toolkitsT.pv_apply, lang)}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ToolkitsProps {
  lang: Lang;
}

export function Toolkits({ lang }: ToolkitsProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const newLabel = pick(toolkitsT.isNew, lang);

  return (
    <section className="toolkits" id="toolkits">
      <div className="section-inner">
        <SectionHeading
          eyebrow={pick(toolkitsT.eyebrow, lang)}
          title={pick(toolkitsT.title, lang)}
          subtitle={pick(toolkitsT.subtitle, lang)}
        />

        <div className="tk-grid">
          <ToolkitCard
            id="macos26"
            name="macOS 26"
            style="Liquid Glass"
            os={pick(toolkitsT.macOsName, lang)}
            module="decorated-window-macos26"
            isNew
            newLabel={newLabel}
            onHover={setHovered}
            hovered={hovered}
          >
            <MacOS26Preview lang={lang}/>
          </ToolkitCard>

          <ToolkitCard
            id="fluent"
            name="Fluent"
            style="Mica · Acrylic"
            os={pick(toolkitsT.fluentOs, lang)}
            module="decorated-window-fluent"
            isNew
            newLabel={newLabel}
            onHover={setHovered}
            hovered={hovered}
          >
            <FluentPreview lang={lang}/>
          </ToolkitCard>

          <ToolkitCard
            id="yaru"
            name="Yaru"
            style={pick(toolkitsT.yaruStyle, lang)}
            os={pick(toolkitsT.yaruOs, lang)}
            module="decorated-window-yaru"
            isNew
            newLabel={newLabel}
            onHover={setHovered}
            hovered={hovered}
          >
            <YaruPreview lang={lang}/>
          </ToolkitCard>

          <ToolkitCard
            id="jewel"
            name="Jewel"
            style={pick(toolkitsT.jewelStyle, lang)}
            os={pick(toolkitsT.jewelOs, lang)}
            module="decorated-window-jewel"
            newLabel={newLabel}
            onHover={setHovered}
            hovered={hovered}
          >
            <JewelPreview lang={lang}/>
          </ToolkitCard>
        </div>

        <div className="tk-footnote">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {pick(toolkitsT.footnote, lang)}
        </div>
      </div>
    </section>
  );
}
