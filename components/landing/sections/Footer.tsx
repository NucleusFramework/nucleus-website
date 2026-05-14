import * as React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <img src="/assets/logo.png" alt="" />
            <span>Nucleus</span>
          </div>
          <p className="footer-tagline">The Kotlin framework for native desktop apps. Built on Compose, GraalVM and Tao.</p>
        </div>
        <div className="footer-col">
          <h4>Docs</h4>
          <Link href="/docs/getting-started">Getting started</Link>
          <Link href="/docs/runtime">Runtime APIs</Link>
          <Link href="/docs/getting-started#packaging">Packaging</Link>
          <Link href="/docs/getting-started#ci">CI / CD</Link>
        </div>
        <div className="footer-col">
          <h4>Platform</h4>
          <a href="#">macOS</a>
          <a href="#">Windows</a>
          <a href="#">Linux</a>
          <a href="#">GraalVM</a>
        </div>
        <div className="footer-col">
          <h4>Community</h4>
          <a href="https://github.com/NucleusFramework/Nucleus" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#">Releases</a>
          <a href="#">Roadmap</a>
          <a href="#">Discord</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">License (MIT)</a>
          <a href="#">Trademark</a>
          <a href="#">Security</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Nucleus Framework. MIT licensed.</span>
        <span>v2.0.0 · Tao backend preview</span>
      </div>
    </footer>
  );
}
