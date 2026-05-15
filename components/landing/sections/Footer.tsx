import * as React from 'react';
import Link from 'next/link';
import { type Lang, footerT, pick } from '@/lib/landing-i18n';
import { asset } from '@/lib/site';

interface FooterProps {
  lang: Lang;
}

export function Footer({ lang }: FooterProps) {
  const docsBase = `/${lang}/docs`;
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <img src={asset('/assets/logo.png')} alt="" />
            <span>Nucleus</span>
          </div>
          <p className="footer-tagline">{pick(footerT.tagline, lang)}</p>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.docs, lang)}</h4>
          <Link href={`${docsBase}/start/install`}>{pick(footerT.gettingStarted, lang)}</Link>
          <Link href={`${docsBase}/concepts/runtimes`}>{pick(footerT.runtimeApis, lang)}</Link>
          <Link href={`${docsBase}/packaging`}>{pick(footerT.packaging, lang)}</Link>
          <Link href={`${docsBase}/packaging/ci-cd`}>{pick(footerT.cicd, lang)}</Link>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.platform, lang)}</h4>
          <a href="#">macOS</a>
          <a href="#">Windows</a>
          <a href="#">Linux</a>
          <a href="#">GraalVM</a>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.community, lang)}</h4>
          <a href="https://github.com/NucleusFramework/Nucleus" target="_blank" rel="noreferrer">{pick(footerT.github, lang)}</a>
          <a href="#">{pick(footerT.releases, lang)}</a>
          <a href="#">{pick(footerT.roadmap, lang)}</a>
          <a href="#">{pick(footerT.discord, lang)}</a>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.legal, lang)}</h4>
          <a href="#">{pick(footerT.license, lang)}</a>
          <a href="#">{pick(footerT.trademark, lang)}</a>
          <a href="#">{pick(footerT.security, lang)}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{pick(footerT.copyright, lang)}</span>
        <span>{pick(footerT.version, lang)}</span>
      </div>
    </footer>
  );
}
