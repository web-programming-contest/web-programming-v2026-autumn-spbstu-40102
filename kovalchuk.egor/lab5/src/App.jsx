import {useState} from 'react';
import {books} from './books.js';
import {BookCard} from './components/BookCard.jsx';
import {Favorites} from './components/Favorites.jsx';
import {HeartIcon} from './components/HeartIcon.jsx';

const storageKey = 'kovalchuk.egor.lab5.favorites';

function loadFavorites() {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === null) {
      return {ids: [], message: ''};
    }
    const ids = JSON.parse(saved);
    if (!Array.isArray(ids)) {
      throw new Error('Ожидался массив ID.');
    }
    return {
      ids: [
        ...new Set(ids.filter((id) => books.some((book) => book.id === id))),
      ],
      message: '',
    };
  } catch {
    return {
      ids: [],
      message: 'Не удалось прочитать избранное. Подборка открыта пустой.',
    };
  }
}

export function App() {
  const [initial] = useState(loadFavorites);
  const [favoriteIds, setFavoriteIds] = useState(initial.ids);
  const [message, setMessage] = useState(initial.message);
  const [hasError, setHasError] = useState(Boolean(initial.message));
  const favoriteBooks = favoriteIds.map((id) =>
    books.find((book) => book.id === id),
  );

  function updateFavorites(ids, successMessage) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(ids));
      setFavoriteIds(ids);
      setMessage(successMessage);
      setHasError(false);
    } catch {
      setMessage(
        'Не удалось сохранить избранное. Проверь доступ браузера к хранилищу и повтори попытку.',
      );
      setHasError(true);
    }
  }

  function removeFavorite(book) {
    updateFavorites(
      favoriteIds.filter((id) => id !== book.id),
      `«${book.title}» удалена из избранного.`,
    );
  }

  function toggleFavorite(book) {
    if (favoriteIds.includes(book.id)) {
      removeFavorite(book);
    } else {
      updateFavorites(
        [...favoriteIds, book.id],
        `«${book.title}» добавлена в избранное.`,
      );
    }
  }

  return (
    <main className="app" data-testid="app">
      <header className="site-header">
        <a
          className="brand"
          href="#catalog"
          aria-label="Между строк — к каталогу"
        >
          Между строк<span>Книжный магазин</span>
        </a>
        <a className="favorites-link" href="#favorites">
          <HeartIcon />
          <span>Избранное</span>
          <span
            className="favorites-count"
            data-testid="favorites-count"
            aria-live="polite"
            aria-label={`Книг в избранном: ${favoriteBooks.length}`}
          >
            {favoriteBooks.length}
          </span>
        </a>
      </header>
      <section className="intro" aria-labelledby="page-heading">
        <p className="eyebrow">Хорошая история всегда рядом</p>
        <h1 id="page-heading">
          Найди свою
          <br />
          следующую книгу.
        </h1>
        <p className="intro-description">
          Шесть историй, в которые хочется погрузиться.
          <br className="desktop-break" /> Выбирай, сохраняй и возвращайся к
          любимым.
        </p>
        <a className="catalog-link" href="#catalog">
          Посмотреть каталог <span aria-hidden="true">↘</span>
        </a>
      </section>

      <Favorites books={favoriteBooks} onRemove={removeFavorite} />
      <p
        className={`status${hasError ? ' status-error' : ''}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>

      <section id="catalog" aria-labelledby="catalog-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Истории на любой вечер</p>
            <h2 id="catalog-heading">Каталог книг</h2>
          </div>
          <p className="section-note">Книг в коллекции: {books.length}</p>
        </div>
        <div className="book-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={favoriteIds.includes(book.id)}
              onToggle={toggleFavorite}
            />
          ))}
        </div>
      </section>
      <footer className="site-footer">
        <span>Между строк · Учебный книжный каталог</span>
        <span>Ковальчук Егор · Лабораторная 5 · Вариант 40</span>
      </footer>
    </main>
  );
}
