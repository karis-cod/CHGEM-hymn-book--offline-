// FILE PATH: constants/typography.ts

export const FontFamilies = {
  regular: undefined,
  bold: undefined,
  italic: undefined,
} as const;

export const FontScale = {
  xs:  { stanzaBody: 14, hymnTitle: 20, listTitle: 14, label: 11, meta: 11 },
  sm:  { stanzaBody: 15, hymnTitle: 22, listTitle: 15, label: 12, meta: 12 },
  md:  { stanzaBody: 17, hymnTitle: 24, listTitle: 16, label: 13, meta: 13 },
  lg:  { stanzaBody: 19, hymnTitle: 28, listTitle: 18, label: 14, meta: 14 },
  xl:  { stanzaBody: 22, hymnTitle: 32, listTitle: 20, label: 15, meta: 15 },
  xxl: { stanzaBody: 26, hymnTitle: 36, listTitle: 22, label: 16, meta: 16 },
} as const;

export type FontSizeStep = keyof typeof FontScale;
export type FontVariant = keyof typeof FontScale.md;



















/* // FILE PATH: constants/typography.ts
// PURPOSE: Font size scale, font families, line heights.
// RULE: No screen or component ever uses a hardcoded font size.
// RULE: Always use FontSizeStep from SettingsContext.

export const FontFamilies = {
  regular: 'Inter-Regular',
  bold: 'Inter-Bold',
  italic: 'Inter-Italic',
} as const;

// Six-step font scale — XS through XXL
// Values are base sizes. ThemedText applies these per variant.
export const FontScale = {
  xs:  { stanzaBody: 14, hymnTitle: 20, listTitle: 14, label: 11, meta: 11 },
  sm:  { stanzaBody: 15, hymnTitle: 22, listTitle: 15, label: 12, meta: 12 },
  md:  { stanzaBody: 17, hymnTitle: 24, listTitle: 16, label: 13, meta: 13 },
  lg:  { stanzaBody: 19, hymnTitle: 28, listTitle: 18, label: 14, meta: 14 },
  xl:  { stanzaBody: 22, hymnTitle: 32, listTitle: 20, label: 15, meta: 15 },
  xxl: { stanzaBody: 26, hymnTitle: 36, listTitle: 22, label: 16, meta: 16 },
} as const;

export type FontSizeStep = keyof typeof FontScale;
export type FontVariant = keyof typeof FontScale.md;

export const LineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
} as const; */