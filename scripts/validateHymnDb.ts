// FILE PATH: scripts/validateHymnDb.ts
// PURPOSE: CI data integrity gate for the CHGEM bilingual hymn corpus.
// This script MUST pass with zero errors before every build.
// Run with: npx ts-node scripts/validateHymnDb.ts
//
// BILINGUAL UPDATE from Phase 2:
//   - Hymns now have 'titles' (BilingualText) instead of 'title' (string).
//   - Hymns now have 'categories' (BilingualText) instead of 'category' (string).
//   - Stanzas now have a 'language' field ('en' | 'yo').
//   - sequence_order uniqueness is now scoped per (hymn_id + language), not globally per hymn_id.
//   - Tags now have 'labels' (BilingualText) instead of 'label' (string).
//   - New checks added for bilingual field completeness.
//   - 'available_languages' field on hymns is validated.
//
// Validation checks:
//   1.  Every stanza.hymn_id references a valid hymn.id
//   2.  sequence_order unique per (hymn_id + language), starts at 1 per language
//   3.  Every hymn has at least one English stanza
//   4.  hymn.hymn_number is a positive integer, unique across all hymns
//   5.  Every tag id in hymn.tags[] exists in the tags table
//   6.  No hymn has copyright_status 'pending_review'
//   7.  corpus.version present and matches YYYY.N format
//   8.  stanza.type is a valid StanzaType value
//   9.  stanza.verse_number is a positive integer or null
//   10. stanza.language is 'en' or 'yo'
//   11. hymn.titles has non-empty 'en' value
//   12. hymn.categories has non-empty 'en' value
//   13. tag.labels has non-empty 'en' value
//   14. hymn.available_languages includes 'en' and matches actual stanza languages
//   15. No stanza has duplicate id across the entire corpus

import * as fs from 'fs';
import * as path from 'path';

// ─── Constants ────────────────────────────────────────────────────────────────

type StanzaType = 'verse' | 'chorus' | 'bridge' | 'refrain' | 'intro' | 'outro';
type AppLanguage = 'en' | 'yo';

const VALID_STANZA_TYPES: StanzaType[] = [
  'verse', 'chorus', 'bridge', 'refrain', 'intro', 'outro',
];
const VALID_LANGUAGES: AppLanguage[] = ['en', 'yo'];
const VALID_COPYRIGHT_STATUSES = ['public_domain', 'licensed', 'pending_review'] as const;
const CORPUS_VERSION_REGEX = /^\d{4}\.\d+$/;

// ─── Load Corpus ──────────────────────────────────────────────────────────────

const corpusPath = path.resolve(__dirname, '../assets/data/hymns.json');

