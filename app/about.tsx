// FILE PATH: app/about.tsx
// PURPOSE: About / Support screen — app version, corpus version, report issue.
// PRD Reference: Section 8.2, Section 14.1.

import React, { useCallback } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

import { useLanguage } from '../context/LanguageContext';
import  ThemedText from '../components/ui/ThemedText';
import { getThemeColours } from '../constants/theme';
import { SPACING, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../constants/layout';
import Ionicons from '@expo/vector-icons/Ionicons';

const APP_VERSION    = '1.0.0';
const CORPUS_VERSION = '2025.2';
const SUPPORT_EMAIL  = 'support@chgem.org';

export default function AboutScreen() {
  const { t } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');

  const handleSendReport = useCallback(() => {
    const subject = encodeURIComponent(
      `CHGEM Hymn Book Issue [v${APP_VERSION} / corpus ${CORPUS_VERSION}]`
    );
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}`);
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />

      {/* Nav bar */}
      <View style={[styles.navBar, { backgroundColor: colours.background.header }]}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={t('action_back')}
        >
          <ThemedText colour={colours.text.onHeader} style={styles.backArrow}><Ionicons name="arrow-back" size={24} color={colours.text.onHeader} /></ThemedText>
        </Pressable>
        <ThemedText variant="uiLabel" colour={colours.text.onHeader} style={styles.navTitle}>
          {t('screen_about')}
        </ThemedText>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* App identity */}
        <View style={[styles.card, { backgroundColor: colours.background.secondary }]}>
          <ThemedText variant="hymnTitle" colour={colours.text.primary} style={styles.appTitle}>
            {t('about_title')}
          </ThemedText>
          <ThemedText variant="body" colour={colours.text.secondary} style={styles.appBody}>
            {t('about_body')}
          </ThemedText>
        </View>

        {/* Version info */}
        <View style={[styles.card, { backgroundColor: colours.background.secondary }]}>
          <View style={[styles.row, { borderBottomColor: colours.border.default }]}>
            <ThemedText variant="uiLabel" colour={colours.text.primary}>
              {t('about_app_ver')}
            </ThemedText>
            <ThemedText variant="uiLabel" colour={colours.text.secondary}>
              {APP_VERSION}
            </ThemedText>
          </View>
          <View style={styles.rowLast}>
            <ThemedText variant="uiLabel" colour={colours.text.primary}>
              {t('about_corpus_ver')}
            </ThemedText>
            <ThemedText variant="uiLabel" colour={colours.text.secondary}>
              {CORPUS_VERSION}
            </ThemedText>
          </View>
        </View>

        {/* Report button */}
        <Pressable
          onPress={handleSendReport}
          style={({ pressed }) => [
            styles.reportButton,
            { backgroundColor: colours.accent.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={t('action_send_report')}
        >
          <ThemedText variant="uiLabel" colour={colours.text.onHeader}>
            {t('action_send_report')}
          </ThemedText>
        </Pressable>

        <ThemedText variant="caption" colour={colours.text.secondary} style={styles.emailHint}>
          {SUPPORT_EMAIL}
        </ThemedText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen:  { flex: 1 },
  navBar: {
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
  navTitle:  { flex: 1, marginLeft: SPACING.sm, fontWeight: '700' },
  content:   { padding: SPACING.md, gap: SPACING.md, paddingBottom: SPACING.xxl },
  card: {
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  appTitle:  { marginBottom: SPACING.xs },
  appBody:   { lineHeight: 22 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  reportButton: {
    borderRadius: BORDER_RADIUS.md,
    minHeight: TOUCH_TARGET_MIN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailHint: { textAlign: 'center' },
});
