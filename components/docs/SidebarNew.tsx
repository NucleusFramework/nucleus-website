'use client';

import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
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
  return (
    <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
      <span className="min-w-0 truncate">{name}</span>
      <NewBadge lang={lang} />
    </span>
  );
}

export function createNewSidebarComponents(lang: string) {
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
      level,
    }: {
      item: PageTree.Folder;
      level: number;
      children: ReactNode;
    }) {
      const path = useTreePath();
      const defaultOpen = (item.defaultOpen ?? false) || path.includes(item);
      // Fumadocs also opens folders when defaultOpenLevel >= level — keep that
      // behaviour via the layout's defaultOpenLevel; we only force open when
      // the folder is on the active path or marked defaultOpen.
      void level;
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