if (!fs.existsSync(corpusPath)) {
  console.error(`\n❌  FATAL: Corpus file not found at: ${corpusPath}`);
  console.error('    Create assets/data/hymns.json before running validation.\n');
  process.exit(1);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const corpus = require(corpusPath);

// ─── Validation State ─────────────────────────────────────────────────────────

const errors: string[] = [];
const warnings: string[] = [];

function error(message: string): void {
  errors.push(`  ❌  ${message}`);
}

function warn(message: string): void {
  warnings.push(`  ⚠️   ${message}`);
}

// ─── Check 7: Corpus Version ──────────────────────────────────────────────────

console.log('\n🔍  CHGEM Hymn DB Validation (Bilingual)\n');
console.log(`    Corpus path:    ${corpusPath}`);

if (!corpus.version) {
  error('corpus.version is missing');
} else if (!CORPUS_VERSION_REGEX.test(String(corpus.version))) {
  error(
    `corpus.version format invalid: "${corpus.version}" — expected YYYY.N (e.g. "2025.1")`
  );
} else {
  console.log(`    Corpus version: ${corpus.version}`);
  console.log(`    Generated:      ${corpus.generated ?? 'not set'}`);
}

// ─── Basic Structure Checks ───────────────────────────────────────────────────

if (!Array.isArray(corpus.hymns)) {
  error('corpus.hymns is not an array — aborting further validation');
  printResultsAndExit();
}
if (!Array.isArray(corpus.stanzas)) {
  error('corpus.stanzas is not an array — aborting further validation');
  printResultsAndExit();
}
if (!Array.isArray(corpus.tags)) {
  error('corpus.tags is not an array — aborting further validation');
  printResultsAndExit();
}
if (!Array.isArray(corpus.authors)) {
  warn('corpus.authors is not an array — author data will not resolve');
}

console.log(`\n    Hymns:    ${corpus.hymns.length}`);
console.log(`    Stanzas:  ${corpus.stanzas.length}`);
console.log(`    Authors:  ${Array.isArray(corpus.authors) ? corpus.authors.length : 0}`);
console.log(`    Tags:     ${corpus.tags.length}`);
console.log('');

// ─── Build Lookup Sets ────────────────────────────────────────────────────────

const hymnIdSet = new Set<string>(
  corpus.hymns.map((h: { id: string }) => h.id)
);
const tagIdSet = new Set<string>(
  corpus.tags.map((t: { id: string }) => t.id)
);

// ─── Check 4: Unique hymn_number + positive integer ───────────────────────────

const hymnNumbersSeen = new Map<number, string>(); // hymn_number → id
for (const hymn of corpus.hymns) {
  const num = hymn.hymn_number;
  if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0) {
    error(
      `hymn "${hymn.id}": hymn_number must be a positive integer, got: ${JSON.stringify(num)}`
    );
    continue;
  }
  if (hymnNumbersSeen.has(num)) {
    error(
      `Duplicate hymn_number ${num}: found in both "${hymnNumbersSeen.get(num)}" and "${hymn.id}"`
    );
  } else {
    hymnNumbersSeen.set(num, hymn.id);
  }
}

// ─── Check 6: No pending_review ──────────────────────────────────────────────

for (const hymn of corpus.hymns) {
  if (!VALID_COPYRIGHT_STATUSES.includes(hymn.copyright_status)) {
    error(
      `hymn "${hymn.id}": copyright_status "${hymn.copyright_status}" is not valid — ` +
        `must be one of: ${VALID_COPYRIGHT_STATUSES.join(', ')}`
    );
  }
  if (hymn.copyright_status === 'pending_review') {
    const title = hymn.titles?.en ?? hymn.id;
    error(
      `hymn "${hymn.id}" ("${title}"): copyright_status is "pending_review" — ` +
        'this hymn cannot ship. Obtain a licence or confirm public domain status.'
    );
  }
}

// ─── Check 5: Tag references exist ───────────────────────────────────────────

for (const hymn of corpus.hymns) {
  if (!Array.isArray(hymn.tags)) {
    error(`hymn "${hymn.id}": tags field is not an array`);
    continue;
  }
  for (const tagId of hymn.tags) {
    if (!tagIdSet.has(tagId)) {
      error(`hymn "${hymn.id}": tag "${tagId}" does not exist in the tags table`);
    }
  }
}

// ─── Check 11: hymn.titles has non-empty English value ───────────────────────

for (const hymn of corpus.hymns) {
  if (typeof hymn.titles !== 'object' || hymn.titles === null) {
    error(`hymn "${hymn.id}": "titles" must be an object { en, yo }, got: ${JSON.stringify(hymn.titles)}`);
  } else {
    if (!hymn.titles.en || String(hymn.titles.en).trim() === '') {
      error(`hymn "${hymn.id}": titles.en must be a non-empty string`);
    }
    if (hymn.titles.yo === undefined) {
      warn(`hymn "${hymn.id}": titles.yo is missing — will fall back to English title`);
    }
  }
}

// ─── Check 12: hymn.categories has non-empty English value ───────────────────

