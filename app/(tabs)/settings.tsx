// FILE PATH: app/(tabs)/settings.tsx
// PURPOSE: Settings screen — theme, language, font size, offline badge.

import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  useColorScheme,
  StatusBar,
} from 'react-native';

import { useLanguage } from '../../context/LanguageContext';
import { useRecents } from '../../hooks/useRecents';
import { storageService } from '../../services/storageService';
import OfflineBadge from '../../components/ui/OfflineBadge';
import ThemedText from '../../components/ui/ThemedText';
import { getThemeColours } from '../../constants/theme';
import { SPACING, HEADER_HEIGHT, BORDER_RADIUS, TOUCH_TARGET_MIN } from '../../constants/layout';
import { SUPPORTED_LANGUAGES } from '../../types/language';
import { DEFAULT_SETTINGS } from '../../types/settings';
import type { AppLanguage } from '../../types/language';
import type { FontSizeStep } from '../../types/settings';

const APP_VERSION    = '1.0.0';
const CORPUS_VERSION = '2025.2';
const SUPPORT_EMAIL  = 'support@chgem.org';

export default function SettingsScreen() {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const scheme = useColorScheme() ?? 'dark';
  const colours = getThemeColours(scheme === 'dark' ? 'dark' : 'light');
  const { clearRecents } = useRecents();

  const [fontSize, setFontSize] = useState<FontSizeStep>('md');
  const [showVerseNumbers, setShowVerseNumbers] = useState(true);
  const [keepScreenOn, setKeepScreenOn] = useState(false);

  const persistSetting = useCallback(async (patch: Partial<typeof DEFAULT_SETTINGS>) => {
    const current = await storageService.loadSettings();
    await storageService.saveSettings({ ...current, ...patch });
  }, []);

  const handleLanguageToggle = useCallback((lang: AppLanguage) => {
    setLanguage(lang);
    void persistSetting({ language: lang });
  }, [setLanguage, persistSetting]);

  const handleFontSizeChange = useCallback((step: FontSizeStep) => {
    setFontSize(step);
    void persistSetting({ fontSize: step });
  }, [persistSetting]);

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

  const rowStyle = useMemo(() => [
    styles.row,
    { borderBottomColor: colours.border.default },
  ], [colours]);

  const offlineBadgeColours = useMemo(() => ({
    background: colours.status.offline,
    text:       colours.status.offlineText,
    subtext:    colours.status.offlineText + 'CC',
    dot:        colours.status.offlineText,
  }), [colours]);

  return (
    <View style={[styles.screen, { backgroundColor: colours.background.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colours.background.header} />

      <View style={[styles.banner, { backgroundColor: colours.background.header }]}>
        <ThemedText variant="hymnTitle" colour={colours.text.onHeader} style={styles.bannerTitle}>
          {t('screen_settings')}
        </ThemedText>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        <ThemedText
          variant="sectionHeader"
          colour={colours.accent.secondary}
          style={styles.sectionHeader}
        >
          {t('settings_general')}
        </ThemedText>

        {/* Language */}
        <View style={[styles.settingBlock, { backgroundColor: colours.background.secondary }]}>
          <ThemedText variant="uiLabel" colour={colours.text.primary} style={styles.settingLabel}>
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
                      ? colours.accent.primary
                      : colours.background.primary,
                    borderColor: colours.accent.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: currentLanguage === code }}
              >
                <ThemedText
                  variant="uiLabel"
                  colour={currentLanguage === code ? colours.text.onHeader : colours.accent.primary}
                >
                  {nativeLabel}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Font Size */}
        <View style={[styles.settingBlock, { backgroundColor: colours.background.secondary }]}>
          <ThemedText variant="uiLabel" colour={colours.text.primary} style={styles.settingLabel}>
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
                      ? colours.accent.primary
                      : colours.background.primary,
                    borderColor: colours.border.default,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: fontSize === step }}
                accessibilityLabel={label}
              >
                <ThemedText
                  variant="uiLabel"
                  colour={fontSize === step ? colours.text.onHeader : colours.text.secondary}
                >
                  {step.toUpperCase()}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Show Verse Numbers */}
        <View style={rowStyle}>
          <ThemedText variant="uiLabel" colour={colours.text.primary} style={styles.rowText}>
            {t('settings_show_verse_nums')}
          </ThemedText>
          <Switch
            value={showVerseNumbers}
            onValueChange={(val) => { setShowVerseNumbers(val); void persistSetting({ showVerseNumbers: val }); }}
            trackColor={{ false: colours.border.default, true: colours.accent.secondary }}
            thumbColor={colours.text.onHeader}
          />
        </View>

        {/* Keep Screen On */}
        <View style={rowStyle}>
          <ThemedText variant="uiLabel" colour={colours.text.primary} style={styles.rowText}>
            {t('settings_keep_screen_on')}
          </ThemedText>
          <Switch
            value={keepScreenOn}
            onValueChange={(val) => { setKeepScreenOn(val); void persistSetting({ keepScreenOn: val }); }}
            trackColor={{ false: colours.border.default, true: colours.accent.secondary }}
            thumbColor={colours.text.onHeader}
          />
        </View>

        {/* Clear Recents */}
        <Pressable
          onPress={handleClearRecents}
          style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.7 : 1 }]}
          accessibilityRole="button"
        >
          <View style={styles.rowText}>
            <ThemedText variant="uiLabel" colour={colours.text.primary}>
              {t('settings_clear_recents')}
            </ThemedText>
            <ThemedText variant="caption" colour={colours.text.secondary}>
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
          colour={colours.accent.secondary}
          style={[styles.sectionHeader, styles.sectionHeaderSpaced]}
        >
          {t('settings_support')}
        </ThemedText>

        <View style={[styles.settingBlock, { backgroundColor: colours.background.secondary }]}>
          <View style={rowStyle}>
            <ThemedText variant="uiLabel" colour={colours.text.primary}>{t('settings_app_version')}</ThemedText>
            <ThemedText variant="uiLabel" colour={colours.text.secondary}>{APP_VERSION}</ThemedText>
          </View>
          <View style={[rowStyle, styles.lastRow]}>
            <ThemedText variant="uiLabel" colour={colours.text.primary}>{t('settings_corpus_version')}</ThemedText>
            <ThemedText variant="uiLabel" colour={colours.text.secondary}>{CORPUS_VERSION}</ThemedText>
          </View>
        </View>

        <Pressable
          onPress={handleSendReport}
          style={({ pressed }) => [
            styles.reportButton,
            { backgroundColor: colours.accent.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          accessibilityRole="button"
        >
          <ThemedText variant="uiLabel" colour={colours.text.onHeader}>
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
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, minHeight: TOUCH_TARGET_MIN, borderBottomWidth: StyleSheet.hairlineWidth },
  lastRow: { borderBottomWidth: 0 },
  rowText: { flex: 1, marginRight: SPACING.md },
  reportButton: { marginHorizontal: SPACING.md, marginTop: SPACING.md, borderRadius: BORDER_RADIUS.md, minHeight: TOUCH_TARGET_MIN, alignItems: 'center', justifyContent: 'center' },
});
