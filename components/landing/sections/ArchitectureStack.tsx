import * as React from 'react';
import { asset } from '@/lib/site';

const NUCLEUS_FEATURES = [
  {
    label: 'OS integration',
    items: [
      { name: 'Decorated Window', tag: 'Tao' },
      { name: 'Notifications' },
      { name: 'System Tray' },
      { name: 'Dock & Launcher' },
      { name: 'Dark Mode Detector' },
      { name: 'Global Hotkey' },
      { name: 'Media Control' },
      { name: 'System Color' },
    ],
  },
  {
    label: 'Performance',
    items: [
      { name: 'GraalVM Native Image' },
      { name: 'AOT cache (JDK 25+)' },
      { name: 'Energy Manager' },
      { name: 'Native HTTP / SSL' },
    ],
  },
  {
    label: 'Distribution',
    items: [
      { name: '18 packaging formats' },
      { name: 'Code signing + notarization' },
      { name: 'Auto-Update' },
      { name: 'Deep Links' },
      { name: 'Auto-Launch' },
      { name: 'CI reusable actions' },
    ],
  },
] as const;

export function ArchitectureStack() {
  return (
    <div className="stack-stage">
      <div className="stack-bg" aria-hidden="true"/>

      {/* Layer: Your app (top) */}
      <div className="stack-layer stack-layer-app">
        <div className="stack-layer-h">
          <span className="stack-layer-tag">Top</span>
          <span className="stack-layer-name">Your application</span>
        </div>
        <div className="stack-layer-desc">Compose UI · ViewModels · your business logic — shared with Android &amp; iOS if you want.</div>
      </div>

      <div className="stack-connector" aria-hidden="true"><span/></div>

      {/* Layer: Nucleus (highlighted) */}
      <div className="stack-layer stack-layer-nucleus">
        <div className="stack-layer-glow" aria-hidden="true"/>
        <div className="stack-nucleus-head">
          <img src={asset('/assets/logo.png')} alt="" className="stack-nucleus-logo"/>
          <div>
            <div className="stack-layer-tag stack-layer-tag-accent">Native desktop layer</div>
            <div className="stack-nucleus-name">Nucleus 2.0</div>
          </div>
          <div className="stack-nucleus-meta">
            <span className="stack-nucleus-meta-v">40<small>+</small></span>
            <span className="stack-nucleus-meta-k">runtime modules</span>
          </div>
        </div>

        <div className="stack-feat-grid">
          {NUCLEUS_FEATURES.map((g) => (
            <div key={g.label} className="stack-feat-group">
              <div className="stack-feat-group-h">{g.label}</div>
              <div className="stack-feat-group-chips">
                {g.items.map((it) => {
                  const tag = 'tag' in it ? (it as { tag?: string }).tag : undefined;
                  return (
                    <span key={it.name} className={`stack-feat-chip ${tag ? 'has-tag' : ''}`}>
                      <span className="stack-feat-dot"/>
                      {it.name}
                      {tag && <span className="stack-feat-tag">{tag}</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stack-connector" aria-hidden="true"><span/></div>

      {/* Layer: Compose Multiplatform */}
      <div className="stack-layer stack-layer-foundation">
        <div className="stack-layer-h">
          <span className="stack-layer-tag">Foundation</span>
          <span className="stack-layer-name">Compose Multiplatform</span>
        </div>
        <div className="stack-layer-chips">
          <span>Compose runtime</span>
          <span>Compose UI</span>
          <span>Skia GPU rendering</span>
          <span>Hot Reload</span>
          <span>Compose Resources</span>
        </div>
      </div>

      <div className="stack-connector" aria-hidden="true"><span/></div>

      {/* Layer: Kotlin Multiplatform */}
      <div className="stack-layer stack-layer-foundation">
        <div className="stack-layer-h">
          <span className="stack-layer-tag">Foundation</span>
          <span className="stack-layer-name">Kotlin Multiplatform</span>
        </div>
        <div className="stack-layer-chips">
          <span>Shared modules</span>
          <span>Coroutines</span>
          <span>StateFlow</span>
          <span>kotlinx.serialization</span>
          <span>Ktor</span>
        </div>
      </div>

      <div className="stack-connector" aria-hidden="true"><span/></div>

      {/* Layer: JVM / GraalVM bottom */}
      <div className="stack-layer stack-layer-base">
        <div className="stack-layer-h">
          <span className="stack-layer-tag">Runtime</span>
          <span className="stack-layer-name">JDK 17+ · JetBrains Runtime · GraalVM Native Image</span>
        </div>
      </div>
    </div>
  );
}
