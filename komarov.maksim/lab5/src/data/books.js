import cover1 from '../../assets/cover-1.svg';
import cover2 from '../../assets/cover-2.svg';
import cover3 from '../../assets/cover-3.svg';
import cover4 from '../../assets/cover-4.svg';
import cover5 from '../../assets/cover-5.svg';
import cover6 from '../../assets/cover-6.svg';
import cover7 from '../../assets/cover-7.svg';
import cover8 from '../../assets/cover-8.svg';
import cover9 from '../../assets/cover-9.svg';
import cover10 from '../../assets/cover-10.svg';
import cover11 from '../../assets/cover-11.svg';
import cover12 from '../../assets/cover-12.svg';

export const BOOKS_PER_PAGE = 9;

const covers = [
  cover1,
  cover2,
  cover3,
  cover4,
  cover5,
  cover6,
  cover7,
  cover8,
  cover9,
  cover10,
  cover11,
  cover12,
];

const collections = [
  {
    name: 'Тихий атлас',
    author: 'Анна Миронова',
    genre: 'Проза',
    description: 'Истории о местах, к которым хочется возвращаться.',
  },
  {
    name: 'Северный ветер',
    author: 'Илья Ветров',
    genre: 'Приключения',
    description: 'Неожиданный маршрут и открытия за горизонтом.',
  },
  {
    name: 'Шёпот города',
    author: 'Мария Соколова',
    genre: 'Детектив',
    description: 'Загадки, скрытые на знакомых улицах.',
  },
  {
    name: 'Звёздный порог',
    author: 'Роман Белый',
    genre: 'Фантастика',
    description: 'Далёкие миры и непростые решения.',
  },
  {
    name: 'Сад историй',
    author: 'Елена Лескова',
    genre: 'Роман',
    description: 'Тёплая история о встречах и переменах.',
  },
  {
    name: 'Малые открытия',
    author: 'Павел Ларин',
    genre: 'Научпоп',
    description: 'Простые объяснения удивительных явлений.',
  },
  {
    name: 'Карта туманов',
    author: 'Даниил Морозов',
    genre: 'Фэнтези',
    description: 'Путешествие в мир легенд и древних карт.',
  },
  {
    name: 'Дело на пристани',
    author: 'Ольга Денисова',
    genre: 'Детектив',
    description: 'Улики, тайны и один неожиданный свидетель.',
  },
  {
    name: 'Свет за окном',
    author: 'Никита Орлов',
    genre: 'Проза',
    description: 'Неспешные рассказы о повседневной жизни.',
  },
  {
    name: 'Письма с острова',
    author: 'Алиса Сергеева',
    genre: 'Роман',
    description: 'Расстояния, воспоминания и настоящая дружба.',
  },
  {
    name: 'Час механизмов',
    author: 'Виктор Савин',
    genre: 'Фантастика',
    description: 'История города, где время имеет цену.',
  },
  {
    name: 'За поворотом',
    author: 'София Невская',
    genre: 'Приключения',
    description: 'Дороги, выбор и люди на пути.',
  },
  {
    name: 'Море страниц',
    author: 'Егор Котов',
    genre: 'Проза',
    description: 'Книга о случайностях, меняющих судьбы.',
  },
  {
    name: 'Тайна архивов',
    author: 'Вера Полякова',
    genre: 'Детектив',
    description: 'Найденные записи ведут к забытым событиям.',
  },
  {
    name: 'Планета рядом',
    author: 'Артём Новиков',
    genre: 'Научпоп',
    description: 'Знакомый мир с неожиданной стороны.',
  },
  {
    name: 'Белая комета',
    author: 'Лидия Крылова',
    genre: 'Фантастика',
    description: 'Космическая история о втором шансе.',
  },
  {
    name: 'Дом у леса',
    author: 'Дарья Нестерова',
    genre: 'Роман',
    description: 'Семейные секреты и поиск собственного дома.',
  },
  {
    name: 'Город семи башен',
    author: 'Михаил Рудин',
    genre: 'Фэнтези',
    description: 'Магия и легенды старого королевства.',
  },
  {
    name: 'Открытый вопрос',
    author: 'Кирилл Данилов',
    genre: 'Научпоп',
    description: 'Любопытные вопросы и доступные ответы.',
  },
  {
    name: 'Там, где реки',
    author: 'Полина Заречная',
    genre: 'Приключения',
    description: 'Путь к истокам давно потерянной истории.',
  },
];

const subtitles = [
  'Начало пути',
  'Новые горизонты',
  'Забытые строки',
  'Следы прошлого',
  'Встречный свет',
  'Неизвестные маршруты',
  'Точка возврата',
  'Тайная сторона',
  'Последняя глава',
];

export const books = Array.from({length: 180}, (_, index) => {
  const collection = collections[index % collections.length];
  const volume = Math.floor(index / collections.length);

  return {
    id: index + 1,
    title: `${collection.name}. ${subtitles[volume]}`,
    author: collection.author,
    genre: collection.genre,
    description: collection.description,
    rating: (3.9 + ((index * 7) % 11) / 10).toFixed(1),
    price: 390 + ((index * 47) % 15) * 40,
    cover: covers[index % covers.length],
  };
});

export function getTotalPages(items, pageSize = BOOKS_PER_PAGE) {
  return Math.ceil(items.length / pageSize);
}

export function getBooksForPage(items, page, pageSize = BOOKS_PER_PAGE) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
