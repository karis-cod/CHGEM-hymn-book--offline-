// FILE PATH: context/LanguageContext.tsx
// PURPOSE: Global language state for the CHGEM Hymn Book application.
// Provides:
//   - currentLanguage: AppLanguage  — the active language
//   - setLanguage(lang): void       — switches language + persists to AsyncStorage
//   - t(key): string                — translate a UI string key
//   - tInterp(key, values): string  — translate with {placeholder} interpolation
//
// ARCHITECTURE:
//   - Language is stored in UserSettings (@chgem/settings) via storageService.
//   - On startup, language is loaded from storage before SplashScreen.hideAsync().
//   - All state updates are synchronous (React state); AsyncStorage write is async.
//   - No flicker: initial language is resolved from storage before first render.
//
// USAGE:
//   // In any component:
//   import { useLanguage } from '@/context/LanguageContext';
//   const { t, currentLanguage, setLanguage } = useLanguage();
//
//   // Wrap the app root in app/_layout.tsx:
//   <LanguageProvider initialLanguage={loadedLanguage}>
//     {children}
//   </LanguageProvider>

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { storageService } from '../services/storageService';
import { DEFAULT_LANGUAGE } from '../types/language';
import type { AppLanguage } from '../types/language';
import { getTranslations, interpolate } from '../locales/index';
import type { Translations } from '../locales/index';

// ─── Context Shape ────────────────────────────────────────────────────────────

interface LanguageContextValue {
  /** The currently active language. */
  currentLanguage: AppLanguage;

  /**
   * setLanguage — Switches the active language.
   * React state updates synchronously (instant UI switch, zero flicker).
   * AsyncStorage write happens in the background — never blocks the UI.
   */
  setLanguage: (language: AppLanguage) => void;

  /**
   * t — Translate a UI string key to the current language.
   * Returns the English fallback if the key is missing in the current locale.
   *
   * @example t('nav_index') → 'Index' or 'Atọka'
   */
  t: (key: keyof Translations) => string;

  /**
   * tInterp — Translate a UI string key and replace {placeholder} tokens.
   * Use for dynamic strings that contain variable content.
   *
   * @example tInterp('search_no_results', { query: 'faith' })
   *          → 'No hymns found for "faith".'
   */
  tInterp: (key: keyof Translations, values: Record<string, string>) => string;
}

// ─── Context Creation ─────────────────────────────────────────────────────────

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

interface LanguageProviderProps {
  /**
   * initialLanguage — The language loaded from AsyncStorage before first render.
   * Pass this from app/_layout.tsx after loading settings at startup.
   * Defaults to DEFAULT_LANGUAGE if omitted.
   */
  initialLanguage?: AppLanguage;
  children: React.ReactNode;
}

export function LanguageProvider({
  initialLanguage = DEFAULT_LANGUAGE,
  children,
}: LanguageProviderProps): React.JSX.Element {
  const [currentLanguage, setCurrentLanguage] = useState<AppLanguage>(initialLanguage);

  // Memoised translations object for the current language.
  // Recomputes only when currentLanguage changes — not on every render.
  const translations = useMemo(
    () => getTranslations(currentLanguage),
    [currentLanguage]
  );

  /**
   * setLanguage — Update language state synchronously, persist in background.
   * Wrapped in useCallback so it is stable across renders (safe to pass as prop).
   */
  const setLanguage = useCallback((language: AppLanguage): void => {
    // 1. Update React state immediately — instant UI switch, no flicker
    setCurrentLanguage(language);

    // 2. Persist to AsyncStorage in background — fire and forget
    //    storageService.saveSettings merges with existing settings object.
    //    We load current settings first to avoid overwriting other fields.
    void (async () => {
      try {
        const current = await storageService.loadSettings();
        await storageService.saveSettings({ ...current, language });
      } catch {
        // Silent failure — in-memory state is already updated.
        // Language will revert to stored value on next app launch,
        // but the current session remains correct.
      }
    })();
  }, []);

  /**
   * t — Translate a key. Returns the translation or the key itself as fallback.
   * Wrapped in useCallback so it is stable across renders.
   */
  const t = useCallback(
    (key: keyof Translations): string => {
      const value = translations[key];
      // This should never be undefined due to TypeScript enforcement,
      // but we guard anyway for runtime safety.
      return value ?? String(key);
    },
    [translations]
  );

  /**
   * tInterp — Translate and interpolate {placeholder} values.
   */
  const tInterp = useCallback(
    (key: keyof Translations, values: Record<string, string>): string => {
      const raw = translations[key] ?? String(key);
      return interpolate(raw, values);
    },
    [translations]
  );

  const value = useMemo(
    (): LanguageContextValue => ({
      currentLanguage,
      setLanguage,
      t,
      tInterp,
    }),
    [currentLanguage, setLanguage, t, tInterp]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useLanguage — Consume the LanguageContext in any component or hook.
 * Throws a descriptive error if used outside LanguageProvider.
 *
 * @example
 *   const { t, currentLanguage, setLanguage } = useLanguage();
 */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (context === null) {
    throw new Error(
      'useLanguage() must be used inside a <LanguageProvider>. ' +
        'Make sure <LanguageProvider> wraps the app root in app/_layout.tsx.'
    );
  }
  return context;
}
