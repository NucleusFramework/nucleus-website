import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import fs from 'node:fs';
import path from 'node:path';

export const docs = defineDocs({
  dir: 'content/docs',
});

// Archived documentation snapshots (frozen at release time by
// scripts/snapshot-docs.mjs). One export per past version — the script prints
// the exact line to add. Also register it in lib/source.ts DOC_VERSIONS.
// Full procedure: .docs-versioning.md
export const docs_2_2 = defineDocs({
  dir: 'content/versioned/2.2',
});

export const docs_2_1 = defineDocs({
  dir: 'content/versioned/2.1',
});

export const docs_2_0 = defineDocs({
  dir: 'content/versioned/2.0',
});

// --- Version injection ------------------------------------------------------
// Replace the `<version>` placeholder in code snippets with the real latest
// release of each Nucleus repo. Versions come from lib/versions.json, written
// by scripts/fetch-versions.mjs (npm prebuild/predev). Core is always taken
// from lib/nucleus-version.ts (NUCLEUS_VERSION) so a docs bump never lags a
// delayed GitHub Release. A third-party coordinate (or a missing version)
// keeps `<version>` untouched. Same source as the on-page <Version/> badge.
function readNucleusVersion(): string | null {
  try {
    const src = fs.readFileSync(path.join(process.cwd(), 'lib/nucleus-version.ts'), 'utf8');
    return src.match(/NUCLEUS_VERSION\s*=\s*'([^']+)'/)?.[1] ?? null;
  } catch {
    return null;
  }
}

let VERSIONS: Record<string, string | null> = {};
try {
  VERSIONS = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/versions.json'), 'utf8'));
} catch {
  // No versions.json yet (fresh checkout before prebuild) — leave placeholders.
}
const nucleusVersion = readNucleusVersion();
if (nucleusVersion) VERSIONS.core = nucleusVersion;

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
