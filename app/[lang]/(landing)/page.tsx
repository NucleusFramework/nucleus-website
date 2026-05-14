import type { Metadata } from 'next';
import { LandingPage } from '@/components/landing/LandingPage';
import { i18n } from '@/lib/i18n';
import { isLang, type Lang } from '@/lib/landing-i18n';

export const metadata: Metadata = {
  description: 'Nucleus 2.0 — Built on Compose Multiplatform, GraalVM native image, and the Tao backend.',
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
  return <LandingPage lang={safeLang} />;
}
