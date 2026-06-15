

export { useRecents } from '../context/RecentsContext';
export type { RecentsContextValue } from '../context/RecentsContext';



/* 




// PURPOSE: Recent hymns list — last 20 opened, newest first, deduplicated.
// PRD Reference: Section 13.2 (useRecents hook), Section 7 (US-10).
//
// Behaviour:
//   - addRecent(id): prepend to list, remove duplicate if present, trim to 20
//   - Persists across app restarts via AsyncStorage
//   - clearRecents(): removes all recents



//
// PHASE 4 CHANGE: Recents state moved to context/RecentsContext.tsx
// so that addRecent() called from hymn/[id].tsx is visible on the
// Recents tab without re-fetching (fixes "recents not populating" bug).
//
// Any existing `import { useRecents } from '../../hooks/useRecents'`
// continues to work unchanged — it now returns the shared context state.
// RecentsProvider must wrap the app (added in app/_layout.tsx).

// FILE PATH: hooks/useRecents.ts
// Backward-compatible shim — Phase 4 moved state to context/RecentsContext.tsx
export { useRecents } from '../context/RecentsContext';
export type { RecentsContextValue } from '../context/RecentsContext';

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
 */