import * as React from 'react';
import { type Bi, type Lang, componentsT, pick } from '@/lib/landing-i18n';

interface ShippedComponent {
  api: string;
  pkg: string;
  name: Bi<string>;
  /** Native engines this one composable replaces, one per platform. */
  replaces: string[];
  comingSoon?: boolean;
}

// Add a component here and it appears in the shelf — nothing else to touch.
const COMPONENTS: ShippedComponent[] = [
  {
    api: 'PdfReader(state)',
    pkg: 'dev.nucleusframework:pdfium',
    name: { en: 'PDF reader', fr: 'Lecteur PDF' },
    replaces: ['PdfRenderer', 'PDFKit', 'PDF.js', 'PDFBox'],
  },
  {
    api: 'WebView(state)',
    pkg: 'dev.nucleusframework:webview',
    name: { en: 'WebView', fr: 'WebView' },
    replaces: ['WebView', 'WKWebView', 'iframe', 'WebView2'],
    comingSoon: true,
  },
];

interface ComponentShelfProps {
  lang: Lang;
}

export function ComponentShelf({ lang }: ComponentShelfProps) {
  return (
    <div className="cmpts">
      <div className="cmpts-head">
        <span className="cmpts-eyebrow">{pick(componentsT.eyebrow, lang)}</span>
        <p className="cmpts-title">{pick(componentsT.title, lang)}</p>
        <p className="cmpts-sub">{pick(componentsT.subtitle, lang)}</p>
      </div>

      <div className="cmpts-list">
        {COMPONENTS.map((c) => (
          <div key={c.api} className={`cmpts-row${c.comingSoon ? ' cmpts-row-soon' : ''}`}>
            <div className="cmpts-left">
              <div className="cmpts-name-line">
                <span className="cmpts-name">{pick(c.name, lang)}</span>
                {c.comingSoon && (
                  <span className="cmpts-soon">{pick(componentsT.comingSoon, lang)}</span>
                )}
              </div>
              <code className="cmpts-pill">{c.api}</code>
              <span className="cmpts-pkg">{c.pkg}</span>
            </div>

            <div className="cmpts-replaces">
              <span className="cmpts-replaces-label">{pick(componentsT.replaces, lang)}</span>
              <span className="cmpts-engines">
                {c.replaces.map((e, i) => (
                  <React.Fragment key={e}>
                    {i > 0 && <span className="cmpts-dot" aria-hidden="true">·</span>}
                    <span className="cmpts-engine">{e}</span>
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
