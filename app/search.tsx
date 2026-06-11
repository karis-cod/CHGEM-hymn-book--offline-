// FILE PATH: app/search.tsx
// PURPOSE: Full-screen search — stack route, tabs hidden.
// PRD Reference: Section 14.1, Section 5 (search UX), Section 7 (US-01, US-02).

import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import type { ListRenderItem } from 'react-native';

import { useLanguage } from '../context/LanguageContext';
import { useSearch } from '../hooks/useSearch';
import { useFavourites } from '../hooks/useFavourites';
import SearchBar from '../components/ui/SearchBar';
import HymnListItem from '../components/hymn/HymnListItem';
import EmptyState from '../components/ui/EmptyState';
import ThemedText from '../components/ui/ThemedText';
import { getThemeColours } from '../constants/theme';
import { LIST_ITEM_HEIGHT, SPACING, TOUCH_TARGET_MIN } from '../constants/layout';
import type { HymnRecord } from '../types/hymn';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SearchScreen() {
  const { t, currentLanguage } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  const { query, setQuery, results, isSearching } = useSearch(currentLanguage);
  const { isFavourite, toggleFavourite } = useFavourites();

  const handleBack = useCallback(() => router.back(), []);

  const handleHymnPress = useCallback((id: string) => {
    router.push(`/hymn/${id}`);
  }, []);

  const handleClear = useCallback(() => setQuery(''), [setQuery]);

  const keyExtractor = useCallback((item: HymnRecord) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: LIST_ITEM_HEIGHT,
      offset: LIST_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const listItemColours = useMemo(() => ({
    background:            colours.background.secondary,
    border:                colours.border.default,
    text:                  colours.text.primary,
    meta:                  colours.text.secondary,
    numberBadgeBackground: colours.accent.primary + '20',
    numberBadgeText:       colours.accent.primary,
    favouriteActive:       colours.accent.secondary,
    favouriteInactive:     colours.text.secondary,
  }), [colours]);

  const emptyColours = useMemo(() => ({
    textPrimary:   colours.text.primary,
    textSecondary: colours.text.secondary,
    accentPrimary: colours.accent.primary,
    border:        colours.border.default,
  }), [colours]);

  const renderItem: ListRenderItem<HymnRecord> = useCallback(({ item }) => (
    <HymnListItem
      hymn={item}
      isFavourite={isFavourite(item.id)}
      onPress={handleHymnPress}
      onFavouriteToggle={(id) => void toggleFavourite(id)}
      fontSize="md"
      colours={listItemColours}
    />
  ), [isFavourite, handleHymnPress, toggleFavourite, listItemColours]);

  const showNoResults = query.trim().length > 0 && results.length === 0 && !isSearching;
  const showHint = query.trim().length === 0;

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colours.background.header }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
        >
          <ThemedText colour={colours.text.onHeader} style={styles.backArrow}><Ionicons name="arrow-back" size={24} color={colours.text.onHeader} /></ThemedText>
        </Pressable>
        <ThemedText variant="uiLabel" colour={colours.text.onHeader} style={styles.headerTitle}>
          {t('screen_search')}
        </ThemedText>
      </View>

      {/* Search bar — autofocus on this screen */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={handleClear}
        placeholder={t('search_placeholder')}
        autoFocus
        colours={{
         background:  colours.background.secondary,
         text:        colours.text.primary,
         placeholder: colours.text.muted,
         border:      colours.border.input,
         icon:        colours.text.secondary,
}}
      />

      {/* Hint */}
      {showHint && (
        <View style={styles.hintContainer}>
          <ThemedText variant="body" colour={colours.text.secondary} style={styles.hint}>
            {t('search_empty_hint')}
          </ThemedText>
        </View>
      )}

      {/* No results empty state */}
      {showNoResults && (
        <EmptyState
          variant="search"
          title={t('empty_search_title')}
          body={t('empty_search_body')}
          actionLabel={t('action_clear_search')}
          onAction={handleClear}
          colours={emptyColours}
        />
      )}

      {/* Results list */}
      {!showHint && !showNoResults && (
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={10}
          removeClippedSubviews
          initialNumToRender={15}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen:    { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  backButton: {
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontSize: 22, fontWeight: '600' },
  headerTitle: { flex: 1, marginLeft: SPACING.sm, fontWeight: '700' },
  hintContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  hint: { textAlign: 'center', lineHeight: 22 },
  list: { flex: 1 },
});
