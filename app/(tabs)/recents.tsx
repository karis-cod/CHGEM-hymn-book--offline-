// FILE PATH: app/(tabs)/recents.tsx
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/ui/ThemedText';

export default function RecentsScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ThemedText variant="hymnTitle">Recent — Phase 8</ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});