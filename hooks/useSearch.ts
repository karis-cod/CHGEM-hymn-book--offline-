// FILE PATH: hooks/useSearch.ts
// PURPOSE: 150ms debounced search against language-scoped in-memory index.
// PRD Reference: Section 13.2 (useSearch contract), Section 5 (search behaviour).
//
// Contract:
//   query:       string          — current raw input
//   setQuery:    (q) => void     — update input
//   results:     HymnRecord[]    — ranked results (empty array when query is empty)
//   isSearching: boolean         — true while debounce is pending
//
// Empty query → results = [] (NOT all hymns — per PRD Section 5.3)
// Results capped at 50.
// Index is rebuilt when language changes.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { hymnService } from '../services/hymnService';
import { buildIndex, queryIndex } from '../services/searchService';
import type { HymnRecord } from '../types/hymn';
import type { AppLanguage } from '../types/language';
import type { SearchIndex } from '../services/searchService';

const DEBOUNCE_MS = 150;

export interface UseSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: HymnRecord[];
  isSearching: boolean;
}

export function useSearch(language: AppLanguage): UseSearchReturn {
  const [query, setQueryState] = useState('');
  const [results, setResults] = useState<HymnRecord[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Build index for the active language. Rebuilt when language changes.
  const index = useMemo((): SearchIndex => {
    if (!hymnService.isInitialised()) return {};
    const hymns = hymnService.getAllHymns(language);
    return buildIndex(hymns, language);
  }, [language]);

  // Resolver passed to queryIndex — language-aware
  const getHymn = useCallback(
    (id: string): HymnRecord | null => hymnService.getHymn(id, language),
    [language]
  );

  const setQuery = useCallback(
    (q: string) => {
      setQueryState(q);

      // Clear pending debounce
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current);
      }

      if (q.trim() === '') {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      debounceTimer.current = setTimeout(() => {
        const found = queryIndex(index, q, getHymn);
        setResults(found);
        setIsSearching(false);
      }, DEBOUNCE_MS);
    },
    [index, getHymn]
  );

  // Clear results when language changes (stale results from old language)
  useEffect(() => {
    setQueryState('');
    setResults([]);
    setIsSearching(false);
  }, [language]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current !== null) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return { query, setQuery, results, isSearching };
}
