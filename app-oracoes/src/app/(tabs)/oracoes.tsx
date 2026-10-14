import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ConfirmModal } from '@/components/confirm-modal';
import { PixelCandle, PixelHeart, PixelNavIcon, PixelScroll, PixelShield, PixelSparkles } from '@/components/pixel-art';
import { PrayerFormModal } from '@/components/prayer-form-modal';
import { PrayerModal } from '@/components/prayer-modal';
import { Eyebrow, Page, PixelBadge, PixelButton, ScreenTitle, SectionTitle } from '@/components/ui';
import { useProgress } from '@/context/progress-context';
import { Prayer, prayers } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';
import { DayPeriod, formatLocalDate, getDayPeriod, periodLabels } from '@/utils/date';

type PeriodFilter = 'agora' | DayPeriod | 'todas';
type StatusFilter = 'todas' | 'pendentes' | 'concluidas';

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function PrayerArt({ prayer }: { prayer: Prayer }) {
  if (prayer.icon === 'shield') return <PixelShield size={62} />;
  if (prayer.icon === 'heart') return <PixelHeart size={62} />;
  if (prayer.icon === 'scroll') return <PixelScroll size={62} />;
  return <PixelCandle size={62} />;
}

export default function PrayersScreen() {
  const { completedPrayers, customPrayers, deletePrayer, streak } = useProgress();
  const [query, setQuery] = useState('');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('agora');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas');
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [editingPrayer, setEditingPrayer] = useState<Prayer | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Prayer | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formSession, setFormSession] = useState(0);
  const currentPeriod = getDayPeriod();
  const completedCount = Object.keys(completedPrayers).length;

  const allPrayers = useMemo(() => [...prayers, ...customPrayers], [customPrayers]);
  const filteredPrayers = useMemo(() => {
    const search = normalize(query.trim());
    const selectedPeriod = periodFilter === 'agora' ? currentPeriod : periodFilter;
    return allPrayers.filter((prayer) => {
      const completed = Boolean(completedPrayers[prayer.id]);
      const matchesPeriod = selectedPeriod === 'todas' || prayer.period === 'qualquer' || prayer.period === selectedPeriod;
      const matchesStatus = statusFilter === 'todas' || (statusFilter === 'concluidas' ? completed : !completed);
      const haystack = normalize(`${prayer.title} ${prayer.subtitle} ${prayer.focus} ${prayer.text} ${prayer.verseReference}`);
      return matchesPeriod && matchesStatus && (!search || haystack.includes(search));
    });
  }, [allPrayers, completedPrayers, currentPeriod, periodFilter, query, statusFilter]);

  const openForm = (prayer: Prayer | null) => {
    setEditingPrayer(prayer);
    setFormSession((current) => current + 1);
    setFormOpen(true);
  };

  const clearFilters = () => {
    setQuery('');
    setPeriodFilter('agora');
    setStatusFilter('todas');
  };

  return (
    <Page>
      <View style={styles.headingRow}>
        <ScreenTitle title="Sala de oração" subtitle="Pare por alguns minutos. Respire. Ele está aqui." />
        <PixelBadge label={`Agora • ${periodLabels[currentPeriod]}`} color={colors.gold} />
      </View>
      <Text style={styles.localDate}>{formatLocalDate()}</Text>

      <PixelButton label="Adicionar oração" icon={<Text style={styles.plus}>+</Text>} onPress={() => openForm(null)} />

      <View style={styles.hero}>
        <View style={styles.sparkles}><PixelSparkles size={72} color={colors.gold} /></View>
        <PixelCandle size={88} />
        <View style={styles.heroCopy}>
          <Eyebrow>Acenda sua chama</Eyebrow>
          <Text style={styles.heroTitle}>{streak} {streak === 1 ? 'dia' : 'dias'} de jornada</Text>
          <Text style={styles.heroText}>Orações para a {periodLabels[currentPeriod].toLowerCase()}, escolhidas pelo horário do aparelho.</Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <Summary value={completedCount} label="ORAÇÕES FEITAS" />
        <Summary value={customPrayers.length} label="ORAÇÕES CRIADAS" />
        <Summary value={streak} label="DIAS SEGUIDOS" />
      </View>

      <View style={styles.searchBox}>
        <PixelNavIcon name="search" size={21} color={colors.gold} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Buscar oração, foco ou referência..." placeholderTextColor={colors.textMuted} style={styles.searchInput} />
        {query ? <Pressable onPress={() => setQuery('')} style={styles.clearButton}><Text style={styles.clearText}>×</Text></Pressable> : null}
      </View>

      <View style={styles.filterPanel}>
        <View style={styles.filterHeader}>
          <Text style={styles.filterTitle}>QUANDO VOCÊ QUER ORAR?</Text>
          <Pressable onPress={clearFilters}><Text style={styles.resetText}>REDEFINIR</Text></Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {([
            ['agora', `Agora • ${periodLabels[currentPeriod]}`],
            ['manha', 'Manhã'],
            ['tarde', 'Tarde'],
            ['noite', 'Noite'],
            ['todas', 'Todas'],
          ] as const).map(([value, label]) => (
            <FilterChip key={value} label={label} active={periodFilter === value} onPress={() => setPeriodFilter(value)} />
          ))}
        </ScrollView>
        <Text style={styles.filterLabel}>STATUS</Text>
        <View style={styles.statusRow}>
          {([
            ['todas', 'Todas'],
            ['pendentes', 'Não feitas'],
            ['concluidas', 'Concluídas'],
          ] as const).map(([value, label]) => (
            <FilterChip key={value} label={label} active={statusFilter === value} onPress={() => setStatusFilter(value)} grow />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Orações encontradas" action={<PixelBadge label={`${filteredPrayers.length} opções`} color={colors.sage} />} />
        {filteredPrayers.length ? (
          <View style={styles.prayerList}>
            {filteredPrayers.map((prayer) => {
              const completed = Boolean(completedPrayers[prayer.id]);
              const custom = prayer.id.startsWith('custom-prayer-');
              return (
                <View key={prayer.id}>
                  {custom ? <Text style={styles.customLabel}>✦ ORAÇÃO CRIADA POR VOCÊ</Text> : null}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir oração ${prayer.title}`}
                    onPress={() => setSelectedPrayer(prayer)}
                    style={({ pressed }) => [styles.prayerCard, pressed && styles.prayerPressed]}>
                    <View style={[styles.artTile, { borderColor: prayer.color }]}><PrayerArt prayer={prayer} /></View>
                    <View style={styles.cardCopy}>
                      <View style={styles.cardTopline}>
                        <Text style={styles.duration}>{prayer.duration} • {prayer.period === 'qualquer' ? 'QUALQUER HORA' : periodLabels[prayer.period].toUpperCase()}</Text>
                        {completed ? <Text style={styles.completed}>✓ FEITA</Text> : null}
                      </View>
                      <Text style={styles.cardTitle}>{prayer.title}</Text>
                      <Text style={styles.cardSubtitle}>{prayer.subtitle}</Text>
                      <View style={styles.focusRow}><View style={[styles.focusDot, { backgroundColor: prayer.color }]} /><Text numberOfLines={1} style={styles.focusText}>{prayer.focus}</Text></View>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                  </Pressable>
                  {custom ? (
                    <View style={styles.manageRow}>
                      <Pressable onPress={() => openForm(prayer)} style={styles.manageButton}><Text style={styles.editText}>EDITAR ORAÇÃO</Text></Pressable>
                      <Pressable onPress={() => setDeleteTarget(prayer)} style={[styles.manageButton, styles.manageDelete]}><Text style={styles.deleteText}>EXCLUIR</Text></Pressable>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.empty}>
            <PixelNavIcon name="search" size={36} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>Nenhuma oração encontrada</Text>
            <Text style={styles.emptyText}>Tente outro período, status ou termo de busca.</Text>
            <PixelButton label="Limpar filtros" compact tone="dark" onPress={clearFilters} />
          </View>
        )}
      </View>

      <View style={styles.footerQuote}>
        <PixelScroll size={48} />
        <Text style={styles.quote}>Este espaço é seu. Adicione as orações que fazem parte da sua caminhada.</Text>
        <Text style={styles.quoteRef}>CONTEÚDO SALVO SOMENTE NESTE APARELHO</Text>
      </View>

      <PrayerModal key={selectedPrayer?.id ?? 'closed'} prayer={selectedPrayer} onClose={() => setSelectedPrayer(null)} />
      <PrayerFormModal key={`${editingPrayer?.id ?? 'new'}-${formSession}`} visible={formOpen} prayer={editingPrayer} onClose={() => setFormOpen(false)} />
      <ConfirmModal
        visible={Boolean(deleteTarget)}
        title="Excluir oração?"
        message={`“${deleteTarget?.title ?? ''}” será removida definitivamente deste aparelho.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) deletePrayer(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </Page>
  );
}

function Summary({ value, label }: { value: number; label: string }) {
  return <View style={styles.summaryCard}><Text style={styles.summaryValue}>{value}</Text><Text style={styles.summaryLabel}>{label}</Text></View>;
}

function FilterChip({ label, active, onPress, grow = false }: { label: string; active: boolean; onPress: () => void; grow?: boolean }) {
  return <Pressable onPress={onPress} style={[styles.filter, grow && styles.filterGrow, active && styles.filterActive]}><Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  headingRow: { gap: 12 },
  localDate: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: -17 },
  plus: { color: colors.night, fontFamily: fonts.pixel, fontSize: 20, lineHeight: 21 },
  hero: { minHeight: 160, flexDirection: 'row', alignItems: 'center', gap: 10, overflow: 'hidden', backgroundColor: colors.blueDark, borderWidth: 2, borderColor: colors.blue, borderBottomWidth: 6, borderBottomColor: '#1E2D42', padding: 16, ...pixelShadow },
  sparkles: { position: 'absolute', right: 2, top: 0, opacity: 0.25 },
  heroCopy: { flex: 1, gap: 6 },
  heroTitle: { color: colors.parchmentLight, fontFamily: fonts.display, fontSize: 21 },
  heroText: { color: '#CAD7E5', fontFamily: fonts.body, fontSize: 13, lineHeight: 19 },
  summaryRow: { flexDirection: 'row', gap: 8 },
  summaryCard: { flex: 1, alignItems: 'center', backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line, borderBottomWidth: 5, borderBottomColor: colors.black, paddingVertical: 12, gap: 4 },
  summaryValue: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 18 },
  summaryLabel: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 9, letterSpacing: 0.3, textAlign: 'center' },
  searchBox: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line, paddingHorizontal: 13 },
  searchInput: { flex: 1, color: colors.parchmentLight, fontFamily: fonts.body, fontSize: 14, paddingVertical: 9 },
  clearButton: { width: 29, height: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.night },
  clearText: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 18 },
  filterPanel: { gap: 11, backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line, padding: 13 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterTitle: { color: colors.parchmentLight, fontFamily: fonts.pixel, fontSize: 10 },
  resetText: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 9 },
  filterLabel: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 9 },
  chipRow: { gap: 7, paddingRight: 5 },
  statusRow: { flexDirection: 'row', gap: 7 },
  filter: { minHeight: 35, justifyContent: 'center', paddingHorizontal: 11, backgroundColor: colors.night, borderWidth: 2, borderColor: colors.line },
  filterGrow: { flex: 1, alignItems: 'center', paddingHorizontal: 4 },
  filterActive: { backgroundColor: colors.gold, borderColor: colors.goldBright },
  filterText: { color: colors.textMuted, fontFamily: fonts.pixel, fontSize: 9 },
  filterTextActive: { color: colors.night },
  section: { gap: 15 },
  prayerList: { gap: 14 },
  customLabel: { alignSelf: 'flex-start', color: colors.gold, backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.line, borderBottomWidth: 0, paddingHorizontal: 9, paddingVertical: 6, fontFamily: fonts.pixel, fontSize: 9 },
  prayerCard: { minHeight: 116, flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line, borderBottomWidth: 5, borderBottomColor: colors.black, padding: 11 },
  prayerPressed: { transform: [{ translateY: 3 }], borderBottomWidth: 2, backgroundColor: colors.panelLight },
  artTile: { width: 76, height: 80, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.night, borderWidth: 2 },
  cardCopy: { flex: 1, gap: 4 },
  cardTopline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  duration: { color: colors.parchmentLight, fontFamily: fonts.pixel, fontSize: 9 },
  completed: { color: '#BDE6C0', fontFamily: fonts.pixel, fontSize: 9 },
  cardTitle: { color: colors.parchmentLight, fontFamily: fonts.display, fontSize: 18 },
  cardSubtitle: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 12 },
  focusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  focusDot: { width: 6, height: 6 },
  focusText: { flex: 1, color: colors.textMuted, fontFamily: fonts.body, fontSize: 11 },
  arrow: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 25 },
  manageRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, backgroundColor: colors.panel, borderWidth: 2, borderTopWidth: 0, borderColor: colors.line, padding: 8 },
  manageButton: { paddingHorizontal: 11, paddingVertical: 8, backgroundColor: colors.night, borderWidth: 1, borderColor: colors.line },
  manageDelete: { borderColor: colors.rubyDark },
  editText: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 9 },
  deleteText: { color: '#D97B6E', fontFamily: fonts.pixel, fontSize: 9 },
  empty: { alignItems: 'center', gap: 10, padding: 30, backgroundColor: colors.panel, borderWidth: 2, borderColor: colors.line },
  emptyTitle: { color: colors.parchmentLight, fontFamily: fonts.display, fontSize: 19 },
  emptyText: { color: colors.textMuted, fontFamily: fonts.body, fontSize: 13, textAlign: 'center' },
  footerQuote: { alignItems: 'center', gap: 8, padding: 24, borderWidth: 2, borderColor: colors.goldDark, backgroundColor: '#282334' },
  quote: { color: colors.parchmentLight, fontFamily: fonts.display, fontSize: 16, fontStyle: 'italic', lineHeight: 23, textAlign: 'center' },
  quoteRef: { color: colors.gold, fontFamily: fonts.pixel, fontSize: 9, letterSpacing: 0.8 },
});
