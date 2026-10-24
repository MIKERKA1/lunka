// «Не знаю, что выбрать»: two questions, one recommendation. Pure, so it is covered by tests/unit/helper.test.ts.
import { serviceById, type Service, type ServiceId } from './services.ts';

export type Goal = 'clean' | 'color' | 'art' | 'feet';
export type Nails = 'healthy' | 'weak' | 'covered';
export type FeetColor = 'color' | 'none';

export interface Question<T extends string> {
  id: string;
  title: string;
  options: { value: T; label: string; hint: string }[];
}

export const goalQuestion: Question<Goal> = {
  id: 'goal',
  title: 'Чего хочется?',
  options: [
    { value: 'clean', label: 'Просто ухоженные руки', hint: 'без цвета, аккуратно' },
    { value: 'color', label: 'Цвет, который держится', hint: 'однотонно, на 2–3 недели' },
    { value: 'art', label: 'Френч или рисунок', hint: 'чтобы было что показать' },
    { value: 'feet', label: 'Педикюр', hint: 'стопы и ногти на ногах' },
  ],
};

export const nailsQuestion: Question<Nails> = {
  id: 'nails',
  title: 'Какие ногти сейчас?',
  options: [
    { value: 'healthy', label: 'Свои, крепкие', hint: 'не ломаются и не слоятся' },
    { value: 'weak', label: 'Тонкие, ломаются', hint: 'гнутся, слоятся на кончиках' },
    { value: 'covered', label: 'Под покрытием другого салона', hint: 'гель-лак, который надо снять' },
  ],
};

export const feetQuestion: Question<FeetColor> = {
  id: 'feet',
  title: 'Покрытие на ногтях нужно?',
  options: [
    { value: 'color', label: 'Да, с цветом', hint: 'держится месяц и дольше' },
    { value: 'none', label: 'Нет, без цвета', hint: 'только уход' },
  ],
};

export type AddonId = 'clear' | 'design' | 'foreign';

export interface Addon {
  id: AddonId;
  label: string;
  price: number;
}

export interface Recommendation {
  service: Service;
  addons: Addon[];
  total: number;
  duration: number;
  why: string;
}

const pick = (id: ServiceId): Service => {
  const s = serviceById(id);
  if (!s) throw new Error(`Unknown service ${id}`);
  return s;
};

/** Returns null until every question the answers lead to is answered. */
export function recommend(goal: Goal | null, nails: Nails | null, feet: FeetColor | null): Recommendation | null {
  if (!goal) return null;

  if (goal === 'feet') {
    if (!feet) return null;
    const service = pick(feet === 'color' ? 'pedicure-gel' : 'pedicure');
    const why = feet === 'color' ? 'На ногах гель-лак носится дольше, чем на руках: обычно месяц и больше.' : 'Уход без цвета: стопы, пальцы, форма и полировка ногтей.';
    return { service, addons: [], total: service.price, duration: service.duration, why };
  }

  if (!nails) return null;
  const weak = nails === 'weak';
  const service = pick(goal === 'clean' ? 'manicure' : weak ? 'strength' : 'gel');
  const addons: Addon[] = [];
  let extraTime = 0;

  if (goal === 'clean' && weak) addons.push({ id: 'clear', label: 'Прозрачное укрепление', price: 500 });
  if (goal === 'art') {
    addons.push({ id: 'design', label: 'Френч или рисунок, ориентир', price: 500 });
    extraTime += 20;
  }
  if (nails === 'covered') {
    addons.push({ id: 'foreign', label: 'Снятие покрытия другого салона', price: 300 });
    extraTime += 15;
  }

  const why =
    goal === 'clean'
      ? weak
        ? 'Без цвета, но с тонким прозрачным слоем: ногти перестанут слоиться, пока отрастают.'
        : 'Форма, кутикула и полировка. Руки выглядят ухоженно, а ногти отдыхают от покрытия.'
      : weak
        ? 'Тонким ногтям нужен плотный слой геля под цветом, иначе покрытие треснет вместе с ногтем.'
        : goal === 'art'
          ? 'Сначала ровное покрытие, потом рисунок. Сложность и цену дизайна мастер назовёт до начала работы.'
          : 'Ровный цвет на две-три недели. Оттенок выберете из палитры на месте.';

  return {
    service,
    addons,
    total: service.price + addons.reduce((sum, a) => sum + a.price, 0),
    duration: service.duration + extraTime,
    why,
  };
}
