// FILE PATH: app/(drawer)/_layout.tsx

import { Drawer } from 'expo-router/drawer';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '@/context/ThemeContext';

// ── Drawer menu item definition ──────────────────────────────────────────────
interface DrawerItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  badgeCount?: number;
}

const DRAWER_ITEMS: DrawerItem[] = [
  { label: 'Index',     icon: 'list',        route: '/(drawer)/'          },
  { label: 'Category',  icon: 'grid',        route: '/(drawer)/category'  },
  { label: 'Various',   icon: 'book',        route: '/(drawer)/various'   },
  { label: 'Recent',    icon: 'time',        route: '/(drawer)/recents',  badgeCount: 0 },
  { label: 'Favourite', icon: 'heart',       route: '/(drawer)/favourites', badgeCount: 0 },
  { label: 'Settings',  icon: 'settings',    route: '/(drawer)/settings'  },
];

// ── Custom drawer content ─────────────────────────────────────────────────────
function CHGEMDrawerContent(props: DrawerContentComponentProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (route: string) => {
    props.navigation.closeDrawer();
    router.push(route as never);
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: colors.background.primary }]}>

      {/* ── Banner header ── */}
      <View style={[styles.drawerHeader, { backgroundColor: colors.background.header }]}>
        <View style={styles.logoRow}>
          <View style={[styles.logoCircle, { borderColor: colors.accent.warm }]}>
            <Ionicons name="musical-notes" size={28} color={colors.accent.warm} />
          </View>
          <Text style={[styles.drawerTitle, { color: colors.text.onHeader }]}>
            CHGEM Hymn Book
          </Text>
        </View>
      </View>

      {/* ── Menu items ── */}
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {DRAWER_ITEMS.map((item) => {
          const isActive = pathname === item.route ||
            (item.route === '/(drawer)/' && pathname === '/');

          return (
            <Pressable
              key={item.label}
              onPress={() => handleNavigate(item.route)}
              style={({ pressed }) => [
                styles.menuItem,
                {
                  backgroundColor: isActive
                    ? colors.background.secondary
                    : pressed
                    ? colors.background.card
                    : 'transparent',
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive ? colors.accent.warm : colors.icon.default}
                  style={styles.menuIcon}
                />
                <Text
                  style={[
                    styles.menuLabel,
                    {
                      color: isActive
                        ? colors.text.primary
                        : colors.text.secondary,
                      fontWeight: isActive ? '600' : '400',
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </View>

              {/* Orange badge for Recent and Favourite */}
              {item.badgeCount !== undefined && (
                <View style={[styles.badge, { backgroundColor: colors.accent.warm }]}>
                  <Text style={styles.badgeText}>{item.badgeCount}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        {/* ── Divider ── */}
        <View style={[styles.divider, { backgroundColor: colors.border.default }]} />

      </ScrollView>
    </View>
  );
}

// ── Drawer layout ─────────────────────────────────────────────────────────────
export default function DrawerLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CHGEMDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background.primary,
          width: '82%',
        },
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen name="index"      options={{ headerShown: false }} />
      <Drawer.Screen name="category"   options={{ headerShown: false }} />
      <Drawer.Screen name="various"    options={{ headerShown: false }} />
      <Drawer.Screen name="recents"    options={{ headerShown: false }} />
      <Drawer.Screen name="favourites" options={{ headerShown: false }} />
      <Drawer.Screen name="settings"   options={{ headerShown: false }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerHeader: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  menuList: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 44,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuIcon: {
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    fontSize: 16,
  },
  badge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
    marginVertical: 8,
  },
});