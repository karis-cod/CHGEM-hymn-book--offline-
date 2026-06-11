// FILE PATH: components/ui/SortToggle.tsx
// PURPOSE: Two-button toggle for Numerical / A-Z sort order on the Index screen.
// PRD Reference: Section 14.4 (Home screen layout), Section 13.1 (ephemeral state).
//
// Sort order is ephemeral — session only, not persisted.
// Active button has accent background. Inactive has transparent background.

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import ThemedText from './ThemedText';
import { SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/layout';
import type { SortOrder } from '../../types/settings';

export interface SortToggleProps {
  sortOrder: SortOrder;
  onChangeSortOrder: (order: SortOrder) => void;
  labelNumerical: string;   // t('sort_numerical')
  labelAlphabetical: string; // t('sort_alphabetical')
  colours: {
    activeBackground: string;
    activeText: string;
    inactiveBackground: string;
    inactiveText: string;
    border: string;
  };
}

const SortToggle = React.memo(function SortToggle({
  sortOrder,
  onChangeSortOrder,
  labelNumerical,
  labelAlphabetical,
  colours,
}: SortToggleProps) {
  return (
    <View
      style={[styles.container, { borderColor: colours.border }]}
      accessibilityRole="tablist"
    >
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.buttonLeft,
          {
            backgroundColor:
              sortOrder === 'numerical'
                ? colours.activeBackground
                : colours.inactiveBackground,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => onChangeSortOrder('numerical')}
        accessibilityRole="tab"
        accessibilityState={{ selected: sortOrder === 'numerical' }}
        accessibilityLabel={labelNumerical}
      >
        <ThemedText
          variant="uiLabel"
          colour={
            sortOrder === 'numerical' ? colours.activeText : colours.inactiveText
          }
        >
          {labelNumerical}
        </ThemedText>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.buttonRight,
          {
            backgroundColor:
              sortOrder === 'alphabetical'
                ? colours.activeBackground
                : colours.inactiveBackground,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={() => onChangeSortOrder('alphabetical')}
        accessibilityRole="tab"
        accessibilityState={{ selected: sortOrder === 'alphabetical' }}
        accessibilityLabel={labelAlphabetical}
      >
        <ThemedText
          variant="uiLabel"
          colour={
            sortOrder === 'alphabetical' ? colours.activeText : colours.inactiveText
          }
        >
          {labelAlphabetical}
        </ThemedText>
      </Pressable>
    </View>
  );
});

export default SortToggle;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  buttonLeft: {
    borderTopLeftRadius: BORDER_RADIUS.md - 1,
    borderBottomLeftRadius: BORDER_RADIUS.md - 1,
  },
  buttonRight: {
    borderTopRightRadius: BORDER_RADIUS.md - 1,
    borderBottomRightRadius: BORDER_RADIUS.md - 1,
  },
});
