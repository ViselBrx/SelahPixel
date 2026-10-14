export type DayPeriod = 'manha' | 'tarde' | 'noite';

export function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayPeriod(date = new Date()): DayPeriod {
  const hour = date.getHours();
  if (hour < 12) return 'manha';
  if (hour < 18) return 'tarde';
  return 'noite';
}

export const periodLabels: Record<DayPeriod, string> = {
  manha: 'Manhã',
  tarde: 'Tarde',
  noite: 'Noite',
};

export function getPeriodGreeting(date = new Date()) {
  const period = getDayPeriod(date);
  if (period === 'manha') return 'Bom dia, viajante!';
  if (period === 'tarde') return 'Boa tarde, viajante!';
  return 'Boa noite, viajante!';
}

export function formatLocalDate(date = new Date()) {
  const formatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getRecentDays(amount = 7, date = new Date()) {
  return Array.from({ length: amount }, (_, index) => {
    const day = new Date(date);
    day.setDate(date.getDate() - (amount - 1 - index));
    return {
      key: getLocalDateKey(day),
      label: new Intl.DateTimeFormat('pt-BR', { weekday: 'narrow' }).format(day).toUpperCase(),
      day: day.getDate(),
    };
  });
}

