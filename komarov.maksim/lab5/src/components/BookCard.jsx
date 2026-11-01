import React from 'react';
export default function BookCard({book}) {
  return (
    <article className="book-card" data-testid="book-card">
      <div className="book-card-cover">
        <img
          src={book.cover}
          alt={`Обложка книги «${book.title}»`}
          loading="lazy"
        />
        <span className="book-card-genre">{book.genre}</span>
      </div>
      <div className="book-card-body">
        <p className="book-card-author">{book.author}</p>
        <h2 className="book-card-title">{book.title}</h2>
        <div
          className="book-card-rating"
          aria-label={`Рейтинг: ${book.rating} из 5`}
        >
          <span aria-hidden="true">★</span>
          <strong>{book.rating}</strong>
          <span className="book-card-rating-note">/ 5</span>
        </div>
        <p className="book-card-description">{book.description}</p>
        <div className="book-card-footer">
          <span className="book-card-price">
            {book.price.toLocaleString('ru-RU')} ₽
          </span>
          <span className="book-card-availability">В наличии</span>
        </div>
      </div>
    </article>
  );
}
