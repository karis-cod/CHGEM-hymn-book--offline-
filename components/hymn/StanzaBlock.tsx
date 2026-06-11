// FILE PATH: components/hymn/StanzaBlock.tsx
// PURPOSE: Renders one StanzaRecord with correct visual treatment per stanza type.
// PRD Reference: Section 15.3 (stanza visual styling), Section 29.6 (contract).
//
// Contract:
//   stanza:           StanzaRecord
//   fontSize:         FontSizeStep   — from SettingsContext
//   showVerseNumbers: boolean
//   labels, colours:  from parent via useLanguage + theme
// Verse:   regular weight · full width · number badge
// Chorus:  italic · 16pt indent · tinted bg · 'CHORUS' label
// Bridge:  4pt left accent border · bold 'BRIDGE' label
// Refrain: same as Chorus · label reads 'REFRAIN'
// Intro/Outro: caption-size · muted colour · no number badge
//
// accessibility: accessibilityRole='text' · accessibilityLabel='[type]: [lyrics]'

import React from 'react';
import { StyleSheet, View } from 'react-native';
import  ThemedText  from '../ui/ThemedText';
import StanzaTypeLabel from './StanzaTypeLabel';
import {
  SPACING,
  BORDER_RADIUS,
  CHORUS_INDENT,
  BRIDGE_BORDER_WIDTH,
} from '../../constants/layout';
import { FONT_SIZE_SCALES } from '../../types/settings';
import type { BilingualStanzaRecord, StanzaType } from '../../types/hymn';
import type { FontSizeStep } from '../../types/settings';

export interface StanzaBlockProps {
  stanza: BilingualStanzaRecord;
  fontSize: FontSizeStep;
  showVerseNumbers: boolean;
  labels: {
    verse: string;
    chorus: string;
    bridge: string;
    refrain: string;
    intro: string;
    outro: string;
  };
  colours: {
    cardBackground: string;
    chorusBackground: string;
    text: string;
    textMuted: string;
    chorusLabel: string;
    bridgeLabel: string;
    bridgeBorder: string;
    verseLabel: string;
  };
}

function getAccessibilityLabel(
  type: StanzaType,
  verseNumber: number | null,
  lyrics: string,
  labels: StanzaBlockProps['labels']
): string {
  switch (type) {
    case 'verse':
      return `${labels.verse} ${verseNumber ?? ''}: ${lyrics}`;
    case 'chorus':
      return `${labels.chorus}: ${lyrics}`;
    case 'bridge':
      return `${labels.bridge}: ${lyrics}`;
    case 'refrain':
      return `${labels.refrain}: ${lyrics}`;
    default:
      return lyrics;
  }
}

const StanzaBlock = React.memo(function StanzaBlock({
  stanza,
  fontSize,
  showVerseNumbers,
  labels,
  colours,
}: StanzaBlockProps) {
  const scale = FONT_SIZE_SCALES[fontSize];
  const isChorus  = stanza.type === 'chorus' || stanza.type === 'refrain';
  const isBridge  = stanza.type === 'bridge';
  const isMinor   = stanza.type === 'intro' || stanza.type === 'outro';

  const cardStyle = isChorus
    ? [styles.card, styles.chorusCard, { backgroundColor: colours.chorusBackground }]
    : isBridge
    ? [styles.card, styles.bridgeCard, { backgroundColor: colours.cardBackground, borderLeftColor: colours.bridgeBorder }]
    : [styles.card, { backgroundColor: colours.cardBackground }];

  const lyricsStyle = isChorus
    ? [styles.lyrics, styles.chorusLyrics, { fontSize: scale.stanzaBody, color: colours.text, lineHeight: scale.stanzaBody * 1.6 }]
    : isMinor
    ? [styles.lyrics, { fontSize: scale.label, color: colours.textMuted, lineHeight: scale.label * 1.6 }]
    : [styles.lyrics, { fontSize: scale.stanzaBody, color: colours.text, lineHeight: scale.stanzaBody * 1.6 }];

  return (
    <View
      style={cardStyle}
      accessible
      accessibilityRole="text"
      accessibilityLabel={getAccessibilityLabel(
        stanza.type,
        stanza.verse_number,
        stanza.lyrics,
        labels
      )}
    >
      <StanzaTypeLabel
        type={stanza.type}
        verseNumber={stanza.verse_number}
        showVerseNumbers={showVerseNumbers}
        labels={labels}
        colours={{
          verseLabel:  colours.verseLabel,
          chorusLabel: colours.chorusLabel,
          bridgeLabel: colours.bridgeLabel,
          muted:       colours.textMuted,
        }}
      />
      <ThemedText style={lyricsStyle}>
        {stanza.lyrics}
      </ThemedText>
    </View>
  );
});

export default StanzaBlock;

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  chorusCard: {
    paddingLeft: SPACING.md + CHORUS_INDENT,
  },
  bridgeCard: {
    borderLeftWidth: BRIDGE_BORDER_WIDTH,
  },
  lyrics: {
    includeFontPadding: false,
  },
  chorusLyrics: {
    fontStyle: 'italic',
  },
});
