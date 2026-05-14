import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';
import { i18n } from './i18n';

const original = docs.toFumadocsSource();
type SourceShape = typeof original & { files: unknown };
const filesRaw = (original as SourceShape).files;
const files = typeof filesRaw === 'function' ? (filesRaw as () => unknown[])() : filesRaw;
const fixedSource = { ...original, files } as typeof original;

export const source = loader({
  baseUrl: '/docs',
  i18n,
  source: fixedSource,
});
