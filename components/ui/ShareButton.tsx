// FILE PATH: components/ui/ShareButton.tsx
// PURPOSE: Share hymn text via native share sheet.
// PRD Reference: Section 7 (US-05), Section 10.2.

import React, { useCallback } from 'react';
import { Pressable, Share, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { HymnRecord } from '../../types/hymn';

export interface ShareButtonProps {
  hymn: HymnRecord;
  colour?: string;
  hymnPrefix?: string;
  size?: number;
}

const ShareButton = React.memo(function ShareButton({
  hymn,
  colour = '#FFFFFF',
  hymnPrefix = 'Hymn',
  size = 22,
}: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    try {
      const header = `${hymnPrefix} ${hymn.hymn_number} — ${hymn.title}`;
      const stanzaText = hymn.stanzas
        .map((s) => s.lyrics)
        .join('\n\n');
      const message = `${header}\n\n${stanzaText}`;
      await Share.share({ message });
    } catch {
      // Silent — user may have dismissed the share sheet
    }
  }, [hymn, hymnPrefix]);

  return (
    <Pressable
      onPress={handleShare}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="Share hymn"
    >
      <Ionicons name="share-social-outline" size={size} color={colour} />
    </Pressable>
  );
});

export default ShareButton;

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});