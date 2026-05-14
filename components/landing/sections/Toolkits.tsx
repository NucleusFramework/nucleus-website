'use client';

import * as React from 'react';
import { useState } from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';

interface ToolkitCardProps {
  id: string;
  name: string;
  style: string;
  os: string;
  module: string;
  isNew?: boolean;
  children?: React.ReactNode;
  onHover: (id: string | null) => void;
  hovered: string | null;
}

function ToolkitCard({ id, name, style, os, module: mod, isNew, children, onHover, hovered }: ToolkitCardProps) {
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
          {isNew && <span className="tk-meta-new">New · 2.0</span>}
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
function MacOS26Preview() {
  return (
    <div className="tk-pv tk-pv-macos26">
      <div className="tk-pv-bg-macos"/>
      <div className="tk-chrome tk-chrome-macos">
        <span className="tk-tl tk-tl-r"/>
        <span className="tk-tl tk-tl-y"/>
        <span className="tk-tl tk-tl-g"/>
        <span className="tk-chrome-title">Settings</span>
      </div>
      <div className="tk-body tk-body-macos">
        <div className="tk-mac-sidebar">
          <div className="tk-mac-side-item is-active">
            <span className="tk-mac-side-dot" style={{ background: '#007AFF' }}/>
            General
          </div>
          <div className="tk-mac-side-item">
            <span className="tk-mac-side-dot" style={{ background: '#FF3B30' }}/>
            Appearance
          </div>
          <div className="tk-mac-side-item">
            <span className="tk-mac-side-dot" style={{ background: '#34C759' }}/>
            Network
          </div>
        </div>
        <div className="tk-mac-content">
          <div className="tk-mac-card">
            <div className="tk-mac-row">
              <span>Dark mode</span>
              <span className="tk-mac-switch is-on"><i/></span>
            </div>
          </div>
          <button className="tk-mac-btn">Continue</button>
        </div>
      </div>
    </div>
  );
}

/* ---- Fluent (Windows 11) ---- */
function FluentPreview() {
  return (
    <div className="tk-pv tk-pv-fluent">
      <div className="tk-pv-bg-fluent"/>
      <div className="tk-chrome tk-chrome-fluent">
        <span className="tk-chrome-title">Settings — Nucleus Demo</span>
        <span className="tk-fluent-controls">
          <span className="tk-fluent-ctrl">─</span>
          <span className="tk-fluent-ctrl">▢</span>
          <span className="tk-fluent-ctrl tk-fluent-close">✕</span>
        </span>
      </div>
      <div className="tk-body tk-body-fluent">
        <div className="tk-fluent-nav">
          <span className="tk-fluent-nav-item is-active">
            <i/> Appearance
          </span>
          <span className="tk-fluent-nav-item"><i/> System</span>
        </div>
        <div className="tk-fluent-card">
          <div className="tk-fluent-row">
            <div>
              <div className="tk-fluent-row-title">Dark mode</div>
              <div className="tk-fluent-row-sub">Follow system</div>
            </div>
            <span className="tk-fluent-switch is-on"><i/></span>
          </div>
          <div className="tk-fluent-divider"/>
          <div className="tk-fluent-row">
            <div className="tk-fluent-row-title">Accent</div>
            <span className="tk-fluent-chev">›</span>
          </div>
        </div>
        <button className="tk-fluent-btn">Save</button>
      </div>
    </div>
  );
}

/* ---- Yaru (Ubuntu) ---- */
function YaruPreview() {
  return (
    <div className="tk-pv tk-pv-yaru">
      <div className="tk-chrome tk-chrome-yaru">
        <span className="tk-yaru-back">‹</span>
        <span className="tk-chrome-title">Settings</span>
        <span className="tk-yaru-menu">⋮</span>
      </div>
      <div className="tk-body tk-body-yaru">
        <div className="tk-yaru-section">Appearance</div>
        <div className="tk-yaru-card">
          <div className="tk-yaru-row">
            <span>Dark style</span>
            <span className="tk-yaru-switch is-on"><i/></span>
          </div>
          <div className="tk-yaru-divider"/>
          <div className="tk-yaru-row">
            <span>Accent color</span>
            <div className="tk-yaru-accents">
              <span style={{ background: '#E95420' }} className="is-on"/>
              <span style={{ background: '#77216F' }}/>
              <span style={{ background: '#3584E4' }}/>
            </div>
          </div>
        </div>
        <button className="tk-yaru-btn">Apply</button>
      </div>
    </div>
  );
}

/* ---- Jewel (IntelliJ) ---- */
function JewelPreview() {
  return (
    <div className="tk-pv tk-pv-jewel">
      <div className="tk-chrome tk-chrome-jewel">
        <span className="tk-jewel-tab is-active">Settings</span>
        <span className="tk-jewel-tab">Editor</span>
        <span className="tk-jewel-tab">Plugins</span>
      </div>
      <div className="tk-body tk-body-jewel">
        <div className="tk-jewel-tree">
          <div className="tk-jewel-tree-item is-expanded">▾ Appearance</div>
          <div className="tk-jewel-tree-item is-child is-selected">Theme</div>
          <div className="tk-jewel-tree-item is-child">Colors</div>
          <div className="tk-jewel-tree-item">▸ Editor</div>
          <div className="tk-jewel-tree-item">▸ Keymap</div>
        </div>
        <div className="tk-jewel-panel">
          <div className="tk-jewel-label">Theme</div>
          <div className="tk-jewel-select">
            <span>Darcula</span>
            <span>▾</span>
          </div>
          <div className="tk-jewel-actions">
            <button className="tk-jewel-btn">Cancel</button>
            <button className="tk-jewel-btn tk-jewel-btn-primary">Apply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Toolkits() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="toolkits" id="toolkits">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Four native looks"
          title={<>Match every desktop, <span className="hero-grad">by design.</span></>}
          subtitle="Nucleus ships first-party Compose implementations of every major desktop design language. The same Composable, restyled by the toolkit module of your choice — so a Mac user gets macOS, a Windows user gets Fluent, an Ubuntu user gets Yaru, and an IDE-like tool reaches for Jewel. No more Material paint job on Win32."
        />

        <div className="tk-grid">
          <ToolkitCard
            id="macos26"
            name="macOS 26"
            style="Liquid Glass"
            os="macOS Tahoe"
            module="decorated-window-macos26"
            isNew
            onHover={setHovered}
            hovered={hovered}
          >
            <MacOS26Preview/>
          </ToolkitCard>

          <ToolkitCard
            id="fluent"
            name="Fluent"
            style="Mica · Acrylic"
            os="Windows 11"
            module="decorated-window-fluent"
            isNew
            onHover={setHovered}
            hovered={hovered}
          >
            <FluentPreview/>
          </ToolkitCard>

          <ToolkitCard
            id="yaru"
            name="Yaru"
            style="GTK · LibAdwaita"
            os="Ubuntu · GNOME"
            module="decorated-window-yaru"
            isNew
            onHover={setHovered}
            hovered={hovered}
          >
            <YaruPreview/>
          </ToolkitCard>

          <ToolkitCard
            id="jewel"
            name="Jewel"
            style="IntelliJ Platform"
            os="Cross-platform tooling"
            module="decorated-window-jewel"
            onHover={setHovered}
            hovered={hovered}
          >
            <JewelPreview/>
          </ToolkitCard>
        </div>

        <div className="tk-footnote">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Pick one per OS. Or mix freely — every toolkit works on every platform, so you can ship a Fluent build on macOS while you prototype its native look. Your <code>DecoratedWindow</code> stays the same Composable either way.
        </div>
      </div>
    </section>
  );
}
