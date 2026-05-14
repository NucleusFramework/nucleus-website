import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { asset } from '@/lib/site';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <img src={asset('/assets/logo.png')} alt="" width={22} height={22} />
        <span style={{ fontWeight: 700 }}>Nucleus</span>
      </>
    ),
  },
  links: [
    { text: 'Docs', url: '/docs' },
    { text: 'Roadmap', url: '/docs/roadmap' },
    { text: 'Changelog', url: '/docs/changelog' },
    { text: 'GitHub', url: 'https://github.com/NucleusFramework/Nucleus', external: true },
  ],
};
