// FILE PATH: constants/theme.ts
// PURPOSE: All colour tokens for the CHGEM Hymn Book application.
// Source of truth: PRD Section 15.4 Colour Token System.
//
// RULES:
//   - NEVER hardcode colours in components. Always import from this file.
//   - Every colour must exist in both 'light' and 'dark' palettes.
//   - Dark palette is NOT an auto-inversion of light — it is validated independently.
//   - Minimum contrast: WCAG AA 4.5:1 for all text/background combinations.


// ─── Token Shape ──────────────────────────────────────────────────────────────

export interface ThemeColours {
  // Backgrounds
  background: {
    primary: string;    // All screen backgrounds
    secondary: string;  // List rows · cards · input fields
    header: string;     // Blue banner header
    card: string;       // Stanza cards
  };
  // Text
  text: {
    primary: string;    // Hymn lyrics · list titles
    secondary: string;  // Metadata · timestamps · stanza labels
    onHeader: string;   // Text on blue banner
    muted: string;      // Placeholder text · captions
  };
  // Interactive
  accent: {
    primary: string;    // Buttons · active states · filled heart
    secondary: string;  // Secondary actions
  };
  // Stanza-specific
  stanza: {
    chorusBackground: string;  // Chorus tinted background
    bridgeBorder: string;      // Bridge left accent border
    verseBackground: string;   // Verse card background
    labelChorus: string;       // "CHORUS" label colour
    labelBridge: string;       // "BRIDGE" label colour
  };
  // UI
  border: {
    default: string;    // Dividers · card borders
    input: string;      // Search bar border
  };
  // Drawer
  drawer: {
    background: string;
    itemActive: string;
    itemText: string;
    badgeBackground: string;
    badgeText: string;
    headerBackground: string;
  };
  // Status
  status: {
    offline: string;    // Offline badge background
    offlineText: string;
  };
}

// ─── Light Palette ────────────────────────────────────────────────────────────

const light: ThemeColours = {
  background: {
    primary:   '#FFFFFF',
    secondary: '#F4F6F9',
    header:    '#1A3C5E',
    card:      '#F4F6F9',
  },
  text: {
    primary:   '#1A1A2E',
    secondary: '#5A7A9A',
    onHeader:  '#FFFFFF',
    muted:     '#8A9BAD',
  },
  accent: {
    primary:   '#2E75B6',
    secondary: '#E8A020',
  },
  stanza: {
    chorusBackground: '#EFF5FB',
    bridgeBorder:     '#2E75B6',
    verseBackground:  '#F4F6F9',
    labelChorus:      '#E8A020',
    labelBridge:      '#2E75B6',
  },
  border: {
    default: '#DDE4ED',
    input:   '#BDD0E0',
  },
  drawer: {
    background:       '#FFFFFF',
    itemActive:       '#EFF5FB',
    itemText:         '#1A1A2E',
    badgeBackground:  '#E8A020',
    badgeText:        '#FFFFFF',
    headerBackground: '#1A3C5E',
  },
  status: {
    offline:     '#E8F5EE',
    offlineText: '#1A7A4A',
  },
};

// ─── Dark Palette ─────────────────────────────────────────────────────────────
// Validated independently — not auto-inverted from light.

const dark: ThemeColours = {
  background: {
    primary:   '#121212',
    secondary: '#1E1E2E',
    header:    '#0F2035',
    card:      '#1E1E2E',
  },
  text: {
    primary:   '#E8EEF4',
    secondary: '#8AAAC8',
    onHeader:  '#FFFFFF',
    muted:     '#5A7A9A',
  },
  accent: {
    primary:   '#4A9FD4',
    secondary: '#E8A020',
  },
  stanza: {
    chorusBackground: '#1A2A3A',
    bridgeBorder:     '#4A9FD4',
    verseBackground:  '#252535',
    labelChorus:      '#E8A020',
    labelBridge:      '#4A9FD4',
  },
  border: {
    default: '#2A3A4A',
    input:   '#2E4057',
  },
  drawer: {
    background:       '#0D0D1A',
    itemActive:       '#1A2A3A',
    itemText:         '#C8D8E8',
    badgeBackground:  '#E8A020',
    badgeText:        '#FFFFFF',
    headerBackground: '#0F2035',
  },
  status: {
    offline:     '#1A2A1A',
    offlineText: '#4ABA7A',
  },
};

// ─── Theme Map ────────────────────────────────────────────────────────────────

export const themes: Record<'light' | 'dark', ThemeColours> = { light, dark };

/**
 * getThemeColours — Returns the correct colour set for a resolved theme mode.
 * Pass 'light' or 'dark' — never 'system' (resolve 'system' before calling).
 */
export function getThemeColours(resolvedTheme: 'light' | 'dark'): ThemeColours {
  return themes[resolvedTheme];
}

// ─── Brand Colours (static — never change with theme) ─────────────────────────

export const BRAND = {
  primary:   '#1A3C5E',
  accent:    '#2E75B6',
  orange:    '#E8A020',
  white:     '#FFFFFF',
} as const;
