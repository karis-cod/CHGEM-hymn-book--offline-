// FILE PATH: components/ui/OfflineBadge.tsx
// PURPOSE: Static "Fully offline" badge for the Settings screen.
// PRD Reference: Section 6.2 (offline indicator), Section 10.1 (OTA clarification).
//
// Communicates to users that all hymns work without internet.
// No action — informational only.

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';

export interface OfflineBadgeProps {
  label: string;       // t('settings_offline_badge')
  sublabel: string;    // t('settings_offline_sub')
  colours: {
    background: string;
    text: string;
    subtext: string;
    dot: string;
  };
}

const OfflineBadge = React.memo(function OfflineBadge({
  label,
  sublabel,
  colours,
}: OfflineBadgeProps) {
  return (
    <View
      style={[styles.container, { backgroundColor: colours.background }]}
      accessibilityRole="text"
      accessibilityLabel={`${label}. ${sublabel}`}
    >
      <View style={styles.row}>
        <View style={[styles.dot, { backgroundColor: colours.dot }]} />
        <ThemedText
          variant="uiLabel"
          colour={colours.text}
          style={styles.label}
        >
          {label}
        </ThemedText>
      </View>
      <ThemedText
        variant="caption"
        colour={colours.subtext}
        style={styles.sublabel}
      >
        {sublabel}
      </ThemedText>
    </View>
  );
});

export default OfflineBadge;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.sm,
  },
  label: {
    fontWeight: '600',
  },
  sublabel: {
    lineHeight: 18,
  },
});
