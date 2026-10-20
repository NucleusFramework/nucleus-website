'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import type { SortedResult } from 'fumadocs-core/search';
import { initAdvancedSearch, type AdvancedIndex, type SearchServer } from 'fumadocs-core/search/server';
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
const DEBOUNCE_MS = 100;

// One Orama index per locale, built in the browser from the raw page documents
// served by app/api/search/[file]/route.ts — far smaller than a serialized DB.
const servers = new Map<string, SearchServer>();

function getServer(locale: string): SearchServer {
  let server = servers.get(locale);
  if (!server) {
    server = initAdvancedSearch({
      language: LOCALE_TO_LANGUAGE[locale] ?? 'english',
      indexes: async () => {
        const res = await fetch(`${BASE_PATH}/api/search/${locale}.json`);
        if (!res.ok) throw new Error(`Failed to load search index for "${locale}"`);
        return (await res.json()) as AdvancedIndex[];
      },
    });
    servers.set(locale, server);
  }
  return server;
}

function useLocaleSearch(locale: string) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SortedResult[] | 'empty'>('empty');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search.length === 0) {
      setResults('empty');
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    const timer = setTimeout(() => {
      getServer(locale)
        .search(search)
        .then((res) => {
          if (!cancelled) setResults(res);
        })
        .catch((err) => {
          // Drop the failed server so the next query retries the fetch.
          servers.delete(locale);
          console.error(err);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, locale]);

  return { search, setSearch, results, isLoading };
}

export default function NucleusSearchDialog(props: SharedProps) {
  const { locale } = useI18n();
  const { search, setSearch, results, isLoading } = useLocaleSearch(locale ?? 'en');

  // Creating the server starts the download and indexing, so do it as soon as
  // the dialog opens rather than on the first keystroke.
  useEffect(() => {
    if (props.open) getServer(locale ?? 'en');
  }, [props.open, locale]);

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={results !== 'empty' ? results : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
