export const SITE = {
  name: 'Nucleus',
  title: 'Nucleus — the Kotlin framework for native desktop apps',
  description:
    'Nucleus 2.0 — Built on Compose Multiplatform, GraalVM native image, and the Tao backend. Native on every OS, with the simplicity of Kotlin.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nucleusframework.dev',
  ogImage: '/og.png',
  github: 'https://github.com/NucleusFramework/Nucleus',
  twitter: '@nucleusframework',
  author: 'Elie Gambache',
  keywords: [
    'Nucleus',
    'Kotlin',
    'Compose Multiplatform',
    'desktop framework',
    'GraalVM Native Image',
    'cross-platform desktop',
    'Tao',
    'JVM desktop',
    'macOS Windows Linux',
    'native desktop apps',
  ],
} as const;

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string): string =>
  `${BASE_PATH}${path.startsWith('/') ? path : `/${path}`}`;

export async function fetchGitHubStars(): Promise<number | null> {
  try {
    const res = await fetch('https://api.github.com/repos/NucleusFramework/Nucleus', {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function fetchLatestRelease(repo: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/NucleusFramework/${repo}/releases/latest`, {
      next: { revalidate: 3600 },
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { tag_name?: string };
    return typeof data.tag_name === 'string' ? data.tag_name.replace(/^v/, '') : null;
  } catch {
    return null;
  }
}

export function formatStarCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return n.toString();
}
