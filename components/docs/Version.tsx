import fs from 'node:fs';
import path from 'node:path';

const LABEL = { en: 'Latest release', fr: 'Dernière version' } as const;

// Reads the version written by scripts/fetch-versions.mjs (same lib/versions.json
// the MDX injection uses, so the badge and the code snippets always agree). Keyed
// by module: core | tray | pdf | nna. Renders nothing if the version is missing.
function readVersions(): Record<string, string | null> {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib/versions.json'), 'utf8'));
  } catch {
    return {};
  }
}

export function Version({ module, lang = 'en' }: { module: string; lang?: string }) {
  const v = readVersions()[module];
  if (!v) return null;
  return (
    <p style={{ margin: '0.5rem 0 0' }}>
      <strong>{LABEL[lang === 'fr' ? 'fr' : 'en']}:</strong> <code>{v}</code>
    </p>
  );
}
