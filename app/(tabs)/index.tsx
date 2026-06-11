// FILE PATH: app/(tabs)/index.tsx
// PURPOSE: Home / Hymn Index screen — search bar + sorted hymn list.
// PRD Reference: Section 14.4 (layout spec), Section 5 (search), Section 7 (US-01, US-02).
//
// Layout zones (PRD Section 14.4):
//   1. Header banner — dark blue with musical notes, "Index" title
//   2. Search bar — number-pad default, toggle to text keyboard
//   3. Sort toggle — Numerical / A–Z (session-only)
//   4. Hymn FlatList — fixed 64pt rows, getItemLayout, memoised
//   5. Empty state — shown only when search has no results
//
// Performance (PRD Section 16.2):
//   - getItemLayout with LIST_ITEM_HEIGHT=64
//   - keyExtractor uses hymn.id
//   - renderItem is memoised HymnListItem
//   - windowSize=10, removeClippedSubviews=true (Android), initialNumToRender=15

import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import type { ListRenderItem } from 'react-native';

import { useLanguage } from '../../context/LanguageContext';
import { useHymnList } from '../../hooks/useHymnList';
import { useSearch } from '../../hooks/useSearch';
import { useFavourites } from '../../hooks/useFavourites';
import HymnListItem from '../../components/hymn/HymnListItem';
import SearchBar from '../../components/ui/SearchBar';
import SortToggle from '../../components/ui/SortToggle';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { getThemeColours } from '../../constants/theme';
import { LIST_ITEM_HEIGHT, SPACING, HEADER_HEIGHT } from '../../constants/layout';
import type { HymnRecord } from '../../types/hymn';

export default function IndexScreen() {
  const { t, currentLanguage } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  const { hymns, sortOrder, setSortOrder } = useHymnList(currentLanguage);
  const { query, setQuery, results, isSearching } = useSearch(currentLanguage);
  const { isFavourite, toggleFavourite } = useFavourites();

  // When searching, show results; otherwise show full list
  const displayList = query.trim().length > 0 ? results : hymns;
  const isSearchActive = query.trim().length > 0;

  const handleHymnPress = useCallback((id: string) => {
    router.push(`/hymn/${id}`);
  }, []);

  const handleFavouriteToggle = useCallback((id: string) => {
    void toggleFavourite(id);
  }, [toggleFavourite]);

  const handleClearSearch = useCallback(() => {
    setQuery('');
  }, [setQuery]);

  // Stable key extractor — uses hymn.id (PRD Section 16.5)
  const keyExtractor = useCallback((item: HymnRecord) => item.id, []);

  // Fixed height getItemLayout — O(1) scroll position (PRD Section 16.2)
  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: LIST_ITEM_HEIGHT,
      offset: LIST_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  // Memoised render function — no anonymous functions in renderItem (PRD Section 16.5)
  const renderItem: ListRenderItem<HymnRecord> = useCallback(
    ({ item }) => (
      <HymnListItem
        hymn={item}
        isFavourite={isFavourite(item.id)}
        onPress={handleHymnPress}
        onFavouriteToggle={handleFavouriteToggle}
        fontSize="md"
        colours={{
          background:            colours.background.secondary,
          border:                colours.border.default,
          text:                  colours.text.primary,
          meta:                  colours.text.secondary,
          numberBadgeBackground: colours.accent.primary + '20',
          numberBadgeText:       colours.accent.primary,
          favouriteActive:       colours.accent.secondary,
          favouriteInactive:     colours.text.secondary,
        }}
      />
    ),
    [isFavourite, handleHymnPress, handleFavouriteToggle, colours]
  );

  const searchBarColours = useMemo(() => ({
    background:  colours.background.secondary,
    text:        colours.text.primary,
    placeholder: colours.text.muted,
    border:      colours.border.input,
    icon:        colours.text.secondary,
    clearButton: colours.text.secondary,
  }), [colours]);

  const sortColours = useMemo(() => ({
    activeBackground:   colours.accent.primary,
    activeText:         colours.text.onHeader,
    inactiveBackground: colours.background.secondary,
    inactiveText:       colours.text.secondary,
    border:             colours.border.default,
  }), [colours]);

  const emptyColours = useMemo(() => ({
    textPrimary:   colours.text.primary,
    textSecondary: colours.text.secondary,
    accentPrimary: colours.accent.primary,
    border:        colours.border.default,
  }), [colours]);

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colours.background.header}
      />

      {/* Banner header */}
      <View style={[styles.banner, { backgroundColor: colours.background.header }]}>
        <ThemedText
          variant="hymnTitle"
          colour={colours.text.onHeader}
          style={styles.bannerTitle}
        >
          {t('screen_index')}
        </ThemedText>
        <ThemedText
          variant="listMeta"
          colour={colours.text.onHeader + 'AA'}
          style={styles.bannerSub}
        >
          {sortOrder === 'numerical' ? t('sort_numerical') : t('sort_alphabetical')}
        </ThemedText>
      </View>

      {/* Search bar */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={handleClearSearch}
        placeholder={t('search_placeholder')}
        colours={searchBarColours}
        keyboardType="default"
      />

      {/* Sort toggle — hidden while searching */}
      {!isSearchActive && (
        <SortToggle
          sortOrder={sortOrder}
          onChangeSortOrder={setSortOrder}
          labelNumerical={t('sort_numerical')}
          labelAlphabetical={t('sort_alphabetical')}
          colours={sortColours}
        />
      )}

      {/* Hymn list or empty state */}
      {isSearchActive && displayList.length === 0 && !isSearching ? (
        <EmptyState
          variant="search"
          title={t('empty_search_title')}
          body={t('empty_search_body')}
          actionLabel={t('action_clear_search')}
          onAction={handleClearSearch}
          colours={emptyColours}
        />
      ) : (
        <FlatList
          data={displayList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={10}
          removeClippedSubviews
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          style={styles.list}
          contentContainerStyle={
            displayList.length === 0 ? styles.emptyList : undefined
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  banner: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  bannerTitle: {
    fontWeight: '700',
  },
  bannerSub: {
    marginTop: SPACING.xs,
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flex: 1,
  },
});
