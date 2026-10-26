import {HeartIcon} from './HeartIcon.jsx';

export function formatPrice(price) {
  return `${price.toLocaleString('ru-RU')} ₽`;
}

export function BookCard({book, isFavorite, onToggle}) {
  return (
    <article className="book-card" data-testid="book-card">
      <div className="cover-stage">
        <img
          className="book-cover"
          src={book.cover}
          alt={`Обложка книги «${book.title}»`}
          width="240"
          height="340"
        />
      </div>
      <div className="book-info">
        <p className="book-author">{book.author}</p>
        <h3>{book.title}</h3>
        <p
          className="rating"
          aria-label={`Рейтинг ${book.rating.toLocaleString('ru-RU')} из 5`}
        >
          <span aria-hidden="true">★</span>{' '}
          {book.rating.toLocaleString('ru-RU')}{' '}
          <span className="rating-scale">/ 5</span>
        </p>
        <p className="book-description">{book.description}</p>
        <p className="book-price">{formatPrice(book.price)}</p>
        <button
          className={`favorite-button${isFavorite ? ' is-favorite' : ''}`}
          type="button"
          data-testid="favorite-add"
          aria-pressed={isFavorite}
          onClick={() => onToggle(book)}
        >
          <HeartIcon />
          {isFavorite ? 'В избранном' : 'Добавить в избранное'}
        </button>
      </div>
    </article>
  );
}
