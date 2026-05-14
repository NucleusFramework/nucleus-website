'use client';

import * as React from 'react';
import { useState } from 'react';

type OS = 'mac' | 'linux' | 'win';

const CMDS: Record<OS, string> = {
  mac: 'curl -fsSL https://nucleusframework.dev/install.sh | bash',
  linux: 'curl -fsSL https://nucleusframework.dev/install-linux.sh | bash',
  win: 'winget install --id NucleusFramework.Nucleus',
};

export function InstallCTA() {
  const [os, setOs] = useState<OS>('mac');
  const [copied, setCopied] = useState(false);

  const cmd = CMDS[os];

  const copy = () => {
    navigator.clipboard?.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="install" id="install">
      <div className="install-inner">
        <div className="install-glow" aria-hidden="true" />
        <div className="install-h">
          <div className="sec-h-eyebrow">Try the demo</div>
          <h2 className="install-title">One line. Real desktop app. <span className="hero-grad">Now.</span></h2>
          <p className="install-sub">Decorated window, dark-mode-aware, auto-updating. The demo ships with full source — clone, build, and replace.</p>
        </div>

        <div className="install-tabs">
          {([['mac', 'macOS'], ['linux', 'Linux'], ['win', 'Windows']] as Array<[OS, string]>).map(([k, label]) => (
            <button
              key={k}
              className={`install-tab ${os === k ? 'active' : ''}`}
              onClick={() => setOs(k)}
            >{label}</button>
          ))}
        </div>

        <div className="install-cmd">
          <span className="install-cmd-prompt">$</span>
          <code className="install-cmd-code">{cmd}</code>
          <button className="install-cmd-copy" onClick={copy}>
            {copied ? (
              <><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>Copied</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="4" y="4" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M3 11V3.5C3 2.7 3.7 2 4.5 2H11" stroke="currentColor" strokeWidth="1.4"/></svg>Copy</>
            )}
          </button>
        </div>

        <div className="install-meta">
          <span>Detects your architecture · downloads · installs · launches.</span>
          <a href="/docs/getting-started">Or read the install guide →</a>
        </div>
      </div>
    </section>
  );
}
