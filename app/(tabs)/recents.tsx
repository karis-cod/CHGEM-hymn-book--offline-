// FILE PATH: app/(tabs)/recents.tsx
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
import { useRecents } from '../../hooks/useRecents';
import { useFavourites } from '../../hooks/useFavourites';
import { hymnService } from '../../services/hymnService';
import HymnListItem from '../../components/hymn/HymnListItem';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { LIST_ITEM_HEIGHT, SPACING, HEADER_HEIGHT } from '../../constants/layout';
import type { HymnRecord } from '../../types/hymn';

export default function RecentsScreen() {
  const { t, currentLanguage } = useLanguage();
  const { colors } = useTheme();
  const { fontSize } = useSettings();
  const { recents, isLoading } = useRecents();
  const { favourites, toggleFavourite } = useFavourites();

  const hymnRecords = useMemo((): HymnRecord[] => {
    if (!hymnService.isInitialised()) return [];
    return recents
      .map((id) => hymnService.getHymn(id, currentLanguage))
      .filter((h): h is HymnRecord => h !== null);
  }, [recents, currentLanguage]);

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

  const emptyColours = useMemo(() => ({
    textPrimary:   colors.text.primary,
    textSecondary: colors.text.secondary,
    accentPrimary: colors.accent.primary,
    border:        colors.border.default,
  }), [colors]);

  /* const renderItem: ListRenderItem<HymnRecord> = useCallback(({ item }) => (
    <HymnListItem
      hymn={item}
      isFavourite={isFavourite(item.id)}
      onPress={(id) => router.push(`/hymn/${id}`)}
      onFavouriteToggle={(id) => void toggleFavourite(id)}
      fontSize={fontSize}
      colours={listItemColours}
    />
  ), [isFavourite, toggleFavourite, fontSize, listItemColours]); */

  const renderItem: ListRenderItem<HymnRecord> = useCallback(({ item }) => (
  <HymnListItem
    hymn={item}
    isFavourite={favourites.includes(item.id)}
    onPress={(id) => router.push(`/hymn/${id}`)}
    onFavouriteToggle={(id) => void toggleFavourite(id)}
    fontSize={fontSize}
    colours={listItemColours}
  />
), [favourites, toggleFavourite, fontSize, listItemColours]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.header} />

      <View style={[styles.banner, { backgroundColor: colors.background.header }]}>
        <ThemedText variant="hymnTitle" colour={colors.text.onHeader} style={styles.bannerTitle}>
          {t('screen_recent')}
        </ThemedText>
      </View>

      {!isLoading && hymnRecords.length === 0 ? (
        <EmptyState
          variant="recents"
          title={t('empty_recents_title')}
          body={t('empty_recents_body')}
          actionLabel={t('action_browse_hymns')}
          onAction={() => router.push('/')}
          colours={emptyColours}
        />
      ) : (
        <FlatList
          data={hymnRecords}
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
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  bannerTitle: { fontWeight: '700' },
  list: { flex: 1 },
});