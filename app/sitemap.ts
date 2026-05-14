import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { i18n } from '@/lib/i18n';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { source } = await import('@/lib/source');
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // root + landing per language
  for (const lang of i18n.languages) {
    const prefix = lang === i18n.defaultLanguage ? '' : `/${lang}`;
    entries.push({
      url: `${SITE.url}${prefix}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    });
  }

  // docs pages — fumadocs returns pages with localized URLs
  for (const p of source.getPages()) {
    entries.push({
      url: `${SITE.url}${p.url}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  return entries;
}
