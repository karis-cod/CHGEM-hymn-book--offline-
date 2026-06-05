// FILE PATH: app/(drawer)/index.tsx

import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components/ui/ThemedText';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>

      {/* ── Top bar ── */}
      <View style={[styles.topBar, { backgroundColor: colors.background.header }]}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu" size={28} color={colors.icon.onHeader} />
        </Pressable>

        <Pressable
          onPress={() => router.push('/search')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityLabel="Search hymns"
        >
          <Ionicons name="search" size={26} color={colors.icon.onHeader} />
        </Pressable>
      </View>

      {/* ── Banner ── */}
      <View style={[styles.banner, { backgroundColor: colors.background.header }]}>
        <ThemedText variant="hymnTitle" onHeader>Index</ThemedText>
        <ThemedText variant="listMeta" onHeader muted>Numerical</ThemedText>
      </View>

      {/* ── Content placeholder ── */}
      <View style={styles.content}>
        <ThemedText variant="uiLabel" muted>Hymn list loads here in Phase 3</ThemedText>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  banner: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});