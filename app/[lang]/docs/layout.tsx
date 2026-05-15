import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { source } from '@/lib/source';
import { baseOptionsFor } from '../../layout.config';

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const tree =
    (source.pageTree as Record<string, unknown>)[lang] ??
    (source.pageTree as Record<string, unknown>)['en'] ??
    source.pageTree;
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DocsLayout tree={tree as any} i18n {...baseOptionsFor(lang)}>
      {children}
    </DocsLayout>
  );
}
