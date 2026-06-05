// FILE PATH: services/searchService.ts
// PURPOSE: In-memory search index build and ranked query for the CHGEM hymn corpus.
// Called ONCE after hymnService.init() completes at startup.
//
// Scoring:
//   10 — exact hymn number match
//    5 — first word of title match
//    3 — other title word match
//    1 — tag label match
//
// Lyrics are NOT indexed in v1.0. See PRD Section 5.2.
// Full lyric search is planned for v2.0.

import type { HymnRecord } from '../types/hymn';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single entry in the search index: hymn id + relevance score */
interface IndexHit {
  id: string;
  score: number;
}

/**
 * SearchIndex — Inverted token index.
 * Maps a token string → array of hymn id + score pairs.
 * Prefix scanning is used at query time (see queryIndex).
 */
export type SearchIndex = Record<string, IndexHit[]>;

// ─── Index Builder ────────────────────────────────────────────────────────────

/**
 * buildIndex — Builds the in-memory inverted token index.
 * Must be called ONCE after hymnService.init() in the startup sequence.
 *
 * Tokenises:
 *   - hymn_number as string (score 10)
 *   - title words: first word (score 5), remaining words (score 3)
 *   - tag labels (score 1)
 *
 * Does NOT tokenise lyrics in v1.0.
 *
 * PERFORMANCE NOTE: If measured > 200ms on a low-end device on the full corpus,
 * move the call inside useEffect with requestAnimationFrame per PRD Section 16.5.
 */
export function buildIndex(hymns: HymnRecord[]): SearchIndex {
  const index: SearchIndex = {};

  for (const hymn of hymns) {
    const entries: Array<{ token: string; score: number }> = [];

    // Hymn number — highest score — this is the primary in-service lookup
    entries.push({ token: hymn.hymn_number.toString(), score: 10 });

    // Title tokens — first word scores higher (title starts-with ranking)
    const titleTokens = tokenise(hymn.title);
    titleTokens.forEach((token, index_) => {
      entries.push({ token, score: index_ === 0 ? 5 : 3 });
    });

    // Tag labels — lowest score (thematic/category matching)
    for (const tag of hymn.resolvedTags) {
      const tagToken = tag.label.toLowerCase();
      if (tagToken) {
        entries.push({ token: tagToken, score: 1 });
      }
    }

    // Add all entries to the index
    for (const { token, score } of entries) {
      if (!token) continue;
      if (!index[token]) {
        index[token] = [];
      }
      index[token].push({ id: hymn.id, score });
    }
  }

  return index;
}

// ─── Query ────────────────────────────────────────────────────────────────────

/**
 * queryIndex — Performs a ranked prefix-scan query against the search index.
 *
 * Behaviour:
 *   - Empty query returns [] (not all hymns — per PRD Section 5.3)
 *   - Special characters are stripped — no throw on unusual input
 *   - Results are ranked by accumulated score, highest first
 *   - Results are capped at 50 (per PRD Section 5.4)
 *   - Prefix scan: 'faith' matches 'faithfulness', 'faithful', etc.
 *
 * @param index   The SearchIndex built by buildIndex()
 * @param query   Raw user input string
 * @param getHymn Resolver function from hymnService (avoids circular import)
 */
export function queryIndex(
  index: SearchIndex,
  query: string,
  getHymn: (id: string) => HymnRecord | null
): HymnRecord[] {
  const tokens = tokenise(query);

  // Empty query returns empty — not the full list (per PRD Section 5.3)
  if (tokens.length === 0) return [];

  const scores: Record<string, number> = {};

  for (const token of tokens) {
    // Prefix scan: also match index keys that START WITH this token
    const matchingKeys = Object.keys(index).filter((k) => k.startsWith(token));

    for (const key of matchingKeys) {
      for (const hit of index[key]) {
        scores[hit.id] = (scores[hit.id] ?? 0) + hit.score;
      }
    }
  }

  return (
    Object.entries(scores)
      // Sort by score descending
      .sort(([, a], [, b]) => b - a)
      // Cap at 50 results
      .slice(0, 50)
      // Resolve each id to a HymnRecord
      .map(([id]) => getHymn(id))
      // Filter out any null results (corpus integrity issue — should not happen)
      .filter((hymn): hymn is HymnRecord => hymn !== null)
  );
}

// ─── Tokeniser ────────────────────────────────────────────────────────────────

/**
 * tokenise — Converts a string into an array of lowercase search tokens.
 * Strips all non-alphanumeric characters.
 * Filters empty strings.
 * Returns [] for empty or whitespace-only input.
 *
 * Examples:
 *   tokenise('Great is Thy faithfulness') → ['great', 'is', 'thy', 'faithfulness']
 *   tokenise('48') → ['48']
 *   tokenise('???') → []
 *   tokenise('') → []
 */
export function tokenise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean);
}
