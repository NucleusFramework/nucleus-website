import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DOC_VERSIONS, getDocVersion } from '@/lib/source';
import { SITE } from '@/lib/site';
import { i18n } from '@/lib/i18n';
import { baseOptionsFor } from '@/app/layout.config';
import { Version } from '@/components/docs/Version';
import { VersionSwitcher } from '@/components/docs/VersionSwitcher';

interface Params {
  lang: string;
  slug?: string[];
}

// Rewrites root-relative links inside MDX so they stay within the current
// version *and* language: `/docs/foo` becomes `/<lang><baseUrl>/foo`. For the
// latest version baseUrl is `/docs`, so only the locale prefix is added
// (identical to the original behaviour). For an archived version (baseUrl
// `/docs/2.0`) hardcoded `/docs/...` links are kept inside that version instead
// of escaping to the latest docs.
function makeDocLink(lang: string, baseUrl: string) {
  const knownLocales = new Set(i18n.languages);
  return function DocLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const { href, ...rest } = props;
    let nextHref = href;
    if (typeof href === 'string' && href.startsWith('/') && !href.startsWith('//')) {
      // 1. keep in-version: /docs/... -> <baseUrl>/... (no-op when latest).
      if (baseUrl !== '/docs' && (href === '/docs' || href.startsWith('/docs/'))) {
        nextHref = baseUrl + href.slice('/docs'.length);
      }
      // 2. prefix the locale unless the link already targets a known locale.
      const h = nextHref as string;
      if (!h.startsWith(`/${lang}/`) && h !== `/${lang}`) {
        const firstSegment = h.split('/')[1];
        if (!firstSegment || !knownLocales.has(firstSegment)) {
          nextHref = `/${lang}${h}`;
        }
      }
    }
    if (typeof nextHref === 'string' && nextHref.startsWith('/') && !nextHref.startsWith('//')) {
      return <Link href={nextHref} {...rest} />;
    }
    return <a href={nextHref} {...rest} />;
  };
}

// Data for the client-side version switcher: each version plus the slugs it
// contains (relative to its baseUrl) so the switcher can keep the reader on the
// same page across versions and fall back to the home page when it's missing.
function switcherVersions(lang: string) {
  return DOC_VERSIONS.map((v) => ({
    id: v.id,
    label: v.label,
    baseUrl: v.baseUrl,
    slugs: v.source.getPages(lang).map((p) => {
      const rel = p.url.slice(v.baseUrl.length);
      return rel.startsWith('/') ? rel.slice(1) : rel;
    }),
  }));
}

export async function renderDocsPage(versionId: string, props: { params: Promise<Params> }) {
  const { source, baseUrl } = getDocVersion(versionId);
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? <DocsDescription>{page.data.description}</DocsDescription> : null}
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            a: makeDocLink(lang, baseUrl),
            Version: (p: { module: string }) => <Version {...p} lang={lang} />,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function renderDocsLayout(
  versionId: string,
  { params, children }: { params: Promise<{ lang: string }>; children: ReactNode },
) {
  return <DocsLayoutForVersion versionId={versionId} params={params}>{children}</DocsLayoutForVersion>;
}

async function DocsLayoutForVersion({
  versionId,
  params,
  children,
}: {
  versionId: string;
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { source, baseUrl } = getDocVersion(versionId);
  const { lang } = await params;
  const tree =
    (source.pageTree as Record<string, unknown>)[lang] ??
    (source.pageTree as Record<string, unknown>)['en'] ??
    source.pageTree;
  return (
    <DocsLayout
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tree={tree as any}
      i18n
      sidebar={{ banner: <VersionSwitcher lang={lang} current={baseUrl} versions={switcherVersions(lang)} /> }}
      {...baseOptionsFor(lang)}
    >
      {children}
    </DocsLayout>
  );
}

export function docsStaticParams(versionId: string) {
  return getDocVersion(versionId).source.generateParams();
}

export async function docsMetadata(versionId: string, props: { params: Promise<Params> }): Promise<Metadata> {
  const { source, latest } = getDocVersion(versionId);
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) return {};

  const url = `${SITE.url}${page.url}`;
  const title = page.data.title;
  const description = page.data.description ?? SITE.description;

  return {
    title,
    description,
    alternates: { canonical: page.url },
    // Archived versions are kept browsable but out of the index — the latest
    // (unversioned) docs are the canonical, rankable copy.
    ...(latest ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: SITE.name,
      images: [SITE.ogImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [SITE.ogImage] },
  };
}
