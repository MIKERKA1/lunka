// Photos: Unsplash, Unsplash License (free use, attribution appreciated). They show real manicures by other
// people and studios; on this demo site they illustrate the kind of work the fictional salon does.
// Files are prepared by scripts/photos.py.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.jpg', { eager: true });

export const photo = (name: string): ImageMetadata => {
  const file = files[`../assets/photos/${name}.jpg`];
  if (!file) throw new Error(`No photo «${name}» in src/assets/photos`);
  return file.default;
};

export type Category = 'nude' | 'french' | 'bright' | 'design' | 'pedicure';

export const categories: { id: Category; label: string }[] = [
  { id: 'nude', label: 'Нюд' },
  { id: 'french', label: 'Френч' },
  { id: 'bright', label: 'Яркие' },
  { id: 'design', label: 'Дизайн' },
  { id: 'pedicure', label: 'Педикюр' },
];

export interface Work {
  name: string;
  category: Category;
  title: string;
  alt: string;
  service: string;
  author: string;
}

export const works: Work[] = [
  { name: 'bright-red', category: 'bright', title: 'Красный на коротких', alt: 'Две руки с короткими ногтями, покрытыми ярко-красным гель-лаком', service: 'Маникюр с гель-лаком', author: 'koalaaaah' },
  { name: 'nude-pastel', category: 'nude', title: 'Пять пастельных оттенков', alt: 'Ногти овальной формы, каждый своего пастельного цвета: молочный, бежевый, оливковый, сиреневый', service: 'Маникюр с гель-лаком', author: 'jung07011' },
  { name: 'design-winter', category: 'design', title: 'Зимнее дерево', alt: 'Ногти с рисунком: белое дерево на голубом и тёмно-синее на белом', service: 'Гель-лак и рисунок', author: 'fullpower302' },
  { name: 'french-blue', category: 'french', title: 'Синий френч с омбре', alt: 'Квадратные ногти с плавным переходом от молочного к синему на кончике', service: 'Гель-лак и френч', author: 'marsnails' },
  { name: 'nude-fur', category: 'nude', title: 'Розовый нюд', alt: 'Рука с короткими светло-розовыми ногтями на белом меху', service: 'Маникюр с гель-лаком', author: 'jd_chon' },
  { name: 'pedi-red', category: 'pedicure', title: 'Красный педикюр', alt: 'Стопы с ногтями, покрытыми красным гель-лаком', service: 'Педикюр с гель-лаком', author: 'shmatov' },
  { name: 'design-tortoise', category: 'design', title: 'Черепаховый и чёрный', alt: 'Ногти с черепаховым узором и чёрным глянцем, рука в сером свитере', service: 'Гель-лак и рисунок', author: 'b_elena' },
  { name: 'bright-cobalt', category: 'bright', title: 'Кобальтовый миндаль', alt: 'Длинные ногти формы миндаль ярко-синего цвета с серебряными кончиками', service: 'Укрепление и гель-лак', author: 'marsnails' },
  { name: 'french-mug', category: 'french', title: 'Классический френч', alt: 'Руки с белым френчем держат белую кружку', service: 'Гель-лак и френч', author: 'yosuke_ota' },
  { name: 'nude-ombre', category: 'nude', title: 'Молочное омбре', alt: 'Руки с длинными ногтями: розовый у основания переходит в белый на кончике, рядом орхидеи', service: 'Укрепление и гель-лак', author: 'gabriellenca' },
  { name: 'design-abstract', category: 'design', title: 'Цветная абстракция', alt: 'Ногти с рисунком из ярких пятен: жёлтый, оранжевый, синий, белый', service: 'Гель-лак и рисунок', author: 'buudkaanaa' },
  { name: 'pedi-pink', category: 'pedicure', title: 'Малиновый педикюр', alt: 'Стопа с малиновым покрытием на ногтях', service: 'Педикюр с гель-лаком', author: 'shmatov' },
  { name: 'bright-flower', category: 'bright', title: 'Красный и хризантема', alt: 'Рука с длинными красными ногтями на розовой хризантеме', service: 'Укрепление и гель-лак', author: 'malvestida' },
  { name: 'nude-accent', category: 'nude', title: 'Нюд с блёстками', alt: 'Бежевые ногти, на одном пальце серебристые блёстки', service: 'Гель-лак и дизайн', author: 'ydlh' },
  { name: 'design-navy', category: 'design', title: 'Синий с золотом', alt: 'Ногти с тёмно-синим, белым и золотым узором', service: 'Гель-лак и рисунок', author: 'arikurniawan' },
  { name: 'french-lace', category: 'french', title: 'Тонкий френч', alt: 'Руки с тонкой белой линией на кончиках ногтей на кружевной ткани', service: 'Гель-лак и френч', author: 'jonathanborba' },
  { name: 'bright-green', category: 'bright', title: 'Изумрудный', alt: 'Рука с тёмно-зелёными ногтями на красном платье', service: 'Маникюр с гель-лаком', author: 'sharonmccutcheon' },
  { name: 'pedi-blue', category: 'pedicure', title: 'Синий педикюр', alt: 'Стопы с ярко-синим покрытием на ногтях', service: 'Педикюр с гель-лаком', author: 'shmatov' },
  { name: 'nude-ring', category: 'nude', title: 'Прозрачный нюд', alt: 'Рука с полупрозрачным бежевым покрытием и серебряным кольцом', service: 'Укрепление и гель-лак', author: 'happpyal' },
  { name: 'design-pearl', category: 'design', title: 'Жемчужный с камнями', alt: 'Ногти с перламутровым покрытием и мелкими камнями, в руке веточка эвкалипта', service: 'Гель-лак и дизайн', author: 'julia_2501' },
  { name: 'bright-watch', category: 'bright', title: 'Вишнёвый', alt: 'Рука с часами и вишнёвыми ногтями на голубом фоне', service: 'Маникюр с гель-лаком', author: 'shmatov' },
  { name: 'french-classic', category: 'french', title: 'Френч к свадьбе', alt: 'Сложенные руки с аккуратным белым френчем на белой ткани', service: 'Гель-лак и френч', author: 'lenatrn' },
  { name: 'pedi-navy', category: 'pedicure', title: 'Тёмно-синий педикюр', alt: 'Стопы с тёмно-синим покрытием на ногтях', service: 'Педикюр с гель-лаком', author: 'shmatov' },
  { name: 'design-glitter', category: 'design', title: 'Лиловый и блёстки', alt: 'Ногти в лиловом, белом и серебристом с блёстками', service: 'Гель-лак и дизайн', author: 'newleonin' },
];

