// FILE PATH: app/(tabs)/index.tsx
import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import type { ListRenderItem } from 'react-native';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useHymnList } from '../../hooks/useHymnList';
import { useSearch } from '../../hooks/useSearch';
import { useFavourites } from '../../hooks/useFavourites';
import HymnListItem from '../../components/hymn/HymnListItem';
import SearchBar from '../../components/ui/SearchBar';
import SortToggle from '../../components/ui/SortToggle';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { LIST_ITEM_HEIGHT, SPACING, HEADER_HEIGHT } from '../../constants/layout';
import type { HymnRecord } from '../../types/hymn';

export default function IndexScreen() {
  const { t, currentLanguage } = useLanguage();
  const { colors } = useTheme();
  const { fontSize } = useSettings();

  const { hymns, sortOrder, setSortOrder } = useHymnList(currentLanguage);
  const { query, setQuery, results, isSearching } = useSearch(currentLanguage);
  const { favourites, toggleFavourite } = useFavourites();

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
    background:            colors.background.secondary,
    border:                colors.border.default,
    text:                  colors.text.primary,
    meta:                  colors.text.secondary,
    numberBadgeBackground: colors.accent.primary + '20',
    numberBadgeText:       colors.accent.primary,
    favouriteActive:       colors.accent.secondary,
    favouriteInactive:     colors.text.secondary,
  }), [colors]);

  const renderItem: ListRenderItem<HymnRecord> = useCallback(
  ({ item }) => (
    <HymnListItem
      hymn={item}
      isFavourite={favourites.includes(item.id)}
      onPress={handleHymnPress}
      onFavouriteToggle={handleFavouriteToggle}
      fontSize={fontSize}
      colours={listItemColours}
    />
  ),
  [favourites, handleHymnPress, handleFavouriteToggle, fontSize, listItemColours]
);
  const searchBarColours = useMemo(() => ({
    background:  colors.background.secondary,
    text:        colors.text.primary,
    placeholder: colors.text.muted,
    border:      colors.border.input,
    icon:        colors.text.secondary,
    clearButton: colors.text.secondary,
  }), [colors]);

  const sortColours = useMemo(() => ({
    activeBackground:   colors.accent.primary,
    activeText:         colors.text.onHeader,
    inactiveBackground: colors.background.secondary,
    inactiveText:       colors.text.secondary,
    border:             colors.border.default,
  }), [colors]);

  const emptyColours = useMemo(() => ({
    textPrimary:   colors.text.primary,
    textSecondary: colors.text.secondary,
    accentPrimary: colors.accent.primary,
    border:        colors.border.default,
  }), [colors]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.header} />

      <View style={[styles.banner, { backgroundColor: colors.background.header }]}>
        <ThemedText variant="hymnTitle" colour={colors.text.onHeader} style={styles.bannerTitle}>
          {t('screen_index')}
        </ThemedText>
        <ThemedText variant="listMeta" colour={colors.text.onHeader + 'AA'} style={styles.bannerSub}>
          {sortOrder === 'numerical' ? t('sort_numerical') : t('sort_alphabetical')}
        </ThemedText>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        onClear={handleClearSearch}
        placeholder={t('search_placeholder')}
        colours={searchBarColours}
        keyboardType="default"
      />

      {!isSearchActive && (
        <SortToggle
          sortOrder={sortOrder}
          onChangeSortOrder={setSortOrder}
          labelNumerical={t('sort_numerical')}
          labelAlphabetical={t('sort_alphabetical')}
          colours={sortColours}
        />
      )}

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
          contentContainerStyle={displayList.length === 0 ? styles.emptyList : undefined}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  banner: {
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  bannerTitle: { fontWeight: '700' },
  bannerSub: { marginTop: SPACING.xs },
  list: { flex: 1 },
  emptyList: { flex: 1 },
});