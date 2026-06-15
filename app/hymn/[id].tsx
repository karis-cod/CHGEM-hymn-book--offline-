// FILE PATH: app/hymn/[id].tsx
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/build/Ionicons';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useFavourites } from '../../hooks/useFavourites';
import { useRecents } from '../../hooks/useRecents';
import { hymnService } from '../../services/hymnService';
import HymnHeader from '../../components/hymn/HymnHeader';
import StanzaBlock from '../../components/hymn/StanzaBlock';
import FavouriteButton from '../../components/ui/FavouriteButton';
import ShareButton from '../../components/ui/ShareButton';
import EmptyState from '../../components/ui/EmptyState';
import ThemedText from '../../components/ui/ThemedText';
import { SPACING, TOUCH_TARGET_MIN } from '../../constants/layout';
import type { AppLanguage } from '../../types/language';

export default function HymnReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { colors } = useTheme();
  const { fontSize, showVerseNumbers } = useSettings();

  const { isFavourite, toggleFavourite } = useFavourites();
  const { addRecent } = useRecents();

  const hymn = useMemo(() => {
    if (!id || !hymnService.isInitialised()) return null;
    return hymnService.getHymn(id, currentLanguage);
  }, [id, currentLanguage]);

  useEffect(() => {
    if (id) void addRecent(id);
  }, [id, addRecent]);

  const handleBack = useCallback(() => { router.back(); }, []);

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
    cardBackground:   colors.stanza.verseBackground,
    chorusBackground: colors.stanza.chorusBackground,
    text:             colors.text.primary,
    textMuted:        colors.text.secondary,
    chorusLabel:      colors.stanza.labelChorus,
    bridgeLabel:      colors.stanza.labelBridge,
    bridgeBorder:     colors.stanza.bridgeBorder,
    verseLabel:       colors.text.secondary,
  }), [colors]);

  const emptyColours = useMemo(() => ({
    textPrimary:   colors.text.primary,
    textSecondary: colors.text.secondary,
    accentPrimary: colors.accent.primary,
    border:        colors.border.default,
  }), [colors]);

  const availableLanguages = hymn?.available_languages ?? ['en'];

  if (!hymn) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background.primary }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background.header} />
        <View style={[styles.navBar, { backgroundColor: colors.background.header }]}>
          <Pressable onPress={handleBack} style={styles.navButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button" accessibilityLabel={t('action_back')}>
            <Ionicons name="arrow-back" size={24} color={colors.text.onHeader} />
          </Pressable>
        </View>
        <EmptyState variant="missing-lyrics" title={t('empty_lyrics_title')}
          body={t('empty_lyrics_body')} actionLabel={t('action_report_issue')}
          onAction={() => router.push('/about')} colours={emptyColours} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.header} />

      <View style={[styles.navBar, { backgroundColor: colors.background.header }]}>
        <Pressable onPress={handleBack} style={styles.navButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button" accessibilityLabel={t('action_back')}>
          <Ionicons name="arrow-back" size={24} color={colors.text.onHeader} />
        </Pressable>

        <ThemedText variant="uiLabel" colour={colors.text.onHeader}
          style={styles.navTitle} numberOfLines={1}>
          {t('share_hymn_prefix')} {String(hymn.hymn_number).padStart(3, '0')}
        </ThemedText>

        <View style={styles.navActions}>
          {availableLanguages.length > 1 && (
            <Pressable
              onPress={() => {
                const next: AppLanguage = currentLanguage === 'en' ? 'yo' : 'en';
                setLanguage(next);
              }}
              style={[styles.langToggle, { borderColor: colors.text.onHeader + '60' }]}
              accessibilityRole="button" accessibilityLabel={t('language_select')}>
              <ThemedText variant="uiLabel" colour={colors.text.onHeader} style={styles.langLabel}>
                {currentLanguage === 'en' ? 'YOR' : 'ENG'}
              </ThemedText>
            </Pressable>
          )}

          <ShareButton hymn={hymn} colour={colors.text.onHeader}
            hymnPrefix={t('share_hymn_prefix')} />

          <FavouriteButton
            isFavourite={id ? isFavourite(id) : false}
            onToggle={handleFavouriteToggle}
            size={22}
            activeColour={colors.accent.secondary}
            inactiveColour={colors.text.onHeader}
          />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <HymnHeader hymn={hymn} fontSize={fontSize}
          hymnPrefix={t('share_hymn_prefix')}
          colours={{
            bannerBackground: colors.background.header,
            bannerText:       colors.text.onHeader,
            metaText:         colors.text.secondary,
            titleText:        colors.text.primary,
            metaBackground:   colors.background.secondary,
          }} />

        <View style={styles.stanzasContainer}>
          {hymn.stanzas.length === 0 ? (
            <EmptyState variant="missing-lyrics" title={t('empty_lyrics_title')}
              body={t('empty_lyrics_body')} actionLabel={t('action_report_issue')}
              onAction={() => router.push('/about')} colours={emptyColours} />
          ) : (
            hymn.stanzas.map((stanza) => (
              <StanzaBlock key={stanza.id} stanza={stanza}
                fontSize={fontSize}
                showVerseNumbers={showVerseNumbers}
                labels={stanzaLabels} colours={stanzaColours} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  navBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: 44, paddingBottom: SPACING.sm, paddingHorizontal: SPACING.md,
  },
  navButton: { minWidth: TOUCH_TARGET_MIN, minHeight: TOUCH_TARGET_MIN, alignItems: 'center', justifyContent: 'center' },
  navTitle: { flex: 1, marginLeft: SPACING.sm, fontWeight: '700' },
  navActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  langToggle: { borderWidth: 1, borderRadius: 4, paddingHorizontal: SPACING.xs, paddingVertical: 2, minHeight: TOUCH_TARGET_MIN, justifyContent: 'center' },
  langLabel: { fontSize: 11, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xxl },
  stanzasContainer: { padding: SPACING.md },
  backArrow: { fontSize: 22, fontWeight: '600' },
});