// FILE PATH: constants/theme.ts

export interface ThemeColorPalette {
  background: {
    primary: string;
    secondary: string;
    header: string;
    card: string;
    input: string;
  };
  text: {
    primary: string;
    secondary: string;
    onHeader: string;
    onAccent: string;
    muted: string;
  };
  accent: {
    primary: string;
    secondary: string;
    warm: string;
  };
  stanza: {
    chorusBackground: string;
    bridgeBorder: string;
    verseBackground: string;
  };
  border: {
    default: string;
    strong: string;
  };
  icon: {
    default: string;
    active: string;
    onHeader: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
  };
}

const lightColors: ThemeColorPalette = {
  background: {
    primary: '#FFFFFF',
    secondary: '#F4F6F9',
    header: '#1A3C5E',
    card: '#EAEEF4',
    input: '#F0F4F8',
  },
  text: {
    primary: '#1A1A2E',
    secondary: '#5A7A9A',
    onHeader: '#FFFFFF',
    onAccent: '#FFFFFF',
    muted: '#8A9AB0',
  },
  accent: {
    primary: '#2E75B6',
    secondary: '#4A9FD4',
    warm: '#E8A020',
  },
  stanza: {
    chorusBackground: '#EFF5FB',
    bridgeBorder: '#2E75B6',
    verseBackground: '#F8FAFC',
  },
  border: {
    default: '#DDE4ED',
    strong: '#B0C4D8',
  },
  icon: {
    default: '#5A7A9A',
    active: '#2E75B6',
    onHeader: '#FFFFFF',
  },
  status: {
    success: '#1A7A4A',
    warning: '#A05800',
    error: '#8B1A1A',
  },
};

const darkColors: ThemeColorPalette = {
  background: {
    primary: '#121212',
    secondary: '#1E1E2E',
    header: '#0F2035',
    card: '#252535',
    input: '#1A1A2A',
  },
  text: {
    primary: '#E8EEF4',
    secondary: '#8AAAC8',
    onHeader: '#FFFFFF',
    onAccent: '#FFFFFF',
    muted: '#5A7A9A',
  },
  accent: {
    primary: '#4A9FD4',
    secondary: '#6AB8E8',
    warm: '#E8A020',
  },
  stanza: {
    chorusBackground: '#1A2A3A',
    bridgeBorder: '#4A9FD4',
    verseBackground: '#1A1A2A',
  },
  border: {
    default: '#2A3A4A',
    strong: '#3A5A7A',
  },
  icon: {
    default: '#8AAAC8',
    active: '#4A9FD4',
    onHeader: '#FFFFFF',
  },
  status: {
    success: '#2AAA6A',
    warning: '#D4840A',
    error: '#CC4A4A',
  },
};

export const Colors: Record<'light' | 'dark', ThemeColorPalette> = {
  light: lightColors,
  dark: darkColors,
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = ThemeColorPalette;



















/* // FILE PATH: constants/theme.ts
// PURPOSE: All colour tokens for light and dark themes.
// RULE: No screen or component ever uses a hardcoded colour.
// RULE: Always import from this file.

export const Colors = {
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F4F6F9',
      header: '#1A3C5E',
      card: '#EAEEF4',
      input: '#F0F4F8',
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#5A7A9A',
      onHeader: '#FFFFFF',
      onAccent: '#FFFFFF',
      muted: '#8A9AB0',
    },
    accent: {
      primary: '#2E75B6',
      secondary: '#4A9FD4',
      warm: '#E8A020',       // orange — matches screenshots
    },
    stanza: {
      chorusBackground: '#EFF5FB',
      bridgeBorder: '#2E75B6',
      verseBackground: '#F8FAFC',
    },
    border: {
      default: '#DDE4ED',
      strong: '#B0C4D8',
    },
    icon: {
      default: '#5A7A9A',
      active: '#2E75B6',
      onHeader: '#FFFFFF',
    },
    status: {
      success: '#1A7A4A',
      warning: '#A05800',
      error: '#8B1A1A',
    },
  },
  dark: {
    background: {
      primary: '#121212',
      secondary: '#1E1E2E',
      header: '#0F2035',
      card: '#252535',
      input: '#1A1A2A',
    },
    text: {
      primary: '#E8EEF4',
      secondary: '#8AAAC8',
      onHeader: '#FFFFFF',
      onAccent: '#FFFFFF',
      muted: '#5A7A9A',
    },
    accent: {
      primary: '#4A9FD4',
      secondary: '#6AB8E8',
      warm: '#E8A020',       // orange — consistent across themes
    },
    stanza: {
      chorusBackground: '#1A2A3A',
      bridgeBorder: '#4A9FD4',
      verseBackground: '#1A1A2A',
    },
    border: {
      default: '#2A3A4A',
      strong: '#3A5A7A',
    },
    icon: {
      default: '#8AAAC8',
      active: '#4A9FD4',
      onHeader: '#FFFFFF',
    },
    status: {
      success: '#2AAA6A',
      warning: '#D4840A',
      error: '#CC4A4A',
    },
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ThemeColors = typeof Colors.light; */