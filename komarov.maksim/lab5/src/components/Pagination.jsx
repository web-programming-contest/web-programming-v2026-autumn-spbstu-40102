import React from 'react';

function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  for (let page = 1; page <= totalPages; page++) {
    if (
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 2
    ) {
      pages.push(page);
    }
  }

  const result = [];

  for (let index = 0; index < pages.length; index++) {
    if (index > 0 && pages[index] - pages[index - 1] > 1) {
      result.push(`dots-${index}`);
    }

    result.push(pages[index]);
  }

  return result;
}

export default function Pagination({currentPage, totalPages, onPageChange}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav
      className="pagination"
      aria-label="Страницы каталога"
      data-testid="pagination"
    >
      <button
        className="pagination-arrow"
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        data-testid="page-previous"
      >
        <span aria-hidden="true">←</span> Назад
      </button>

      <div className="pagination-pages">
        {pages.map((page) =>
          typeof page === 'string' ? (
            <span className="pagination-dots" aria-hidden="true" key={page}>
              …
            </span>
          ) : (
            <button
              key={page}
              className={`pagination-page ${
                page === currentPage ? 'pagination-page-active' : ''
              }`}
              type="button"
              aria-label={`Страница ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              data-testid="page-number"
              data-page={page}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        className="pagination-arrow"
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        data-testid="page-next"
      >
        Вперёд <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
