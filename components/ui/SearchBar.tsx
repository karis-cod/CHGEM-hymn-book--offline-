// FILE PATH: components/ui/SearchBar.tsx
// PURPOSE: Search input with clear button.
// PRD Reference: Section 5.3, Section 29.6.
// Does NOT debounce — debounce is useSearch hook's responsibility.

import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/layout';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  keyboardType?: 'default' | 'number-pad';
  colours: {
    background: string;
    border: string;
    text: string;
    placeholder: string;
    icon: string;
  };
}

const SearchBar = React.memo(function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = 'Hymn number or title...',
  autoFocus = false,
  keyboardType = 'number-pad',
  colours,
}: SearchBarProps) {
  return (
    <View style={[styles.container, {
      backgroundColor: colours.background,
      borderColor: colours.border,
    }]}>
      <Ionicons
        name="search"
        size={18}
        color={colours.icon}
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: colours.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colours.placeholder}
        keyboardType={keyboardType}
        autoFocus={autoFocus}
        returnKeyType="search"
        clearButtonMode="never"
        underlineColorAndroid="transparent"
        accessibilityLabel="Search hymns"
        accessibilityHint="Type a hymn number or title"
      />
      {value.length > 0 && (
        <Pressable
          onPress={onClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <Ionicons
            name="close-circle"
            size={18}
            color={colours.icon}
          />
        </Pressable>
      )}
    </View>
  );
});

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    minHeight: TOUCH_TARGET_MIN,
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: SPACING.sm,
    includeFontPadding: false,
  },
  clearButton: {
    marginLeft: SPACING.xs,
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
});