for (const hymn of corpus.hymns) {
  if (typeof hymn.categories !== 'object' || hymn.categories === null) {
    error(
      `hymn "${hymn.id}": "categories" must be an object { en, yo }, got: ${JSON.stringify(hymn.categories)}`
    );
  } else {
    if (!hymn.categories.en || String(hymn.categories.en).trim() === '') {
      error(`hymn "${hymn.id}": categories.en must be a non-empty string`);
    }
    if (hymn.categories.yo === undefined) {
      warn(`hymn "${hymn.id}": categories.yo is missing — will fall back to English category`);
    }
  }
}

// ─── Check 14: available_languages is valid ───────────────────────────────────

for (const hymn of corpus.hymns) {
  if (!Array.isArray(hymn.available_languages)) {
    error(`hymn "${hymn.id}": "available_languages" must be an array`);
    continue;
  }
  if (!hymn.available_languages.includes('en')) {
    error(`hymn "${hymn.id}": available_languages must always include 'en'`);
  }
  for (const lang of hymn.available_languages) {
    if (!VALID_LANGUAGES.includes(lang)) {
      error(`hymn "${hymn.id}": available_languages contains unknown language "${lang}"`);
    }
  }
}

// ─── Check 13: tag.labels has non-empty English value ────────────────────────

for (const tag of corpus.tags) {
  if (typeof tag.labels !== 'object' || tag.labels === null) {
    error(
      `tag "${tag.id}": "labels" must be an object { en, yo }, got: ${JSON.stringify(tag.labels)}`
    );
  } else {
    if (!tag.labels.en || String(tag.labels.en).trim() === '') {
      error(`tag "${tag.id}": labels.en must be a non-empty string`);
    }
    if (tag.labels.yo === undefined) {
      warn(`tag "${tag.id}": labels.yo is missing — will fall back to English label`);
    }
  }
}

// ─── Check 15: Globally unique stanza ids ────────────────────────────────────

const stanzaIdsSeen = new Set<string>();
for (const stanza of corpus.stanzas) {
  if (stanzaIdsSeen.has(stanza.id)) {
    error(`Duplicate stanza id: "${stanza.id}" — every stanza must have a globally unique id`);
  } else {
    stanzaIdsSeen.add(stanza.id);
  }
}

// ─── Check 1, 8, 9, 10: Per-stanza validation ────────────────────────────────
//     Stanzas are grouped by (hymn_id + language) for sequence_order checks.

// Map: hymn_id → language → stanza[]
const stanzasByHymnAndLang = new Map<
  string,
  Map<string, Array<{ id: string; sequence_order: number; type: string; verse_number: unknown }>>
>();

for (const stanza of corpus.stanzas) {
  // Check 1: hymn_id references a valid hymn
  if (!hymnIdSet.has(stanza.hymn_id)) {
    error(
      `stanza "${stanza.id}": hymn_id "${stanza.hymn_id}" does not reference a valid hymn`
    );
    continue; // Cannot group — skip further checks for this stanza
  }

  // Check 8: Valid stanza type
  if (!VALID_STANZA_TYPES.includes(stanza.type)) {
    error(
      `stanza "${stanza.id}": type "${stanza.type}" is not valid — ` +
        `must be one of: ${VALID_STANZA_TYPES.join(', ')}`
    );
  }

  // Check 9: verse_number is positive integer or null
  if (stanza.verse_number !== null) {
    if (
      typeof stanza.verse_number !== 'number' ||
      !Number.isInteger(stanza.verse_number) ||
      stanza.verse_number <= 0
    ) {
      error(
        `stanza "${stanza.id}": verse_number must be a positive integer or null, ` +
          `got: ${JSON.stringify(stanza.verse_number)}`
      );
    }
  }

  // Check 10: language field is valid
  if (!VALID_LANGUAGES.includes(stanza.language)) {
    error(
      `stanza "${stanza.id}": language "${stanza.language}" is not valid — ` +
        `must be one of: ${VALID_LANGUAGES.join(', ')}`
    );
  }

  // Group by (hymn_id → language) for sequence_order check
  if (!stanzasByHymnAndLang.has(stanza.hymn_id)) {
    stanzasByHymnAndLang.set(stanza.hymn_id, new Map());
  }
  const langMap = stanzasByHymnAndLang.get(stanza.hymn_id)!;
  const lang = stanza.language ?? 'unknown';
  if (!langMap.has(lang)) {
    langMap.set(lang, []);
  }
  langMap.get(lang)!.push({
    id: stanza.id,
    sequence_order: stanza.sequence_order,
    type: stanza.type,
    verse_number: stanza.verse_number,
  });
}

