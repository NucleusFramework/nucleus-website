import '../globals.css';
import 'fumadocs-ui/style.css';
import type { Metadata, Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider';
import { SITE } from '@/lib/site';
import { i18n } from '@/lib/i18n';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s — ${SITE.name}` },
  description: SITE.description,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  applicationName: SITE.name,
  category: 'technology',
  alternates: {
    canonical: '/',
    languages: { en: '/', fr: '/fr' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  icons: { icon: '/assets/logo.png', apple: '/assets/logo.png' },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0d14' },
  ],
  colorScheme: 'dark light',
};

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nucleus',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows, Linux',
  description: SITE.description,
  url: SITE.url,
  author: { '@type': 'Person', name: SITE.author },
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  programmingLanguage: 'Kotlin',
  sameAs: [SITE.github],
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body>
        <RootProvider
          i18n={{
            locale: lang,
            locales: [
              { name: 'English', locale: 'en' },
              { name: 'Français', locale: 'fr' },
            ],
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
