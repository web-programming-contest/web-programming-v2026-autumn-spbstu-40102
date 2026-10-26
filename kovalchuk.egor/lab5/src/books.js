import masterCover from '../assets/master.svg';
import orwellCover from '../assets/1984.svg';
import princeCover from '../assets/prince.svg';
import crimeCover from '../assets/crime.svg';
import duneCover from '../assets/dune.svg';
import flowersCover from '../assets/flowers.svg';

export const books = [
  {
    id: 'master',
    title: 'Мастер и Маргарита',
    author: 'Михаил Булгаков',
    rating: 4.9,
    price: 790,
    cover: masterCover,
    description:
      'Таинственные гости меняют привычную жизнь Москвы. Роман о любви, свободе и силе творчества.',
  },
  {
    id: '1984',
    title: '1984',
    author: 'Джордж Оруэлл',
    rating: 4.8,
    price: 650,
    cover: orwellCover,
    description:
      'В мире тотального наблюдения человек пытается сохранить право на собственные мысли и чувства.',
  },
  {
    id: 'prince',
    title: 'Маленький принц',
    author: 'Антуан де Сент-Экзюпери',
    rating: 4.9,
    price: 540,
    cover: princeCover,
    description:
      'Путешествие по далёким планетам становится разговором о дружбе, заботе и том, что придаёт жизни смысл.',
  },
  {
    id: 'crime',
    title: 'Преступление и наказание',
    author: 'Фёдор Достоевский',
    rating: 4.7,
    price: 720,
    cover: crimeCover,
    description:
      'Петербургский студент проверяет опасную идею и сталкивается с её последствиями для себя и окружающих.',
  },
  {
    id: 'dune',
    title: 'Дюна',
    author: 'Фрэнк Герберт',
    rating: 4.8,
    price: 990,
    cover: duneCover,
    description:
      'Пустынная планета становится центром борьбы за власть. История о выборе, природе и цене предвидения.',
  },
  {
    id: 'flowers',
    title: 'Цветы для Элджернона',
    author: 'Дэниел Киз',
    rating: 4.9,
    price: 680,
    cover: flowersCover,
    description:
      'Научный эксперимент меняет способности Чарли. Вместе с ним читатель заново открывает мир и человеческие отношения.',
  },
];
