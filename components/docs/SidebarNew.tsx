'use client';

import type { ComponentProps, ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
} from 'fumadocs-ui/components/layout/sidebar';
import { useTreePath } from 'fumadocs-ui/contexts/tree';
import { isNewDocFolder, isNewDocPage } from '@/lib/docs-new';
import { NewBadge } from '@/components/docs/NewBadge';

function withBadge(name: ReactNode, show: boolean, lang: string) {
  if (!show) return name;
  // Space-separated like the label itself — no chip, no flex stretch fight
  // with the folder chevron's ms-auto.
  return (
    <>
      {name}
      <NewBadge lang={lang} />
    </>
  );
}

function createNewSidebarComponents(lang: string) {
  return {
    Item({ item }: { item: PageTree.Item }) {
      return (
        <SidebarItem href={item.url} external={item.external} icon={item.icon}>
          {withBadge(item.name, isNewDocPage(item.url), lang)}
        </SidebarItem>
      );
    },

    Folder({
      item,
      children,
    }: {
      item: PageTree.Folder;
      level: number;
      children: ReactNode;
    }) {
      const path = useTreePath();
      const defaultOpen = (item.defaultOpen ?? false) || path.includes(item);
      const showNew = isNewDocFolder(item.$id);

      return (
        <SidebarFolder defaultOpen={defaultOpen}>
          {item.index ? (
            <SidebarFolderLink href={item.index.url} external={item.index.external}>
              {item.icon}
              {withBadge(item.name, showNew || isNewDocPage(item.index.url), lang)}
            </SidebarFolderLink>
          ) : (
            <SidebarFolderTrigger>
              {item.icon}
              {withBadge(item.name, showNew, lang)}
            </SidebarFolderTrigger>
          )}
          <SidebarFolderContent>{children}</SidebarFolderContent>
        </SidebarFolder>
      );
    },

    Separator({ item }: { item: PageTree.Separator }) {
      return (
        <SidebarSeparator>
          {item.icon}
          {item.name}
        </SidebarSeparator>
      );
    },
  };
}

type DocsLayoutProps = ComponentProps<typeof DocsLayout>;

/**
 * Client DocsLayout for the live (latest) docs tree — attaches "New" sidebar
 * badges. Must stay a Client Component: sidebar item renderers use hooks.
 */
export function DocsLayoutWithNewBadges({
  lang,
  sidebarBanner,
  sidebar,
  ...props
}: DocsLayoutProps & {
  lang: string;
  sidebarBanner?: ReactNode;
}) {
  const { banner: _ignored, components: _c, ...sidebarRest } = sidebar ?? {};
  return (
    <DocsLayout
      {...props}
      sidebar={{
        ...sidebarRest,
        banner: sidebarBanner ?? sidebar?.banner,
        components: createNewSidebarComponents(lang),
      }}
    />
  );
}
