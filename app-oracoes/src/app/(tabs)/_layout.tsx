import { Tabs } from 'expo-router';
import { ColorValue, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavIconName, PixelNavIcon } from '@/components/pixel-art';
import { colors, fonts, layout } from '@/theme';

function TabIcon({ name, color, focused }: { name: NavIconName; color: ColorValue; focused: boolean }) {
  return <PixelNavIcon name={name} color={color} filled={focused} size={24} />;
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, layout.tabBarMinBottom);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: styles.scene,
        tabBarActiveTintColor: colors.goldBright,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: [
          styles.tabBar,
          {
            height: layout.tabBarContentHeight + bottomPadding,
            paddingBottom: bottomPadding,
          },
        ],
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="biblia"
        options={{
          title: 'Bíblia',
          tabBarIcon: ({ color, focused }) => <TabIcon name="bible" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="oracoes"
        options={{
          title: 'Orações',
          tabBarIcon: ({ color, focused }) => <TabIcon name="prayer" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="marcados"
        options={{
          title: 'Marcados',
          tabBarIcon: ({ color, focused }) => <TabIcon name="saved" color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="creditos"
        options={{
          title: 'Créditos',
          tabBarIcon: ({ color, focused }) => <TabIcon name="credits" color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: colors.night,
  },
  tabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    backgroundColor: colors.panel,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 2,
    borderColor: colors.line,
    elevation: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontFamily: fonts.pixel,
    fontSize: 9,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
});
