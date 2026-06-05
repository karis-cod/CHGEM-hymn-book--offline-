// FILE PATH: services/hymnService.ts
// PURPOSE: In-memory query layer for the CHGEM hymn corpus.
// All methods are synchronous after init() completes.
// This module is a singleton — init() must be called exactly once at startup,
// before SplashScreen.hideAsync() is called.
//
// IMPORTANT: Never call getAllHymns() inside a render function.
// Call it once in useHymnList and memoize with useMemo.

import type {
  HymnBase,
  HymnCorpus,
  HymnRecord,
  AuthorRecord,
  TagRecord,
  StanzaRecord,
} from '../types/hymn';

// ─── Internal State ───────────────────────────────────────────────────────────

/** Maps hymn id → HymnRecord (O(1) lookup) */
let hymnIdMap: Map<string, HymnRecord> = new Map();

/** Maps hymn_number → HymnRecord (O(1) lookup) */
let hymnNumberMap: Map<number, HymnRecord> = new Map();

/** Sorted list of all hymns by hymn_number ASC — memoised */
let sortedHymns: HymnRecord[] = [];

/** Unique category strings derived dynamically from corpus — memoised */
let categories: string[] = [];

/** Whether init() has been called */
let initialised = false;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * init — Must be called ONCE before any other method.
 * Builds id-map, number-map, and joins stanzas/authors/tags into HymnRecord objects.
 * Called synchronously at startup from the root layout before splash hides.
 */
function init(corpus: HymnCorpus): void {
  if (initialised) {
    // Safe to call again after OTA corpus update — will rebuild maps
  }

  hymnIdMap = new Map();
  hymnNumberMap = new Map();

  // Build lookup maps for authors and tags (O(1) resolution during join)
  const authorMap = new Map<string, AuthorRecord>(
    corpus.authors.map((a) => [a.id, a])
  );
  const tagMap = new Map<string, TagRecord>(
    corpus.tags.map((t) => [t.id, t])
  );

  // Group stanzas by hymn_id for efficient joining
  const stanzasByHymn = new Map<string, StanzaRecord[]>();
  for (const stanza of corpus.stanzas) {
    const existing = stanzasByHymn.get(stanza.hymn_id) ?? [];
    existing.push(stanza);
    stanzasByHymn.set(stanza.hymn_id, existing);
  }

  // Build HymnRecord for each hymn (join stanzas, author, tags)
  for (const base of corpus.hymns) {
    const rawStanzas = stanzasByHymn.get(base.id) ?? [];
    // Sort by sequence_order ASC — gaps are irrelevant (see PRD Section 24)
    const sortedStanzas = [...rawStanzas].sort(
      (a, b) => a.sequence_order - b.sequence_order
    );

    const record: HymnRecord = {
      ...base,
      stanzas: sortedStanzas,
      author: base.author_id ? (authorMap.get(base.author_id) ?? null) : null,
      resolvedTags: base.tags
        .map((tagId) => tagMap.get(tagId))
        .filter((tag): tag is TagRecord => tag !== undefined),
    };

    hymnIdMap.set(base.id, record);
    hymnNumberMap.set(base.hymn_number, record);
  }

  // Build sorted list memoised — sort once, reuse everywhere
  sortedHymns = Array.from(hymnIdMap.values()).sort(
    (a, b) => a.hymn_number - b.hymn_number
  );

  // Derive categories dynamically from corpus — NEVER hardcode these
  const categorySet = new Set<string>();
  for (const hymn of corpus.hymns) {
    categorySet.add(hymn.category);
  }
  categories = Array.from(categorySet).sort();

  initialised = true;
}

/**
 * getHymn — O(1) lookup by id.
 * Returns null if the id does not exist in the corpus.
 */
function getHymn(id: string): HymnRecord | null {
  assertInitialised('getHymn');
  return hymnIdMap.get(id) ?? null;
}

/**
 * getHymnByNumber — O(1) lookup by hymn_number.
 * Returns null if the number does not exist in the corpus.
 * This is the primary in-service search path (US-01).
 */
function getHymnByNumber(n: number): HymnRecord | null {
  assertInitialised('getHymnByNumber');
  return hymnNumberMap.get(n) ?? null;
}

/**
 * getAllHymns — Returns the full list sorted by hymn_number ASC.
 * Result is memoised — no sort on every call.
 *
 * RULE: Never call this inside a render function.
 * Call once in useHymnList and memoize with useMemo.
 */
function getAllHymns(): HymnRecord[] {
  assertInitialised('getAllHymns');
  return sortedHymns;
}

/**
 * getCategories — Returns unique category strings derived dynamically from corpus.
 * NEVER hardcode these — see PRD Section 17.9.
 */
function getCategories(): string[] {
  assertInitialised('getCategories');
  return categories;
}

/**
 * getHymnsByCategory — Returns hymns in a specific category, sorted by hymn_number.
 */
function getHymnsByCategory(category: string): HymnRecord[] {
  assertInitialised('getHymnsByCategory');
  return sortedHymns.filter((h) => h.category === category);
}

/**
 * isInitialised — Returns whether init() has been called.
 * Useful for startup sequence verification.
 */
function isInitialised(): boolean {
  return initialised;
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

function assertInitialised(methodName: string): void {
  if (!initialised) {
    throw new Error(
      `hymnService.${methodName}() called before hymnService.init(). ` +
        'Call init() in the startup sequence before SplashScreen.hideAsync().'
    );
  }
}

// ─── Exported Service Object ──────────────────────────────────────────────────

export const hymnService = {
  init,
  getHymn,
  getHymnByNumber,
  getAllHymns,
  getCategories,
  getHymnsByCategory,
  isInitialised,
} as const;
