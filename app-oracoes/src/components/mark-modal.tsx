import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PixelBookmark } from '@/components/pixel-art';
import { PixelButton } from '@/components/ui';
import { markColors, useProgress } from '@/context/progress-context';
import { Verse } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';

type MarkModalProps = {
  verse: Verse | null;
  onClose: () => void;
};

export function MarkModal({ verse, onClose }: MarkModalProps) {
  const insets = useSafeAreaInsets();
  const { marks, setMark, removeMark } = useProgress();
  const currentMark = verse ? marks[verse.id] : undefined;
  const [selectedColor, setSelectedColor] = useState<string>(() => currentMark?.color ?? markColors[0]);
  const [note, setNote] = useState(() => currentMark?.note ?? '');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = () => {
    if (!verse || submitting) return;
    setSubmitting(true);
    setMark(verse.id, selectedColor, note);
    onClose();
  };

  const handleRemove = () => {
    if (!verse || submitting) return;
    setSubmitting(true);
    removeMark(verse.id);
    onClose();
  };

  return (
    <Modal
      visible={Boolean(verse)}
      transparent
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={() => (confirmingDelete ? setConfirmingDelete(false) : onClose())}>
      <View style={styles.modalRoot}>
        <Pressable accessibilityLabel="Fechar" style={styles.backdrop} onPress={onClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[
            styles.keyboardWrap,
            { paddingTop: Math.max(insets.top, 12), paddingBottom: Math.max(insets.bottom, 14) },
          ]}>
          <View accessibilityViewIsModal style={styles.sheet}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sheetContent}>
            <View style={styles.handle} />
            <View style={styles.headingRow}>
              <View style={[styles.iconTile, { borderColor: selectedColor }]}>
                <PixelBookmark size={28} color={colors.parchmentLight} filled />
              </View>
              <View style={styles.headingCopy}>
                <Text style={styles.eyebrow}>{currentMark ? 'ATUALIZAR MARCAÇÃO' : 'CADASTRAR MARCAÇÃO'}</Text>
                <Text style={styles.title}>{verse?.reference}</Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Fechar marcação" hitSlop={8} onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <Text numberOfLines={3} style={styles.preview}>
              “{verse?.text}”
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>COR DO MARCADOR</Text>
              <View style={styles.colorsRow}>
                {markColors.map((color, index) => (
                  <Pressable
                    key={color}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selectedColor === color }}
                    accessibilityLabel={`Selecionar marcador ${['dourado', 'verde', 'azul', 'vermelho', 'violeta'][index]}`}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorButton,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorButtonSelected,
                    ]}>
                    {selectedColor === color ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>ANOTAÇÃO PESSOAL</Text>
              <TextInput
                accessibilityLabel="Anotação pessoal"
                multiline
                maxLength={240}
                value={note}
                onChangeText={setNote}
                placeholder="O que Deus falou com você neste versículo?"
                placeholderTextColor="#8D806A"
                style={styles.input}
                textAlignVertical="top"
              />
              <Text style={styles.counter}>{note.length}/240</Text>
            </View>

            <View style={styles.actions}>
              {currentMark ? (
                <PixelButton label="Excluir" tone="ruby" compact onPress={() => setConfirmingDelete(true)} style={styles.removeButton} />
              ) : null}
              <PixelButton
                label={currentMark ? 'Atualizar marcação' : 'Cadastrar marcação'}
                disabled={submitting}
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        {confirmingDelete ? (
          <View style={styles.confirmLayer}>
            <Pressable accessibilityLabel="Cancelar exclusão" style={styles.confirmBackdrop} onPress={() => setConfirmingDelete(false)} />
            <View style={styles.confirmCard}>
              <Text style={styles.confirmRune}>!</Text>
              <Text style={styles.confirmTitle}>Excluir marcação?</Text>
              <Text style={styles.confirmMessage}>
                A cor e a anotação de {verse?.reference} serão removidas deste aparelho.
              </Text>
              <Text style={styles.confirmWarning}>Esta ação não pode ser desfeita.</Text>
              <View style={styles.confirmActions}>
                <PixelButton label="Cancelar" tone="dark" compact onPress={() => setConfirmingDelete(false)} style={styles.confirmAction} />
                <PixelButton label={submitting ? 'Excluindo...' : 'Sim, excluir'} tone="ruby" compact disabled={submitting} onPress={handleRemove} style={styles.confirmAction} />
              </View>
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(4,5,9,0.78)',
  },
  keyboardWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  sheet: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '100%',
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.parchmentLight,
    borderBottomColor: colors.goldDark,
    ...pixelShadow,
  },
  sheetContent: {
    padding: 20,
    gap: 18,
  },
  handle: {
    width: 44,
    height: 5,
    alignSelf: 'center',
    backgroundColor: colors.parchmentDark,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconTile: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    borderWidth: 3,
  },
  headingCopy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    color: colors.goldDark,
    fontFamily: fonts.pixel,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  title: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 23,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.parchmentDark,
    borderWidth: 2,
    borderColor: '#B7A37B',
  },
  closeText: {
    color: colors.ink,
    fontFamily: fonts.pixel,
    fontSize: 23,
    lineHeight: 24,
  },
  preview: {
    color: '#5B5040',
    fontFamily: fonts.display,
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 23,
    borderLeftWidth: 4,
    borderLeftColor: colors.goldDark,
    paddingLeft: 12,
  },
  fieldGroup: {
    gap: 9,
  },
  label: {
    color: '#655944',
    fontFamily: fonts.pixel,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  colorsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.ink,
  },
  colorButtonSelected: {
    transform: [{ translateY: -3 }],
    borderWidth: 3,
  },
  check: {
    color: colors.night,
    width: 21,
    height: 21,
    backgroundColor: colors.parchmentLight,
    borderWidth: 1,
    borderColor: colors.ink,
    fontFamily: fonts.pixel,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  input: {
    minHeight: 84,
    maxHeight: 120,
    color: colors.ink,
    backgroundColor: colors.parchmentLight,
    borderWidth: 2,
    borderColor: colors.parchmentDark,
    padding: 12,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  counter: {
    alignSelf: 'flex-end',
    color: '#8D806A',
    fontFamily: fonts.pixel,
    fontSize: 9,
    marginTop: -5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  removeButton: {
    flexShrink: 0,
  },
  saveButton: {
    flex: 1,
  },
  confirmLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  confirmBackdrop: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(4,5,9,0.9)',
  },
  confirmCard: {
    width: '100%',
    maxWidth: 430,
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.parchmentLight,
    borderBottomWidth: 7,
    borderBottomColor: colors.rubyDark,
    padding: 24,
    ...pixelShadow,
  },
  confirmRune: {
    width: 48,
    height: 48,
    color: colors.white,
    backgroundColor: colors.ruby,
    borderWidth: 2,
    borderColor: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'center',
  },
  confirmTitle: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 23,
  },
  confirmMessage: {
    color: '#5B5040',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  confirmWarning: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 10,
    textAlign: 'center',
  },
  confirmActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 5,
  },
  confirmAction: {
    flex: 1,
  },
});
