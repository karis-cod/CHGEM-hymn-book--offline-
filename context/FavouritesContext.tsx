// FILE PATH: context/FavouritesContext.tsx
// PURPOSE: Shared favourites state across all screens.
// Replaces the per-screen hooks/useFavourites.ts instance — fixes the bug where
// clearFavourites() in one screen did not update the heart icons on another screen.
//
// PRD Reference: Section 13.2 (hook contract), Section 7 (US-04).

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { storageService } from '../services/storageService';
import { hymnService } from '../services/hymnService';

const MAX_FAVOURITES = 100;

export interface FavouritesContextValue {
  favourites: string[];
  isFavourite: (id: string) => boolean;
  toggleFavourite: (id: string) => Promise<void>;
  clearFavourites: () => Promise<void>;
  isLoading: boolean;
  isAtLimit: boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

interface FavouritesProviderProps {
  children: React.ReactNode;
}

export function FavouritesProvider({ children }: FavouritesProviderProps) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stable snapshot for revert logic without stale closures
  const favouritesRef = useRef<string[]>([]);
  favouritesRef.current = favourites;

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
      const updated = current.filter((fav) => fav !== id);
      setFavourites(updated);
      try {
        await storageService.removeFavourite(id);
      } catch {
        setFavourites(
          favouritesRef.current.includes(id)
            ? favouritesRef.current
            : [...favouritesRef.current, id]
        );
      }
    } else {
      if (current.length >= MAX_FAVOURITES) return;
      const updated = [...current, id];
      setFavourites(updated);
      try {
        await storageService.saveFavourite(id);
      } catch {
        setFavourites(favouritesRef.current.filter((fav) => fav !== id));
      }
    }
  }, []);

  const clearFavourites = useCallback(async (): Promise<void> => {
    const previous = favouritesRef.current;
    // Update shared state immediately — every screen using useFavourites()
    // re-renders because they all read from this single context.
    setFavourites([]);
    try {
      await storageService.clearFavourites();
    } catch {
      setFavourites(previous);
    }
  }, []);

  const value: FavouritesContextValue = {
    favourites,
    isFavourite,
    toggleFavourite,
    clearFavourites,
    isLoading,
    isAtLimit: favourites.length >= MAX_FAVOURITES,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavourites must be used within FavouritesProvider');
  }
  return context;
}