// FILE PATH: app/(tabs)/favourites.tsx
// PURPOSE: Saved/bookmarked hymns screen.

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
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLanguage } from '../../context/LanguageContext';
import { useFavourites } from '../../hooks/useFavourites';
import { hymnService } from '../../services/hymnService';
import HymnListItem from '../../components/hymn/HymnListItem';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { getThemeColours } from '../../constants/theme';
import {
  SPACING,
  HEADER_HEIGHT,
  LIST_ITEM_HEIGHT,
  TOUCH_TARGET_MIN,
} from '../../constants/layout';
import type { HymnRecord } from '../../types/hymn';

export default function FavouritesScreen() {
  const { t, currentLanguage } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');
  const { favourites, isFavourite, toggleFavourite, clearFavourites } = useFavourites();

  const hymnList: HymnRecord[] = useMemo(() => {
    return favourites
      .map((id) => hymnService.getHymn(id, currentLanguage))
      .filter((h): h is HymnRecord => h !== null);
  }, [favourites, currentLanguage]);

  const handleHymnPress = useCallback((id: string) => {
    router.push(`/hymn/${id}`);
  }, []);

  const handleFavouriteToggle = useCallback((id: string) => {
    void toggleFavourite(id);
  }, [toggleFavourite]);

  const keyExtractor = useCallback((item: HymnRecord) => item.id, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: LIST_ITEM_HEIGHT,
      offset: LIST_ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const emptyColours = useMemo(() => ({
    textPrimary:   colours.text.primary,
    textSecondary: colours.text.secondary,
    accentPrimary: colours.accent.primary,
    border:        colours.border.default,
  }), [colours]);

  // Match exactly what HymnListItem expects
  const listItemColours = useMemo(() => ({
    background:           colours.background.secondary,
    border:               colours.border.default,
    text:                 colours.text.primary,
    meta:                 colours.text.secondary,
    numberBadgeBackground: colours.accent.primary,
    numberBadgeText:      colours.text.onHeader,
    favouriteActive:      colours.accent.secondary,
    favouriteInactive:    colours.text.secondary,
  }), [colours]);

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />

      <View style={[styles.banner, { backgroundColor: colours.background.header }]}>
        <ThemedText
          variant="hymnTitle"
          colour={colours.text.onHeader}
          style={styles.bannerTitle}
        >
          {t('screen_favourite')}
        </ThemedText>
        {hymnList.length > 0 && (
          <Pressable
            onPress={() => void clearFavourites()}
            style={styles.clearButton}
            accessibilityRole="button"
            accessibilityLabel={t('action_clear_all')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name="trash-outline"
              size={20}
              color={colours.text.onHeader}
            />
          </Pressable>
        )}
      </View>

      {hymnList.length === 0 ? (
        <EmptyState
          variant="favourites"
          title={t('empty_favourites_title')}
          body={t('empty_favourites_body')}
          actionLabel={t('action_browse_hymns')}
          onAction={() => router.push('/')}
          colours={emptyColours}
        />
      ) : (
        <FlatList
          data={hymnList}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          renderItem={({ item }) => (
            <HymnListItem
             hymn={item}
             isFavourite={isFavourite(item.id)}
             onPress={handleHymnPress}
             onFavouriteToggle={handleFavouriteToggle}
             fontSize="md"
             colours={listItemColours}
           />
          )}
          windowSize={10}
          removeClippedSubviews
          initialNumToRender={15}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  banner: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  bannerTitle: { fontWeight: '700' },
  clearButton: {
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { paddingBottom: SPACING.xl },
});