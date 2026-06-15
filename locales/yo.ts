// FILE PATH: locales/yo.ts
// PURPOSE: Yoruba (Yorùbá) UI strings for the CHGEM Hymn Book application.
// Every key in this file MUST match a key in locales/en.ts.
// TypeScript enforces this via the Translations interface in locales/index.ts.
//
// TRANSLATION NOTES:
//   - Where a natural Yoruba equivalent does not exist, use the English term.
//   - Church/liturgical terms follow CHGEM congregation usage.
//   - Accents and tone marks are included where standard (e.g. Yorùbá, Olúwa).

import type { Translations } from './index';

export const yo: Translations = {
  // ─── Navigation ───────────────────────────────────────────────────────────
  nav_index:       'Atọka',
  nav_category:    'Ẹka',
  nav_various:     'Oríṣiríṣi',
  nav_recent:      'Àìpẹ́',
  nav_favourite:   'Ayanfẹ́',
  nav_settings:    'Ètò',

  // ─── Screen Titles ────────────────────────────────────────────────────────
  screen_index:       'Atọka',
  screen_index_sub:   'Ìlà Nọ́mbà',
  screen_category:    'Ẹka',
  screen_recent:      'Àìpẹ́',
  screen_favourite:   'Ayanfẹ́',
  screen_settings:    'Ètò',
  screen_search:      'Wà',
  screen_about:       'Nípa',

  // ─── Search ───────────────────────────────────────────────────────────────
  search_placeholder:       'Nọ́mbà tàbí àkọlé orin...',
  search_placeholder_num:   'Nọ́mbà orin...',
  search_no_results:        'A kò rí orin fún "{query}".',
  search_no_results_hint:   'Gbìyànjú nọ́mbà orin tàbí ọ̀rọ̀ míì.',
  search_empty_hint:        'Tẹ nọ́mbà tàbí àkọlé orin láti wá.',

  // ─── Sort / Filter ────────────────────────────────────────────────────────
  sort_numerical:    'Ìlà Nọ́mbà',
  sort_alphabetical: 'A – Z',

  // ─── Hymn Reader ──────────────────────────────────────────────────────────
  reader_verse:    'Ẹsẹ',
  reader_chorus:   'Orin Àárín',
  reader_bridge:   'Àárín Orin',
  reader_refrain:  'Ìtúnwọ̀',
  reader_intro:    'Ìbẹ̀rẹ̀',
  reader_outro:    'Òpin',

  // ─── Actions ──────────────────────────────────────────────────────────────
  action_share:           'Pín',
  action_add_favourite:   'Fi sí Ayanfẹ́',
  action_remove_favourite:'Yọ kúrò nínú Ayanfẹ́',
  action_browse_hymns:    'Wo Àwọn Orin',
  action_clear_search:    'Pa Àkọsọ Rẹ',
  action_clear_recents:   'Pa Àwọn Àìpẹ́ Rẹ',
  action_clear_all:       'Pa Gbogbo Rẹ',
  action_report_issue:    'Ròyìn Àṣìṣe',
  action_send_report:     'Fi Ìjábọ̀ Ránṣẹ́',
  action_back:            'Padà',


  // ─── Empty States ─────────────────────────────────────────────────────────
  empty_search_title:          'A kò rí orin kankan',
  empty_search_body:           'Orin kan kò báramu àkọsọ rẹ. Gbìyànjú nọ́mbà tàbí ọ̀rọ̀ míì.',
  empty_favourites_title:      'Kò sí orin tí a tọ́jú',
  empty_favourites_body:       'Tẹ ♥ lórí orin èyíkéyìí láti tọ́jú rẹ̀ níhìn.',
  empty_favourites_full_title: 'Iye Ayanfẹ́ ti kún',
  empty_favourites_full_body:  'O ti tọ́jú orin 100 (iye tó pọ̀ jù). Yọ àwọn kan kúrò kí o lè fi mìíràn.',
  empty_recents_title:         'Kò sí orin tí a ṣẹ̀ ṣẹ̀ ṣí',
  empty_recents_body:          'Ṣí orin èyíkéyìí kí ó jẹ́ kó farahàn níhìn.',
  empty_category_title:        'Kò sí orin nínú ẹka yìí',
  empty_category_body:         'Gbìyànjú ẹka míì.',
  empty_lyrics_title:          'Àwọn ọ̀rọ̀ orin kò sí',
  empty_lyrics_body:           'A kò lè kojú àwọn ọ̀rọ̀ orin fún orin yìí. Jọ̀wọ́ ròyìn àṣìṣe yìí.',
  empty_corpus_title:          'A kò lè kojú dátà orin',
  empty_corpus_body:           'Jọ̀wọ́ fi app sún-ún tàbí kàn sí àtìlẹ́yìn.',

  // ─── Settings ─────────────────────────────────────────────────────────────
  settings_general:          'Ètò Àgbàyanu',
  settings_theme:            'Àwòrán',
  settings_theme_system:     'Àdáni ẹ̀rọ',
  settings_theme_light:      'Ìmọ́lẹ̀',
  settings_theme_dark:       'Òkùnkùn',
  settings_language:         'Èdè',
  settings_font_size:        'Ìwọn Lẹ́tà',
  settings_font_xs:          'XS — Kékeré Jù',
  settings_font_sm:          'SM — Kékeré',
  settings_font_md:          'MD — Àdáni',
  settings_font_lg:          'LG — Títóbi',
  settings_font_xl:          'XL — Títóbi Sí i',
  settings_font_xxl:         'XXL — Títóbi Jù',
  settings_show_verse_nums:  'Ṣàfihàn Nọ́mbà Ẹsẹ',
  settings_keep_screen_on:   'Jẹ́ kí Ojú-Ẹ̀rọ Máa Ṣí',
  settings_haptic_feedback:  'Ìmọ̀lára Ifọwọ́kan',
  settings_clear_recents:    'Pa Àwọn Orin Àìpẹ́',
  settings_clear_recents_sub:'Parẹ́ àkọsílẹ̀ àwọn orin tí a ṣẹ̀ ṣẹ̀ wò',
  settings_offline_badge:    'Ìgbésẹ̀ Ọ̀tọ̀ẹni',
  settings_offline_sub:      'Àwọn orin gbogbo ṣiṣẹ́ láìsí íntánẹ́ẹ̀tì. Àwọn ìmúdójúìwọ̀n jẹ́ àṣàyànwá.',
  settings_support:          'Àtìlẹ́yìn',
  settings_report_issue:     'Ròyìn Àṣìṣe',
  settings_app_version:      'Ẹ̀dà App',
  settings_corpus_version:   'Ẹ̀dà Dátà Orin',
  settings_font_preview: 'Ìgbẹ́kẹ̀lé Rẹ tóbi, Ọlọrun Baba mi!',

  // ─── Language Switcher ────────────────────────────────────────────────────
  language_english:  'Gẹ̀ẹ́sì',
  language_yoruba:   'Yorùbá',
  language_select:   'Yan Èdè',

  // ─── Share Payload ────────────────────────────────────────────────────────
  share_hymn_prefix: 'Orin',

  // ─── Offline / Status ─────────────────────────────────────────────────────
  status_offline: 'Ìgbésẹ̀ Ọ̀tọ̀ẹni',

  // ─── About ────────────────────────────────────────────────────────────────
  about_title:      'Ìwé Orin CHGEM',
  about_body:       'Ìjọ Ìrètí Olùgbàlà Ọlọ́run',
  about_app_ver:    'Ẹ̀dà App',
  about_corpus_ver: 'Ẹ̀dà Dátà Orin',

};
