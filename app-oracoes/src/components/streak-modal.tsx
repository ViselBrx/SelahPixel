import { useEffect, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelFlame, PixelSparkles } from '@/components/pixel-art';
import { PixelButton } from '@/components/ui';
import { useProgress } from '@/context/progress-context';
import { colors, fonts, pixelShadow } from '@/theme';
import { formatLocalDate, getLocalDateKey, getRecentDays } from '@/utils/date';

type StreakModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function StreakModal({ visible, onClose }: StreakModalProps) {
  const insets = useSafeAreaInsets();
  const { activeDates, streak } = useProgress();
  const [scale] = useState(() => new Animated.Value(1));
  const days = getRecentDays();
  const today = getLocalDateKey();

  useEffect(() => {
    if (!visible) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.08, duration: 650, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.96, duration: 650, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [scale, visible]);

  return (
    <Modal visible={visible} transparent animationType="fade" presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View
        style={[
          styles.root,
          { paddingTop: Math.max(insets.top, 18), paddingBottom: Math.max(insets.bottom, 18) },
        ]}>
        <Pressable accessibilityLabel="Fechar sequência" style={styles.backdrop} onPress={onClose} />
        <View accessibilityViewIsModal style={styles.card}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cardContent}>
            <View pointerEvents="none" style={styles.sparkles}>
              <PixelSparkles size={76} color={colors.gold} />
            </View>
            <Text style={styles.eyebrow}>SUA CHAMA ESTÁ ACESA</Text>
            <Animated.View style={{ transform: [{ scale }] }}>
              <PixelFlame size={112} />
            </Animated.View>
            <Text style={styles.value}>{streak}</Text>
            <Text style={styles.title}>{streak === 1 ? 'dia de sequência' : 'dias de sequência'}</Text>
            <Text style={styles.date}>{formatLocalDate()}</Text>

            <View style={styles.week}>
              {days.map((day) => {
                const active = activeDates.includes(day.key);
                const isToday = day.key === today;
                return (
                  <View key={day.key} style={styles.dayColumn}>
                    <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{day.label}</Text>
                    <View style={[styles.dayBox, active && styles.dayBoxActive, isToday && styles.dayBoxToday]}>
                      <Text style={[styles.dayNumber, active && styles.dayNumberActive]}>{active ? '✓' : day.day}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <Text style={styles.hint}>Abra o SelahPixel todos os dias para manter sua chama viva.</Text>
            <PixelButton label="Continuar jornada" onPress={onClose} style={styles.button} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(4,5,9,0.9)',
  },
  card: {
    width: '100%',
    maxWidth: 470,
    maxHeight: '100%',
    overflow: 'hidden',
    backgroundColor: colors.panel,
    borderWidth: 3,
    borderColor: colors.gold,
    borderBottomWidth: 8,
    borderBottomColor: colors.goldDark,
    ...pixelShadow,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
    gap: 7,
  },
  sparkles: {
    position: 'absolute',
    right: 14,
    top: 18,
    opacity: 0.32,
  },
  eyebrow: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 11,
    letterSpacing: 1.1,
  },
  value: {
    color: colors.goldBright,
    fontFamily: fonts.pixel,
    fontSize: 46,
    lineHeight: 50,
  },
  title: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 25,
  },
  date: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    marginBottom: 13,
  },
  week: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 3,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  dayLabel: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
  },
  dayLabelToday: {
    color: colors.gold,
  },
  dayBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    borderWidth: 2,
    borderColor: colors.line,
  },
  dayBoxActive: {
    backgroundColor: colors.goldDark,
    borderColor: colors.gold,
  },
  dayBoxToday: {
    borderColor: colors.goldBright,
  },
  dayNumber: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
  },
  dayNumberActive: {
    color: colors.parchmentLight,
    fontSize: 12,
  },
  hint: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 14,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 9,
  },
});
