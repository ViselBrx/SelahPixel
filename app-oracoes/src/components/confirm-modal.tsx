import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { PixelButton } from '@/components/ui';
import { colors, fonts, pixelShadow } from '@/theme';

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Sim, excluir',
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.root}>
        <Pressable accessibilityLabel="Cancelar" style={styles.backdrop} onPress={onCancel} />
        <View style={styles.dialog}>
          <Text style={styles.rune}>!</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.warning}>Esta ação não pode ser desfeita.</Text>
          <View style={styles.actions}>
            <PixelButton label="Cancelar" tone="dark" compact onPress={onCancel} style={styles.action} />
            <PixelButton label={confirmLabel} tone="ruby" compact onPress={onConfirm} style={styles.action} />
          </View>
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
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(4,5,9,0.84)',
  },
  dialog: {
    width: '100%',
    maxWidth: 430,
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.parchmentLight,
    borderBottomWidth: 7,
    borderBottomColor: colors.goldDark,
    padding: 24,
    ...pixelShadow,
  },
  rune: {
    width: 52,
    height: 52,
    color: colors.parchmentLight,
    backgroundColor: colors.ruby,
    borderWidth: 2,
    borderColor: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 26,
    lineHeight: 48,
    textAlign: 'center',
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 24,
    textAlign: 'center',
  },
  message: {
    color: '#675A46',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  warning: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 10,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  action: {
    flex: 1,
  },
});
