// FILE PATH: locales/en.ts
// PURPOSE: English UI strings for the CHGEM Hymn Book application.
// Every user-facing string in the app must come from this file (or yo.ts).
// Never hardcode UI text in components — always use the t() function.
//
// ADDING NEW STRINGS:
//   1. Add the key here with the English value.
//   2. Add the same key to yo.ts with the Yoruba translation.
//   3. Add the key to the Translations interface in locales/index.ts.
//   4. TypeScript will then enforce the key exists in both locales.

import type { Translations } from './index';

export const en: Translations = {
  // ─── Navigation ───────────────────────────────────────────────────────────
  nav_index:       'Index',
  nav_category:    'Category',
  nav_various:     'Various',
  nav_recent:      'Recent',
  nav_favourite:   'Favourite',
  nav_settings:    'Settings',


  // ─── Screen Titles ────────────────────────────────────────────────────────
  screen_index:       'Index',
  screen_index_sub:   'Numerical',
  screen_category:    'Category',
  screen_recent:      'Recent',
  screen_favourite:   'Favourite',
  screen_settings:    'Settings',
  screen_search:      'Search',
  screen_about:       'About',

  // ─── Search ───────────────────────────────────────────────────────────────
  search_placeholder:       'Hymn number or title...',
  search_placeholder_num:   'Hymn number...',
  search_no_results:        'No hymns found for "{query}".',
  search_no_results_hint:   'Try the hymn number or a different keyword.',
  search_empty_hint:        'Type a hymn number or title to search.',

  // ─── Sort / Filter ────────────────────────────────────────────────────────
  sort_numerical:    'Numerical',
  sort_alphabetical: 'A – Z',

  // ─── Hymn Reader ──────────────────────────────────────────────────────────
  reader_verse:    'Verse',
  reader_chorus:   'Chorus',
  reader_bridge:   'Bridge',
  reader_refrain:  'Refrain',
  reader_intro:    'Intro',
  reader_outro:    'Outro',

  // ─── Actions ──────────────────────────────────────────────────────────────
  action_share:           'Share',
  action_add_favourite:   'Add to Favourites',
  action_remove_favourite:'Remove from Favourites',
  action_browse_hymns:    'Browse Hymns',
  action_clear_search:    'Clear Search',
  action_clear_recents:   'Clear Recents',
  action_clear_all:       'Clear All',
  action_report_issue:    'Report Issue',
  action_send_report:     'Send Report',
  action_back:            'Back',

  // ─── Empty States ─────────────────────────────────────────────────────────
  empty_search_title:          'No hymns found',
  empty_search_body:           'No hymns matched your search. Try a different number or keyword.',
  empty_favourites_title:      'No saved hymns yet',
  empty_favourites_body:       'Tap the ♥ on any hymn to save it here.',
  empty_favourites_full_title: 'Favourites limit reached',
  empty_favourites_full_body:  'You have saved 100 hymns (maximum). Remove some to add more.',
  empty_recents_title:         'No recently opened hymns',
  empty_recents_body:          'Open any hymn and it will appear here.',
  empty_category_title:        'No hymns in this category',
  empty_category_body:         'Try browsing a different category.',
  empty_lyrics_title:          'Lyrics unavailable',
  empty_lyrics_body:           'The lyrics for this hymn could not be loaded. Please report this.',
  empty_corpus_title:          'Hymn data could not be loaded',
  empty_corpus_body:           'Please reinstall the app or contact support.',

  // ─── Settings ─────────────────────────────────────────────────────────────
  settings_general:          'General Settings',
  settings_theme:            'Theme',
  settings_theme_system:     'System default',
  settings_theme_light:      'Light',
  settings_theme_dark:       'Dark',
  settings_language:         'Language',
  settings_font_size:        'Font Size',
  settings_font_xs:          'XS — Smallest',
  settings_font_sm:          'SM — Small',
  settings_font_md:          'MD — Default',
  settings_font_lg:          'LG — Large',
  settings_font_xl:          'XL — Extra Large',
  settings_font_xxl:         'XXL — Maximum',
  settings_font_preview: 'Great is Thy faithfulness, O God my Father!',
  settings_show_verse_nums:  'Show Verse Numbers',
  settings_keep_screen_on:   'Keep Screen On',
  settings_haptic_feedback:  'Haptic Feedback',
  settings_clear_recents:    'Clear Recent Hymns',
  settings_clear_recents_sub:'Delete record of all recently viewed hymns',
  settings_offline_badge:    'Fully offline',
  settings_offline_sub:      'All hymns work without internet. Updates are optional.',
  settings_support:          'Support',
  settings_report_issue:     'Report an Issue',
  settings_app_version:      'App Version',
  settings_corpus_version:   'Corpus Version',

  // ─── Language Switcher ────────────────────────────────────────────────────
  language_english:  'English',
  language_yoruba:   'Yoruba',
  language_select:   'Select Language',

  // ─── Share Payload ────────────────────────────────────────────────────────
  share_hymn_prefix: 'Hymn',

  // ─── Offline / Status ─────────────────────────────────────────────────────
  status_offline: 'Offline',

  // ─── About ────────────────────────────────────────────────────────────────
  about_title:      'CHGEM Hymn Book',
  about_body:       'Christ\'s Hope of Glory Evangelical Mission',
  about_app_ver:    'App Version',
  about_corpus_ver: 'Corpus Version',
  

};

