// FILE PATH: constants/layout.ts
// PURPOSE: Layout and spacing constants for the CHGEM Hymn Book application.
// Source of truth: PRD Sections 15.1, 16.2, 29.6.
//
// RULES:
//   - NEVER hardcode pixel values in components. Always import from this file.
//   - LIST_ITEM_HEIGHT must match exactly in both HymnListItem and getItemLayout.
//   - TOUCH_TARGET_MIN ensures WCAG 2.5.5 compliance on all interactive elements.

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * LIST_ITEM_HEIGHT — Fixed height for every HymnListItem row.
 * Must be used in both the component style AND FlatList.getItemLayout.
 * Any mismatch causes incorrect scroll position calculation.
 * PRD Section 16.2: "getItemLayout with fixed height LIST_ITEM_HEIGHT=64"
 */
export const LIST_ITEM_HEIGHT = 64;

/**
 * CATEGORY_ITEM_HEIGHT — Fixed height for category list rows.
 */
export const CATEGORY_ITEM_HEIGHT = 56;

// ─── Accessibility ────────────────────────────────────────────────────────────

/**
 * TOUCH_TARGET_MIN — Minimum touch target dimension.
 * PRD Section 15.1: "WCAG 2.5.5 — 44×44pt — minWidth:44 minHeight:44 on all Pressable"
 */
export const TOUCH_TARGET_MIN = 44;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────

export const BORDER_RADIUS = {
  sm:   4,
  md:   8,
  lg:   12,
  pill: 999,
} as const;

// ─── Header ───────────────────────────────────────────────────────────────────

/**
 * HEADER_HEIGHT — Height of the animated banner on list screens.
 * Collapses partially on scroll per PRD Section 14.4.
 */
export const HEADER_HEIGHT = 180;

/**
 * HEADER_COLLAPSED_HEIGHT — Height of the banner after scroll-collapse.
 */
export const HEADER_COLLAPSED_HEIGHT = 60;

// ─── Stanza ───────────────────────────────────────────────────────────────────

/**
 * CHORUS_INDENT — Left indent for chorus stanzas.
 * PRD Section 15.3: "Italic · 16pt left indent"
 */
export const CHORUS_INDENT = 16;

/**
 * BRIDGE_BORDER_WIDTH — Left accent border width for bridge stanzas.
 * PRD Section 15.3: "4pt left accent border"
 */
export const BRIDGE_BORDER_WIDTH = 4;

// ─── Icon Sizes ───────────────────────────────────────────────────────────────

export const ICON_SIZE = {
  sm:  16,
  md:  22,
  lg:  28,
  xl:  36,
} as const;

// ─── Z-Index ──────────────────────────────────────────────────────────────────

export const Z_INDEX = {
  base:    0,
  card:    1,
  header:  10,
  overlay: 100,
  modal:   200,
} as const;
