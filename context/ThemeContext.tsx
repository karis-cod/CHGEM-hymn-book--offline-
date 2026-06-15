// FILE PATH: context/ThemeContext.tsx
// PURPOSE: Resolves and distributes the active colour palette.
//
// PHASE 4 CHANGES:
//   - ThemeMode is now imported from types/settings (the canonical definition
//     used by UserSettings.theme) instead of being redefined locally.
//     Re-exported here for backward compatibility with any file that does
//     `import type { ThemeMode } from '../context/ThemeContext'`.
//   - ThemeProvider accepts `initialThemeMode` (loaded once at startup in
//     app/_layout.tsx) so the stored override is respected from first render.
//   - setThemeMode now persists the choice to AsyncStorage, merging with the
//     current stored settings object.

import React, { createContext, useCallback, useContext, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { ThemeColours, themes } from '@/constants/theme';
import { storageService } from '../services/storageService';
import type { ThemeMode } from '../types/settings';

export type { ThemeMode };

interface ThemeContextValue {
  colorScheme: 'light' | 'dark';
  themeMode: ThemeMode;
  colors: ThemeColours;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  /** Loaded once in app/_layout.tsx via storageService.loadSettings().theme */
  initialThemeMode?: ThemeMode;
}

export function ThemeProvider({ children, initialThemeMode = 'system' }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme() ?? 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode);

  const colorScheme: 'light' | 'dark' =
    themeMode === 'system' ? systemColorScheme : themeMode;

  const colors: ThemeColours = themes[colorScheme];

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    void (async () => {
      const current = await storageService.loadSettings();
      await storageService.saveSettings({ ...current, theme: mode });
    })();
  }, []);

  const value: ThemeContextValue = {
    colorScheme,
    themeMode,
    colors,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}