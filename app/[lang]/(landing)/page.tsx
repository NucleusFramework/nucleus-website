import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { i18n } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/landing-i18n';
import { SITE, fetchGitHubStars } from '@/lib/site';

export const metadata: Metadata = {
  description: SITE.description,
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const safeLang: Lang = isLang(lang) ? lang : 'en';
  const stars = await fetchGitHubStars();
  return <LandingPage lang={safeLang} stars={stars} />;
}
