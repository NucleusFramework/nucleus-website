#!/usr/bin/env node
// Fetches the latest release of Nucleus and each independently-versioned module,
// writing lib/versions.json (gitignored). Run before build/dev — the MDX version
// injection (source.config.ts) and the <Version/> badge read this file, so the
// network is hit once per build, not once per build worker. A failed fetch keeps
// the previous value instead of clobbering it with null.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'lib/versions.json');
const REPOS = { core: 'Nucleus', tray: 'ComposeNativeTray', pdf: 'ComposePdfReader', nna: 'NucleusNativeAccess' };

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
await Promise.all(
  Object.entries(REPOS).map(async ([key, repo]) => {
    try {
      out[key] = await latest(repo);
    } catch (e) {
      console.warn(`[versions] ${repo} failed (${e.message}); keeping ${prev[key] ?? 'none'}`);
    }
  }),
);
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log('[versions]', out);

// Keep marketing / docs line in sync with published core (lib/nucleus-version.ts).
const verTs = path.join(process.cwd(), 'lib/nucleus-version.ts');
if (out.core && fs.existsSync(verTs)) {
  const src = fs.readFileSync(verTs, 'utf8');
  const m = src.match(/NUCLEUS_VERSION\s*=\s*'([^']+)'/);
  if (m && m[1] !== out.core) {
    console.warn(
      `[versions] lib/nucleus-version.ts is '${m[1]}' but GitHub latest core is '${out.core}'. ` +
        'Bump NUCLEUS_VERSION (and snapshot the previous docs line) so landing + docs stay aligned.',
    );
  }
}
