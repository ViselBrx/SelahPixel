import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelCandle, PixelHeart, PixelPrayer, PixelScroll, PixelShield } from '@/components/pixel-art';
import { PixelBadge, PixelButton } from '@/components/ui';
import { useProgress } from '@/context/progress-context';
import { Prayer } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';

type PrayerModalProps = {
  prayer: Prayer | null;
  onClose: () => void;
};

function PrayerArt({ prayer }: { prayer: Prayer }) {
  if (prayer.icon === 'shield') return <PixelShield size={80} />;
  if (prayer.icon === 'heart') return <PixelHeart size={80} />;
  if (prayer.icon === 'scroll') return <PixelScroll size={80} />;
  return <PixelCandle size={80} />;
}

export function PrayerModal({ prayer, onClose }: PrayerModalProps) {
  const insets = useSafeAreaInsets();
  const { completedPrayers, completePrayer } = useProgress();
  const completed = prayer ? Boolean(completedPrayers[prayer.id]) : false;
  const [submitting, setSubmitting] = useState(false);

  const handleComplete = () => {
    if (!prayer || submitting) return;
    setSubmitting(true);
    completePrayer(prayer.id);
    onClose();
  };

  return (
    <Modal visible={Boolean(prayer)} transparent animationType="fade" presentationStyle="overFullScreen" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityRole="button" accessibilityLabel="Fechar oração" style={styles.backdrop} onPress={onClose} />
        <View style={[styles.dialogWrap, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
          {prayer ? (
            <View accessibilityViewIsModal style={styles.dialog}>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar oração" hitSlop={8} onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={[styles.artHalo, { borderColor: prayer.color }]}>
                  <PrayerArt prayer={prayer} />
                </View>
                <PixelBadge label={`${prayer.duration} • ${prayer.focus}`} color={prayer.color} />
                <Text style={styles.title}>{prayer.title}</Text>
                <Text style={styles.subtitle}>{prayer.subtitle}</Text>
                <View style={styles.divider} />
                <Text style={styles.prayerText}>{prayer.text}</Text>
                <Text style={styles.reference}>{prayer.verseReference}</Text>
                <PixelButton
                  label={submitting ? 'Salvando...' : completed ? 'Orar novamente' : 'Concluir oração'}
                  disabled={submitting}
                  onPress={handleComplete}
                  icon={<PixelPrayer size={28} />}
                  style={styles.action}
                />
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(4,5,9,0.9)',
  },
  dialogWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dialog: {
    width: '100%',
    maxWidth: 560,
    maxHeight: '100%',
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.gold,
    borderBottomWidth: 8,
    borderBottomColor: colors.goldDark,
    ...pixelShadow,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    borderWidth: 2,
    borderColor: colors.line,
  },
  closeText: {
    color: colors.parchmentLight,
    fontFamily: fonts.pixel,
    fontSize: 24,
    lineHeight: 25,
  },
  content: {
    alignItems: 'center',
    padding: 26,
    paddingTop: 56,
    gap: 10,
  },
  artHalo: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E7D8B5',
    borderWidth: 3,
    marginBottom: 8,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 29,
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    color: '#766850',
    fontFamily: fonts.body,
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    width: 52,
    height: 5,
    backgroundColor: colors.goldDark,
    marginVertical: 10,
  },
  prayerText: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 29,
    textAlign: 'center',
  },
  reference: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 11,
    letterSpacing: 0.7,
    marginTop: 9,
  },
  action: {
    alignSelf: 'stretch',
    marginTop: 15,
  },
});
