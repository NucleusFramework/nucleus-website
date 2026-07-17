import { docsMetadata, docsStaticParams, renderDocsPage } from '@/components/docs/versioned';

type Params = { lang: string; slug?: string[] };

export default function Page(props: { params: Promise<Params> }) {
  return renderDocsPage('2.0', props);
}

export function generateStaticParams() {
  return docsStaticParams('2.0');
}

export function generateMetadata(props: { params: Promise<Params> }) {
  return docsMetadata('2.0', props);
}
