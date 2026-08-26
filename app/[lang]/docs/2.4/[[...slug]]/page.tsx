import { docsMetadata, docsStaticParams, renderDocsPage } from '@/components/docs/versioned';

type Params = { lang: string; slug?: string[] };

export default function Page(props: { params: Promise<Params> }) {
  return renderDocsPage('2.4', props);
}

export function generateStaticParams() {
  return docsStaticParams('2.4');
}

export function generateMetadata(props: { params: Promise<Params> }) {
  return docsMetadata('2.4', props);
}
