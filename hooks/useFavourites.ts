
export { useFavourites } from '../context/FavouritesContext';
export type { FavouritesContextValue } from '../context/FavouritesContext';




/* // FILE PATH: hooks/useFavourites.ts
// PURPOSE: Optimistic favourites CRUD with AsyncStorage persistence.
// PRD Reference: Section 13.2 (hook contract), Section 7 (US-04).
//
// Contract (from PRD Section 13.2):
//   favourites:      string[]          — array of HymnBase.id
//   isFavourite:     (id) => boolean
//   toggleFavourite: (id) => Promise<void>
//   clearFavourites: () => Promise<void>
//   isLoading:       boolean
//
// Optimistic update: state changes immediately — AsyncStorage write is fire-and-forget.
// On write failure: revert optimistic state.
// Limit: at 100 items, toggleFavourite (add) is a no-op — caller shows message.
// On load: filter favourites against hymnService to remove stale IDs silently.


// PHASE 4 CHANGE: Favourites state moved to context/FavouritesContext.tsx
// so that favourites are shared across all screens (fixes the bug where
// clearFavourites() on one screen did not update heart icons on another).
//
// Any existing `import { useFavourites } from '../../hooks/useFavourites'`
// continues to work unchanged — it now returns the shared context state.
// FavouritesProvider must wrap the app (added in app/_layout.tsx).

// FILE PATH: hooks/useFavourites.ts
// Backward-compatible shim — Phase 4 moved state to context/FavouritesContext.tsx
// All existing imports from this path continue to work unchanged.
// FILE PATH: hooks/useFavourites.ts
// Backward-compatible shim — Phase 4 moved state to context/FavouritesContext.tsx
export type { FavouritesContextValue } from '../context/FavouritesContext';

import { useCallback, useEffect, useRef, useState } from 'react';

import { storageService } from '../services/storageService';
import { hymnService } from '../services/hymnService';

const MAX_FAVOURITES = 100;

export interface UseFavouritesReturn {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => Promise<void>;
  clearFavourites: () => Promise<void>;
  isLoading: boolean;
  isAtLimit: boolean;
}

export function useFavourites(): UseFavouritesReturn {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ref keeps a stable snapshot for revert logic without stale closure issues
  const favouritesRef = useRef<string[]>([]);
  favouritesRef.current = favourites;

  // Load on mount — filter stale IDs against current corpus
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const loaded = await storageService.loadFavourites();
      if (cancelled) return;
      // Remove any IDs that no longer exist in the corpus (stale after OTA)
      const valid = hymnService.isInitialised()
        ? loaded.filter((id) => hymnService.getHymn(id) !== null)
        : loaded;
      setFavourites(valid);
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const isFavourite = useCallback(
    (id: string): boolean => favouritesRef.current.includes(id),
    []
  );

  const toggleFavourite = useCallback(async (id: string): Promise<void> => {
    const current = favouritesRef.current;
    const alreadySaved = current.includes(id);

    if (alreadySaved) {
      // Optimistic remove
      const updated = current.filter((fav) => fav !== id);
      setFavourites(updated);
      try {
        await storageService.removeFavourite(id);
      } catch {
        // Revert on failure
        setFavourites(favouritesRef.current.includes(id) ? favouritesRef.current : [...favouritesRef.current, id]);
      }
    } else {
      // At limit — do not add. Caller is responsible for showing the message.
      if (current.length >= MAX_FAVOURITES) return;
      // Optimistic add
      const updated = [...current, id];
      setFavourites(updated);
      try {
        await storageService.saveFavourite(id);
      } catch {
        // Revert on failure
        setFavourites(favouritesRef.current.filter((fav) => fav !== id));
      }
    }
  }, []);

  const clearFavourites = useCallback(async (): Promise<void> => {
    const previous = favouritesRef.current;
    setFavourites([]);
    try {
      await storageService.clearFavourites();
    } catch {
      setFavourites(previous);
    }
  }, []);

  return {
    favourites,
    isFavourite,
    toggleFavourite,
    clearFavourites,
    isLoading,
    isAtLimit: favourites.length >= MAX_FAVOURITES,
  };
}
 */