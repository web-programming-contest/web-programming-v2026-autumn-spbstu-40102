import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import BookCard from './components/BookCard.jsx';
import Pagination from './components/Pagination.jsx';
import {
  books,
  BOOKS_PER_PAGE,
  getBooksForPage,
  getTotalPages,
} from './data/books.js';
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = getTotalPages(books);
  const visibleBooks = getBooksForPage(books, currentPage);
  const firstBook = (currentPage - 1) * BOOKS_PER_PAGE + 1;
  const lastBook = Math.min(currentPage * BOOKS_PER_PAGE, books.length);

  function changePage(page) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  return (
    <div className="store">
      <header className="site-header">
        <div className="site-header-inner">
          <span className="site-logo">
            <span className="site-logo-icon" aria-hidden="true">
              ✳
            </span>{' '}
            листва<span className="site-logo-dot">.</span>
          </span>
          <span className="site-header-tagline">
            Небольшой магазин больших историй
          </span>
        </div>
      </header>

      <div className="page-container">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <span className="eyebrow">КНИЖНАЯ ПОЛКА / КАТАЛОГ</span>
            <h1 id="hero-title">
              Книги, в которые <em>хочется</em> вернуться
            </h1>
            <p>
              Истории для тихих вечеров, смелых планов и новых открытий. Найдите
              следующую книгу для себя.
            </p>
          </div>
          <div className="hero-decoration" aria-hidden="true">
            <span>ЧИТАТЬ</span>
            <span>ЗНАЧИТ</span>
            <span>ОТКРЫВАТЬ</span>
          </div>
        </section>

        <section className="catalog" aria-labelledby="catalog-title">
          <div className="catalog-heading">
            <div>
              <span className="eyebrow">КОЛЛЕКЦИЯ</span>
              <h2 id="catalog-title">Каталог книг</h2>
            </div>
            <div className="catalog-count">{books.length} книг в каталоге</div>
          </div>

          <div className="catalog-summary">
            <span data-testid="page-indicator">
              Страница {currentPage} из {totalPages}
            </span>
            <span>
              Показаны {firstBook}–{lastBook} из {books.length}
            </span>
          </div>

          <div className="books-grid" data-testid="book-list">
            {visibleBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <div className="catalog-pagination-block">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={changePage}
            />
            <p className="pagination-caption">
              Выберите страницу, чтобы посмотреть другие книги
            </p>
          </div>
        </section>
      </div>

      <footer className="site-footer">
        <span>✳ листва.</span>
        <span>Учебный книжный каталог · 2026</span>
      </footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
