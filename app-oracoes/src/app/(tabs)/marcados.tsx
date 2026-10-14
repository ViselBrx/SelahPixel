import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { MarkModal } from '@/components/mark-modal';
import { PixelBookmark, PixelScroll, PixelSparkles } from '@/components/pixel-art';
import { EmptyState, Page, PixelButton, ScreenTitle, SectionTitle } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { markColors, useProgress } from '@/context/progress-context';
import { Verse, verses } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';

export default function SavedScreen() {
  const { marks, removeMark, streak, customVerses } = useProgress();
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [deleteVerse, setDeleteVerse] = useState<Verse | null>(null);
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const savedVerses = useMemo(
    () =>
      [...verses, ...customVerses]
        .filter((verse) => marks[verse.id] && (!colorFilter || marks[verse.id].color === colorFilter))
        .sort((a, b) => marks[b.id].savedAt.localeCompare(marks[a.id].savedAt)),
    [colorFilter, customVerses, marks],
  );

  const totalNotes = Object.values(marks).filter((mark) => mark.note).length;
  const totalMarks = Object.keys(marks).length;

  return (
    <Page>
      <View style={styles.headerRow}>
        <ScreenTitle title="Minhas marcações" subtitle="Cadastre, atualize e exclua seus versículos e reflexões." />
        <View style={styles.bookmarkTile}>
          <PixelBookmark size={38} color={colors.gold} filled />
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{totalMarks}</Text>
          <Text style={styles.statLabel}>VERSÍCULOS</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{totalNotes}</Text>
          <Text style={styles.statLabel}>REFLEXÕES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBlock}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>DIAS SEGUIDOS</Text>
        </View>
      </View>

      {totalMarks ? (
        <>
          <PixelButton
            label="Cadastrar nova marcação"
            tone="dark"
            icon={<PixelBookmark size={22} color={colors.gold} />}
            onPress={() => router.push('/biblia' as never)}
          />
          <View style={styles.filterBlock}>
            <Text style={styles.filterLabel}>FILTRAR POR MARCADOR</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorFilters}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: colorFilter === null }}
                onPress={() => setColorFilter(null)}
                style={[styles.allFilter, colorFilter === null && styles.allFilterActive]}>
                <Text style={[styles.allFilterText, colorFilter === null && styles.allFilterTextActive]}>TODOS</Text>
              </Pressable>
              {markColors.map((color) => (
                <Pressable
                  key={color}
                  accessibilityRole="button"
                  accessibilityLabel={`Filtrar pela cor ${color}`}
                  accessibilityState={{ selected: colorFilter === color }}
                  onPress={() => setColorFilter(colorFilter === color ? null : color)}
                  style={[
                    styles.colorFilter,
                    { backgroundColor: color },
                    colorFilter === color && styles.colorFilterActive,
                  ]}>
                  {colorFilter === color ? <Text style={styles.filterCheck}>✓</Text> : null}
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.listSection}>
            <SectionTitle title="Marcações cadastradas" action={<Text style={styles.count}>{savedVerses.length}</Text>} />
            {savedVerses.length ? (
              <View style={styles.verseList}>
                {savedVerses.map((verse) => (
                  <VerseCard
                    key={verse.id}
                    verse={verse}
                    mark={marks[verse.id]}
                    compact
                    onPress={() => setSelectedVerse(verse)}
                    onDelete={() => setDeleteVerse(verse)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noColorResult}>
                <PixelSparkles size={42} color={colors.textMuted} />
                <Text style={styles.noColorText}>Nenhum versículo usa esta cor ainda.</Text>
              </View>
            )}
          </View>
        </>
      ) : (
        <EmptyState
          title="Seu relicário está vazio"
          message="Explore a biblioteca, toque em um versículo e guarde as palavras que deseja levar com você."
          action={
            <PixelButton
              label="Cadastrar primeira marcação"
              icon={<PixelScroll size={26} />}
              onPress={() => router.push('/biblia' as never)}
            />
          }
        />
      )}

      <View style={styles.tip}>
        <Text style={styles.tipRune}>✦</Text>
        <Text style={styles.tipText}>Suas marcações e notas ficam salvas somente neste aparelho e funcionam sem internet.</Text>
      </View>

      <MarkModal key={selectedVerse?.id ?? 'closed'} verse={selectedVerse} onClose={() => setSelectedVerse(null)} />

      <ConfirmModal
        visible={Boolean(deleteVerse)}
        title="Excluir marcação?"
        message={`A cor e a anotação de ${deleteVerse?.reference ?? 'este versículo'} serão removidas deste aparelho.`}
        onCancel={() => setDeleteVerse(null)}
        onConfirm={() => {
          if (deleteVerse) removeMark(deleteVerse.id);
          setDeleteVerse(null);
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bookmarkTile: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
    borderBottomColor: colors.black,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
    borderBottomColor: colors.black,
    paddingVertical: 16,
    ...pixelShadow,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 18,
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 2,
    height: 30,
    backgroundColor: colors.line,
  },
  filterBlock: {
    gap: 10,
  },
  filterLabel: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
    letterSpacing: 0.7,
  },
  colorFilters: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 3,
    paddingRight: 8,
  },
  allFilter: {
    minHeight: 36,
    justifyContent: 'center',
    paddingHorizontal: 13,
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
  },
  allFilterActive: {
    backgroundColor: colors.parchmentLight,
    borderColor: colors.white,
  },
  allFilterText: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
  },
  allFilterTextActive: {
    color: colors.ink,
  },
  colorFilter: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.black,
  },
  colorFilterActive: {
    transform: [{ translateY: -3 }],
    borderWidth: 3,
  },
  filterCheck: {
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
  listSection: {
    gap: 15,
  },
  count: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 12,
  },
  verseList: {
    gap: 15,
  },
  noColorResult: {
    alignItems: 'center',
    gap: 8,
    padding: 28,
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
  },
  noColorText: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 13,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    padding: 14,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
  },
  tipRune: {
    color: colors.gold,
    fontSize: 17,
  },
  tipText: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
  },
});
