// FILE PATH: app/hymn/[id].tsx
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/theme';
import { ThemedText } from '@/components/ui/ThemedText';

export default function HymnReaderScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ThemedText variant="hymnTitle">Hymn Reader — Phase 3</ThemedText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});