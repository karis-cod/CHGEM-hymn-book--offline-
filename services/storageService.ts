// FILE PATH: services/storageService.ts
// PURPOSE: Typed AsyncStorage wrapper for the CHGEM Hymn Book application.
// All user state (favourites, recents, settings, corpus version) flows through here.
//
// RULES:
//   - All methods are async with try/catch — never throws to the caller
//   - Returns safe defaults on null (first install) or error
//   - Never store full HymnRecord objects — store id strings only
//   - AsyncStorage.getItem returning null is NORMAL on first install, not an error
//   - All reads use STORAGE_KEYS constants — never raw strings
//
// IMPORTANT: Import AsyncStorage from @react-native-async-storage/async-storage
// NEVER import it from react-native core — that package is deprecated.

import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, STORAGE_KEYS } from '../types/settings';
import type { UserSettings } from '../types/settings';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum number of favourites a user can save. Matches PRD Section 6.2. */
const MAX_FAVOURITES = 100;

/** Maximum number of recent hymns to retain. Matches PRD Section 7.2 (US-10). */
const MAX_RECENTS = 20;

// ─── Favourites ───────────────────────────────────────────────────────────────

/**
 * loadFavourites — Returns the saved array of hymn id strings.
 * Returns [] on first install (null from AsyncStorage) or any error.
 * Never throws.
 */
async function loadFavourites(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.FAVOURITES);
    if (raw === null) return []; // Normal on first install
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Validate each element is a string
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

/**
 * saveFavourite — Adds a hymn id to the favourites list.
 * Silently skips if already present.
 * Silently skips if at the 100-item limit.
 * Caller is responsible for showing the limit empty state (see PRD Section 8.1).
 * Never throws.
 */
async function saveFavourite(id: string): Promise<void> {
  try {
    const current = await loadFavourites();
    if (current.includes(id)) return; // Already saved — no-op
    if (current.length >= MAX_FAVOURITES) return; // Limit reached — caller shows message
    const updated = [...current, id];
    await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updated));
  } catch {
    // Silent failure — in-memory optimistic state is preserved by the hook
  }
}

/**
 * removeFavourite — Removes a hymn id from the favourites list.
 * Silently skips if not present.
 * Never throws.
 */
async function removeFavourite(id: string): Promise<void> {
  try {
    const current = await loadFavourites();
    const updated = current.filter((fav) => fav !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(updated));
  } catch {
    // Silent failure — optimistic state is preserved by the hook
  }
}

/**
 * clearFavourites — Removes all saved favourites.
 * Never throws.
 */
async function clearFavourites(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FAVOURITES);
  } catch {
    // Silent failure
  }
}

// ─── Recents ──────────────────────────────────────────────────────────────────

/**
 * loadRecents — Returns the saved array of recent hymn id strings (newest first).
 * Returns [] on first install or any error.
 * Never throws.
 */
async function loadRecents(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.RECENTS);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

/**
 * saveRecent — Prepends a hymn id to the recents list.
 * If already present, moves it to the top (no duplication).
 * Trims list to MAX_RECENTS (20) oldest entries.
 * Never throws.
 */
async function saveRecent(id: string): Promise<void> {
  try {
    const current = await loadRecents();
    // Remove existing occurrence (dedup) then prepend
    const deduplicated = current.filter((r) => r !== id);
    const updated = [id, ...deduplicated].slice(0, MAX_RECENTS);
    await AsyncStorage.setItem(STORAGE_KEYS.RECENTS, JSON.stringify(updated));
  } catch {
    // Silent failure
  }
}

/**
 * clearRecents — Removes all recent hymn history.
 * Never throws.
 */
async function clearRecents(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.RECENTS);
  } catch {
    // Silent failure
  }
}

// ─── Settings ─────────────────────────────────────────────────────────────────

/**
 * loadSettings — Returns the saved UserSettings object.
 * Returns DEFAULT_SETTINGS on first install (null) or any error.
 * Merges with DEFAULT_SETTINGS to handle partial/missing fields after OTA updates.
 * Never throws.
 */
async function loadSettings(): Promise<UserSettings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw === null) return { ...DEFAULT_SETTINGS };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return { ...DEFAULT_SETTINGS };
    // Merge with defaults to handle any new fields added in OTA updates
    return { ...DEFAULT_SETTINGS, ...(parsed as Partial<UserSettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * saveSettings — Persists the full UserSettings object.
 * Never throws.
 */
async function saveSettings(settings: UserSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Silent failure — in-memory state is preserved by SettingsContext
  }
}

// ─── Corpus Version ───────────────────────────────────────────────────────────

/**
 * getStoredCorpusVersion — Returns the last known corpus version string.
 * Returns null if not yet stored (first install or first OTA).
 * Never throws.
 */
async function getStoredCorpusVersion(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.DB_VERSION);
  } catch {
    return null;
  }
}

/**
 * setStoredCorpusVersion — Saves the current corpus version string.
 * Called after a corpus version change is detected at startup.
 * Never throws.
 */
async function setStoredCorpusVersion(version: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DB_VERSION, version);
  } catch {
    // Silent failure — index is always rebuilt at startup regardless
  }
}

// ─── Exported Service Object ──────────────────────────────────────────────────

export const storageService = {
  loadFavourites,
  saveFavourite,
  removeFavourite,
  clearFavourites,
  loadRecents,
  saveRecent,
  clearRecents,
  loadSettings,
  saveSettings,
  getStoredCorpusVersion,
  setStoredCorpusVersion,
} as const;
