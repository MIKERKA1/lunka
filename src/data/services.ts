// Demo prices and durations. One source for the services list, the price list, the helper and the booking form.

export type ServiceId = 'manicure' | 'gel' | 'strength' | 'design' | 'removal' | 'pedicure' | 'pedicure-gel';

export interface Service {
  id: ServiceId;
  name: string;
  /** What it is, in words a person without salon vocabulary understands. */
  plain: string;
  includes: string;
  price: number;
  /** Minutes. */
  duration: number;
  photo: string;
  /** Shown in the services list; the rest only appear in the price list. */
  featured: boolean;
  /** Add-ons are booked on top of a coating, not on their own. */
  addon?: boolean;
  priceLabel?: string;
}

export const services: Service[] = [
  {
    id: 'manicure',
    name: 'Маникюр без покрытия',
    plain: 'Ухоженные руки без цвета. Подходит, если лак мешает работе или хочется, чтобы ногти отдохнули.',
    includes: 'Форма, кутикула, полировка, масло и крем',
    price: 1600,
    duration: 50,
    photo: 'nude-white',
    featured: true,
  },
  {
    id: 'gel',
    name: 'Маникюр с гель-лаком',
    plain: 'Ровный цвет, который держится две-три недели и не скалывается. Самая частая запись.',
    includes: 'Маникюр, снятие нашего покрытия, база, цвет, топ',
    price: 2900,
    duration: 105,
    photo: 'bright-watch',
    featured: true,
  },
  {
    id: 'strength',
    name: 'Укрепление и гель-лак',
    plain: 'Для тонких ногтей, которые слоятся и ломаются. Под цвет кладём плотный слой геля, и ноготь перестаёт гнуться.',
    includes: 'Всё из маникюра с гель-лаком и укрепляющий слой',
    price: 3400,
    duration: 120,
    photo: 'nude-ring',
    featured: true,
  },
  {
    id: 'design',
    name: 'Френч или дизайн',
    plain: 'Белая линия на кончике, рисунок, втирка или стразы. Добавляется к покрытию, цена зависит от количества ногтей.',
    includes: 'Френч на все ногти или рисунок на выбранных',
    price: 500,
    duration: 20,
    photo: 'design-winter',
    featured: true,
    addon: true,
    priceLabel: 'от 150 ₽ за ноготь',
  },
  {
    id: 'pedicure-gel',
    name: 'Педикюр с гель-лаком',
    plain: 'Стопы, пальцы и ногти в порядке, на ногтях цвет, который держится месяц и дольше.',
    includes: 'Обработка стоп и пальцев, покрытие, крем',
    price: 3600,
    duration: 100,
    photo: 'pedi-red',
    featured: true,
  },
  {
    id: 'pedicure',
    name: 'Педикюр без покрытия',
    plain: 'Мягкие пятки и аккуратные ногти без цвета.',
    includes: 'Обработка стоп и пальцев, полировка ногтей, крем',
    price: 2800,
    duration: 75,
    photo: 'pedi-pink',
    featured: false,
  },
  {
    id: 'removal',
    name: 'Снятие покрытия',
    plain: 'Если хотите отдохнуть от цвета. Снимаем аппаратом, без ацетона и без вреда для ногтя.',
    includes: 'Снятие, форма, масло',
    price: 700,
    duration: 30,
    photo: 'nude-fur',
    featured: false,
  },
];

export interface Extra {
  id: string;
  name: string;
  price: string;
  note?: string;
}

/** Surcharges, said up front instead of at the till. */
export const extras: Extra[] = [
  { id: 'foreign', name: 'Снятие покрытия другого салона', price: '+300 ₽', note: 'наше снимаем бесплатно' },
  { id: 'length', name: 'Длина больше 3 мм от края пальца', price: '+300 ₽', note: 'на длинные ногти уходит больше материала' },
  { id: 'nail-art', name: 'Рисунок, наклейка или стразы', price: '+150 ₽', note: 'за один ноготь' },
  { id: 'french', name: 'Френч на все ногти', price: '+500 ₽' },
  { id: 'repair', name: 'Ремонт одного ногтя', price: '200 ₽', note: 'бесплатно в течение 7 дней после нашего покрытия' },
  { id: 'clear', name: 'Прозрачное укрепление без цвета', price: '+500 ₽' },
];

export const serviceById = (id: string): Service | undefined => services.find((s) => s.id === id);

export const rub = (n: number): string => `${n.toLocaleString('ru-RU').replace(/\s/g, ' ')} ₽`;

/** «1 ч 45 мин», «50 мин». */
export function minutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return [h && `${h} ч`, m && `${m} мин`].filter(Boolean).join(' ');
}
