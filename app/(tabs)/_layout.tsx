// FILE PATH: app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { getThemeColours } from '../../constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colours.background.secondary,
          borderTopColor: colours.border.default,
          height: 60,
        },
        tabBarActiveTintColor: colours.accent.primary,
        tabBarInactiveTintColor: colours.text.secondary,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recents"
        options={{
          title: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}