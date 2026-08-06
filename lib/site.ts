import { NUCLEUS_LABEL } from './nucleus-version';

export const SITE = {
  name: 'Nucleus',
  title: 'Nucleus — Compose Desktop, production-ready',
  description:
    `${NUCLEUS_LABEL} — The production desktop layer for Kotlin teams on Compose Multiplatform: native chrome, OS APIs, packaging, and stores — without leaving Kotlin.`,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nucleusframework.dev',
  ogImage: '/og.png',
  /** Product repository (landing / nav GitHub link). */
  github: 'https://github.com/NucleusFramework/Nucleus',
  /**
   * Docs website repository — “Edit on GitHub” for latest content under content/docs/.
   * Archived versions do not get an edit link.
   */
  docsGithub: {
    owner: 'NucleusFramework',
    repo: 'nucleus-website',
    branch: 'main',
    /** Path prefix of live docs inside the website repo. */
    contentRoot: 'content/docs',
  },
  twitter: '@nucleusframework',
  author: 'Elie Gambache',
  keywords: [
    'Nucleus',
    'Kotlin',
    'Compose Multiplatform',
    'Compose Desktop',
    'desktop framework',
    'Kotlin Multiplatform',
    'Android to desktop',
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

export function formatStarCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return n.toString();
}
