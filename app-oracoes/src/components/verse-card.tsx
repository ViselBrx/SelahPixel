import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PixelBookmark } from '@/components/pixel-art';
import { Verse } from '@/data/content';
import { VerseMark } from '@/context/progress-context';
import { colors, fonts, pixelShadow } from '@/theme';

type VerseCardProps = {
  verse: Verse;
  mark?: VerseMark;
  onPress: () => void;
  onDelete?: () => void;
  compact?: boolean;
};

export function VerseCard({ verse, mark, onPress, onDelete, compact = false }: VerseCardProps) {
  const showCrudActions = Boolean(mark && onDelete);

  return (
    <View style={[styles.card, mark && { borderLeftColor: mark.color }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${mark ? 'Abrir marcação' : 'Marcar'} ${verse.reference}`}
        accessibilityHint="Abre os detalhes deste versículo"
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardMain,
          compact && styles.cardMainCompact,
          pressed && styles.pressed,
        ]}>
        <View style={styles.topRow}>
          <View style={styles.referenceWrap}>
            <View style={[styles.themeDot, { backgroundColor: mark?.color ?? colors.gold }]} />
            <Text style={styles.reference}>{verse.reference}</Text>
          </View>
          <PixelBookmark size={24} color={mark?.color ?? colors.textMuted} filled={Boolean(mark)} />
        </View>

        <Text style={[styles.verseText, compact && styles.verseTextCompact]}>“{verse.text}”</Text>

        <View style={styles.footer}>
          <Text style={styles.theme}>{verse.theme}</Text>
          {!showCrudActions ? (
            <Text style={styles.action}>{mark ? 'ATUALIZAR MARCAÇÃO' : '+ CADASTRAR MARCAÇÃO'}</Text>
          ) : null}
        </View>

        {mark?.note ? (
          <View style={[styles.note, { borderLeftColor: mark.color }]}>
            <Text style={styles.noteLabel}>SUA REFLEXÃO</Text>
            <Text numberOfLines={2} style={styles.noteText}>
              {mark.note}
            </Text>
          </View>
        ) : null}
      </Pressable>

      {mark && onDelete ? (
        <View style={styles.crudActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Atualizar marcação de ${verse.reference}`}
            onPress={onPress}
            style={({ pressed }) => [styles.crudButton, pressed && styles.crudButtonPressed]}>
            <Text style={styles.updateText}>ATUALIZAR</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Excluir marcação de ${verse.reference}`}
            onPress={onDelete}
            style={({ pressed }) => [styles.crudButton, styles.deleteButton, pressed && styles.crudButtonPressed]}>
            <Text style={styles.deleteText}>EXCLUIR</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.parchmentLight,
    borderWidth: 2,
    borderColor: colors.parchmentDark,
    borderLeftWidth: 7,
    borderLeftColor: colors.gold,
    borderBottomWidth: 6,
    borderBottomColor: '#9C8964',
    overflow: 'hidden',
    ...pixelShadow,
  },
  cardMain: {
    padding: 18,
    gap: 14,
  },
  cardMainCompact: {
    padding: 15,
    gap: 11,
  },
  pressed: {
    backgroundColor: '#F7EACD',
    opacity: 0.86,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referenceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeDot: {
    width: 8,
    height: 8,
  },
  reference: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  verseText: {
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 29,
  },
  verseTextCompact: {
    fontSize: 17,
    lineHeight: 25,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.parchmentDark,
    paddingTop: 11,
  },
  theme: {
    color: '#7C715E',
    fontFamily: fonts.body,
    fontSize: 12,
  },
  action: {
    color: colors.goldDark,
    fontFamily: fonts.pixel,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  crudActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.parchmentDark,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  crudButton: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: '#E3D3B2',
    borderWidth: 1,
    borderColor: '#BDAA82',
  },
  deleteButton: {
    backgroundColor: '#E6C5B8',
    borderColor: '#C28E7B',
  },
  crudButtonPressed: {
    opacity: 0.65,
  },
  updateText: {
    color: colors.goldDark,
    fontFamily: fonts.pixel,
    fontSize: 9,
  },
  deleteText: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 9,
  },
  note: {
    backgroundColor: '#E9DCC0',
    borderLeftWidth: 4,
    padding: 10,
    gap: 4,
  },
  noteLabel: {
    color: '#746750',
    fontFamily: fonts.pixel,
    fontSize: 9,
    letterSpacing: 0.7,
  },
  noteText: {
    color: colors.ink,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
});
