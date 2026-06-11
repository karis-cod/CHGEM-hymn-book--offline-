// FILE PATH: app/category/[name].tsx
// PURPOSE: Filtered hymn list for a single category.
// PRD Reference: Section 7 (US-08), Section 8.1, Section 14.1 (P1).
// Category names are NEVER hardcoded — always derived from hymnService.

import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import type { ListRenderItem } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useLanguage } from '../../context/LanguageContext';
import { useFavourites } from '../../hooks/useFavourites';
import { hymnService } from '../../services/hymnService';
import HymnListItem from '../../components/hymn/HymnListItem';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { getThemeColours } from '../../constants/theme';
import { LIST_ITEM_HEIGHT, SPACING, HEADER_HEIGHT, TOUCH_TARGET_MIN } from '../../constants/layout';
import type { HymnRecord } from '../../types/hymn';

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { t, currentLanguage } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  const { isFavourite, toggleFavourite } = useFavourites();

  // Decode the category name from the URL param
  const categoryName = useMemo(
    () => (name ? decodeURIComponent(name) : ''),
    [name]
  );

  const hymns = useMemo((): HymnRecord[] => {
    if (!hymnService.isInitialised() || !categoryName) return [];
    return hymnService.getHymnsByCategory(categoryName, currentLanguage);
  }, [categoryName, currentLanguage]);

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
      onPress={(id) => router.push(`/hymn/${id}`)}
      onFavouriteToggle={(id) => void toggleFavourite(id)}
      fontSize="md"
      colours={listItemColours}
    />
  ), [isFavourite, toggleFavourite, listItemColours]);

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />

      <View style={[styles.banner, { backgroundColor: colours.background.header }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
        >
          <ThemedText colour={colours.text.onHeader} style={styles.backArrow}><Ionicons name="arrow-back" size={24} color={colours.text.onHeader} /></ThemedText>
        </Pressable>
        <ThemedText
          variant="hymnTitle"
          colour={colours.text.onHeader}
          style={styles.bannerTitle}
          numberOfLines={2}
        >
          {categoryName}
        </ThemedText>
      </View>

      {hymns.length === 0 ? (
        <EmptyState
          variant="category"
          title={t('empty_category_title')}
          body={t('empty_category_body')}
          actionLabel={t('action_back')}
          onAction={() => router.back()}
          colours={emptyColours}
        />
      ) : (
        <FlatList
          data={hymns}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          windowSize={10}
          removeClippedSubviews
          initialNumToRender={15}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  banner: {
    height: HEADER_HEIGHT,
    paddingTop: 44,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: SPACING.md,
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow:   { fontSize: 22, fontWeight: '600' },
  bannerTitle: { fontWeight: '700', paddingLeft: TOUCH_TARGET_MIN },
  list:        { flex: 1 },
});
