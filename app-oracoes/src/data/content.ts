import { DayPeriod } from '@/utils/date';

export type VerseTheme = 'Promessas' | 'Coragem' | 'Paz' | 'Sabedoria' | 'Gratidão';

export type Verse = {
  id: string;
  reference: string;
  book: string;
  text: string;
  theme: VerseTheme;
  testament: 'Antigo' | 'Novo';
  reminderTime?: string | null;
  notificationId?: string | null;
};

export type Prayer = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  focus: string;
  text: string;
  verseReference: string;
  color: string;
  icon: 'candle' | 'shield' | 'heart' | 'scroll';
  period: DayPeriod | 'qualquer';
  reminderTime?: string | null;
  notificationId?: string | null;
};

// O app começa sem registros de demonstração. Todo o conteúdo vem do próprio usuário.
export const verses: Verse[] = [];
export const prayers: Prayer[] = [];
export const themes: VerseTheme[] = ['Promessas', 'Coragem', 'Paz', 'Sabedoria', 'Gratidão'];

export function getDailyVerse(collection: Verse[], date = new Date()) {
  if (!collection.length) return null;
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const day = Math.floor((current - start) / 86_400_000);
  return collection[day % collection.length];
}
