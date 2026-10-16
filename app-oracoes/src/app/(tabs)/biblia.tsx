import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { MarkModal } from '@/components/mark-modal';
import { PixelBible, PixelNavIcon } from '@/components/pixel-art';
import { Page, PixelBadge, PixelButton, ScreenTitle, SectionTitle } from '@/components/ui';
import { VerseCard } from '@/components/verse-card';
import { VerseFormModal } from '@/components/verse-form-modal';
import { useProgress } from '@/context/progress-context';
import { themes, Verse, verses, VerseTheme } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';

type TestamentFilter = 'Todos' | 'Antigo' | 'Novo';
type OriginFilter = 'Todos' | 'Biblioteca' | 'Meus';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function BibleScreen() {
  const params = useLocalSearchParams<{ tema?: string }>();
  const { marks, customVerses, deleteVerse } = useProgress();
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<VerseTheme | 'Todos'>(() =>
    params.tema && themes.includes(params.tema as VerseTheme) ? (params.tema as VerseTheme) : 'Todos',
  );
  const [testament, setTestament] = useState<TestamentFilter>('Todos');
  const [origin, setOrigin] = useState<OriginFilter>('Todos');
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [editingVerse, setEditingVerse] = useState<Verse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Verse | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);

  const allVerses = useMemo(() => [...verses, ...customVerses], [customVerses]);
  const filteredVerses = useMemo(() => {
    const search = normalize(query.trim());
    return allVerses.filter((verse) => {
      const custom = verse.id.startsWith('custom-verse-');
      const matchesTheme = theme === 'Todos' || verse.theme === theme;
      const matchesTestament = testament === 'Todos' || verse.testament === testament;
      const matchesOrigin = origin === 'Todos' || (origin === 'Meus' ? custom : !custom);
      const haystack = normalize(`${verse.reference} ${verse.book} ${verse.text} ${verse.theme}`);
      return matchesTheme && matchesTestament && matchesOrigin && (!search || haystack.includes(search));
    });
  }, [allVerses, origin, query, testament, theme]);

  const openForm = (verse: Verse | null) => {
    setEditingVerse(verse);
    setFormSession((current) => current + 1);
    setFormOpen(true);
  };

  const clearFilters = () => {
    setQuery('');
    setTheme('Todos');
    setTestament('Todos');
    setOrigin('Todos');
  };

  const hasFilters = Boolean(query) || theme !== 'Todos' || testament !== 'Todos' || origin !== 'Todos';

  return (
    <Page>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <ScreenTitle title="Biblioteca" subtitle="Encontre e adicione palavras para sua caminhada." />
        </View>
        <View style={styles.headerArt}><PixelBible size={82} /></View>
      </View>

      <PixelButton label="Adicionar versículo" icon={<Text style={styles.plus}>+</Text>} onPress={() => openForm(null)} />

      <View style={styles.searchBox}>
        <PixelNavIcon name="search" size={22} color={colors.gold} />
        <TextInput
          accessibilityLabel="Buscar versículos"
          value={query}
          onChangeText={setQuery}
          placeholder="Busque livro, tema ou palavra..."
          placeholderTextColor={colors.textMuted}
          returnKeyType="search"
          style={styles.searchInput}
        />
        {query ? <Pressable accessibilityRole="button" accessibilityLabel="Limpar busca" onPress={() => setQuery('')} style={styles.clearButton}><Text style={styles.clearText}>×</Text></Pressable> : null}
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>FILTROS</Text>
          {hasFilters ? <Pressable accessibilityRole="button" accessibilityLabel="Limpar todos os filtros" hitSlop={8} onPress={clearFilters}><Text style={styles.resetText}>LIMPAR TUDO</Text></Pressable> : null}
        </View>
        <Text style={styles.filterLabel}>TEMA</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(['Todos', ...themes] as const).map((item) => (
            <FilterChip key={item} label={item} active={theme === item} onPress={() => setTheme(item)} />
          ))}
        </ScrollView>
        <Text style={styles.filterLabel}>TESTAMENTO</Text>
        <View style={styles.segmentRow}>
          {(['Todos', 'Antigo', 'Novo'] as const).map((item) => (
            <FilterChip key={item} label={item} active={testament === item} onPress={() => setTestament(item)} grow />
          ))}
        </View>
        <Text style={styles.filterLabel}>ORIGEM</Text>
        <View style={styles.segmentRow}>
          {(['Todos', 'Biblioteca', 'Meus'] as const).map((item) => (
            <FilterChip key={item} label={item === 'Meus' ? `Meus (${customVerses.length})` : item} active={origin === item} onPress={() => setOrigin(item)} grow />
          ))}
        </View>
      </View>

      <View style={styles.tipCard}>
        <PixelNavIcon name="spark" color={colors.goldBright} size={26} />
        <View style={styles.tipCopy}>
          <Text style={styles.tipTitle}>DICA DO ESCRIBA</Text>
          <Text style={styles.tipText}>Toque no versículo para criar uma marcação. Seus versículos têm edição e exclusão próprias.</Text>
        </View>
      </View>

      <View style={styles.resultsSection}>
        <SectionTitle title="Resultados" action={<PixelBadge label={`${filteredVerses.length} versos`} />} />
        {filteredVerses.length ? (
          <View style={styles.verseList}>
            {filteredVerses.map((verse) => {
              const custom = verse.id.startsWith('custom-verse-');
              return (
                <View key={verse.id} style={styles.verseWrap}>
                  {custom ? <Text style={styles.customLabel}>✦ VERSÍCULO ADICIONADO POR VOCÊ</Text> : null}
                  <VerseCard verse={verse} mark={marks[verse.id]} onPress={() => setSelectedVerse(verse)} />
                  {custom ? (
                    <View style={styles.manageRow}>
                      <Pressable accessibilityRole="button" accessibilityLabel={`Editar ${verse.reference}`} onPress={() => openForm(verse)} style={styles.manageButton}><Text style={styles.editText}>EDITAR TEXTO</Text></Pressable>
                      <Pressable accessibilityRole="button" accessibilityLabel={`Excluir ${verse.reference}`} onPress={() => setDeleteTarget(verse)} style={[styles.manageButton, styles.manageDelete]}><Text style={styles.deleteText}>EXCLUIR VERSÍCULO</Text></Pressable>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.notFound}>
            <PixelNavIcon name="search" size={38} color={colors.textMuted} />
            <Text style={styles.notFoundTitle}>Nenhum versículo encontrado</Text>
            <Text style={styles.notFoundText}>Ajuste os filtros ou adicione um novo versículo.</Text>
            <PixelButton label="Limpar filtros" compact tone="dark" onPress={clearFilters} />
          </View>
        )}
      </View>

      <MarkModal key={selectedVerse?.id ?? 'closed'} verse={selectedVerse} onClose={() => setSelectedVerse(null)} />
      <VerseFormModal key={`${editingVerse?.id ?? 'new'}-${formSession}`} visible={formOpen} verse={editingVerse} onClose={() => setFormOpen(false)} />
      <ConfirmModal
        visible={Boolean(deleteTarget)}
        title="Excluir versículo?"
        message={`“${deleteTarget?.reference ?? ''}” e sua eventual marcação serão removidos deste aparelho.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deleteVerse(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Page>
  );
}

function FilterChip({ label, active, onPress, grow = false }: { label: string; active: boolean; onPress: () => void; grow?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.filter, grow && styles.filterGrow, active && styles.filterActive]}>
      <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  headerRow: { minHeight: 104, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  headerCopy: { flex: 1, minWidth: 0 },
  headerArt: { width: 92, height: 98, flexShrink: 0, alignItems: 'center', justifyContent: 'center' },
  plus: { color: colors.night, fontFamily: fonts.pixel, fontSize: 20, lineHeight: 21 },
  searchBox: { minHeight: 54, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line, borderBottomWidth: 5, borderBottomColor: colors.black, paddingHorizontal: 14, ...pixelShadow },
  searchInput: { flex: 1, color: colors.parchmentLight, fontFamily: fonts.body, fontSize: 14, paddingVertical: 10 },
  clearButton: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.night, borderWidth: 1, borderColor: colors.line },
  clearText: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 19, lineHeight: 20 },
  filterPanel: { gap: 10, backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line, padding: 13 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterTitle: { color: colors.parchmentLight, fontFamily: fonts.pixel, fontSize: 10, letterSpacing: 0.8 },
  filterLabel: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 9, letterSpacing: 0.6 },
  resetText: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 9 },
  filters: { gap: 7, paddingRight: 5 },
  segmentRow: { flexDirection: 'row', gap: 7 },
  filter: { minHeight: 35, justifyContent: 'center', paddingHorizontal: 11, paddingVertical: 8, backgroundColor: colors.night, borderWidth: 2, borderColor: colors.line },
  filterGrow: { flex: 1, alignItems: 'center', paddingHorizontal: 5 },
  filterActive: { backgroundColor: colors.gold, borderColor: colors.goldBright, borderBottomColor: colors.goldDark },
  filterText: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 9 },
  filterTextActive: { color: colors.night },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: colors.blueDark, borderWidth: 2, borderColor: colors.blue, padding: 14 },
  tipCopy: { flex: 1, gap: 3 },
  tipTitle: { color: colors.goldBright, fontFamily: fonts.pixel, fontSize: 9, letterSpacing: 0.8 },
  tipText: { color: '#D6E4F0', fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  resultsSection: { gap: 15 },
  verseList: { gap: 18 },
  verseWrap: { gap: 0 },
  customLabel: { alignSelf: 'flex-start', color: colors.gold, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderBottomWidth: 0, paddingHorizontal: 9, paddingVertical: 6, fontFamily: fonts.pixel, fontSize: 9 },
  manageRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, backgroundColor: colors.panel, borderWidth: 2, borderTopWidth: 0, borderColor: colors.line, padding: 8 },
  manageButton: { paddingHorizontal: 11, paddingVertical: 8, backgroundColor: colors.night, borderWidth: 1, borderColor: colors.line },
  manageDelete: { borderColor: colors.rubyDark },
  editText: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 9 },
  deleteText: { color: '#D97B6E', fontFamily: fonts.pixel, fontSize: 9 },
  notFound: { alignItems: 'center', padding: 34, gap: 10, borderWidth: 2, borderColor: colors.line, backgroundColor: colors.panel },
  notFoundTitle: { color: colors.parchmentLight, fontFamily: fonts.display, fontSize: 19, textAlign: 'center' },
  notFoundText: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, textAlign: 'center' },
});
