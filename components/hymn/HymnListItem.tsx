// FILE PATH: components/hymn/HymnListItem.tsx
// PURPOSE: Single row in the hymn FlatList. Fixed height required for getItemLayout.

import React, { useCallback } from 'react';
import { Keyboard, Pressable, StyleSheet, View } from 'react-native';
import ThemedText from '../ui/ThemedText';
import FavouriteButton from '../ui/FavouriteButton';
import { LIST_ITEM_HEIGHT, SPACING, BORDER_RADIUS } from '../../constants/layout';
import { FONT_SIZE_SCALES } from '../../types/settings';
import type { HymnRecord } from '../../types/hymn';
import type { FontSizeStep } from '../../types/settings';

export interface HymnListItemProps {
  hymn: HymnRecord;
  isFavourite: boolean;
  onPress: (id: string) => void;
  onFavouriteToggle: (id: string) => void;
  fontSize: FontSizeStep;
  colours: {
    background: string;
    border: string;
    text: string;
    meta: string;
    numberBadgeBackground: string;
    numberBadgeText: string;
    favouriteActive: string;
    favouriteInactive: string;
  };
}

const HymnListItem = React.memo(function HymnListItem({
  hymn,
  isFavourite,
  onPress,
  onFavouriteToggle,
  fontSize,
  colours,
}: HymnListItemProps) {
  const scale = FONT_SIZE_SCALES[fontSize];

  const handlePress = useCallback(() => {
    Keyboard.dismiss();
    onPress(hymn.id);
  }, [hymn.id, onPress]);

  const handleFavouriteToggle = useCallback(() => {
    onFavouriteToggle(hymn.id);
  }, [hymn.id, onFavouriteToggle]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colours.background,
          borderBottomColor: colours.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Hymn ${hymn.hymn_number}: ${hymn.title}`}
    >
      {/* Number badge */}
      <View style={[styles.numberBadge, { backgroundColor: colours.numberBadgeBackground }]}>
        <ThemedText
          variant="listMeta"
          colour={colours.numberBadgeText}
          style={[styles.numberText, { fontSize: scale.label }]}
          numberOfLines={1}
        >
          {hymn.hymn_number}
        </ThemedText>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <ThemedText
          variant="listTitle"
          colour={colours.text}
          style={[styles.title, { fontSize: scale.listTitle }]}
          numberOfLines={2}
        >
          {hymn.title}
        </ThemedText>
      </View>

      {/* Favourite button */}
      <FavouriteButton
        isFavourite={isFavourite}
        onToggle={handleFavouriteToggle}
        size={20}
        activeColour={colours.favouriteActive}
        inactiveColour={colours.favouriteInactive}
      />
    </Pressable>
  );
});

export default HymnListItem;

const styles = StyleSheet.create({
  container: {
    height: LIST_ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  numberBadge: {
    width: 36,
    height: 28,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    flexShrink: 0,
  },
  numberText: {
    fontWeight: '700',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    includeFontPadding: false,
  },
});
