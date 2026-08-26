#!/usr/bin/env node
// Verifies every internal /docs link in the *latest* docs: the page exists and,
// when the link carries a #fragment, a heading with that id exists on the page.
//
//   npm run check-links          # after a build
//
// Heading ids are read from the built HTML under .next/server/app, never derived
// from the Markdown. Deriving them is how anchors silently rot: github-slugger
// turns every single space into its own dash, so `## \`graalvm { }\` reference`
// becomes `graalvm---reference`, and any checker that collapses whitespace calls
// the correct anchor broken (and "fixes" it into a real one).
//
// Archived lines under content/versioned/ are frozen and not checked.
import fs from 'node:fs';
import path from 'node:path';

const DOCS = 'content/docs';
const BUILD = '.next/server/app';
const LANGS = ['en', 'fr'];

if (!fs.existsSync(BUILD)) {
  console.error(`[check-links] ${BUILD} not found — run \`npm run build\` first.`);
  process.exit(2);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

const idCache = new Map();
function headingIds(lang, rel) {
  const key = `${lang}/${rel}`;
  if (idCache.has(key)) return idCache.get(key);
  const candidates = rel
    ? [path.join(BUILD, lang, 'docs', `${rel}.html`), path.join(BUILD, lang, 'docs', rel, 'index.html')]
    : [path.join(BUILD, lang, 'docs.html'), path.join(BUILD, lang, 'docs', 'index.html')];
  const file = candidates.find((c) => fs.existsSync(c));
  let ids = null;
  if (file) {
    const html = fs.readFileSync(file, 'utf8');
    ids = new Set([...html.matchAll(/<h[2-4][^>]*\bid="([^"]+)"/g)].map((m) => m[1]));
  }
  idCache.set(key, ids);
  return ids;
}

const problems = [];
for (const file of walk(DOCS)) {
  const lang = file.endsWith('.fr.mdx') ? 'fr' : 'en';
  const body = fs.readFileSync(file, 'utf8');
  for (const m of body.matchAll(/\]\((\/docs[^)\s]*)\)/g)) {
    const [target, anchor] = m[1].split('#');
    const rel = target.replace(/^\/docs\/?/, '').replace(/\/$/, '');
    const ids = headingIds(lang, rel);
    if (ids === null) problems.push(`${file}: missing page  ${m[1]}`);
    else if (anchor && !ids.has(anchor)) problems.push(`${file}: missing anchor  ${m[1]}`);
  }
}

if (problems.length) {
  console.error(`[check-links] ${problems.length} broken link(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
console.log('[check-links] every internal /docs link and anchor resolves (en + fr).');
