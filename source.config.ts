import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import fs from 'node:fs';
import path from 'node:path';

export const docs = defineDocs({
  dir: 'content/docs',
});

// --- Version injection ------------------------------------------------------
// Replace the `<version>` placeholder in code snippets with the real latest
// release of each Nucleus repo. Versions come from lib/versions.json, written
// by scripts/fetch-versions.mjs (npm prebuild/predev). A third-party coordinate
// (or a missing version) keeps `<version>` untouched. Same source as the
// on-page <Version/> badge — see components/docs/Version.tsx.
let VERSIONS: Record<string, string | null> = {};
try {
  VERSIONS = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/versions.json'), 'utf8'));
} catch {
  // No versions.json yet (fresh checkout before prebuild) — leave placeholders.
}

// Which module a `<version>` on this line belongs to — order matters (nna before core).
function versionForLine(line: string) {
  if (line.includes('composenativetray')) return VERSIONS.tray;
  if (line.includes(':pdfium')) return VERSIONS.pdf;
  if (line.includes('nucleusframework.nna')) return VERSIONS.nna;
  if (line.includes('dev.nucleusframework')) return VERSIONS.core;
  return null; // third-party coordinate: leave the placeholder
}

function substitute(value: string) {
  return value
    .split('\n')
    .map((line) => {
      if (!line.includes('<version>')) return line;
      const num = versionForLine(line);
      return num ? line.replaceAll('<version>', num) : line;
    })
    .join('\n');
}

function walk(node: any, fn: (n: any) => void) {
  fn(node);
  if (Array.isArray(node.children)) for (const child of node.children) walk(child, fn);
}

function remarkNucleusVersions() {
  return (tree: any) => {
    walk(tree, (n) => {
      if ((n.type === 'code' || n.type === 'inlineCode') && typeof n.value === 'string' && n.value.includes('<version>')) {
        n.value = substitute(n.value);
      }
    });
  };
}

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkNucleusVersions],
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      langs: [
        'bash',
        'diff',
        'ini',
        'json',
        'kotlin',
        'mermaid',
        'powershell',
        'properties',
        'toml',
        'xml',
        'yaml',
      ],
      langAlias: {
        kt: 'kotlin',
        proguard: 'text',
        nsis: 'ini',
      },
    },
  },
});
