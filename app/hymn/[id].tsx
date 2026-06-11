// FILE PATH: app/hymn/[id].tsx
// PURPOSE: Hymn Reader — structured stanza display with share + favourite.
// PRD Reference: Section 7 (US-03, US-04, US-05), Section 14.3, Section 16.3.
//
// Uses ScrollView (not FlatList) — stanza count is small and bounded (PRD Section 16.3).
// keyboardShouldPersistTaps='handled' prevents keyboard flicker on navigation (PRD Section 17.7).
// Saves to recents on mount (PRD Section 7, US-10).
// Language toggle in header switches between EN/YO stanzas instantly.

import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { useLanguage } from '../../context/LanguageContext';
import { useFavourites } from '../../hooks/useFavourites';
import { useRecents } from '../../hooks/useRecents';
import { hymnService } from '../../services/hymnService';
import HymnHeader from '../../components/hymn/HymnHeader';
import StanzaBlock from '../../components/hymn/StanzaBlock';
import FavouriteButton from '../../components/ui/FavouriteButton';
import ShareButton from '../../components/ui/ShareButton';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { getThemeColours } from '../../constants/theme';
import { SPACING, TOUCH_TARGET_MIN } from '../../constants/layout';
import type { AppLanguage } from '../../types/language';
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function HymnReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  const { isFavourite, toggleFavourite } = useFavourites();
  const { addRecent } = useRecents();

  // Resolve hymn record for current language
  const hymn = useMemo(() => {
    if (!id || !hymnService.isInitialised()) return null;
    return hymnService.getHymn(id, currentLanguage);
  }, [id, currentLanguage]);

  // Save to recents on mount — PRD Section 7 (US-10)
  useEffect(() => {
    if (id) {
      void addRecent(id);
    }
  }, [id, addRecent]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const handleFavouriteToggle = useCallback(() => {
    if (id) void toggleFavourite(id);
  }, [id, toggleFavourite]);

  const stanzaLabels = useMemo(() => ({
    verse:   t('reader_verse'),
    chorus:  t('reader_chorus'),
    bridge:  t('reader_bridge'),
    refrain: t('reader_refrain'),
    intro:   t('reader_intro'),
    outro:   t('reader_outro'),
  }), [t]);

  const stanzaColours = useMemo(() => ({
    cardBackground:  colours.stanza.verseBackground,
    chorusBackground: colours.stanza.chorusBackground,
    text:            colours.text.primary,
    textMuted:       colours.text.secondary,
    chorusLabel:     colours.stanza.labelChorus,
    bridgeLabel:     colours.stanza.labelBridge,
    bridgeBorder:    colours.stanza.bridgeBorder,
    verseLabel:      colours.text.secondary,
  }), [colours]);

  const emptyColours = useMemo(() => ({
    textPrimary:   colours.text.primary,
    textSecondary: colours.text.secondary,
    accentPrimary: colours.accent.primary,
    border:        colours.border.default,
  }), [colours]);

  // Language toggle — only show languages with stanzas in corpus
  const availableLanguages = hymn?.available_languages ?? ['en'];

  if (!hymn) {
    return (
      <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />
        <View style={[styles.navBar, { backgroundColor: colours.background.header }]}>
          <Pressable
            onPress={handleBack}
            style={styles.navButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={t('action_back')}
          >
            <ThemedText colour={colours.text.onHeader} style={styles.backArrow}><Ionicons name="arrow-back" size={24} color={colours.text.onHeader} /></ThemedText>
          </Pressable>
        </View>
        <EmptyState
          variant="missing-lyrics"
          title={t('empty_lyrics_title')}
          body={t('empty_lyrics_body')}
          actionLabel={t('action_report_issue')}
          onAction={() => router.push('/about')}
          colours={emptyColours}
        />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />

      {/* Navigation bar */}
      <View style={[styles.navBar, { backgroundColor: colours.background.header }]}>
        <Pressable
          onPress={handleBack}
          style={styles.navButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
        >
          <ThemedText colour={colours.text.onHeader} style={styles.backArrow}><Ionicons name="arrow-back" size={24} color={colours.text.onHeader} /></ThemedText>
        </Pressable>

        <ThemedText
          variant="uiLabel"
          colour={colours.text.onHeader}
          style={styles.navTitle}
          numberOfLines={1}
        >
          {t('share_hymn_prefix')} {String(hymn.hymn_number).padStart(3, '0')}
        </ThemedText>

        <View style={styles.navActions}>
          {/* Language toggle — only if Yoruba is available */}
          {availableLanguages.length > 1 && (
            <Pressable
              onPress={() => {
                const next: AppLanguage = currentLanguage === 'en' ? 'yo' : 'en';
                setLanguage(next);
              }}
              style={[styles.langToggle, { borderColor: colours.text.onHeader + '60' }]}
              accessibilityRole="button"
              accessibilityLabel={t('language_select')}
            >
              <ThemedText
                variant="uiLabel"
                colour={colours.text.onHeader}
                style={styles.langLabel}
              >
                {currentLanguage === 'en' ? 'YOR' : 'ENG'}
              </ThemedText>
            </Pressable>
          )}

          <ShareButton
            hymn={hymn}
            colour={colours.text.onHeader}
            hymnPrefix={t('share_hymn_prefix')}
          />

          <FavouriteButton
            isFavourite={id ? isFavourite(id) : false}
            onToggle={handleFavouriteToggle}
            size={22}
            activeColour={colours.accent.secondary}
            inactiveColour={colours.text.onHeader}
          />
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Banner + metadata + title */}
        <HymnHeader
          hymn={hymn}
          fontSize="md"
          hymnPrefix={t('share_hymn_prefix')}
          colours={{
            bannerBackground: colours.background.header,
            bannerText:       colours.text.onHeader,
            metaText:         colours.text.secondary,
            titleText:        colours.text.primary,
            metaBackground:   colours.background.secondary,
          }}
        />

        {/* Stanzas */}
        <View style={styles.stanzasContainer}>
          {hymn.stanzas.length === 0 ? (
            <EmptyState
              variant="missing-lyrics"
              title={t('empty_lyrics_title')}
              body={t('empty_lyrics_body')}
              actionLabel={t('action_report_issue')}
              onAction={() => router.push('/about')}
              colours={emptyColours}
            />
          ) : (
            hymn.stanzas.map((stanza) => (
              <StanzaBlock
                key={stanza.id}
                stanza={stanza}
                fontSize="md"
                showVerseNumbers
                labels={stanzaLabels}
                colours={stanzaColours}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44, // Status bar safe area
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  navButton: {
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '600',
  },
  navTitle: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontWeight: '700',
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  langToggle: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    minHeight: TOUCH_TARGET_MIN,
    justifyContent: 'center',
  },
  langLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  stanzasContainer: {
    padding: SPACING.md,
  },
});
