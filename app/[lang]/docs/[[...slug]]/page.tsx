import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { source } from '@/lib/source';
import { SITE } from '@/lib/site';
import { i18n } from '@/lib/i18n';
import { Versions } from '@/components/docs/Versions';

function makeLocaleLink(lang: string) {
  const knownLocales = new Set(i18n.languages);
  return function LocaleLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    const { href, ...rest } = props;
    let nextHref = href;
    if (
      typeof href === 'string' &&
      href.startsWith('/') &&
      !href.startsWith('//') &&
      !href.startsWith(`/${lang}/`) &&
      href !== `/${lang}`
    ) {
      const segments = href.split('/');
      const firstSegment = segments[1];
      if (!firstSegment || !knownLocales.has(firstSegment)) {
        nextHref = `/${lang}${href}`;
      }
    }
    if (typeof nextHref === 'string' && nextHref.startsWith('/') && !nextHref.startsWith('//')) {
      return <Link href={nextHref} {...rest} />;
    }
    return <a href={nextHref} {...rest} />;
  };
}

interface Params {
  lang: string;
  slug?: string[];
}

export default async function Page(props: { params: Promise<Params> }) {
  const { lang, slug } = await props.params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? <DocsDescription>{page.data.description}</DocsDescription> : null}
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents, a: makeLocaleLink(lang), Versions: () => <Versions lang={lang} /> }} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata> {
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
