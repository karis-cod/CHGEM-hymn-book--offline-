// FILE PATH: types/language.ts
// PURPOSE: Language type definitions for the CHGEM bilingual system.
// Every language-related type in the app derives from this file.
// Add new languages here ONLY — never hardcode language strings elsewhere.

// ─── Supported Languages ──────────────────────────────────────────────────────

/**
 * AppLanguage — The two supported languages in CHGEM v1.x.
 * Strict union type: 'en' or 'yo' only.
 * Never use raw strings like 'english' or 'yoruba' — always use this type.
 */
export type AppLanguage = 'en' | 'yo';

/**
 * DEFAULT_LANGUAGE — The language used on first install.
 * Per PRD: English is the default.
 */
export const DEFAULT_LANGUAGE: AppLanguage = 'en';

/**
 * SUPPORTED_LANGUAGES — Ordered list for UI display.
 * Order determines display order in language selectors.
 */
export const SUPPORTED_LANGUAGES: ReadonlyArray<{
  code: AppLanguage;
  label: string;
  nativeLabel: string;
}> = [
  { code: 'en', label: 'English',  nativeLabel: 'English' },
  { code: 'yo', label: 'Yoruba',   nativeLabel: 'Yorùbá'  },
] as const;

// ─── Bilingual Content Shape ───────────────────────────────────────────────────

/**
 * BilingualText — A value that exists in both supported languages.
 * Used for hymn titles, category names, and any translatable corpus field.
 *
 * When a Yoruba translation is not yet available, set 'yo' to the English
 * value as a fallback rather than an empty string.
 */
export type BilingualText = Record<AppLanguage, string>;

/**
 * resolveBilingual — Resolves a BilingualText to a plain string for the
 * given language, falling back to English if the target language is empty.
 *
 * This is a pure utility — no React, no context dependency.
 * Use in services and non-React code.
 */
export function resolveBilingual(
  text: BilingualText,
  language: AppLanguage
): string {
  const value = text[language];
  // Fallback to English if the translation is missing or empty
  if (!value || value.trim() === '') {
    return text['en'];
  }
  return value;
}
