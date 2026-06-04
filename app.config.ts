// FILE PATH: app.config.ts
// PURPOSE: Expo app configuration. Scheme, orientation, extras.

import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'CHGEM Hymn Book',
  slug: 'chgem-hymnbook',
  scheme: 'chgem-hymnbook',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#1A3C5E',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.chgem.hymnbook',
  },
  android: {
    package: 'com.chgem.hymnbook',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1A3C5E',
    },
    permissions: [],
  },
  plugins: [
    'expo-router',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#1A3C5E',
        image: './assets/splash-icon.png',
        resizeMode: 'contain',
      },
    ],
  ],
  extra: {
    corpusVersion: '2025.1',
    supportEmail: 'support@chgem.org',
    eas: {
      projectId: 'REPLACE_WITH_EAS_PROJECT_ID',
    },
  },
});