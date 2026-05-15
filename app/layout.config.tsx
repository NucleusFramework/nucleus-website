import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { asset } from '@/lib/site';

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
    links: [
      { text: 'Docs', url: p('/docs') },
      { text: 'Roadmap', url: p('/docs/roadmap') },
      { text: 'Changelog', url: p('/docs/changelog') },
      { text: 'GitHub', url: 'https://github.com/NucleusFramework/Nucleus', external: true },
    ],
  };
}

export const baseOptions: BaseLayoutProps = baseOptionsFor('en');
