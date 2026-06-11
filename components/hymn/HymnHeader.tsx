// FILE PATH: components/hymn/HymnHeader.tsx
// PURPOSE: Banner header for the Hymn Reader screen.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from '../ui/ThemedText';
import { SPACING } from '../../constants/layout';
import { FONT_SIZE_SCALES } from '../../types/settings';
import type { HymnRecord } from '../../types/hymn';
import type { FontSizeStep } from '../../types/settings';
import { HEADER_HEIGHT } from '../../constants/layout';

export interface HymnHeaderProps {
  hymn: HymnRecord;
  fontSize: FontSizeStep;
  hymnPrefix: string;
  colours: {
    bannerBackground: string;
    bannerText: string;
    metaText: string;
    titleText: string;
    metaBackground: string;
  };
}

const HymnHeader = React.memo(function HymnHeader({
  hymn,
  fontSize,
  hymnPrefix,
  colours,
}: HymnHeaderProps) {
  const scale = FONT_SIZE_SCALES[fontSize];

  return (
    <View>
      {/* Dark blue banner */}
      <View style={[styles.banner, { backgroundColor: colours.bannerBackground }]}>
        <ThemedText
          variant="hymnTitle"
          colour={colours.bannerText}
          style={{ fontSize: scale.hymnTitle, fontWeight: '700' }}
          accessibilityRole="header"
        >
          {hymnPrefix} {String(hymn.hymn_number).padStart(3, '0')}
        </ThemedText>
      </View>

      {/* Metadata strip */}
      <View style={[styles.metaStrip, { backgroundColor: colours.metaBackground }]}>
        {hymn.meter !== null && (
          <ThemedText
            variant="caption"
            colour={colours.metaText}
            style={styles.metaText}
          >
            {hymn.meter}
          </ThemedText>
        )}
        {hymn.scripture_reference !== null && (
          <ThemedText
            variant="caption"
            colour={colours.metaText}
            style={styles.metaText}
          >
            {hymn.scripture_reference}
          </ThemedText>
        )}
      </View>

      {/* Hymn title */}
      <ThemedText
        variant="hymnTitle"
        colour={colours.titleText}
        style={[styles.hymnTitle, { fontSize: scale.hymnTitle }]}
        accessibilityRole="header"
      >
        {hymn.title}
      </ThemedText>
    </View>
  );
});

export default HymnHeader;

const styles = StyleSheet.create({
  banner: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  metaStrip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
  },
  metaText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  hymnTitle: {
    textAlign: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontWeight: '700',
  },
});
