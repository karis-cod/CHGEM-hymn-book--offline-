// FILE PATH: app/_layout.tsx
// Temporary Phase 1 layout — no fonts yet
// Fonts will be added in Phase 3 when expo-font is installed

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';

SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { colorScheme } = useTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="hymn/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="search"
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="category/[name]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="about"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <RootLayoutInner />
      </SettingsProvider>
    </ThemeProvider>
  );
}














/* // FILE PATH: app/_layout.tsx
// PURPOSE: Root layout. Loads fonts. Controls splash screen.
// Wraps entire app in ThemeProvider and SettingsProvider.
// RULE: No business logic here. Only providers and font loading.

import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { SettingsProvider } from '@/context/SettingsContext';

// Keep splash screen visible until fonts + data are ready
SplashScreen.preventAutoHideAsync();

function RootLayoutInner() {
  const { colorScheme } = useTheme();

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="hymn/[id]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="search"
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="category/[name]"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="about"
          options={{ headerShown: false, animation: 'slide_from_right' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
    'Inter-Italic': require('../assets/fonts/Inter-Italic.ttf'),
  });

  useEffect(() => {
    // CRITICAL: Only hide splash after fonts are ready.
    // See PRD Section 17.1 — Font Loading Race Condition.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null; // Splash remains visible
  }

  return (
    <ThemeProvider>
      <SettingsProvider>
        <RootLayoutInner />
      </SettingsProvider>
    </ThemeProvider>
  );
} */