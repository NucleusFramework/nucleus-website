/**
 * Single source of truth for the **live** Nucleus line shown on the website
 * (landing, docs label "X.Y (latest)", example coordinates when not using
 * the `<version>` MDX placeholder).
 *
 * Keep this equal to the published core tag and to `lib/versions.json` → `core`
 * after `npm run fetch-versions` / predev. When you ship a new minor:
 *   1. Bump these constants
 *   2. Snapshot the previous line (see .docs-versioning.md)
 *   3. Set DOC_VERSIONS latest label via NUCLEUS_LINE below
 */
export const NUCLEUS_VERSION = '2.4.0' as const;

/** major.minor for badges and marketing (e.g. "2.4") */
export const NUCLEUS_LINE = NUCLEUS_VERSION.split('.').slice(0, 2).join('.') as '2.4';

export const NUCLEUS_VTAG = `v${NUCLEUS_VERSION}` as const;
export const NUCLEUS_LABEL = `Nucleus ${NUCLEUS_LINE}` as const;
export const NUCLEUS_LATEST_DOCS_LABEL = `${NUCLEUS_LINE} (latest)` as const;
