'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { create } from '@orama/orama';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';

const LOCALE_TO_LANGUAGE: Record<string, string> = {
  en: 'english',
  fr: 'french',
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const SEARCH_API = `${BASE_PATH}/api/search`;

export default function NucleusSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const stableInit = useCallback(() => {
    return create({
      schema: { _: 'string' },
      language: LOCALE_TO_LANGUAGE[locale ?? 'en'] ?? 'english',
    });
  }, [locale]);
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: SEARCH_API,
    locale,
    initOrama: stableInit,
  });

  return (
    <SearchDialog
      search={search}
      onSearchChange={setSearch}
      isLoading={query.isLoading}
      {...props}
    >
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
