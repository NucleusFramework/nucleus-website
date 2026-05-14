import * as React from 'react';

export function OneLanguageBar() {
  return (
    <div className="one-lang">
      <div className="one-lang-side one-lang-them">
        <span className="one-lang-tag">Tauri · Electron</span>
        <div className="one-lang-langs">
          <span className="one-lang-pill" data-lang="js">JavaScript</span>
          <span className="one-lang-plus">+</span>
          <span className="one-lang-pill" data-lang="rs">Rust</span>
          <span className="one-lang-plus">+</span>
          <span className="one-lang-pill" data-lang="sw">Swift</span>
          <span className="one-lang-plus">+</span>
          <span className="one-lang-pill" data-lang="kt">Kotlin</span>
        </div>
        <div className="one-lang-cap">Four languages, three mindsets, an IPC bridge between every two of them.</div>
      </div>
      <div className="one-lang-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="one-lang-side one-lang-us">
        <span className="one-lang-tag one-lang-tag-hero">Nucleus</span>
        <div className="one-lang-langs">
          <span className="one-lang-pill one-lang-pill-hero" data-lang="kt">Kotlin</span>
        </div>
        <div className="one-lang-cap">UI, business logic, OS calls, packaging — same language, same mindset, same call graph.</div>
      </div>
    </div>
  );
}
