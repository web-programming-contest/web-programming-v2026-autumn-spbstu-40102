import {formatPrice} from './BookCard.jsx';

export function Favorites({books, onRemove}) {
  return (
    <section
      className="favorites-section"
      id="favorites"
      aria-labelledby="favorites-heading"
    >
      <div className="section-heading">
        <div>
          <p className="eyebrow">Твоя подборка</p>
          <h2 id="favorites-heading">Избранное</h2>
        </div>
        <p className="section-note">Сохрани то, что хочется прочитать</p>
      </div>
      <ul className="favorites-list" data-testid="favorites-list">
        {books.length === 0 ? (
          <li className="empty-state">
            <p>Здесь начнётся твоя книжная полка</p>
            <span>
              Нажми «Добавить в избранное» у понравившейся книги в каталоге.
            </span>
          </li>
        ) : (
          books.map((book) => (
            <li
              className="favorite-item"
              data-testid="favorite-item"
              key={book.id}
            >
              <img
                src={book.cover}
                alt={`Обложка книги «${book.title}»`}
                width="54"
                height="77"
              />
              <div className="favorite-details">
                <h3>{book.title}</h3>
                <p>{book.author}</p>
                <span>{formatPrice(book.price)}</span>
              </div>
              <button
                className="remove-button"
                data-testid="favorite-remove"
                type="button"
                aria-label={`Удалить из избранного: ${book.title}`}
                onClick={() => onRemove(book)}
              >
                Удалить
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
