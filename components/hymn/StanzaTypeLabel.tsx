// FILE PATH: components/hymn/StanzaTypeLabel.tsx
// PURPOSE: Label displayed above each stanza in the hymn reader.
// PRD Reference: Section 15.3 (stanza visual styling), Section 7 (US-03).
//
// Verse:   "Verse 1", "Verse 2" — small grey pill badge
// Chorus:  "CHORUS" — bold, accent colour (orange)
// Bridge:  "BRIDGE" — bold, blue accent
// Refrain: "REFRAIN" — same as Chorus
// Intro:   "INTRO" — caption size, muted
// Outro:   "OUTRO" — caption size, muted

import React from 'react';
import { StyleSheet, View } from 'react-native';
import ThemedText from '../ui/ThemedText';
import { SPACING, BORDER_RADIUS } from '../../constants/layout';
import type { StanzaType } from '../../types/hymn';

export interface StanzaTypeLabelProps {
  type: StanzaType;
  verseNumber: number | null;
  showVerseNumbers: boolean;
  // Localised strings from parent (via useLanguage t())
  labels: {
    verse: string;    // t('reader_verse')
    chorus: string;   // t('reader_chorus')
    bridge: string;   // t('reader_bridge')
    refrain: string;  // t('reader_refrain')
    intro: string;    // t('reader_intro')
    outro: string;    // t('reader_outro')
  };
  colours: {
    verseLabel: string;
    chorusLabel: string;
    bridgeLabel: string;
    muted: string;
  };
}

const StanzaTypeLabel = React.memo(function StanzaTypeLabel({
  type,
  verseNumber,
  showVerseNumbers,
  labels,
  colours,
}: StanzaTypeLabelProps) {
  if (type === 'verse') {
    if (!showVerseNumbers || verseNumber === null) return null;
    return (
      <View style={styles.verseBadgeContainer}>
        <View style={[styles.verseBadge, { backgroundColor: colours.verseLabel + '30' }]}>
          <ThemedText
            variant="stanzaLabel"
            colour={colours.verseLabel}
          >
            {verseNumber}.
          </ThemedText>
        </View>
      </View>
    );
  }

  if (type === 'chorus' || type === 'refrain') {
    const label = type === 'chorus' ? labels.chorus.toUpperCase() : labels.refrain.toUpperCase();
    return (
      <ThemedText
        variant="stanzaLabel"
        colour={colours.chorusLabel}
        style={styles.chorusLabel}
      >
        {label}:
      </ThemedText>
    );
  }

  if (type === 'bridge') {
    return (
      <ThemedText
        variant="stanzaLabel"
        colour={colours.bridgeLabel}
        style={styles.bridgeLabel}
      >
        {labels.bridge.toUpperCase()}
      </ThemedText>
    );
  }

  if (type === 'intro' || type === 'outro') {
    const label = type === 'intro' ? labels.intro : labels.outro;
    return (
      <ThemedText
        variant="caption"
        colour={colours.muted}
        style={styles.minorLabel}
      >
        {label.toUpperCase()}
      </ThemedText>
    );
  }

  return null;
});

export default StanzaTypeLabel;

const styles = StyleSheet.create({
  verseBadgeContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  verseBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.pill,
  },
  chorusLabel: {
    marginBottom: SPACING.xs,
  },
  bridgeLabel: {
    marginBottom: SPACING.xs,
  },
  minorLabel: {
    marginBottom: SPACING.xs,
  },
});
