import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProgress } from '@/context/progress-context';
import { colors, fonts, pixelShadow } from '@/theme';

export function AppToast() {
  const { notice, dismissNotice } = useProgress();

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(dismissNotice, 3200);
    return () => clearTimeout(timer);
  }, [dismissNotice, notice]);

  if (!notice) return null;

  return (
    <SafeAreaView pointerEvents="box-none" style={styles.layer}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${notice.message} Toque para fechar.`}
        accessibilityLiveRegion="polite"
        onPress={dismissNotice}
        style={styles.toast}>
        <View style={styles.icon}><Text style={styles.check}>✓</Text></View>
        <Text style={styles.message}>{notice.message}</Text>
        <Text style={styles.close}>×</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 100,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  toast: {
    width: '100%',
    maxWidth: 580,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: colors.parchmentLight,
    borderWidth: 2,
    borderColor: colors.white,
    borderBottomWidth: 5,
    borderBottomColor: colors.sageDark,
    paddingHorizontal: 13,
    paddingVertical: 10,
    ...pixelShadow,
  },
  icon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sage,
    borderWidth: 2,
    borderColor: colors.sageDark,
  },
  check: {
    color: colors.white,
    fontFamily: fonts.pixel,
    fontSize: 15,
  },
  message: {
    flex: 1,
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  close: {
    color: '#5F5545',
    fontFamily: fonts.pixel,
    fontSize: 21,
  },
});

