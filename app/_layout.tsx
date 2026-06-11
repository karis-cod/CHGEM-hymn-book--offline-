// FILE PATH: app/_layout.tsx
// PURPOSE: Root layout — wires all contexts, runs startup sequence, controls splash.

import { useEffect, useState } from 'react';
import { SplashScreen, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { hymnService } from '../services/hymnService';
import { buildIndex } from '../services/searchService';
import { storageService } from '../services/storageService';
import { LanguageProvider } from '../context/LanguageContext';
import type { AppLanguage } from '../types/language';
import { DEFAULT_SETTINGS } from '../types/settings';

const corpus = require('../assets/data/hymns.json');

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [initialLanguage, setInitialLanguage] = useState<AppLanguage>('en');

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
      <LanguageProvider initialLanguage={initialLanguage}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="hymn/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="search" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: false }} />
          <Stack.Screen name="category/[name]" options={{ headerShown: false }} />
        </Stack>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});