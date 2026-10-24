// Booking form rules, kept pure so tests/unit/booking.test.ts can check them without a browser.
import { normalizePhone } from './phone.ts';
import { serviceById } from '../data/services.ts';

/** Surcharges a visitor can tick in the form; prices match the price list. */
export const formExtras = [
  { id: 'design', label: 'Френч или рисунок', price: 500, minutes: 20, hint: 'ориентир: френч 500 ₽, рисунок от 150 ₽ за ноготь' },
  { id: 'foreign', label: 'Снять покрытие другого салона', price: 300, minutes: 15 },
  { id: 'length', label: 'Длина больше 3 мм', price: 300, minutes: 10 },
  { id: 'clear', label: 'Прозрачное укрепление', price: 500, minutes: 10 },
] as const;

export type ExtraId = (typeof formExtras)[number]['id'];

export const slots = [
  { value: 'morning', label: 'Утро', hint: '10–13' },
  { value: 'day', label: 'День', hint: '13–17' },
  { value: 'evening', label: 'Вечер', hint: 'после 17' },
] as const;

export const BOOK_AHEAD_DAYS = 60;

export interface BookingInput {
  service: string;
  extras: string[];
  date: string;
  slot: string;
  name: string;
  phone: string;
  consent: boolean;
}

export type BookingErrors = Partial<Record<'service' | 'date' | 'slot' | 'name' | 'phone' | 'consent', string>>;

/** yyyy-mm-dd of a local date, the format of <input type="date">. */
export const isoDay = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export function dateRange(today: Date): { min: string; max: string } {
  const max = new Date(today);
  max.setDate(max.getDate() + BOOK_AHEAD_DAYS);
  return { min: isoDay(today), max: isoDay(max) };
}

/** Error messages say what to do, not only what is wrong. */
export function validate(input: BookingInput, today: Date): BookingErrors {
  const errors: BookingErrors = {};
  if (!input.service) errors.service = 'Выберите услугу или «Пока не знаю».';
  const { min, max } = dateRange(today);
  if (!input.date) errors.date = 'Выберите день визита.';
  else if (input.date < min) errors.date = 'Эта дата уже прошла. Выберите сегодня или позже.';
  else if (input.date > max) errors.date = `Запись открыта на ${BOOK_AHEAD_DAYS} дней вперёд. Выберите дату пораньше.`;
  if (!input.slot) errors.slot = 'Выберите удобное время дня.';
  if (input.name.trim().length < 2) errors.name = 'Напишите, как к вам обращаться.';
  if (!input.phone.trim()) errors.phone = 'Нужен телефон, чтобы подтвердить время.';
  else if (!normalizePhone(input.phone)) errors.phone = 'Проверьте номер: нужно 10 цифр после +7.';
  if (!input.consent) errors.consent = 'Без согласия мы не можем принять заявку.';
  return errors;
}

/** Price and time for the summary. null price means the master will name it at the visit. */
export function estimate(serviceId: string, extras: string[]): { price: number | null; minutes: number | null } {
  const s = serviceById(serviceId);
  if (!s) return { price: null, minutes: null };
  const picked = formExtras.filter((x) => extras.includes(x.id));
  return {
    price: s.price + picked.reduce((sum, x) => sum + x.price, 0),
    minutes: s.duration + picked.reduce((sum, x) => sum + x.minutes, 0),
  };
}
