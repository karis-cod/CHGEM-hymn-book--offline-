// FILE PATH: app/(tabs)/settings.tsx
// PURPOSE: Settings screen — theme, language, font size, offline badge.
//
// PHASE 4 CHANGES:
//   - fontSize / showVerseNumbers / keepScreenOn now read from and write to
//     SettingsContext (useSettings()) instead of local useState — these
//     values are now shared with HymnReader, StanzaBlock, HymnListItem, etc.
//   - Removed raw useColorScheme() — colours now come from useTheme(),
//     which respects the manual Light/Dark/System override.
//   - Added a Theme section: Light / Dark / System selector, persisted via
//     ThemeContext.setThemeMode().
//   - Added a live font-size preview line under the font size selector —
//     it re-renders instantly as the user taps XS..XXL because it reads
//     fontSize from the same shared SettingsContext.
//   - persistSetting() helper removed — setters in SettingsContext now
//     handle persistence themselves.

import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  StatusBar,
} from 'react-native';

import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useSettings } from '../../context/SettingsContext';
import { useRecents } from '../../hooks/useRecents';
import OfflineBadge from '../../components/ui/OfflineBadge';
import ThemedText from '../../components/ui/ThemedText';
import { SPACING, HEADER_HEIGHT, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/layout';
import { SUPPORTED_LANGUAGES } from '../../types/language';
import type { AppLanguage } from '../../types/language';
import type { FontSizeStep, ThemeMode } from '../../types/settings';
const APP_VERSION    = '1.0.0';
const CORPUS_VERSION = '2025.2';
const SUPPORT_EMAIL  = 'chukwuebukaogu3@gmail.com';

export default function SettingsScreen() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const { colors, themeMode, setThemeMode } = useTheme();
  const {
    fontSize,
    showVerseNumbers,
    keepScreenOn,
    setFontSize,
    setShowVerseNumbers,
    setKeepScreenOn,
  } = useSettings();
  const { clearRecents } = useRecents();

  const handleLanguageToggle = useCallback((lang: AppLanguage) => {
    setLanguage(lang);
  }, [setLanguage]);

  const handleFontSizeChange = useCallback((step: FontSizeStep) => {
    setFontSize(step);
  }, [setFontSize]);

  const handleThemeChange = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, [setThemeMode]);

  const handleClearRecents = useCallback(() => {
    Alert.alert(
      t('settings_clear_recents'),
      t('settings_clear_recents_sub'),
      [
        { text: t('action_back'), style: 'cancel' },
        { text: t('action_clear_all'), style: 'destructive', onPress: () => void clearRecents() },
      ]
    );
  }, [t, clearRecents]);

  const handleSendReport = useCallback(() => {
    const subject = encodeURIComponent(
      `CHGEM Hymn Book Issue [v${APP_VERSION} / corpus ${CORPUS_VERSION}]`
    );
    void Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=${subject}`);
  }, []);

  const fontSizeSteps: { step: FontSizeStep; label: string }[] = [
    { step: 'xs',  label: t('settings_font_xs')  },
    { step: 'sm',  label: t('settings_font_sm')  },
    { step: 'md',  label: t('settings_font_md')  },
    { step: 'lg',  label: t('settings_font_lg')  },
    { step: 'xl',  label: t('settings_font_xl')  },
    { step: 'xxl', label: t('settings_font_xxl') },
  ];

  const themeOptions: { mode: ThemeMode; label: string }[] = [
    { mode: 'light',  label: t('settings_theme_light')  },
    { mode: 'dark',   label: t('settings_theme_dark')   },
    { mode: 'system', label: t('settings_theme_system') },
  ];

  const rowStyle = useMemo(() => [
    styles.row,
    { borderBottomColor: colors.border.default },
  ], [colors]);

  const offlineBadgeColours = useMemo(() => ({
    background: colors.status.offline,
    text:       colors.status.offlineText,
    subtext:    colors.status.offlineText + 'CC',
    dot:        colors.status.offlineText,
  }), [colors]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.header} />

      <View style={[styles.banner, { backgroundColor: colors.background.header }]}>
        <ThemedText variant="hymnTitle" colour={colors.text.onHeader} style={styles.bannerTitle}>
          {t('screen_settings')}
        </ThemedText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <ThemedText
          variant="sectionHeader"
          colour={colors.accent.secondary}
          style={styles.sectionHeader}
        >
          {t('settings_general')}
        </ThemedText>

        {/* Theme */}
        <View style={[styles.settingBlock, { backgroundColor: colors.background.secondary }]}>
          <ThemedText variant="uiLabel" colour={colors.text.primary} style={styles.settingLabel}>
            {t('settings_theme')}
          </ThemedText>
          <View style={styles.langRow}>
            {themeOptions.map(({ mode, label }) => (
              <Pressable
                key={mode}
                onPress={() => handleThemeChange(mode)}
                style={({ pressed }) => [
                  styles.langOption,
                  {
                    backgroundColor: themeMode === mode
                      ? colors.accent.primary
                      : colors.background.primary,
                    borderColor: colors.accent.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: themeMode === mode }}
              >
                <ThemedText
                  variant="uiLabel"
                  colour={themeMode === mode ? colors.text.onHeader : colors.accent.primary}
                >
                  {label}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={[styles.settingBlock, { backgroundColor: colors.background.secondary }]}>
          <ThemedText variant="uiLabel" colour={colors.text.primary} style={styles.settingLabel}>
            {t('settings_language')}
          </ThemedText>
          <View style={styles.langRow}>
            {SUPPORTED_LANGUAGES.map(({ code, nativeLabel }) => (
              <Pressable
                key={code}
                onPress={() => handleLanguageToggle(code)}
                style={({ pressed }) => [
                  styles.langOption,
                  {
                    backgroundColor: currentLanguage === code
                      ? colors.accent.primary
                      : colors.background.primary,
                    borderColor: colors.accent.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: currentLanguage === code }}
              >
                <ThemedText
                  variant="uiLabel"
                  colour={currentLanguage === code ? colors.text.onHeader : colors.accent.primary}
                >
                  {nativeLabel}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Font Size */}
        <View style={[styles.settingBlock, { backgroundColor: colors.background.secondary }]}>
          <ThemedText variant="uiLabel" colour={colors.text.primary} style={styles.settingLabel}>
            {t('settings_font_size')}
          </ThemedText>
          <View style={styles.fontSizeGrid}>
            {fontSizeSteps.map(({ step, label }) => (
              <Pressable
                key={step}
                onPress={() => handleFontSizeChange(step)}
                style={({ pressed }) => [
                  styles.fontOption,
                  {
                    backgroundColor: fontSize === step
                      ? colors.accent.primary
                      : colors.background.primary,
                    borderColor: colors.border.default,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: fontSize === step }}
                accessibilityLabel={label}
              >
                <ThemedText
                  variant="uiLabel"
                  colour={fontSize === step ? colors.text.onHeader : colors.text.secondary}
                >
                  {step.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          {/* Live preview — reads fontSize from the same SettingsContext,
              so it scales instantly as the user taps XS..XXL above. */}
          <View
            style={[
              styles.previewBox,
              { backgroundColor: colors.background.primary, borderColor: colors.border.default },
            ]}
          >
            <ThemedText variant="stanzaBody" colour={colors.text.primary}>
              {t('settings_font_preview')}
            </ThemedText>
          </View>
        </View>

        {/* Show Verse Numbers */}
        <View style={rowStyle}>
          <ThemedText variant="uiLabel" colour={colors.text.primary} style={styles.rowText}>
            {t('settings_show_verse_nums')}
          </ThemedText>
          <Switch
            value={showVerseNumbers}
            onValueChange={(val) => setShowVerseNumbers(val)}
            trackColor={{ false: colors.border.default, true: colors.accent.secondary }}
            thumbColor={colors.text.onHeader}
          />
        </View>

        {/* Keep Screen On */}
        <View style={rowStyle}>
          <ThemedText variant="uiLabel" colour={colors.text.primary} style={styles.rowText}>
            {t('settings_keep_screen_on')}
          </ThemedText>
          <Switch
            value={keepScreenOn}
            onValueChange={(val) => setKeepScreenOn(val)}
            trackColor={{ false: colors.border.default, true: colors.accent.secondary }}
            thumbColor={colors.text.onHeader}
          />
        </View>

        {/* Clear Recents */}
        <Pressable
          onPress={handleClearRecents}
          style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="button"
        >
          <View style={styles.rowText}>
            <ThemedText variant="uiLabel" colour={colors.text.primary}>
              {t('settings_clear_recents')}
            </ThemedText>
            <ThemedText variant="caption" colour={colors.text.secondary}>
              {t('settings_clear_recents_sub')}
            </ThemedText>
          </View>
        </Pressable>

        <OfflineBadge
          label={t('settings_offline_badge')}
          sublabel={t('settings_offline_sub')}
          colours={offlineBadgeColours}
        />

        <ThemedText
          variant="sectionHeader"
          colour={colors.accent.secondary}
          style={[styles.sectionHeader, styles.sectionHeaderSpaced]}
        >
          {t('settings_support')}
        </ThemedText>

        <View style={[styles.settingBlock, { backgroundColor: colors.background.secondary }]}>
          <View style={rowStyle}>
            <ThemedText variant="uiLabel" colour={colors.text.primary}>{t('settings_app_version')}</ThemedText>
            <ThemedText variant="uiLabel" colour={colors.text.secondary}>{APP_VERSION}</ThemedText>
          </View>
          <View style={[rowStyle, styles.lastRow]}>
            <ThemedText variant="uiLabel" colour={colors.text.primary}>{t('settings_corpus_version')}</ThemedText>
            <ThemedText variant="uiLabel" colour={colors.text.secondary}>{CORPUS_VERSION}</ThemedText>
          </View>
        </View>

        <Pressable
          onPress={handleSendReport}
          style={({ pressed }) => [
            styles.reportButton,
            { backgroundColor: colors.accent.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          accessibilityRole="button"
        >
          <ThemedText variant="uiLabel" colour={colors.text.onHeader}>
            {t('action_send_report')}
          </ThemedText>
        </Pressable>

      </ScrollView>
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
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: SPACING.xxl },
  sectionHeader: { paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.sm },
  sectionHeaderSpaced: { paddingTop: SPACING.xl },
  settingBlock: { marginHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm },
  settingLabel: { marginBottom: SPACING.sm, fontWeight: '600' },
  langRow: { flexDirection: 'row', gap: SPACING.sm },
  langOption: { flex: 1, minHeight: TOUCH_TARGET_MIN, borderWidth: 1.5, borderRadius: BORDER_RADIUS.md, alignItems: 'center', justifyContent: 'center' },
  fontSizeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs },
  fontOption: { minWidth: TOUCH_TARGET_MIN, minHeight: TOUCH_TARGET_MIN - 4, borderWidth: 1, borderRadius: BORDER_RADIUS.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.sm },
  previewBox: { marginTop: SPACING.sm, borderWidth: 1, borderRadius: BORDER_RADIUS.sm, padding: SPACING.sm },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, minHeight: TOUCH_TARGET_MIN, borderBottomWidth: StyleSheet.hairlineWidth },
  lastRow: { borderBottomWidth: 0 },
  rowText: { flex: 1, marginRight: SPACING.md },
  reportButton: { marginHorizontal: SPACING.md, marginTop: SPACING.md, borderRadius: BORDER_RADIUS.md, minHeight: TOUCH_TARGET_MIN, alignItems: 'center', justifyContent: 'center' },
});