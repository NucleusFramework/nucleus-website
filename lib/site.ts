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