/** The five «nails» of the hero, left to right: little finger to thumb. */
export const tips = [
  { name: 'tip-square', shape: 'Квадрат', alt: 'Короткие розовые ногти квадратной формы' },
  { name: 'tip-oval', shape: 'Овал', alt: 'Розовые ногти овальной формы с глянцем' },
  { name: 'tip-almond', shape: 'Миндаль', alt: 'Длинные ногти формы миндаль с перламутровым покрытием' },
  { name: 'tip-french', shape: 'Френч', alt: 'Ногти с классическим белым френчем, в руке маленький цветок' },
  { name: 'tip-red', shape: 'Красный', alt: 'Короткие ногти ярко-красного цвета' },
] as const;

export const tipAuthors = ['ddarinaaa', 'jojobean24', '___atmos', 'anna_meshkov', 'shmatov'];

/** Photos outside the gallery, with their authors, for the credits list. */
export const otherPhotos = [
  { name: 'work-tools', author: 'pixelesse' },
  { name: 'work-salon', author: 'giorgiotrovato' },
  { name: 'work-polish', author: 'hngstrm' },
  { name: 'work-marble', author: 'sweetspotphoto' },
  { name: 'work-pedicure', author: 'runejohs' },
  { name: 'master-anya', author: 'ydlh' },
  { name: 'nude-white', author: 'eliiesh' },
];

export const allAuthors = [...new Set([...works.map((w) => w.author), ...tipAuthors, ...otherPhotos.map((p) => p.author)])].sort();
