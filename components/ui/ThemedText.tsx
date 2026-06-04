// FILE PATH: components/ui/ThemedText.tsx
// Phase 1 version — uses system fonts until expo-font is installed in Phase 3

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { FontScale } from '@/constants/typography';

export type TextVariant =
  | 'hymnTitle'
  | 'stanzaBody'
  | 'stanzaLabel'
  | 'listTitle'
  | 'listMeta'
  | 'uiLabel'
  | 'caption';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  onHeader?: boolean;
  muted?: boolean;
  accent?: boolean;
}

export function ThemedText({
  variant = 'uiLabel',
  onHeader = false,
  muted = false,
  accent = false,
  style,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();
  const { fontSize } = useSettings();

  const scale = FontScale[fontSize];

  const sizeMap: Record<TextVariant, number> = {
    hymnTitle: scale.hymnTitle,
    stanzaBody: scale.stanzaBody,
    stanzaLabel: scale.label,
    listTitle: scale.listTitle,
    listMeta: scale.meta,
    uiLabel: scale.label,
    caption: scale.meta,
  };

  const colorValue = onHeader
    ? colors.text.onHeader
    : muted
    ? colors.text.muted
    : accent
    ? colors.accent.warm
    : colors.text.primary;

  return (
    <Text
      style={[
        styles.base,
        { fontSize: sizeMap[variant], color: colorValue },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: undefined, // System font for now — Inter added in Phase 3
  },
});










































/* // FILE PATH: components/ui/ThemedText.tsx
// PURPOSE: ALL text in the application uses this component.
// RULE: Never use raw <Text> anywhere in the app.
// RULE: Never pass hardcoded fontSize or color to this component.

import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { FontFamilies, FontScale } from '@/constants/typography';

export type TextVariant =
  | 'hymnTitle'
  | 'stanzaBody'
  | 'stanzaLabel'
  | 'listTitle'
  | 'listMeta'
  | 'uiLabel'
  | 'caption';

interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  onHeader?: boolean;        // true when text sits on the dark blue banner
  muted?: boolean;           // renders with text.secondary color
  accent?: boolean;          // renders with accent.primary color
}

export function ThemedText({
  variant = 'uiLabel',
  onHeader = false,
  muted = false,
  accent = false,
  style,
  ...props
}: ThemedTextProps) {
  const { colors } = useTheme();
  const { fontSize } = useSettings();

  const scale = FontScale[fontSize];

  const variantStyles = StyleSheet.create({
    hymnTitle: {
      fontSize: scale.hymnTitle,
      fontFamily: FontFamilies.bold,
      lineHeight: scale.hymnTitle * 1.25,
    },
    stanzaBody: {
      fontSize: scale.stanzaBody,
      fontFamily: FontFamilies.regular,
      lineHeight: scale.stanzaBody * 1.6,
    },
    stanzaLabel: {
      fontSize: scale.label,
      fontFamily: FontFamilies.bold,
      lineHeight: scale.label * 1.4,
      letterSpacing: 0.8,
      textTransform: 'uppercase' as const,
    },
    listTitle: {
      fontSize: scale.listTitle,
      fontFamily: FontFamilies.regular,
      lineHeight: scale.listTitle * 1.4,
    },
    listMeta: {
      fontSize: scale.meta,
      fontFamily: FontFamilies.regular,
      lineHeight: scale.meta * 1.4,
    },
    uiLabel: {
      fontSize: scale.label,
      fontFamily: FontFamilies.regular,
      lineHeight: scale.label * 1.4,
    },
    caption: {
      fontSize: scale.meta,
      fontFamily: FontFamilies.italic,
      lineHeight: scale.meta * 1.4,
    },
  });

  const colorStyle = onHeader
    ? { color: colors.text.onHeader }
    : muted
    ? { color: colors.text.muted }
    : accent
    ? { color: colors.accent.warm }
    : { color: colors.text.primary };

  return (
    <Text
      style={[variantStyles[variant], colorStyle, style]}
      {...props}
    />
  );
} */