// FILE PATH: hooks/useHymnList.ts
// PURPOSE: Sorted hymn list from hymnService, memoised, language-aware.
// PRD Reference: Section 13.2 (useHymnList contract).
//
// Contract:
//   hymns:        HymnRecord[]     — sorted list
//   sortOrder:    SortOrder        — current sort
//   setSortOrder: (order) => void  — ephemeral, session-only
//
// RULE: Never call hymnService.getAllHymns() inside a render function.
// This hook calls it once and memoises with useMemo.
// Re-sort happens only when sortOrder or language changes.

import { useCallback, useMemo, useState } from 'react';

import { hymnService } from '../services/hymnService';
import type { HymnRecord } from '../types/hymn';
import type { SortOrder } from '../types/settings';
import type { AppLanguage } from '../types/language';

export interface UseHymnListReturn {
  hymns: HymnRecord[];
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}

export function useHymnList(language: AppLanguage): UseHymnListReturn {
  const [sortOrder, setSortOrder] = useState<SortOrder>('numerical');

  const hymns = useMemo((): HymnRecord[] => {
    if (!hymnService.isInitialised()) return [];
    const all = hymnService.getAllHymns(language);
    if (sortOrder === 'alphabetical') {
      return [...all].sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );
    }
    // 'numerical' — already sorted by hymn_number ASC from the service
    return all;
  }, [sortOrder, language]);

  const handleSetSortOrder = useCallback((order: SortOrder) => {
    setSortOrder(order);
  }, []);

  return { hymns, sortOrder, setSortOrder: handleSetSortOrder };
}
