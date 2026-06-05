// FILE PATH: app/(drawer)/category.tsx

import { View, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/context/ThemeContext';
import { ThemedText } from '@/components/ui/ThemedText';

export default function CategoryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={[styles.topBar, { backgroundColor: colors.background.header }]}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu" size={28} color={colors.icon.onHeader} />
        </Pressable>
      </View>
      <View style={[styles.banner, { backgroundColor: colors.background.header }]}>
        <ThemedText variant="hymnTitle" onHeader>Category</ThemedText>
      </View>
      <View style={styles.content}>
        <ThemedText variant="uiLabel" muted>Categories load here in Phase 8</ThemedText>
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
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});