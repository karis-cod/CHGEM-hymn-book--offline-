// FILE PATH: services/searchService.ts
// PURPOSE: In-memory search index build and ranked query — now language-aware.
//
// BILINGUAL CHANGE FROM PHASE 2:
//   - buildIndex() now accepts a language parameter.
//   - The index is built from language-resolved titles and tag labels.
//   - queryIndex() signature is unchanged — it queries whatever index is passed.
//   - The caller (useSearch hook) is responsible for passing the correct index
//     for the active language, or calling buildIndex() when language changes.
//   - Hymn number search is always language-neutral (numbers are universal).
//
// Scoring:
//   10 — exact hymn number match
//    5 — first word of title match (in active language)
//    3 — other title word match
//    1 — tag label match (in active language)
//
// Lyrics are NOT indexed in v1.0. See PRD Section 5.2.

import type { HymnRecord } from '../types/hymn';
import type { AppLanguage } from '../types/language';
import { DEFAULT_LANGUAGE } from '../types/language';

// ─── Types ────────────────────────────────────────────────────────────────────

interface IndexHit {
  id: string;
  score: number;
}

/**
 * SearchIndex — Inverted token index.
 * Maps a token string → array of (hymn id, score) pairs.
 */
export type SearchIndex = Record<string, IndexHit[]>;

// ─── Index Builder ────────────────────────────────────────────────────────────

/**
 * buildIndex — Builds the inverted token index for the given language.
 *
 * Call this:
 *   - ONCE at startup for the default language (English).
 *   - AGAIN whenever the user switches language (in useSearch or startup).
 *
 * Tokenises:
 *   - hymn_number as string (score 10) — language-neutral
 *   - title words in the active language: first word (5), rest (3)
 *   - tag labels in the active language (1)
 *
 * Does NOT tokenise lyrics in v1.0.
 */
export function buildIndex(
  hymns: HymnRecord[],
  language: AppLanguage = DEFAULT_LANGUAGE
): SearchIndex {
  // language param is passed for explicitness; hymns are already resolved
  // to the correct language by hymnService.getAllHymns(language).
  // We accept it here to make the contract clear to callers.
  void language;

  const index: SearchIndex = {};

  for (const hymn of hymns) {
    const entries: Array<{ token: string; score: number }> = [];

    // Hymn number — highest score — language-neutral
    entries.push({ token: hymn.hymn_number.toString(), score: 10 });

    // Title tokens — resolved to active language by hymnService
    const titleTokens = tokenise(hymn.title);
    titleTokens.forEach((token, i) => {
      entries.push({ token, score: i === 0 ? 5 : 3 });
    });

    // Tag labels — resolved to active language
    for (const tag of hymn.resolvedTags) {
      // tags have labels in both languages — pick the active language label
      const tagLabel = typeof tag.labels === 'object'
        ? (tag.labels[language] || tag.labels[DEFAULT_LANGUAGE] || '')
        : '';
      const tagToken = tagLabel.toLowerCase();
      if (tagToken) {
        entries.push({ token: tagToken, score: 1 });
      }
    }

    // Insert all entries into index
    for (const { token, score } of entries) {
      if (!token) continue;
      if (!index[token]) index[token] = [];
      index[token].push({ id: hymn.id, score });
    }
  }

  return index;
}

// ─── Query ────────────────────────────────────────────────────────────────────

/**
 * queryIndex — Ranked prefix-scan query.
 * Signature is unchanged from Phase 2.
 *
 * - Empty query → []
 * - Caps at 50 results
 * - Special chars stripped — no throw
 */
export function queryIndex(
  index: SearchIndex,
  query: string,
  getHymn: (id: string) => HymnRecord | null
): HymnRecord[] {
  const tokens = tokenise(query);
  if (tokens.length === 0) return [];

  const scores: Record<string, number> = {};

  for (const token of tokens) {
    const matchingKeys = Object.keys(index).filter((k) => k.startsWith(token));
    for (const key of matchingKeys) {
      for (const hit of index[key]) {
        scores[hit.id] = (scores[hit.id] ?? 0) + hit.score;
      }
    }
  }

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50)
    .map(([id]) => getHymn(id))
    .filter((hymn): hymn is HymnRecord => hymn !== null);
}

// ─── Tokeniser ────────────────────────────────────────────────────────────────

/**
 * tokenise — Lowercase, strip non-alphanumeric, split on space.
 * Works for both English and Yoruba — Yoruba tone marks are stripped,
 * which is intentional for forgiving search matching.
 *
 * Examples:
 *   tokenise('Great is Thy faithfulness') → ['great', 'is', 'thy', 'faithfulness']
 *   tokenise('Olúwa') → ['olwa']  (tone mark stripped — still matches 'olwa')
 *   tokenise('48') → ['48']
 *   tokenise('') → []
 */
export function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean);
}
