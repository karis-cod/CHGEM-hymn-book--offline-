// FILE PATH: components/ui/ThemedView.tsx
// PURPOSE: Theme-aware View. Use whenever background colour should follow theme.
// RULE: Never hardcode background colours in screens or components.

import React from 'react';
import { View, ViewProps } from 'react-native';
import { useColorScheme } from 'react-native';
import { getThemeColours } from '@/constants/theme';

type BackgroundVariant = 'primary' | 'secondary' | 'card' | 'header';

interface ThemedViewProps extends ViewProps {
  variant?: BackgroundVariant;
}

export function ThemedView({
  variant = 'primary',
  style,
  ...props
}: ThemedViewProps) {
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  const backgroundColors: Record<BackgroundVariant, string> = {
    primary: colours.background.primary,
    secondary: colours.background.secondary,
    card: colours.background.secondary,
    header: colours.background.header,
  };

  return (
    <View
      style={[{ backgroundColor: backgroundColors[variant] }, style]}
      {...props}
    />
  );
}