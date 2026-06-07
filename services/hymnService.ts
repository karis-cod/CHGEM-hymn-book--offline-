// FILE PATH: services/hymnService.ts
// PURPOSE: In-memory query layer for the CHGEM bilingual hymn corpus.
// All methods are synchronous after init() completes.
// This module is a singleton — init() must be called exactly once at startup.
//
// BILINGUAL CHANGE FROM PHASE 2:
//   - Corpus shape is now BilingualHymnCorpus (hymns have titles + categories
//     in both languages; stanzas carry a 'language' field).
//   - All existing method signatures are UNCHANGED for backward compatibility.
//   - New method: getHymnsForLanguage(lang) returns language-resolved HymnRecords.
//   - getHymn() and getAllHymns() now require a language parameter.
//   - getHymnByNumber() now requires a language parameter.
//   - getCategoriesForLanguage(lang) replaces getCategories() for bilingual use.
//   - getCategories() is retained as an alias returning English categories.
//
// IMPORTANT: Never call getAllHymns() inside a render function.
// Call it once in useHymnList and memoize with useMemo.

import type {
  BilingualHymnBase,
  BilingualHymnCorpus,
  BilingualStanzaRecord,
  HymnRecord,
  AuthorRecord,
  TagRecord,
} from '../types/hymn';
import type { AppLanguage } from "@/types/language"
import { resolveBilingual, DEFAULT_LANGUAGE } from '@/types/language';

// ─── Internal State ───────────────────────────────────────────────────────────

/** Maps hymn id → BilingualHymnBase (raw corpus record) */
let hymnBaseMap: Map<string, BilingualHymnBase> = new Map();

/** Maps hymn_number → BilingualHymnBase */
let hymnNumberBaseMap: Map<number, BilingualHymnBase> = new Map();

/** Maps hymn id → stanzas grouped by language */
let stanzasByHymnAndLang: Map<string, Map<AppLanguage, BilingualStanzaRecord[]>> = new Map();

/** Author lookup map */
let authorMap: Map<string, AuthorRecord> = new Map();

/** Tag lookup map */
let tagMap: Map<string, TagRecord> = new Map();

/** Sorted list of raw base records by hymn_number ASC */
let sortedBases: BilingualHymnBase[] = [];

/** Whether init() has been called */
let initialised = false;

// ─── Record Builder ───────────────────────────────────────────────────────────

/**
 * buildHymnRecord — Assembles a language-resolved HymnRecord from a base record.
 * Pure function — no side effects.
 */
