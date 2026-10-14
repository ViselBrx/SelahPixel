import '@/global.css';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import { AppToast } from '@/components/app-toast';
import { ProgressProvider } from '@/context/progress-context';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <ProgressProvider>
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.night } }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
        <AppToast />
      </View>
    </ProgressProvider>
  );
}
