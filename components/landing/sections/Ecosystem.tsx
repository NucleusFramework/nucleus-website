import * as React from 'react';
import { SectionHeading } from '@/components/landing/SectionHeading';

interface EcoLib {
  name: string;
  sub?: string;
}

interface EcoCategory {
  id: string;
  tag: string;
  desc: string;
  libs: EcoLib[];
  accent: string;
}

const CATEGORIES: EcoCategory[] = [
  {
    id: 'ai',
    tag: 'AI & ML',
    desc: 'Run inference locally, call remote models, embed an LLM in your app — the JVM has bindings for every framework that matters.',
    libs: [
      { name: 'DJL', sub: 'Deep Java Library' },
      { name: 'ONNX Runtime Java' },
      { name: 'LangChain4j' },
      { name: 'llama.cpp', sub: 'via FFM bindings' },
      { name: 'TensorFlow Java' },
    ],
    accent: '#9B7BFF',
  },
  {
    id: 'search',
    tag: 'Search & indexing',
    desc: "The world's most deployed search stack runs on the JVM. Lucene is the engine behind Elasticsearch, Solr, OpenSearch — embed it directly.",
    libs: [
      { name: 'Apache Lucene', sub: 'embedded full-text' },
      { name: 'OpenSearch client' },
      { name: 'Elasticsearch client' },
      { name: 'Tantivy', sub: 'via JNI' },
      { name: 'Quickwit' },
    ],
    accent: '#5B8DEF',
  },
  {
    id: 'data',
    tag: 'Data & analytics',
    desc: 'Columnar, in-process, distributed — pick your engine. The JVM is where serious data work happens, and now it ships in your desktop binary.',
    libs: [
      { name: 'Apache Arrow' },
      { name: 'DuckDB JDBC', sub: 'embedded OLAP' },
      { name: 'Apache Parquet' },
      { name: 'jOOQ' },
      { name: 'Apache Spark', sub: 'in-process' },
    ],
    accent: '#4FD1E0',
  },
  {
    id: 'docs',
    tag: 'Documents & parsing',
    desc: 'Parse anything users drag into your app. PDFs, Word, Excel, raw HTML, 1000+ formats — without shelling out to native binaries.',
    libs: [
      { name: 'Apache Tika', sub: '1000+ formats' },
      { name: 'Apache PDFBox' },
      { name: 'Apache POI', sub: 'Office docs' },
      { name: 'Jsoup', sub: 'HTML parsing' },
      { name: 'commonmark-java' },
    ],
    accent: '#C9A862',
  },
  {
    id: 'imaging',
    tag: 'Imaging & vision',
    desc: "Production-grade image processing and computer vision — used by NASA, BioMed, defense. Now it's a Gradle dep away from your UI.",
    libs: [
      { name: 'BoofCV' },
      { name: 'JavaCV', sub: 'OpenCV bindings' },
      { name: 'TwelveMonkeys', sub: '40+ image formats' },
      { name: 'Skia', sub: 'GPU 2D' },
      { name: 'FFmpeg', sub: 'via JavaCV' },
    ],
    accent: '#FF7A59',
  },
  {
    id: 'net',
    tag: 'Networking & RPC',
    desc: 'Battle-tested at the scale of Twitter, Apple, LinkedIn. Netty handles billions of connections daily — runs in your desktop app too.',
    libs: [
      { name: 'Netty', sub: 'async I/O at scale' },
      { name: 'Ktor' },
      { name: 'gRPC Java' },
      { name: 'OkHttp' },
      { name: 'WebRTC Java' },
    ],
    accent: '#FF80A8',
  },
];

export function Ecosystem() {
  return (
    <section className="eco" id="ecosystem">
      <div className="section-inner">
        <SectionHeading
          eyebrow="Battle-tested ecosystem"
          title={<>Thirty years of mature libraries. <span className="hero-grad">Native to your app.</span></>}
          subtitle="Your Kotlin code sits on top of the JVM — the most professionally engineered runtime ever built. AI, search, document parsing, scientific computing, RPC at scale: every problem already has a hardened library on Maven Central. No FFI, no bridges, no JS shim. Same process. Same memory. Already there."
        />

        <div className="eco-grid">
          {CATEGORIES.map((c) => (
            <div
              key={c.id}
              className="eco-card"
              style={{ ['--cat-accent' as string]: c.accent } as React.CSSProperties}
            >
              <div className="eco-card-head">
                <div className="eco-card-tag">
                  <span className="eco-card-dot"/>
                  {c.tag}
                </div>
              </div>
              <p className="eco-card-desc">{c.desc}</p>
              <div className="eco-card-libs">
                {c.libs.map((l, i) => (
                  <div key={i} className="eco-lib">
                    <span className="eco-lib-name">{l.name}</span>
                    {l.sub && <span className="eco-lib-sub">{l.sub}</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="eco-footnote">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M14 8l-4-4M14 8l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>And every other artifact on Maven Central — <strong>~500,000</strong> battle-tested libraries, all <code>implementation</code> away.</span>
        </div>
      </div>
    </section>
  );
}
