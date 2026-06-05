// FILE PATH: types/hymn.ts
// PURPOSE: All hymn data interfaces for the CHGEM Hymn Book application.
// These are the source of truth for all data shapes used across services,
// hooks, and components. Never use raw JSON shapes — always use these types.

// ─── Stanza Types ─────────────────────────────────────────────────────────────

export type StanzaType =
  | 'verse'
  | 'chorus'
  | 'bridge'
  | 'refrain'
  | 'intro'
  | 'outro';

// ─── Core Records ─────────────────────────────────────────────────────────────

/**
 * StanzaRecord — One verse, chorus, bridge, or other section of a hymn.
 * Each stanza is a separate record linked to its parent hymn by hymn_id.
 * sequence_order controls the render order on the reader screen.
 */
export interface StanzaRecord {
  /** e.g. 'stanza_048_v1' · 'stanza_048_c1' · 'stanza_048_b1' */
  id: string;
  /** FK → HymnBase.id  e.g. 'hymn_048' */
  hymn_id: string;
  type: StanzaType;
  /** 1, 2, 3 for verses — null for chorus/bridge/refrain */
  verse_number: number | null;
  /** Full stanza text. Use \n for line breaks within lines. */
  lyrics: string;
  /** Render order: 1, 2, 3... unique per hymn_id */
  sequence_order: number;
}

/**
 * HymnBase — Master record for each hymn.
 * This is the flat record stored in hymns.json.
 * For the runtime joined view (with stanzas, author, tags), see HymnRecord.
 */
export interface HymnBase {
  /** 'hymn_048' — zero-padded to 3 digits */
  id: string;
  /** Canonical number · unique · permanent · positive integer */
  hymn_number: number;
  title: string;
  /** e.g. 'Praise and Worship' · 'Advent' · 'Communion' — NEVER hardcode these */
  category: string;
  /** FK → AuthorRecord.id — null if unknown */
  author_id: string | null;
  /** e.g. 'FAITHFULNESS' · 'LOBE DEN HERREN' */
  tune_name: string | null;
  /** e.g. '11.10.11.10. & Ref.' · '8.7.8.7.D' */
  meter: string | null;
  year: number | null;
  /** FK[] → TagRecord.id */
  tags: string[];
  /** ISO 639-1: 'en' default · 'yo' for Yoruba */
  language: string;
  copyright_status: 'public_domain' | 'licensed' | 'pending_review';
  /** Optional scripture reference shown in reader header */
  scripture_reference: string | null;
}

/**
 * AuthorRecord — Hymn author information.
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
 * TagRecord — Thematic or liturgical tag for a hymn.
 */
export interface TagRecord {
  /** e.g. 'tag_praise' */
  id: string;
  /** e.g. 'Praise' */
  label: string;
  /** e.g. 'Thematic' | 'Liturgical' | 'Seasonal' */
  group: string | null;
}

// ─── Runtime View ─────────────────────────────────────────────────────────────

/**
 * HymnRecord — Runtime joined view assembled by HymnService.getHymn().
 * This is what every screen and component receives.
 *
 * IMPORTANT: Never store HymnRecord in AsyncStorage.
 * Store only id strings and resolve to HymnRecord at read time.
 */
export interface HymnRecord extends HymnBase {
  /** Sorted by sequence_order ASC */
  stanzas: StanzaRecord[];
  author: AuthorRecord | null;
  resolvedTags: TagRecord[];
}

// ─── Corpus Root ──────────────────────────────────────────────────────────────

/**
 * HymnCorpus — The root structure of assets/data/hymns.json.
 * Loaded synchronously at startup via require().
 */
export interface HymnCorpus {
  /** Format: YYYY.N  e.g. '2025.1' */
  version: string;
  /** ISO date string e.g. '2025-01-01' */
  generated: string;
  hymns: HymnBase[];
  stanzas: StanzaRecord[];
  authors: AuthorRecord[];
  tags: TagRecord[];
}
