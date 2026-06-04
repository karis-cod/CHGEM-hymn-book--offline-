// FILE PATH: constants/layout.ts
// PURPOSE: All layout constants. Spacing, touch targets, radii, heights.
// RULE: No screen or component ever uses a magic number.

export const Layout = {
  // Touch targets — WCAG 2.5.5 minimum 44×44pt
  TOUCH_TARGET_MIN: 44,

  // FlatList — MUST be fixed for getItemLayout performance
  LIST_ITEM_HEIGHT: 72,         // slightly taller than PRD 64pt to match screenshot cards
  LIST_ITEM_SEPARATOR: 1,

  // Banner header height (music notes background — seen in all screenshots)
  BANNER_HEIGHT: 220,

  // Spacing scale
  SPACING: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius
  RADIUS: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },

  // Card / list item padding
  CARD_PADDING_H: 16,
  CARD_PADDING_V: 14,

  // Stanza indentation for chorus
  CHORUS_INDENT: 16,

  // Bridge left border width
  BRIDGE_BORDER_WIDTH: 4,

  // Safe minimum for HitSlop on small icons
  HIT_SLOP: { top: 10, bottom: 10, left: 10, right: 10 },
} as const;