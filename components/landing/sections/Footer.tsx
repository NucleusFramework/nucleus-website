import * as React from 'react';
import Link from 'next/link';
import { type Lang, footerT, pick } from '@/lib/landing-i18n';
import { SITE, asset } from '@/lib/site';

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
            <img src={asset('/assets/logo.png')} alt="" width={32} height={32} />
            <span>Nucleus</span>
          </div>
          <p className="footer-tagline">{pick(footerT.tagline, lang)}</p>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.docs, lang)}</h4>
          <Link href={`${docsBase}/start/install`}>{pick(footerT.gettingStarted, lang)}</Link>
          <Link href={`${docsBase}/performance`}>{pick(footerT.runtimeApis, lang)}</Link>
          <Link href={`${docsBase}/packaging`}>{pick(footerT.packaging, lang)}</Link>
          <Link href={`${docsBase}/packaging/ci-cd`}>{pick(footerT.cicd, lang)}</Link>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.platform, lang)}</h4>
          <Link href={`${docsBase}/packaging/macos`}>macOS</Link>
          <Link href={`${docsBase}/packaging/windows`}>Windows</Link>
          <Link href={`${docsBase}/packaging/linux`}>Linux</Link>
          <Link href={`${docsBase}/performance/graalvm`}>GraalVM</Link>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.community, lang)}</h4>
          <a href={SITE.github} target="_blank" rel="noreferrer">{pick(footerT.github, lang)}</a>
          <a href={SITE.websiteGithub} target="_blank" rel="noreferrer">{pick(footerT.websiteSource, lang)}</a>
          <a href={`${SITE.github}/releases`} target="_blank" rel="noreferrer">{pick(footerT.releases, lang)}</a>
          <Link href={`${docsBase}/roadmap`}>{pick(footerT.roadmap, lang)}</Link>
          <a href={SITE.slack} target="_blank" rel="noreferrer">{pick(footerT.slack, lang)}</a>
        </div>
        <div className="footer-col">
          <h4>{pick(footerT.legal, lang)}</h4>
          <a href={`${SITE.github}/blob/main/LICENSE`} target="_blank" rel="noreferrer">{pick(footerT.license, lang)}</a>
          <a href={`${SITE.github}/security`} target="_blank" rel="noreferrer">{pick(footerT.security, lang)}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          {pick(footerT.copyright, lang)}{' '}
          <a className="footer-oss" href={SITE.websiteGithub} target="_blank" rel="noreferrer">
            {pick(footerT.openSource, lang)} ↗
          </a>
        </span>
        <span>{pick(footerT.version, lang)}</span>
      </div>
    </footer>
  );
}
