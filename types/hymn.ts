// FILE PATH: types/hymn.ts
// PURPOSE: All hymn data interfaces for the CHGEM Hymn Book application.
// These are the source of truth for all data shapes used across services,
// hooks, and components. Never use raw JSON shapes — always use these types.
//
// BILINGUAL ARCHITECTURE:
//   The corpus is stored as bilingual records. Each hymn carries both English
//   and Yoruba titles. Each stanza carries a 'language' field ('en' or 'yo').
//   At runtime, hymnService.getHymnsForLanguage(lang) returns HymnRecord objects
//   with only the stanzas for the requested language, and the correct title.
//
//   Favourites always store the raw hymn id — language-agnostic.
//   The language is applied at display time only.

import type { AppLanguage, BilingualText } from './language';

// ─── Stanza Types ─────────────────────────────────────────────────────────────

export type StanzaType =
  | 'verse'
  | 'chorus'
  | 'bridge'
  | 'refrain'
  | 'intro'
  | 'outro';

// ─── Core Records — Bilingual Corpus Shape ────────────────────────────────────

/**
 * BilingualStanzaRecord — One verse, chorus, bridge, or other section.
 * Carries a 'language' field so stanzas can be filtered by language at runtime.
 * sequence_order is language-scoped: each language starts at 1.
 */
export interface BilingualStanzaRecord {
  /** e.g. 'stanza_048_v1_en' · 'stanza_048_c1_yo' */
  id: string;
  /** FK → BilingualHymnBase.id  e.g. 'hymn_048' */
  hymn_id: string;
  type: StanzaType;
  /** 1, 2, 3 for verses — null for chorus/bridge/refrain */
  verse_number: number | null;
  /** Full stanza text. Use \n for line breaks. */
  lyrics: string;
  /** Render order: 1, 2, 3... unique per (hymn_id + language) */
  sequence_order: number;
  /** ISO 639-1: 'en' | 'yo' */
  language: AppLanguage;
}

/**
 * BilingualHymnBase — Master record for each hymn in the bilingual corpus.
 * Titles exist in both languages. Stanzas are stored separately in
 * BilingualHymnCorpus.stanzas and joined at runtime.
 */
export interface BilingualHymnBase {
  /** 'hymn_048' — zero-padded to 3 digits */
  id: string;
  /** Canonical number · unique · permanent · positive integer */
  hymn_number: number;
  /**
   * titles — Both language titles on one record.
   * Yoruba title falls back to English if translation not yet available.
   */
  titles: BilingualText;
  /**
   * categories — Category name in both languages.
   * Used for filtering and display on the Category screen.
   */
  categories: BilingualText;
  /** FK → AuthorRecord.id — null if unknown */
  author_id: string | null;
  /** e.g. 'FAITHFULNESS' · 'LOBE DEN HERREN' */
  tune_name: string | null;
  /** e.g. '11.10.11.10. & Ref.' · '8.7.8.7.D' */
  meter: string | null;
  year: number | null;
  /** FK[] → TagRecord.id */
  tags: string[];
  copyright_status: 'public_domain' | 'licensed' | 'pending_review';
  /** Optional scripture reference (language-neutral) */
  scripture_reference: string | null;
  /** Which languages have stanzas in the corpus ('en' always present) */
  available_languages: AppLanguage[];
}

/**
 * AuthorRecord — Hymn author information. Language-neutral.
 */
export interface AuthorRecord {
  /** e.g. 'author_chisholm_thomas' */
  id: string;
  /** e.g. 'Thomas O. Chisholm' */
  name: string;
  birth_year: number | null;
  death_year: number | null;
  denomination: string | null;
}

/**
 * TagRecord — Thematic or liturgical tag. Labels exist in both languages.
 */
export interface TagRecord {
  /** e.g. 'tag_praise' */
  id: string;
  /** Labels in both languages */
  labels: BilingualText;
  /** e.g. 'Thematic' | 'Liturgical' | 'Seasonal' */
  group: string | null;
}

// ─── Runtime View ─────────────────────────────────────────────────────────────

/**
 * HymnRecord — Runtime language-resolved view assembled by hymnService.
 * All fields are already resolved for the active language.
 * title, category, and stanzas all reflect the requested language.
 *
 * IMPORTANT: Never store HymnRecord in AsyncStorage.
 * Store only id strings and resolve to HymnRecord at display time.
 * Never store language in AsyncStorage alongside a HymnRecord id.
 */
export interface HymnRecord {
  /** Raw id from corpus — language-agnostic */
  id: string;
  hymn_number: number;
  /** Title resolved to the active language */
  title: string;
  /** Category resolved to the active language */
  category: string;
  author_id: string | null;
  tune_name: string | null;
  meter: string | null;
  year: number | null;
  copyright_status: 'public_domain' | 'licensed' | 'pending_review';
  scripture_reference: string | null;
  available_languages: AppLanguage[];
  /** The language this record was resolved for */
  resolvedLanguage: AppLanguage;
  /** Stanzas filtered and sorted for resolvedLanguage */
  stanzas: BilingualStanzaRecord[];
  author: AuthorRecord | null;
  resolvedTags: TagRecord[];
  /** Convenience: the raw BilingualHymnBase for accessing other language fields */
  _base: BilingualHymnBase;
}

// ─── Corpus Root ──────────────────────────────────────────────────────────────

/**
 * BilingualHymnCorpus — Root structure of assets/data/hymns.json.
 * Loaded synchronously at startup via require().
 */
export interface BilingualHymnCorpus {
  /** Format: YYYY.N  e.g. '2025.1' */
  version: string;
  /** ISO date string e.g. '2025-01-01' */
  generated: string;
  hymns: BilingualHymnBase[];
  stanzas: BilingualStanzaRecord[];
  authors: AuthorRecord[];
  tags: TagRecord[];
}

// ─── Legacy Compatibility Alias ───────────────────────────────────────────────
// HymnCorpus was the name used in Phase 2. Alias it so any existing code
// referencing HymnCorpus continues to compile without changes.
export type HymnCorpus = BilingualHymnCorpus;

// ─── StanzaRecord Alias ───────────────────────────────────────────────────────
// Phase 2 services used StanzaRecord. Alias to BilingualStanzaRecord
// so existing code continues to compile.
export type StanzaRecord = BilingualStanzaRecord;

// ─── HymnBase Alias ───────────────────────────────────────────────────────────
// Phase 2 services used HymnBase. Alias to BilingualHymnBase.
export type HymnBase = BilingualHymnBase;
