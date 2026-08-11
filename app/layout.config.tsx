import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { asset, SITE } from '@/lib/site';

export function baseOptionsFor(lang: string): BaseLayoutProps {
  const p = (path: string) => `/${lang}${path}`;
  return {
    nav: {
      title: (
        <>
          <img src={asset('/assets/logo.png')} alt="" width={22} height={22} />
          <span style={{ fontWeight: 700 }}>Nucleus</span>
        </>
      ),
    },
    // Icon button in the docs navbar (fumadocs `getLinks` appends it).
    githubUrl: SITE.github,
    links: [
      { text: 'Docs', url: p('/docs') },
      { text: lang === 'fr' ? 'Migrer avec l’IA' : 'Migrate with AI', url: p('/docs/migrate/ai-agent') },
      { text: 'Roadmap', url: p('/docs/roadmap') },
      { text: 'Changelog', url: p('/docs/changelog') },
      { text: 'GitHub', url: SITE.github, external: true },
    ],
  };
}

export const baseOptions: BaseLayoutProps = baseOptionsFor('en');
