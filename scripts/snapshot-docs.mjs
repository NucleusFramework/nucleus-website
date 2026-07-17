#!/usr/bin/env node
// Freezes the current `content/docs` (the latest, actively-maintained docs) into
// an immutable, version-numbered snapshot so past releases stay browsable forever.
//
//   npm run snapshot-docs 2.0
//
// It does two things:
//   1. Copies content/docs -> content/versioned/<version>
//   2. Scaffolds the archived route folder app/[lang]/docs/<version>/
//
// After running, wire the snapshot in two spots (the script prints the exact
// lines): a `defineDocs` export in source.config.ts and a DOC_VERSIONS entry in
// lib/source.ts. Everything else — routing, sidebar, the version switcher —
// picks it up automatically.
import fs from 'node:fs';
import path from 'node:path';

const version = process.argv[2];
if (!version || !/^\d+\.\d+(\.\d+)?$/.test(version)) {
  console.error('Usage: node scripts/snapshot-docs.mjs <version>   e.g. 2.0');
  process.exit(1);
}

const root = process.cwd();
const src = path.join(root, 'content/docs');
const dest = path.join(root, 'content/versioned', version);
const routeDir = path.join(root, 'app/[lang]/docs', version);
// JS identifier for the generated collection (dots aren't valid in identifiers).
const collection = `docs_${version.replaceAll('.', '_')}`;

if (fs.existsSync(dest)) {
  console.error(`[snapshot] ${path.relative(root, dest)} already exists — remove it first to re-snapshot.`);
  process.exit(1);
}

// 1. Freeze the content.
fs.cpSync(src, dest, { recursive: true });
console.log(`[snapshot] content/docs -> ${path.relative(root, dest)}`);

// 2. Scaffold the archived route (thin files delegating to the shared helpers).
fs.mkdirSync(path.join(routeDir, '[[...slug]]'), { recursive: true });

fs.writeFileSync(
  path.join(routeDir, 'layout.tsx'),
  `import type { ReactNode } from 'react';
import { renderDocsLayout } from '@/components/docs/versioned';

export default function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  return renderDocsLayout('${version}', { params, children });
}
`,
);

fs.writeFileSync(
  path.join(routeDir, '[[...slug]]', 'page.tsx'),
  `import { docsMetadata, docsStaticParams, renderDocsPage } from '@/components/docs/versioned';

type Params = { lang: string; slug?: string[] };

export default function Page(props: { params: Promise<Params> }) {
  return renderDocsPage('${version}', props);
}

export function generateStaticParams() {
  return docsStaticParams('${version}');
}

export function generateMetadata(props: { params: Promise<Params> }) {
  return docsMetadata('${version}', props);
}
`,
);
console.log(`[snapshot] scaffolded ${path.relative(root, routeDir)}/`);

console.log(`
[snapshot] Done. Two lines left to wire ${version}:

  1. source.config.ts — add:
       export const ${collection} = defineDocs({ dir: 'content/versioned/${version}' });

  2. lib/source.ts — add to DOC_VERSIONS (after 'latest'):
       version({ id: '${version}', label: '${version}', baseUrl: '/docs/${version}', collection: Source.${collection} }),
`);
