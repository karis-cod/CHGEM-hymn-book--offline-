// FILE PATH: hooks/useRecents.ts
// PURPOSE: Recent hymns list — last 20 opened, newest first, deduplicated.
// PRD Reference: Section 13.2 (useRecents hook), Section 7 (US-10).
//
// Behaviour:
//   - addRecent(id): prepend to list, remove duplicate if present, trim to 20
//   - Persists across app restarts via AsyncStorage
//   - clearRecents(): removes all recents

import { useCallback, useEffect, useRef, useState } from 'react';

import { storageService } from '../services/storageService';

export interface UseRecentsReturn {
  recents: string[];
  addRecent: (id: string) => Promise<void>;
  clearRecents: () => Promise<void>;
  isLoading: boolean;
}

export function useRecents(): UseRecentsReturn {
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
    // Dedup: remove existing occurrence, prepend
    const updated = [id, ...current.filter((r) => r !== id)].slice(0, 20);
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

  return { recents, addRecent, clearRecents, isLoading };
}