// ─── Check 2 + 3: sequence_order per (hymn_id + language) + English stanzas ──

for (const hymn of corpus.hymns) {
  const langMap = stanzasByHymnAndLang.get(hymn.id);
  const hymnTitle = hymn.titles?.en ?? hymn.id;

  // Check 3: Every hymn must have at least one English stanza
  const enStanzas = langMap?.get('en') ?? [];
  if (enStanzas.length === 0) {
    error(
      `hymn "${hymn.id}" ("${hymnTitle}"): has zero English stanzas — ` +
        'every hymn must have at least one English stanza'
    );
  }

  // Check 2: sequence_order unique per language, starts at 1
  if (!langMap) continue;

  for (const [lang, stanzas] of langMap.entries()) {
    if (stanzas.length === 0) continue;

    const ordersSeen = new Set<number>();
    for (const stanza of stanzas) {
      const order = stanza.sequence_order;
      if (typeof order !== 'number' || !Number.isInteger(order) || order <= 0) {
        error(
          `stanza "${stanza.id}": sequence_order must be a positive integer, ` +
            `got: ${JSON.stringify(order)}`
        );
      } else if (ordersSeen.has(order)) {
        error(
          `hymn "${hymn.id}" [${lang}]: duplicate sequence_order ${order} — ` +
            'sequence_order must be unique per hymn+language'
        );
      } else {
        ordersSeen.add(order);
      }
    }

    // Warn if doesn't start at 1 (valid but unusual)
    if (ordersSeen.size > 0) {
      const minOrder = Math.min(...Array.from(ordersSeen));
      if (minOrder !== 1) {
        warn(
          `hymn "${hymn.id}" [${lang}] ("${hymnTitle}"): sequence_order starts at ` +
            `${minOrder} instead of 1 — valid but unusual`
        );
      }
    }

    // Cross-check: if lang is in available_languages, warn if stanzas exist
    // for a language NOT listed in available_languages
    const hymnAvailableLangs: string[] = Array.isArray(hymn.available_languages)
      ? hymn.available_languages
      : [];
    if (lang !== 'unknown' && !hymnAvailableLangs.includes(lang)) {
      warn(
        `hymn "${hymn.id}": has stanzas in language "${lang}" but ` +
          `"${lang}" is not listed in available_languages`
      );
    }
  }
}

// ─── Print Results ────────────────────────────────────────────────────────────

printResultsAndExit();

function printResultsAndExit(): void {
  console.log('─'.repeat(60));

  if (warnings.length > 0) {
    console.log(`\n⚠️   WARNINGS (${warnings.length}):\n`);
    warnings.forEach((w) => console.log(w));
  }

  if (errors.length === 0) {
    console.log(
      `\n✅  VALIDATION PASSED — ${corpus.hymns?.length ?? 0} hymns · ` +
        `${corpus.stanzas?.length ?? 0} stanzas · zero errors\n`
    );
    console.log('    Corpus is ready to ship.\n');
    process.exit(0);
  } else {
    console.log(`\n❌  VALIDATION FAILED — ${errors.length} error(s) found:\n`);
    errors.forEach((e) => console.log(e));
    console.log('\n    Fix all errors before building or deploying.\n');
    process.exit(1);
  }
}
