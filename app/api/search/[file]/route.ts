import { source } from '@/lib/source';
import { searchPath } from 'fumadocs-core/breadcrumb';
import type { AdvancedIndex } from 'fumadocs-core/search/server';
import { i18n } from '@/lib/i18n';

export const dynamic = 'force-static';
export const revalidate = false;

// One raw index file per locale (`/api/search/en.json`, `/api/search/fr.json`).
// We ship the page documents instead of a serialized Orama database: the
// serialized DB (radix trees, frequencies, sort tables) is ~5x larger than the
// documents, so the client rebuilds the index itself (see SearchDialog).
// The `.json` extension makes static hosts serve it as JSON, and so gzip it.
export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ file: `${lang}.json` }));
}

function breadcrumbsOf(url: string, locale: string): string[] {
  const tree = source.getPageTree(locale);
  const path = searchPath(tree.children, url) ?? [];
  path.pop();
  return [tree.name, ...path.map((node) => node.name)].filter(
    (name): name is string => typeof name === 'string' && name.length > 0,
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const locale = (await params).file.replace(/\.json$/, '');
  if (!i18n.languages.includes(locale)) return new Response(null, { status: 404 });

  const indexes: AdvancedIndex[] = source.getPages(locale).map((page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    breadcrumbs: breadcrumbsOf(page.url, locale),
    structuredData: page.data.structuredData,
  }));
  return Response.json(indexes);
}
