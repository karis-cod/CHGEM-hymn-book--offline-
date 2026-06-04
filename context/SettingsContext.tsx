// FILE PATH: context/SettingsContext.tsx
// PURPOSE: Distributes font size, language, and UI preferences.
// AsyncStorage persistence added in Phase 4.

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FontSizeStep } from '@/constants/typography';

interface SettingsContextValue {
  fontSize: FontSizeStep;
  language: string;
  showVerseNumbers: boolean;
  keepScreenOn: boolean;
  hapticFeedback: boolean;
  setFontSize: (size: FontSizeStep) => void;
  setLanguage: (lang: string) => void;
  setShowVerseNumbers: (show: boolean) => void;
  setKeepScreenOn: (keep: boolean) => void;
  setHapticFeedback: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [fontSize, setFontSizeState] = useState<FontSizeStep>('md');
  const [language, setLanguageState] = useState<string>('en');
  const [showVerseNumbers, setShowVerseNumbersState] = useState<boolean>(true);
  const [keepScreenOn, setKeepScreenOnState] = useState<boolean>(false);
  const [hapticFeedback, setHapticFeedbackState] = useState<boolean>(true);

  const setFontSize = useCallback((size: FontSizeStep) => {
    setFontSizeState(size);
    // AsyncStorage persistence added in Phase 4
  }, []);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
  }, []);

  const setShowVerseNumbers = useCallback((show: boolean) => {
    setShowVerseNumbersState(show);
  }, []);

  const setKeepScreenOn = useCallback((keep: boolean) => {
    setKeepScreenOnState(keep);
  }, []);

  const setHapticFeedback = useCallback((enabled: boolean) => {
    setHapticFeedbackState(enabled);
  }, []);

  const value: SettingsContextValue = {
    fontSize,
    language,
    showVerseNumbers,
    keepScreenOn,
    hapticFeedback,
    setFontSize,
    setLanguage,
    setShowVerseNumbers,
    setKeepScreenOn,
    setHapticFeedback,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}