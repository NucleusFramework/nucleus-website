import * as React from 'react';
import Link from 'next/link';

export function TopNav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand">
          <img src="/assets/logo.png" alt="" />
          <span>Nucleus</span>
          <span className="ver">v2.0</span>
        </Link>
        <div className="nav-links">
          <Link href="/docs">Docs</Link>
          <a href="#toolkits">Toolkits</a>
          <a href="#paradigm">Native APIs</a>
          <a href="#install">Download</a>
          <a href="https://github.com/NucleusFramework/Nucleus" target="_blank" rel="noreferrer">Changelog</a>
        </div>
        <div className="nav-right">
          <a href="https://github.com/NucleusFramework/Nucleus" target="_blank" rel="noreferrer" className="nav-icon-btn" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.33c-2.22.48-2.69-1.07-2.69-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.77-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.13 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.03 2.2-.82 2.2-.82.44 1.11.16 1.93.08 2.13.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>
          <a href="#install" className="btn btn-primary">Get started</a>
        </div>
      </div>
    </nav>
  );
}
