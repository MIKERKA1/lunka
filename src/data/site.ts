// Everything about the (fictional) business in one place. Replace these values to reuse the site.
export const site = {
  name: 'Лунка',
  title: 'Лунка: маникюр и педикюр в Москве, цены и онлайн-запись',
  description:
    'Маникюрная студия «Лунка»: маникюр с гель-лаком, френч, дизайн, укрепление и педикюр. Цены и время процедур на сайте, запись за минуту.',
  city: 'Москва',
  address: 'Лунный переулок, 4, второй этаж',
  addressNote: 'Вход со двора, дверь с белой вывеской. Демо-адрес: такого переулка нет.',
  hours: 'Пн–Пт 10:00–21:00, Сб–Вс 10:00–20:00',
  hoursShort: [
    { days: 'Пн–Пт', time: '10:00–21:00' },
    { days: 'Сб–Вс', time: '10:00–20:00' },
  ],
  // The +7 (000) code is not assigned to any operator, so the demo number cannot reach a real person.
  phone: { display: '+7 (000) 123-45-67', href: 'tel:+70001234567' },
  email: 'hello@lunka.example',
} as const;

export const nav = [
  { label: 'Услуги', href: '/#uslugi' },
  { label: 'Работы', href: '/#raboty' },
  { label: 'Цены', href: '/#ceny' },
  { label: 'Мастера', href: '/#mastera' },
  { label: 'Контакты', href: '/#kontakty' },
] as const;