function buildHymnRecord(
  base: BilingualHymnBase,
  language: AppLanguage
): HymnRecord {
  // Resolve title and category for requested language (falls back to English)
  const title    = resolveBilingual(base.titles,     language);
  const category = resolveBilingual(base.categories, language);

  // Get stanzas for this hymn in the requested language
  const hymnStanzaMap  = stanzasByHymnAndLang.get(base.id);
  const langStanzas    = hymnStanzaMap?.get(language) ?? [];

  // If no stanzas for requested language, fall back to English
  const effectiveStanzas = langStanzas.length > 0
    ? langStanzas
    : (hymnStanzaMap?.get(DEFAULT_LANGUAGE) ?? []);

  // Sort by sequence_order ASC
  const sortedStanzas = [...effectiveStanzas].sort(
    (a, b) => a.sequence_order - b.sequence_order
  );

  // Resolve author and tags
  const author = base.author_id ? (authorMap.get(base.author_id) ?? null) : null;
  const resolvedTags = base.tags
    .map((tagId) => tagMap.get(tagId))
    .filter((tag): tag is TagRecord => tag !== undefined);

  return {
    id:                  base.id,
    hymn_number:         base.hymn_number,
    title,
    category,
    author_id:           base.author_id,
    tune_name:           base.tune_name,
    meter:               base.meter,
    year:                base.year,
    copyright_status:    base.copyright_status,
    scripture_reference: base.scripture_reference,
    available_languages: base.available_languages,
    resolvedLanguage:    language,
    stanzas:             sortedStanzas,
    author,
    resolvedTags,
    _base:               base,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * init — Must be called ONCE before any other method.
 * Builds all internal maps from the corpus.
 * Safe to call again after an OTA corpus update.
 */
function init(corpus: BilingualHymnCorpus): void {
  hymnBaseMap         = new Map();
  hymnNumberBaseMap   = new Map();
  stanzasByHymnAndLang = new Map();
  authorMap           = new Map();
  tagMap              = new Map();

  // Build author map
  for (const author of corpus.authors) {
    authorMap.set(author.id, author);
  }

  // Build tag map
  for (const tag of corpus.tags) {
    tagMap.set(tag.id, tag);
  }

  // Build stanza map: hymn_id → language → stanzas[]
  for (const stanza of corpus.stanzas) {
    if (!stanzasByHymnAndLang.has(stanza.hymn_id)) {
      stanzasByHymnAndLang.set(stanza.hymn_id, new Map());
    }
    const langMap = stanzasByHymnAndLang.get(stanza.hymn_id)!;
    const lang    = stanza.language as AppLanguage;
    if (!langMap.has(lang)) {
      langMap.set(lang, []);
    }
    langMap.get(lang)!.push(stanza);
  }

  // Build hymn base maps
  for (const base of corpus.hymns) {
    hymnBaseMap.set(base.id, base);
    hymnNumberBaseMap.set(base.hymn_number, base);
  }

  // Build sorted base list — sort once
  sortedBases = Array.from(hymnBaseMap.values()).sort(
    (a, b) => a.hymn_number - b.hymn_number
  );

  initialised = true;
}

/**
 * getHymn — O(1) lookup by id, resolved for the given language.
 * Returns null if the id does not exist.
 */
function getHymn(id: string, language: AppLanguage = DEFAULT_LANGUAGE): HymnRecord | null {
  assertInitialised('getHymn');
  const base = hymnBaseMap.get(id);
  if (!base) return null;
  return buildHymnRecord(base, language);
}

/**
 * getHymnByNumber — O(1) lookup by hymn_number, resolved for the given language.
 * Returns null if the number does not exist.
 * Primary in-service search path (US-01).
 */
function getHymnByNumber(n: number, language: AppLanguage = DEFAULT_LANGUAGE): HymnRecord | null {
  assertInitialised('getHymnByNumber');
  const base = hymnNumberBaseMap.get(n);
  if (!base) return null;
  return buildHymnRecord(base, language);
}

/**
 * getAllHymns — Returns all hymns sorted by hymn_number ASC,
 * resolved for the given language.
 *
 * RULE: Never call this inside a render function.
 * Call once in useHymnList and memoize with useMemo.
 */
function getAllHymns(language: AppLanguage = DEFAULT_LANGUAGE): HymnRecord[] {
  assertInitialised('getAllHymns');
  return sortedBases.map((base) => buildHymnRecord(base, language));
}

/**
 * getCategoriesForLanguage — Returns unique category strings for the given
 * language, derived dynamically from corpus. NEVER hardcode these.
 */
function getCategoriesForLanguage(language: AppLanguage = DEFAULT_LANGUAGE): string[] {
  assertInitialised('getCategoriesForLanguage');
  const categorySet = new Set<string>();
  for (const base of sortedBases) {
    categorySet.add(resolveBilingual(base.categories, language));
  }
  return Array.from(categorySet).sort();
}

/**
 * getCategories — Backward-compatible alias for getCategoriesForLanguage('en').
 * Returns English category strings.
 */
function getCategories(): string[] {
  return getCategoriesForLanguage(DEFAULT_LANGUAGE);
}

/**
 * getHymnsByCategory — Returns hymns in a specific category (language-aware).
 * The category string must match the resolved category for the given language.
 */
function getHymnsByCategory(
  category: string,
  language: AppLanguage = DEFAULT_LANGUAGE
): HymnRecord[] {
  assertInitialised('getHymnsByCategory');
  return sortedBases
    .filter((base) => resolveBilingual(base.categories, language) === category)
    .map((base) => buildHymnRecord(base, language));
}

/**
 * isInitialised — Returns whether init() has been called.
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
  getCategoriesForLanguage,
  getHymnsByCategory,
  isInitialised,
} as const;
