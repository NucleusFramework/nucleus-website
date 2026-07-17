'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export interface SwitcherVersion {
  id: string;
  label: string;
  /** Route prefix, e.g. '/docs' or '/docs/2.0'. */
  baseUrl: string;
  /** Page slugs that exist in this version (relative to baseUrl, '' = index). */
  slugs: string[];
}

interface Props {
  lang: string;
  /** baseUrl of the version currently being viewed. */
  current: string;
  versions: SwitcherVersion[];
}

function stripTrailingSlash(p: string) {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
}

// Lets the reader jump between documentation versions while staying on the same
// page. If the current page doesn't exist in the target version, it falls back
// to that version's home. Rendered in the docs sidebar banner.
export function VersionSwitcher({ lang, current, versions }: Props) {
  const router = useRouter();
  const pathname = stripTrailingSlash(usePathname());

  // Slug of the current page, relative to the current version's baseUrl.
  const currentSlug = useMemo(() => {
    let p = pathname;
    if (p.startsWith(`/${lang}`)) p = p.slice(lang.length + 1) || '/';
    p = p === current ? '' : p.startsWith(`${current}/`) ? p.slice(current.length + 1) : '';
    return p;
  }, [pathname, lang, current]);

  const targetFor = (v: SwitcherVersion) => {
    const has = v.slugs.includes(currentSlug);
    const slug = has ? currentSlug : '';
    return `/${lang}${v.baseUrl}${slug ? `/${slug}` : ''}/`;
  };

  return (
    <label className="flex flex-col gap-1.5 p-2">
      <span className="text-xs font-medium text-fd-muted-foreground">Version</span>
      <select
        value={current}
        onChange={(e) => {
          const next = versions.find((v) => v.baseUrl === e.target.value);
          if (next) router.push(targetFor(next));
        }}
        className="rounded-lg border bg-fd-secondary/50 p-2 text-sm text-fd-secondary-foreground transition-colors hover:bg-fd-accent"
      >
        {versions.map((v) => (
          <option key={v.id} value={v.baseUrl}>
            {v.label}
          </option>
        ))}
      </select>
    </label>
  );
}
