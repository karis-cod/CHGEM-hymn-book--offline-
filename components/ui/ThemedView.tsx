// FILE PATH: components/ui/ThemedView.tsx
// PURPOSE: Theme-aware View. Use whenever background colour should follow theme.
// RULE: Never hardcode background colours in screens or components.

import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type BackgroundVariant = 'primary' | 'secondary' | 'card' | 'header';

interface ThemedViewProps extends ViewProps {
  variant?: BackgroundVariant;
}

export function ThemedView({
  variant = 'primary',
  style,
  ...props
}: ThemedViewProps) {
  const { colors } = useTheme();

  const backgroundColors: Record<BackgroundVariant, string> = {
    primary: colors.background.primary,
    secondary: colors.background.secondary,
    card: colors.background.card,
    header: colors.background.header,
  };

  return (
    <View
      style={[{ backgroundColor: backgroundColors[variant] }, style]}
      {...props}
    />
  );
}