import { docsMetadata, docsStaticParams, renderDocsPage } from '@/components/docs/versioned';

type Params = { lang: string; slug?: string[] };

export default function Page(props: { params: Promise<Params> }) {
  return renderDocsPage('latest', props);
}

export function generateStaticParams() {
  return docsStaticParams('latest');
}

export function generateMetadata(props: { params: Promise<Params> }) {
  return docsMetadata('latest', props);
}
