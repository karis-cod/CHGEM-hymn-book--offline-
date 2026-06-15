// FILE PATH: locales/index.ts
// PURPOSE: Unified locale export and Translations interface.
// The Translations interface is the TypeScript contract that enforces:
//   - every key exists in BOTH en.ts and yo.ts
//   - every new key added to one locale must be added to the other
//
// HOW TO ADD A NEW STRING:
//   1. Add the key to the Translations interface below.
//   2. TypeScript will immediately error on en.ts and yo.ts until both files
//      have the key — this is intentional enforcement.
//   3. Add the English value to en.ts.
//   4. Add the Yoruba value to yo.ts.
//
// USING TRANSLATIONS:
//   import { useLanguage } from '@/context/LanguageContext';
//   const { t } = useLanguage();
//   <Text>{t('nav_index')}</Text>

import type { AppLanguage } from '../types/language';

// ─── Translations Interface ───────────────────────────────────────────────────
// This is the single source of truth for all translatable string keys.
// Both en.ts and yo.ts must implement this interface completely.

export interface Translations {
  // Navigation
  nav_index:       string;
  nav_category:    string;
  nav_various:     string;
  nav_recent:      string;
  nav_favourite:   string;
  nav_settings:    string;

  // Screen Titles
  screen_index:       string;
  screen_index_sub:   string;
  screen_category:    string;
  screen_recent:      string;
  screen_favourite:   string;
  screen_settings:    string;
  screen_search:      string;
  screen_about:       string;

  // Search
  search_placeholder:       string;
  search_placeholder_num:   string;
  search_no_results:        string;
  search_no_results_hint:   string;
  search_empty_hint:        string;

  // Sort / Filter
  sort_numerical:    string;
  sort_alphabetical: string;

  // Hymn Reader
  reader_verse:    string;
  reader_chorus:   string;
  reader_bridge:   string;
  reader_refrain:  string;
  reader_intro:    string;
  reader_outro:    string;

  // Actions
  action_share:           string;
  action_add_favourite:   string;
  action_remove_favourite:string;
  action_browse_hymns:    string;
  action_clear_search:    string;
  action_clear_recents:   string;
  action_clear_all:       string;
  action_report_issue:    string;
  action_send_report:     string;
  action_back:            string;

  // Empty States
  empty_search_title:          string;
  empty_search_body:           string;
  empty_favourites_title:      string;
  empty_favourites_body:       string;
  empty_favourites_full_title: string;
  empty_favourites_full_body:  string;
  empty_recents_title:         string;
  empty_recents_body:          string;
  empty_category_title:        string;
  empty_category_body:         string;
  empty_lyrics_title:          string;
  empty_lyrics_body:           string;
  empty_corpus_title:          string;
  empty_corpus_body:           string;

  // Settings
  settings_general:          string;
  settings_theme:            string;
  settings_theme_system:     string;
  settings_theme_light:      string;
  settings_theme_dark:       string;
  settings_language:         string;
  settings_font_size:        string;
  settings_font_xs:          string;
  settings_font_sm:          string;
  settings_font_md:          string;
  settings_font_lg:          string;
  settings_font_xl:          string;
  settings_font_xxl:         string;
  settings_font_preview: string;
  settings_show_verse_nums:  string;
  settings_keep_screen_on:   string;
  settings_haptic_feedback:  string;
  settings_clear_recents:    string;
  settings_clear_recents_sub:string;
  settings_offline_badge:    string;
  settings_offline_sub:      string;
  settings_support:          string;
  settings_report_issue:     string;
  settings_app_version:      string;
  settings_corpus_version:   string;

  // Language Switcher
  language_english:  string;
  language_yoruba:   string;
  language_select:   string;

  // Share Payload
  share_hymn_prefix: string;

  // Offline / Status
  status_offline: string;

  // About
  about_title:      string;
  about_body:       string;
  about_app_ver:    string;
  about_corpus_ver: string;
}

// ─── Locale Map ───────────────────────────────────────────────────────────────
// Lazy import pattern: files are small and bundled, so we import them directly.
// This avoids any async loading and keeps startup synchronous.

import { en } from './en';
import { yo } from './yo';

export const locales: Record<AppLanguage, Translations> = {
  en,
  yo,
} as const;

/**
 * getTranslations — Returns the Translations object for a given language.
 * Falls back to English if the language is not recognised.
 * Pure function — no React dependency.
 */
export function getTranslations(language: AppLanguage): Translations {
  return locales[language] ?? locales['en'];
}

/**
 * interpolate — Replaces {key} placeholders in a translation string.
 * Used for dynamic strings like search_no_results which contain {query}.
 *
 * Example:
 *   interpolate(t('search_no_results'), { query: 'faith' })
 *   → 'No hymns found for "faith".'
 */
export function interpolate(
  template: string,
  values: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}
