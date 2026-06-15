// FILE PATH: context/RecentsContext.tsx
// PURPOSE: Shared recents state across all screens.
// Replaces the per-screen hooks/useRecents.ts instance — fixes the bug where
// addRecent() called from hymn/[id].tsx never appeared on the Recents tab
// (each screen previously held its own isolated copy of the list).
//
// PRD Reference: Section 13.2 (useRecents hook), Section 7 (US-10).

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { storageService } from '../services/storageService';

const MAX_RECENTS = 20;

export interface RecentsContextValue {
  recents: string[];
  addRecent: (id: string) => Promise<void>;
  clearRecents: () => Promise<void>;
  isLoading: boolean;
}

const RecentsContext = createContext<RecentsContextValue | null>(null);

interface RecentsProviderProps {
  children: React.ReactNode;
}

export function RecentsProvider({ children }: RecentsProviderProps) {
  const [recents, setRecents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const recentsRef = useRef<string[]>([]);
  recentsRef.current = recents;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const loaded = await storageService.loadRecents();
      if (!cancelled) {
        setRecents(loaded);
        setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addRecent = useCallback(async (id: string): Promise<void> => {
    const current = recentsRef.current;
    const updated = [id, ...current.filter((r) => r !== id)].slice(0, MAX_RECENTS);
    // Shared state — Recents tab re-renders immediately even though
    // addRecent was called from hymn/[id].tsx.
    setRecents(updated);
    try {
      await storageService.saveRecent(id);
    } catch {
      // Silent failure — in-memory state already updated
    }
  }, []);

  const clearRecents = useCallback(async (): Promise<void> => {
    const previous = recentsRef.current;
    setRecents([]);
    try {
      await storageService.clearRecents();
    } catch {
      setRecents(previous);
    }
  }, []);

  const value: RecentsContextValue = { recents, addRecent, clearRecents, isLoading };

  return (
    <RecentsContext.Provider value={value}>
      {children}
    </RecentsContext.Provider>
  );
}

export function useRecents(): RecentsContextValue {
  const context = useContext(RecentsContext);
  if (!context) {
    throw new Error('useRecents must be used within RecentsProvider');
  }
  return context;
}