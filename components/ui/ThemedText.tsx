// FILE PATH: components/ui/ThemedText.tsx
// PURPOSE: All text in the CHGEM app must use this component.

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import type { TextProps, TextStyle } from 'react-native';

import { FONT_SIZE_SCALES } from '../../types/settings';

export type ThemedTextVariant =
  | 'hymnTitle'
  | 'stanzaBody'
  | 'stanzaLabel'
  | 'listTitle'
  | 'listMeta'
  | 'uiLabel'
  | 'caption'
  | 'body'
  | 'sectionHeader'
  | 'badgeText';

export interface ThemedTextProps extends TextProps {
  variant?: ThemedTextVariant;
  /** Colour override — maps to RN 'color' under the hood */
  colour?: string;
  /** Font size override */
  fontSize?: number;
}

const ThemedText = React.memo(function ThemedText({
  variant = 'body',
  colour,
  fontSize: fontSizeOverride,
  style,
  children,
  ...rest
}: ThemedTextProps) {
  const variantStyle = getVariantStyle(variant);

  return (
    <Text
      style={[
        variantStyle,
        colour !== undefined ? { color: colour } : undefined,
        fontSizeOverride !== undefined ? { fontSize: fontSizeOverride } : undefined,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
});

export default ThemedText;

function getVariantStyle(variant: ThemedTextVariant): TextStyle {
  const scale = FONT_SIZE_SCALES['md'];

  switch (variant) {
    case 'hymnTitle':
      return { fontSize: scale.hymnTitle, fontWeight: '700', lineHeight: scale.hymnTitle * 1.3 };
    case 'stanzaBody':
      return { fontSize: scale.stanzaBody, fontWeight: '400', lineHeight: scale.stanzaBody * 1.6 };
    case 'stanzaLabel':
      return { fontSize: scale.label, fontWeight: '700', letterSpacing: 0.8 };
    case 'listTitle':
      return { fontSize: scale.listTitle, fontWeight: '500', lineHeight: scale.listTitle * 1.4 };
    case 'listMeta':
      return { fontSize: scale.label, fontWeight: '400' };
    case 'uiLabel':
      return { fontSize: scale.label, fontWeight: '500' };
    case 'caption':
      return { fontSize: 12, fontWeight: '400' };
    case 'sectionHeader':
      return { fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' };
    case 'badgeText':
      return { fontSize: 12, fontWeight: '700' };
    case 'body':
    default:
      return { fontSize: scale.stanzaBody, fontWeight: '400', lineHeight: scale.stanzaBody * 1.5 };
  }
}
