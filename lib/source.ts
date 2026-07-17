import * as Source from '@/.source';
import { loader } from 'fumadocs-core/source';
import { i18n } from './i18n';

// All doc versions share the same collection schema, so we borrow the concrete
// types from the latest collection — this keeps `page.data` fully typed
// (body/toc/full) instead of widening to the base PageData.
type Collection = typeof Source.docs;
type FumadocsSource = ReturnType<Collection['toFumadocsSource']>;

// fumadocs-mdx sometimes hands back `files` as a thunk; normalise to an array so
// the loader gets a stable shape (same fix the original single-source setup used).
function toFumadocsSource(collection: Collection): FumadocsSource {
  const original = collection.toFumadocsSource();
  const filesRaw = (original as { files: unknown }).files;
  const files = typeof filesRaw === 'function' ? (filesRaw as () => unknown[])() : filesRaw;
  return { ...original, files } as FumadocsSource;
}

function buildSource(baseUrl: string, collection: Collection) {
  return loader({ baseUrl, i18n, source: toFumadocsSource(collection) });
}

export interface DocVersion {
  /** Stable id and, for archived versions, the URL segment: 'latest' | '2.0'. */
  id: string;
  /** Label shown in the version switcher. */
  label: string;
  /** Route prefix: '/docs' for latest, '/docs/2.0' for archived. */
  baseUrl: string;
  /** The unversioned, actively-maintained docs. */
  latest: boolean;
  source: ReturnType<typeof buildSource>;
}

function version(opts: {
  id: string;
  label: string;
  baseUrl: string;
  collection: Collection;
  latest?: boolean;
}): DocVersion {
  return {
    id: opts.id,
    label: opts.label,
    baseUrl: opts.baseUrl,
    latest: opts.latest ?? false,
    source: buildSource(opts.baseUrl, opts.collection),
  };
}

// Newest first; `latest` must stay index 0. To archive a release run
// `npm run snapshot-docs <version>` and add the printed entry here.
export const DOC_VERSIONS: DocVersion[] = [
  version({ id: 'latest', label: '2.1 (latest)', baseUrl: '/docs', collection: Source.docs, latest: true }),
  version({ id: '2.0', label: '2.0', baseUrl: '/docs/2.0', collection: Source.docs_2_0 }),
];

export function getDocVersion(id: string): DocVersion {
  return DOC_VERSIONS.find((v) => v.id === id) ?? DOC_VERSIONS[0];
}

// Latest source — used by search indexing and the sitemap.
export const source = DOC_VERSIONS[0].source;
