import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig({
  mdxOptions: {
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
