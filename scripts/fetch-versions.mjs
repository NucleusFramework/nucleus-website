#!/usr/bin/env node
// Writes lib/versions.json (gitignored) for MDX `<version>` injection and the
// <Version/> badge. Independently-versioned modules (tray / pdf / nna) are
// fetched from GitHub Releases. **core always comes from lib/nucleus-version.ts**
// so a docs bump (tag + NUCLEUS_VERSION) is visible before the GitHub Release is
// published — never leave snippets stuck on a stale GitHub "latest".
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'lib/versions.json');
const VER_TS = path.join(process.cwd(), 'lib/nucleus-version.ts');
// core is filled from NUCLEUS_VERSION — not from this map.
const REPOS = { tray: 'ComposeNativeTray', pdf: 'ComposePdfReader', nna: 'NucleusNativeAccess' };

function readNucleusVersion() {
  if (!fs.existsSync(VER_TS)) return null;
  const m = fs.readFileSync(VER_TS, 'utf8').match(/NUCLEUS_VERSION\s*=\s*'([^']+)'/);
  return m?.[1] ?? null;
}

async function latest(repo) {
  const res = await fetch(`https://api.github.com/repos/NucleusFramework/${repo}/releases/latest`, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const { tag_name } = await res.json();
  return typeof tag_name === 'string' ? tag_name.replace(/^v/, '') : null;
}

const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const out = { ...prev };

const nucleusVersion = readNucleusVersion();
if (nucleusVersion) {
  out.core = nucleusVersion;
} else if (!out.core) {
  console.warn('[versions] lib/nucleus-version.ts missing NUCLEUS_VERSION; core unset');
}

await Promise.all(
  Object.entries(REPOS).map(async ([key, repo]) => {
    try {
      out[key] = await latest(repo);
    } catch (e) {
      console.warn(`[versions] ${repo} failed (${e.message}); keeping ${prev[key] ?? 'none'}`);
    }
  }),
);

// Advisory: warn when GitHub's latest core release lags or leads NUCLEUS_VERSION.
try {
  const githubCore = await latest('Nucleus');
  if (githubCore && nucleusVersion && githubCore !== nucleusVersion) {
    console.warn(
      `[versions] NUCLEUS_VERSION is '${nucleusVersion}' but GitHub latest core release is '${githubCore}'. ` +
        'Snippets use NUCLEUS_VERSION. Align them when the release is published (or bump the constant).',
    );
  }
} catch (e) {
  console.warn(`[versions] Nucleus release check failed (${e.message})`);
}

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log('[versions]', out);
