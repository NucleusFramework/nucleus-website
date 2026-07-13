import * as React from 'react';
import { type Lang, pdfT, pick } from '@/lib/landing-i18n';

interface PdfReaderStripProps {
  lang: Lang;
}

const NATIVE_STACKS = [
  { os: 'Android', engine: 'PdfRenderer' },
  { os: 'iOS', engine: 'PDFKit' },
  { os: 'Web', engine: 'PDF.js' },
  { os: 'Desktop', engine: 'PDFBox' },
];

export function PdfReaderStrip({ lang }: PdfReaderStripProps) {
  return (
    <div className="pdfx">
      <div className="pdfx-head">
        <span className="pdfx-eyebrow">{pick(pdfT.eyebrow, lang)}</span>
        <p className="pdfx-title">{pick(pdfT.title, lang)}</p>
      </div>

      <div className="pdfx-compare">
        <div className="pdfx-side pdfx-them">
          <span className="pdfx-tag">{pick(pdfT.themTag, lang)}</span>
          <div className="pdfx-stacks">
            {NATIVE_STACKS.map((s) => (
              <span key={s.os} className="pdfx-stack">
                <span className="pdfx-stack-os">{s.os}</span>
                <span className="pdfx-stack-engine">{s.engine}</span>
              </span>
            ))}
          </div>
          <div className="pdfx-cap">{pick(pdfT.themCap, lang)}</div>
        </div>

        <div className="pdfx-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="pdfx-side pdfx-us">
          <span className="pdfx-tag pdfx-tag-hero">{pick(pdfT.usTag, lang)}</span>
          <div className="pdfx-api">
            <code className="pdfx-api-pill">PdfReader(state)</code>
            <span className="pdfx-api-pkg">dev.nucleusframework:pdfium</span>
          </div>
          <div className="pdfx-cap">{pick(pdfT.usCap, lang)}</div>
        </div>
      </div>
    </div>
  );
}
