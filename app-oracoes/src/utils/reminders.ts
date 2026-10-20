import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { NotificationContentInput } from 'expo-notifications';

import { Prayer, Verse } from '@/data/content';

const CHANNEL_ID = 'daily-reminders';
type NotificationsApi = typeof import('expo-notifications');
let notifications: NotificationsApi | null | undefined;

function getNotifications() {
  // Expo Go can report the same execution environment as a development build, but lacks this native module here.
  if (Platform.OS === 'web' || Constants.appOwnership === 'expo') return null;
  if (notifications !== undefined) return notifications;
  try {
    // Expo Go may not include this native module; loading it lazily keeps the rest of the app available.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notifications = require('expo-notifications') as NotificationsApi;
    notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {
    notifications = null;
  }
  return notifications;
}

export function parseReminderTime(value: string) {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(value.trim());
  if (!match) return null;
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

async function requestPermission() {
  const Notifications = getNotifications();
  if (Platform.OS === 'web' || !Notifications) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Lembretes diários',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180],
      lightColor: '#E7B85C',
      sound: null,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function schedulePrayerReminder(prayer: Pick<Prayer, 'id' | 'title' | 'subtitle'>, time: string) {
  return scheduleDailyReminder({
    title: 'Seu momento de oração',
    body: prayer.title ? `Reserve alguns minutos para: ${prayer.title}` : prayer.subtitle,
    data: { url: '/oracoes', kind: 'prayer', itemId: prayer.id },
  }, time);
}

export async function scheduleVerseReminder(verse: Pick<Verse, 'id' | 'reference' | 'text'>, time: string) {
  return scheduleDailyReminder({
    title: verse.reference || 'Versículo do dia',
    body: verse.text ? `“${verse.text}”` : 'Separe um instante para a Palavra.',
    data: { url: '/biblia', kind: 'verse', itemId: verse.id },
  }, time);
}

async function scheduleDailyReminder(
  content: Pick<NotificationContentInput, 'title' | 'body' | 'data'>,
  time: string,
) {
  const Notifications = getNotifications();
  if (!Notifications) {
    return { id: null, error: 'Os lembretes precisam de um APK ou development build atualizado. O Expo Go não oferece suporte a este módulo nesta versão.' };
  }
  const parsed = parseReminderTime(time);
  if (!parsed) return { id: null, error: 'Use o horário no formato HH:MM, por exemplo 07:30.' };
  if (!(await requestPermission())) return { id: null, error: 'Ative as notificações nas permissões do aparelho para criar o lembrete.' };

  const id = await Notifications.scheduleNotificationAsync({
    content: { ...content, sound: undefined },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: parsed.hour,
      minute: parsed.minute,
      channelId: Platform.OS === 'android' ? CHANNEL_ID : undefined,
    },
  });
  return { id, error: null };
}

export function cancelReminder(notificationId?: string | null) {
  if (!notificationId || Platform.OS === 'web') return;
  getNotifications()?.cancelScheduledNotificationAsync(notificationId).catch(() => undefined);
}
