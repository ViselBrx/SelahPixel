import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import { Prayer, Verse } from '@/data/content';
import { getLocalDateKey } from '@/utils/date';

export const markColors = ['#E7B85C', '#70A27A', '#668DB2', '#A94C49', '#8C79A8'] as const;

export type VerseMark = {
  color: string;
  note: string;
  savedAt: string;
};

export type VerseDraft = Omit<Verse, 'id'>;
export type PrayerDraft = Omit<Prayer, 'id'>;

type StoredProgress = {
  marks: Record<string, VerseMark>;
  completedPrayers: Record<string, string>;
  activeDates: string[];
  lastStreakCelebration: string | null;
  customVerses: Verse[];
  customPrayers: Prayer[];
};

type ProgressContextValue = StoredProgress & {
  hydrated: boolean;
  streak: number;
  shouldCelebrateStreak: boolean;
  acknowledgeStreak: () => void;
  setMark: (verseId: string, color: string, note: string) => void;
  removeMark: (verseId: string) => void;
  completePrayer: (prayerId: string) => void;
  addVerse: (draft: VerseDraft) => void;
  updateVerse: (verseId: string, draft: VerseDraft) => void;
  deleteVerse: (verseId: string) => void;
  addPrayer: (draft: PrayerDraft) => void;
  updatePrayer: (prayerId: string, draft: PrayerDraft) => void;
  deletePrayer: (prayerId: string) => void;
  notice: AppNotice | null;
  dismissNotice: () => void;
};

export type AppNotice = {
  id: number;
  message: string;
  tone: 'success' | 'info';
};

const STORAGE_KEY = '@ora/progress-v3';
const OLD_STORAGE_KEYS = ['@ora/progress-v1', '@ora/progress-v2'];
const initialProgress: StoredProgress = {
  marks: {},
  completedPrayers: {},
  activeDates: [],
  lastStreakCelebration: null,
  customVerses: [],
  customPrayers: [],
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function calculateStreak(activeDates: string[]) {
  const dates = new Set(activeDates);
  const cursor = new Date();

  if (!dates.has(getLocalDateKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (dates.has(getLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function registerToday(current: StoredProgress) {
  const today = getLocalDateKey();
  if (current.activeDates.includes(today)) return current;
  return { ...current, activeDates: [...current.activeDates, today].slice(-120) };
}

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<StoredProgress>(initialProgress);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<AppNotice | null>(null);

  const notify = useCallback((message: string, tone: AppNotice['tone'] = 'success') => {
    setNotice({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.multiRemove(OLD_STORAGE_KEYS).catch(() => undefined);

    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (!mounted) return;
        const restored = saved ? (JSON.parse(saved) as Partial<StoredProgress>) : {};
        setProgress(
          registerToday({
            marks: restored.marks ?? {},
            completedPrayers: restored.completedPrayers ?? {},
            activeDates: restored.activeDates ?? [],
            lastStreakCelebration: restored.lastStreakCelebration ?? null,
            customVerses: restored.customVerses ?? [],
            customPrayers: restored.customPrayers ?? [],
          }),
        );
      })
      .catch(() => {
        if (mounted) setProgress(registerToday(initialProgress));
      })
      .finally(() => {
        if (mounted) setHydrated(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setProgress(registerToday);
    });
    return () => subscription.remove();
  }, [hydrated]);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress)).catch(() => undefined);
  }, [hydrated, progress]);

  const value = useMemo<ProgressContextValue>(() => ({
    ...progress,
    hydrated,
    notice,
    dismissNotice: () => setNotice(null),
    streak: calculateStreak(progress.activeDates),
    shouldCelebrateStreak: hydrated && progress.lastStreakCelebration !== getLocalDateKey(),
    acknowledgeStreak: () =>
      setProgress((current) => ({ ...current, lastStreakCelebration: getLocalDateKey() })),
    setMark: (verseId, color, note) => {
      const updating = Boolean(progress.marks[verseId]);
      setProgress((current) => ({
        ...current,
        marks: {
          ...current.marks,
          [verseId]: { color, note: note.trim(), savedAt: new Date().toISOString() },
        },
      }));
      notify(updating ? 'Marcação atualizada com sucesso.' : 'Marcação cadastrada com sucesso.');
    },
    removeMark: (verseId) => {
      setProgress((current) => {
        const marks = { ...current.marks };
        delete marks[verseId];
        return { ...current, marks };
      });
      notify('Marcação excluída com sucesso.');
    },
    completePrayer: (prayerId) => {
      setProgress((current) => ({
        ...current,
        completedPrayers: { ...current.completedPrayers, [prayerId]: new Date().toISOString() },
      }));
      notify('Oração concluída e salva neste aparelho.');
    },
    addVerse: (draft) => {
      setProgress((current) => ({
        ...current,
        customVerses: [...current.customVerses, { ...draft, id: `custom-verse-${Date.now()}` }],
      }));
      notify('Versículo adicionado com sucesso.');
    },
    updateVerse: (verseId, draft) => {
      setProgress((current) => ({
        ...current,
        customVerses: current.customVerses.map((verse) => (verse.id === verseId ? { ...draft, id: verseId } : verse)),
      }));
      notify('Versículo atualizado com sucesso.');
    },
    deleteVerse: (verseId) => {
      setProgress((current) => {
        const marks = { ...current.marks };
        delete marks[verseId];
        return {
          ...current,
          marks,
          customVerses: current.customVerses.filter((verse) => verse.id !== verseId),
        };
      });
      notify('Versículo excluído com sucesso.');
    },
    addPrayer: (draft) => {
      setProgress((current) => ({
        ...current,
        customPrayers: [...current.customPrayers, { ...draft, id: `custom-prayer-${Date.now()}` }],
      }));
      notify('Oração adicionada com sucesso.');
    },
    updatePrayer: (prayerId, draft) => {
      setProgress((current) => ({
        ...current,
        customPrayers: current.customPrayers.map((prayer) =>
          prayer.id === prayerId ? { ...draft, id: prayerId } : prayer,
        ),
      }));
      notify('Oração atualizada com sucesso.');
    },
    deletePrayer: (prayerId) => {
      setProgress((current) => {
        const completedPrayers = { ...current.completedPrayers };
        delete completedPrayers[prayerId];
        return {
          ...current,
          completedPrayers,
          customPrayers: current.customPrayers.filter((prayer) => prayer.id !== prayerId),
        };
      });
      notify('Oração excluída com sucesso.');
    },
  }), [hydrated, notice, notify, progress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress deve ser usado dentro de ProgressProvider');
  return context;
}
