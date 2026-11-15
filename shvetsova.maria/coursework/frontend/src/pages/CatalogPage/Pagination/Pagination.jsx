import arrowIcon from '@/assets/icons/arrow.svg';
import styles from './Pagination.module.scss';

function getPageItems(current, total) {
  if (total <= 4) {
    return Array.from({length: total}, (_, i) => i + 1);
  }
  if (current <= 3) {
    return [1, 2, 3, '...', total];
  }
  if (current >= total - 2) {
    return [1, '...', total - 2, total - 1, total];
  }
  return [1, '...', current, '...', total];
}

export function Pagination({className, currentPage, totalPages, onChange}) {
  const items = getPageItems(currentPage, totalPages);

  return (
    <nav
      className={`${styles.pagination} ${className}`}
      aria-label="Страницы каталога"
    >
      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowPrev} ${currentPage > 1 ? '' : styles.hidden}`}
        onClick={() => onChange(currentPage - 1)}
        aria-label="Предыдущая страница"
      >
        <img src={arrowIcon} alt="" />
      </button>

      {items.map((item, index) =>
        item === '...' ? (
          <span key={`dots-${index}`} className={styles.dots}>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`${styles.page} ${item === currentPage ? styles.active : ''}`}
            onClick={() => onChange(item)}
            aria-current={item === currentPage ? 'page' : undefined}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        className={`${styles.arrow} ${styles.arrowNext} ${currentPage < totalPages ? '' : styles.hidden}`}
        onClick={() => onChange(currentPage + 1)}
        aria-label="Следующая страница"
      >
        <img src={arrowIcon} alt="" />
      </button>
    </nav>
  );
}
