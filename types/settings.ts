// FILE PATH: types/settings.ts
// PURPOSE: Settings and theme types for the CHGEM Hymn Book application.
// All user preferences flow through these types.
// Never use raw strings for theme, font size, or language — always use these types.
//
// CHANGE FROM PHASE 2:
//   language field changed from `string` to `AppLanguage` for strict typing.
//   All existing storageService calls are unaffected — the JSON value is the same.

import type { AppLanguage } from './language';
import { DEFAULT_LANGUAGE } from './language';

// ─── Font Size ────────────────────────────────────────────────────────────────

/**
 * FontSizeStep — 6-step font scale.
 * XS and XXL are accessibility extremes.
 * MD is the default shipped setting.
 * See PRD Section 15.2 for exact point values per step.
 */
export type FontSizeStep = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Maps each FontSizeStep to concrete point values used by ThemedText.
 * All text in the app derives from these values — never hardcode font sizes.
 */
export interface FontSizeScale {
  stanzaBody: number;
  hymnTitle: number;
  listTitle: number;
  label: number;
}

/**
 * Complete font size scale for all 6 steps.
 * Source of truth: PRD Section 15.2.
 */
export const FONT_SIZE_SCALES: Record<FontSizeStep, FontSizeScale> = {
  xs:  { stanzaBody: 14, hymnTitle: 20, listTitle: 14, label: 11 },
  sm:  { stanzaBody: 15, hymnTitle: 22, listTitle: 15, label: 12 },
  md:  { stanzaBody: 17, hymnTitle: 24, listTitle: 16, label: 13 },
  lg:  { stanzaBody: 19, hymnTitle: 28, listTitle: 18, label: 14 },
  xl:  { stanzaBody: 22, hymnTitle: 32, listTitle: 20, label: 15 },
  xxl: { stanzaBody: 26, hymnTitle: 36, listTitle: 22, label: 16 },
};

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * ThemeMode — How the app determines which colour palette to use.
 * 'system' follows the device's dark/light preference.
 * 'light' and 'dark' are manual overrides that persist across restarts.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

// ─── Sort Order ───────────────────────────────────────────────────────────────

/**
 * SortOrder — How the hymn list is ordered on the Index screen.
 * This preference is ephemeral (session only, not persisted).
 */
export type SortOrder = 'numerical' | 'alphabetical';

// ─── User Settings ────────────────────────────────────────────────────────────

/**
 * UserSettings — All user preferences persisted via AsyncStorage.
 * Key: @chgem/settings
 * Never store partial settings — always read/write the full object.
 *
 * CHANGE: language is now strictly typed as AppLanguage ('en' | 'yo')
 * rather than a generic string.
 */
export interface UserSettings {
  theme: ThemeMode;
  fontSize: FontSizeStep;
  /** Strictly typed language code — 'en' | 'yo' */
  language: AppLanguage;
  showVerseNumbers: boolean;
  keepScreenOn: boolean;
  hapticFeedback: boolean;
}

/**
 * DEFAULT_SETTINGS — Used when no stored settings exist (first install).
 * AsyncStorage returns null on first install — this is normal, not an error.
 */
export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  fontSize: 'md',
  language: DEFAULT_LANGUAGE,
  showVerseNumbers: true,
  keepScreenOn: false,
  hapticFeedback: true,
};

// ─── AsyncStorage Keys ────────────────────────────────────────────────────────

/**
 * STORAGE_KEYS — All AsyncStorage keys used by the application.
 * Using constants prevents typos and keeps keys in one place.
 */
export const STORAGE_KEYS = {
  FAVOURITES: '@chgem/favourites',
  RECENTS:    '@chgem/recents',
  SETTINGS:   '@chgem/settings',
  DB_VERSION: '@chgem/db_version',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
