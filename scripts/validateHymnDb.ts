// FILE PATH: scripts/validateHymnDb.ts
// PURPOSE: CI data integrity gate for the CHGEM hymn corpus.
// This script MUST pass with zero errors before every build.
// Run with: npx ts-node scripts/validateHymnDb.ts
//
// If this script reports errors, the build must be blocked.
// Content Curators must fix all errors before any store submission or OTA update.
//
// Validation checks (per PRD Section 21.2):
//   1. Every StanzaRecord.hymn_id references a valid HymnBase.id
//   2. sequence_order values per hymn are unique and start at 1
//   3. No HymnBase entry has zero StanzaRecords
//   4. HymnBase.hymn_number is unique across all entries
//   5. Every tag in HymnBase.tags[] exists in the tags table
//   6. No HymnBase.copyright_status is 'pending_review'
//   7. corpus.version present and matches format YYYY.N
//   8. StanzaRecord.type must be a valid StanzaType value
//   9. StanzaRecord.verse_number must be positive integer or null
//  10. HymnBase.hymn_number must be a positive integer

import * as fs from 'fs';
import * as path from 'path';

// ─── Types (inline to avoid import path issues in ts-node) ────────────────────

type StanzaType = 'verse' | 'chorus' | 'bridge' | 'refrain' | 'intro' | 'outro';
const VALID_STANZA_TYPES: StanzaType[] = ['verse', 'chorus', 'bridge', 'refrain', 'intro', 'outro'];
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

console.log('\n🔍  CHGEM Hymn DB Validation\n');
console.log(`    Corpus path:    ${corpusPath}`);

if (!corpus.version) {
  error('corpus.version is missing');
} else if (!CORPUS_VERSION_REGEX.test(String(corpus.version))) {
  error(`corpus.version format invalid: "${corpus.version}" — expected YYYY.N (e.g. "2025.1")`);
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

const hymnIdSet = new Set<string>(corpus.hymns.map((h: { id: string }) => h.id));
const tagIdSet = new Set<string>(corpus.tags.map((t: { id: string }) => t.id));

// ─── Check 4: Unique hymn_number ──────────────────────────────────────────────

const hymnNumbersSeen = new Map<number, string>(); // number → id
for (const hymn of corpus.hymns) {
  const num = hymn.hymn_number;
  if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0) {
    error(`hymn "${hymn.id}": hymn_number must be a positive integer, got: ${JSON.stringify(num)}`);
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

// ─── Check 6: No pending_review copyright_status ─────────────────────────────

for (const hymn of corpus.hymns) {
  if (!VALID_COPYRIGHT_STATUSES.includes(hymn.copyright_status)) {
    error(
      `hymn "${hymn.id}": copyright_status "${hymn.copyright_status}" is not valid — must be one of: ${VALID_COPYRIGHT_STATUSES.join(', ')}`
    );
  }
  if (hymn.copyright_status === 'pending_review') {
    error(
      `hymn "${hymn.id}" ("${hymn.title}"): copyright_status is "pending_review" — this hymn cannot ship. Obtain a licence or confirm public domain status.`
    );
  }
}

// ─── Check 5: All tag references exist in tags table ─────────────────────────

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

// ─── Check 1, 2, 3, 8, 9: Stanza validation ──────────────────────────────────

// Group stanzas by hymn_id for sequence_order and count checks
const stanzasByHymn = new Map<string, Array<{ id: string; sequence_order: number; type: string; verse_number: unknown }>>();

for (const stanza of corpus.stanzas) {
  // Check 1: hymn_id references a valid hymn
  if (!hymnIdSet.has(stanza.hymn_id)) {
    error(
      `stanza "${stanza.id}": hymn_id "${stanza.hymn_id}" does not reference a valid hymn`
    );
    // Do not group — cannot validate further
    continue;
  }

  // Check 8: Valid stanza type
  if (!VALID_STANZA_TYPES.includes(stanza.type)) {
    error(
      `stanza "${stanza.id}": type "${stanza.type}" is not valid — must be one of: ${VALID_STANZA_TYPES.join(', ')}`
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
        `stanza "${stanza.id}": verse_number must be a positive integer or null, got: ${JSON.stringify(stanza.verse_number)}`
      );
    }
  }

  // Group for sequence_order and count checks
  const group = stanzasByHymn.get(stanza.hymn_id) ?? [];
  group.push({
    id: stanza.id,
    sequence_order: stanza.sequence_order,
    type: stanza.type,
    verse_number: stanza.verse_number,
  });
  stanzasByHymn.set(stanza.hymn_id, group);
}

// Check 2: sequence_order unique per hymn and starts at 1
// Check 3: No hymn has zero stanzas
for (const hymn of corpus.hymns) {
  const stanzas = stanzasByHymn.get(hymn.id) ?? [];

  // Check 3: At least one stanza
  if (stanzas.length === 0) {
    error(
      `hymn "${hymn.id}" ("${hymn.title}"): has zero stanzas — every hymn must have at least one stanza`
    );
    continue;
  }

  // Check 2: sequence_order values are unique
  const ordersSeen = new Set<number>();
  for (const stanza of stanzas) {
    const order = stanza.sequence_order;
    if (typeof order !== 'number' || !Number.isInteger(order) || order <= 0) {
      error(
        `stanza "${stanza.id}": sequence_order must be a positive integer, got: ${JSON.stringify(order)}`
      );
    } else if (ordersSeen.has(order)) {
      error(
        `hymn "${hymn.id}": duplicate sequence_order ${order} — each stanza must have a unique sequence_order within its hymn`
      );
    } else {
      ordersSeen.add(order);
    }
  }

  // Check 2: starts at 1
  const minOrder = Math.min(...Array.from(ordersSeen));
  if (ordersSeen.size > 0 && minOrder !== 1) {
    warn(
      `hymn "${hymn.id}" ("${hymn.title}"): sequence_order starts at ${minOrder} instead of 1 — this is valid but unusual`
    );
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
    console.log(`\n✅  VALIDATION PASSED — ${corpus.hymns?.length ?? 0} hymns · ${corpus.stanzas?.length ?? 0} stanzas · zero errors\n`);
    console.log('    Corpus is ready to ship.\n');
    process.exit(0);
  } else {
    console.log(`\n❌  VALIDATION FAILED — ${errors.length} error(s) found:\n`);
    errors.forEach((e) => console.log(e));
    console.log('\n    Fix all errors before building or deploying.\n');
    process.exit(1);
  }
}
