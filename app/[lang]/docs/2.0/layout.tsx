import type { ReactNode } from 'react';
import { renderDocsLayout } from '@/components/docs/versioned';

export default function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  return renderDocsLayout('2.0', { params, children });
}
