import React, {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import './styles.css';

const books = [
  {
    id: 1,
    title: 'Мастер и Маргарита',
    description: 'Роман о московской жизни, любви и выборе.',
    price: 690,
    rating: 4.5,
    ratingCount: 4,
  },
  {
    id: 2,
    title: 'Дюна',
    description: 'Научно-фантастический роман о планете Арракис.',
    price: 840,
    rating: 4.6,
    ratingCount: 5,
  },
  {
    id: 3,
    title: 'Цветы для Элджернона',
    description: 'История о человеке и цене знаний.',
    price: 590,
    rating: 4.25,
    ratingCount: 4,
  },
];

function Rating({rating, ratingCount = 1, starsCount = 5}) {
  const [ratingData, setRatingData] = useState({
    sum: rating * ratingCount,
    count: ratingCount,
  });
  const [selectedRating, setSelectedRating] = useState(null);
  const averageRating = ratingData.sum / ratingData.count;
  const displayedRating = selectedRating ?? averageRating;

  function setRating(newRating) {
    setRatingData((currentData) => ({
      sum: currentData.sum + newRating,
      count: currentData.count + 1,
    }));
    setSelectedRating(newRating);
    setTimeout(() => setSelectedRating(null), 3500);
  }

  return (
    <div className="rating">
      <div className="stars" aria-label="Оценка книги">
        {Array.from({length: starsCount}, (_, index) => index + 1).map(
          (starValue) => (
            <button
              key={starValue}
              type="button"
              data-testid="rating-star"
              aria-label={`Оценить на ${starValue}`}
              className={
                starValue <= displayedRating ? 'star selected-star' : 'star'
              }
              onClick={() => setRating(starValue)}
            >
              ★
            </button>
          ),
        )}
      </div>
      <p data-testid="rating-value">Рейтинг: {displayedRating.toFixed(1)}</p>
    </div>
  );
}

function BookCard({book}) {
  return (
    <article className="book-card" data-testid="book-card">
      <div
        className={`book-cover cover-${book.id}`}
        role="img"
        aria-label={`Обложка книги «${book.title}»`}
      >
        <span>{book.title}</span>
      </div>
      <div className="book-info">
        <h2>{book.title}</h2>
        <p>{book.description}</p>
        <p className="price">{book.price} ₽</p>
        <Rating rating={book.rating} ratingCount={book.ratingCount} />
      </div>
    </article>
  );
}

function App() {
  return (
    <>
      <h1>Книги</h1>
      <section className="book-list" aria-label="Список книг">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </section>
    </>
  );
}

const rootElement = document.querySelector('[data-testid="app"]');

if (!rootElement) {
  throw new Error('Корневой элемент приложения не найден.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
