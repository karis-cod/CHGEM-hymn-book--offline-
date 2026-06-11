// FILE PATH: components/ui/FavouriteButton.tsx
// PURPOSE: Heart icon button for saving/removing hymns from favourites.
// PRD Reference: Section 29.6 (component contract), Section 7 (US-04).

import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface FavouriteButtonProps {
  isFavourite: boolean;
  onToggle: () => void;
  size?: number;
  activeColour?: string;
  inactiveColour?: string;
}

const FavouriteButton = React.memo(function FavouriteButton({
  isFavourite,
  onToggle,
  size = 24,
  activeColour = '#E8A020',
  inactiveColour = '#FFFFFF',
}: FavouriteButtonProps) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      accessibilityState={{ selected: isFavourite }}
    >
      <Ionicons
        name={isFavourite ? 'heart' : 'heart-outline'}
        size={size}
        color={isFavourite ? activeColour : inactiveColour}
      />
    </Pressable>
  );
});

export default FavouriteButton;

const styles = StyleSheet.create({
  button: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});