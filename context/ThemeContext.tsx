// FILE PATH: context/ThemeContext.tsx

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { ThemeColours, themes } from '@/constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  colorScheme: 'light' | 'dark';
  themeMode: ThemeMode;
  colors: ThemeColours;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useSystemColorScheme() ?? 'light';
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  const colorScheme: 'light' | 'dark' =
    themeMode === 'system' ? systemColorScheme : themeMode;

  const colors: ThemeColours = themes[colorScheme];

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
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