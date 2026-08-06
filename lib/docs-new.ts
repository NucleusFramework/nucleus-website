/**
 * Pages and folders that should show a "New" badge in the latest docs sidebar
 * (Nucleus 2.2). Paths are relative to the docs root, no leading slash.
 *
 * Only applied when viewing the unversioned /docs tree — archives stay clean.
 * Update this list when the next minor ships (and clear 2.2 items after snapshot).
 */
export const NEW_DOC_PAGES = new Set([
  // Tao — window scaffold + chrome, a11y, decorated-window notes
  'tao',
  'tao/window-scaffold',
  'tao/decorated-window',
  'tao/accessibility',
  // Window overview points at scaffold
  'window',
  // GraalVM task surface + GC selection
  'performance/graalvm',
  'performance/graalvm/configuration',
  'performance/graalvm/tasks-ci',
  // Gradle DSL garbageCollector
  'reference/gradle-dsl',
  // Scheme-only deep links
  'lifecycle/deep-links',
  // Release notes & roadmap for 2.2
  'changelog',
  'roadmap',
]);

/** Folder tree ids (content path under content/docs) that contain 2.2 work. */
export const NEW_DOC_FOLDERS = new Set([
  'tao',
  'window',
  'performance',
  'performance/graalvm',
  'reference',
  'lifecycle',
]);

/** Strip locale and /docs[/X.Y] prefix → `tao/window-scaffold`. */
export function normalizeDocPath(url: string): string {
  let p = url.split('?')[0] ?? url;
  p = p.replace(/\/$/, '');
  p = p.replace(/^\/(en|fr)(?=\/|$)/, '');
  p = p.replace(/^\/docs(?:\/\d+\.\d+)?(?=\/|$)/, '');
  return p.replace(/^\//, '');
}

export function isNewDocPage(url: string): boolean {
  return NEW_DOC_PAGES.has(normalizeDocPath(url));
}

/** Folder `$id` is the content-relative path (e.g. `tao`, `performance/graalvm`). */
export function isNewDocFolder(folderId: string | undefined): boolean {
  if (!folderId) return false;
  const id = folderId.replace(/^\//, '').replace(/\/$/, '');
  return NEW_DOC_FOLDERS.has(id);
}
