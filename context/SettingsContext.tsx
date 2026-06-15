// FILE PATH: context/SettingsContext.tsx
// PURPOSE: Distributes font size and UI preferences. Persists to AsyncStorage.
//
// PHASE 4 CHANGES:
//   - Fixed FontSizeStep import: was '@/constants/typography' (does not exist),
//     now correctly imports from '../types/settings' (canonical source,
//     includes FONT_SIZE_SCALES).
//   - SettingsProvider now accepts `initialSettings` (loaded once at startup
//     in app/_layout.tsx) so the correct values are available on first render
//     — no flash of default 'md' before AsyncStorage resolves.
//   - All setters now persist to AsyncStorage via storageService.saveSettings(),
//     merging with the current stored object so no other fields are lost.

import React, { createContext, useCallback, useContext, useState } from 'react';

import { storageService } from '../services/storageService';
import { DEFAULT_SETTINGS } from '../types/settings';
import type { FontSizeStep, UserSettings } from '../types/settings';

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
  /** Loaded once in app/_layout.tsx via storageService.loadSettings() before splash hides. */
  initialSettings?: UserSettings;
}

export function SettingsProvider({ children, initialSettings }: SettingsProviderProps) {
  const base = initialSettings ?? DEFAULT_SETTINGS;

  const [fontSize, setFontSizeState] = useState<FontSizeStep>(base.fontSize);
  const [language, setLanguageState] = useState<string>(base.language);
  const [showVerseNumbers, setShowVerseNumbersState] = useState<boolean>(base.showVerseNumbers);
  const [keepScreenOn, setKeepScreenOnState] = useState<boolean>(base.keepScreenOn);
  const [hapticFeedback, setHapticFeedbackState] = useState<boolean>(base.hapticFeedback);

  /** Merge a partial change into the stored settings object — fire and forget. */
  const persist = useCallback((patch: Partial<UserSettings>) => {
    void (async () => {
      const current = await storageService.loadSettings();
      await storageService.saveSettings({ ...current, ...patch });
    })();
  }, []);

  const setFontSize = useCallback((size: FontSizeStep) => {
    setFontSizeState(size);
    persist({ fontSize: size });
  }, [persist]);

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    persist({ language: lang as UserSettings['language'] });
  }, [persist]);

  const setShowVerseNumbers = useCallback((show: boolean) => {
    setShowVerseNumbersState(show);
    persist({ showVerseNumbers: show });
  }, [persist]);

  const setKeepScreenOn = useCallback((keep: boolean) => {
    setKeepScreenOnState(keep);
    persist({ keepScreenOn: keep });
  }, [persist]);

  const setHapticFeedback = useCallback((enabled: boolean) => {
    setHapticFeedbackState(enabled);
    persist({ hapticFeedback: enabled });
  }, [persist]);

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