// FILE PATH: app/(tabs)/index.tsx
// PURPOSE: Home screen placeholder. Real implementation in Phase 3.
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/ui/ThemedText';

export default function HomeScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ThemedText variant="hymnTitle">Home — Phase 3</ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});