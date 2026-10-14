import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { MarkModal } from '@/components/mark-modal';
import { PixelBible, PixelBookmark, PixelFlame, PixelNavIcon } from '@/components/pixel-art';
import { StreakModal } from '@/components/streak-modal';
import { BrandMark, Page, PixelBadge, PixelButton, SectionTitle } from '@/components/ui';
import { useProgress } from '@/context/progress-context';
import { getDailyVerse, themes, Verse } from '@/data/content';
import { colors, fonts, pixelShadow } from '@/theme';
import { formatLocalDate, getPeriodGreeting } from '@/utils/date';

export default function HomeScreen() {
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const [showStreak, setShowStreak] = useState(false);
  const {
    marks,
    completedPrayers,
    customVerses,
    customPrayers,
    streak,
    shouldCelebrateStreak,
    acknowledgeStreak,
  } = useProgress();
  const dailyVerse = useMemo(() => getDailyVerse(customVerses), [customVerses]);
  const markedCount = Object.keys(marks).length;
  const completedPrayerCount = Object.keys(completedPrayers).length;
  const dailyMarked = dailyVerse ? Boolean(marks[dailyVerse.id]) : false;
  const firstPrayer = customPrayers[0];
  const firstPrayerDone = firstPrayer ? Boolean(completedPrayers[firstPrayer.id]) : false;

  const missions = [
    {
      title: dailyVerse ? 'Guardar a palavra do dia' : 'Adicionar seu primeiro versículo',
      detail: dailyVerse ? (dailyMarked ? 'Marcação cadastrada' : 'Cadastre uma marcação') : 'Monte sua biblioteca pessoal',
      done: dailyMarked,
      onPress: () => (dailyVerse ? setSelectedVerse(dailyVerse) : router.push('/biblia' as never)),
    },
    {
      title: firstPrayer ? firstPrayer.title : 'Adicionar sua primeira oração',
      detail: firstPrayer ? (firstPrayerDone ? 'Oração concluída' : 'Sua oração está esperando') : 'Escreva uma oração pessoal',
      done: firstPrayerDone,
      onPress: () => router.push('/oracoes' as never),
    },
    {
      title: 'Explorar uma promessa',
      detail: 'Abra sua biblioteca bíblica',
      done: markedCount >= 3,
      onPress: () => router.push('/biblia' as never),
    },
  ];

  return (
    <Page>
      <View style={styles.topBar}>
        <BrandMark />
        <Pressable accessibilityRole="button" accessibilityLabel="Abrir sequência diária" onPress={() => setShowStreak(true)} style={styles.streakChip}>
          <PixelFlame size={25} />
          <View>
            <Text style={styles.streakNumber}>{streak}</Text>
            <Text style={styles.streakTiny}>DIAS</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.greetingBlock}>
        <Text style={styles.greeting}>{getPeriodGreeting()}</Text>
        <Text style={styles.localDate}>{formatLocalDate()}</Text>
        <Text style={styles.greetingCopy}>Sua próxima pequena jornada começa na Palavra.</Text>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroPixelTop} />
        <View style={styles.heroPixelBottom} />
        <View style={styles.bibleArt} pointerEvents="none">
          <PixelBible size={118} />
        </View>
        <PixelBadge label={dailyVerse ? 'Palavra do dia' : 'Seu espaço pessoal'} color={colors.ruby} />
        <Text style={styles.heroQuote}>
          {dailyVerse ? `“${dailyVerse.text}”` : 'Sua palavra do dia aparecerá aqui.'}
        </Text>
        <Text style={styles.heroReference}>
          {dailyVerse ? dailyVerse.reference : 'ADICIONE UM VERSÍCULO PARA COMEÇAR'}
        </Text>
        <PixelButton
          compact
          tone={dailyMarked ? 'dark' : 'gold'}
          label={dailyVerse ? (dailyMarked ? 'Atualizar marcação' : 'Cadastrar marcação') : 'Adicionar versículo'}
          icon={<PixelBookmark size={20} color={dailyMarked ? colors.gold : colors.night} filled={dailyMarked} />}
          onPress={() => (dailyVerse ? setSelectedVerse(dailyVerse) : router.push('/biblia' as never))}
          style={styles.heroAction}
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>DIAS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🙏</Text>
          <Text style={styles.statValue}>{completedPrayerCount}</Text>
          <Text style={styles.statLabel}>ORAÇÕES</Text>
        </View>
        <View style={styles.statCard}>
          <PixelBookmark size={20} color={colors.gold} filled />
          <Text style={styles.statValue}>{markedCount}</Text>
          <Text style={styles.statLabel}>MARCAS</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Missões de hoje" action={<Text style={styles.sectionCounter}>{missions.filter((item) => item.done).length}/3</Text>} />
        <View style={styles.missionList}>
          {missions.map((mission, index) => (
            <Pressable
              key={mission.title}
              accessibilityRole="button"
              onPress={mission.onPress}
              style={({ pressed }) => [styles.mission, pressed && styles.missionPressed]}>
              <View style={[styles.questBox, mission.done && styles.questBoxDone]}>
                <Text style={styles.questStatus}>{mission.done ? '✓' : index + 1}</Text>
              </View>
              <View style={styles.missionCopy}>
                <Text style={[styles.missionTitle, mission.done && styles.missionTitleDone]}>{mission.title}</Text>
                <Text style={styles.missionDetail}>{mission.detail}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title="Explore por tema" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themeRow}>
          {themes.map((theme, index) => (
            <Pressable
              key={theme}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/biblia', params: { tema: theme } } as never)}
              style={({ pressed }) => [styles.themeCard, pressed && styles.themePressed]}>
              <PixelNavIcon name={index % 2 ? 'spark' : 'bible'} size={30} color={index % 2 ? colors.blue : colors.gold} />
              <Text style={styles.themeTitle}>{theme}</Text>
              <Text style={styles.themeArrow}>→</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <MarkModal key={selectedVerse?.id ?? 'closed'} verse={selectedVerse} onClose={() => setSelectedVerse(null)} />
      <StreakModal
        visible={showStreak || shouldCelebrateStreak}
        onClose={() => {
          acknowledgeStreak();
          setShowStreak(false);
        }}
      />
    </Page>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakChip: {
    minWidth: 68,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 4,
    borderBottomColor: colors.black,
  },
  streakTiny: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
    lineHeight: 9,
  },
  streakNumber: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 14,
    lineHeight: 15,
  },
  greetingBlock: {
    gap: 5,
    marginTop: 2,
  },
  greeting: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 31,
    lineHeight: 36,
  },
  greetingCopy: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  localDate: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroCard: {
    minHeight: 300,
    overflow: 'hidden',
    backgroundColor: colors.parchment,
    borderWidth: 3,
    borderColor: colors.parchmentLight,
    borderBottomWidth: 8,
    borderBottomColor: '#9C8964',
    padding: 21,
    gap: 14,
    ...pixelShadow,
  },
  heroPixelTop: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 46,
    height: 13,
    backgroundColor: colors.gold,
  },
  heroPixelBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 74,
    height: 8,
    backgroundColor: colors.ruby,
  },
  bibleArt: {
    position: 'absolute',
    right: -8,
    bottom: 6,
    opacity: 0.95,
  },
  heroQuote: {
    maxWidth: '88%',
    color: colors.ink,
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 34,
  },
  heroReference: {
    color: colors.rubyDark,
    fontFamily: fonts.pixel,
    fontSize: 11,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroAction: {
    alignSelf: 'flex-start',
    marginTop: 'auto',
    marginRight: 72,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
    borderBottomColor: colors.black,
    gap: 2,
  },
  statIcon: {
    fontSize: 17,
    lineHeight: 20,
  },
  statValue: {
    color: colors.parchmentLight,
    fontFamily: fonts.pixel,
    fontSize: 16,
  },
  statLabel: {
    color: colors.textMuted,
    fontFamily: fonts.pixel,
    fontSize: 9,
    letterSpacing: 0.6,
  },
  section: {
    gap: 14,
  },
  sectionCounter: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 11,
  },
  missionList: {
    gap: 9,
  },
  mission: {
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    padding: 11,
  },
  missionPressed: {
    backgroundColor: colors.panelLight,
    transform: [{ translateX: 3 }],
  },
  questBox: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.night,
    borderWidth: 2,
    borderColor: colors.line,
  },
  questBoxDone: {
    backgroundColor: colors.sage,
    borderColor: '#9FC69E',
  },
  questStatus: {
    color: colors.parchmentLight,
    fontFamily: fonts.pixel,
    fontSize: 13,
  },
  missionCopy: {
    flex: 1,
    gap: 3,
  },
  missionTitle: {
    color: colors.parchmentLight,
    fontFamily: fonts.body,
    fontSize: 14,
    fontWeight: '700',
  },
  missionTitleDone: {
    color: colors.sage,
  },
  missionDetail: {
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  chevron: {
    color: colors.gold,
    fontFamily: fonts.pixel,
    fontSize: 25,
  },
  themeRow: {
    gap: 11,
    paddingRight: 8,
  },
  themeCard: {
    width: 132,
    height: 112,
    justifyContent: 'space-between',
    backgroundColor: colors.panel,
    borderWidth: 2,
    borderColor: colors.line,
    borderBottomWidth: 5,
    borderBottomColor: colors.black,
    padding: 13,
  },
  themePressed: {
    transform: [{ translateY: 3 }],
    borderBottomWidth: 2,
  },
  themeTitle: {
    color: colors.parchmentLight,
    fontFamily: fonts.display,
    fontSize: 16,
  },
  themeArrow: {
    position: 'absolute',
    right: 12,
    bottom: 10,
    color: colors.textMuted,
    fontFamily: fonts.pixel,
  },
});
