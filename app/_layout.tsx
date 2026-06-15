// FILE PATH: app/_layout.tsx
// PURPOSE: Root layout — wires all contexts, runs startup sequence, controls splash.
//
// PHASE 4 CHANGES:
//   - Added SafeAreaProvider (required for useSafeAreaInsets in (tabs)/_layout.tsx).
//   - Added ThemeProvider, SettingsProvider, FavouritesProvider, RecentsProvider.
//   - The settings object already loaded during startup is now reused to seed
//     ThemeProvider.initialThemeMode and SettingsProvider.initialSettings —
//     no second AsyncStorage read, no flash of default values.

import { useEffect, useState } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

import { hymnService } from '../services/hymnService';
import { buildIndex } from '../services/searchService';
import { storageService } from '../services/storageService';
import { LanguageProvider } from '../context/LanguageContext';
import { ThemeProvider } from '../context/ThemeContext';
import { SettingsProvider } from '../context/SettingsContext';
import { FavouritesProvider } from '../context/FavouritesContext';
import { RecentsProvider } from '../context/RecentsContext';
import type { AppLanguage } from '../types/language';
import { DEFAULT_SETTINGS } from '../types/settings';
import type { UserSettings } from '../types/settings';

const corpus = require('../assets/data/hymns.json');

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState<AppLanguage>('en');
  const [initialSettings, setInitialSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  const [fontsLoaded, fontError] = useFonts({
    // Uncomment when font files are added to assets/fonts/:
    // 'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Bold':    require('../assets/fonts/Inter-Bold.ttf'),
    // 'Inter-Italic':  require('../assets/fonts/Inter-Italic.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    let cancelled = false;

    void (async () => {
      try {
        hymnService.init(corpus);

        const settings = await storageService.loadSettings();
        if (cancelled) return;

        const lang: AppLanguage =
          (settings.language as AppLanguage) ?? DEFAULT_SETTINGS.language;

        const hymns = hymnService.getAllHymns(lang);
        buildIndex(hymns, lang);

        const storedVersion = await storageService.getStoredCorpusVersion();
        if (storedVersion !== corpus.version) {
          await storageService.setStoredCorpusVersion(corpus.version as string);
        }

        if (cancelled) return;
        setInitialLanguage(lang);
        setInitialSettings(settings);
        setAppReady(true);
      } catch {
        if (!cancelled) setAppReady(true);
      } finally {
        if (!cancelled) await SplashScreen.hideAsync();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fontsLoaded, fontError]);

  if (!appReady) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <LanguageProvider initialLanguage={initialLanguage}>
          <ThemeProvider initialThemeMode={initialSettings.theme}>
            <SettingsProvider initialSettings={initialSettings}>
              <FavouritesProvider>
                <RecentsProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="hymn/[id]" options={{ headerShown: false }} />
                    <Stack.Screen name="search" options={{ headerShown: false }} />
                    <Stack.Screen name="about" options={{ headerShown: false }} />
                    <Stack.Screen name="category/[name]" options={{ headerShown: false }} />
                  </Stack>
                </RecentsProvider>
              </FavouritesProvider>
            </SettingsProvider>
          </ThemeProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});