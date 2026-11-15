import starIcon from '@/assets/icons/star.svg';
import {formatPrice, formatRating} from '@/utils/format';
import styles from './ProductCard.module.scss';

export function ProductCard({product, onClick, children}) {
  const {name, price, image, rating, isNew, isHit} = product;

  return (
    <article
      className={`${styles.card} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.imageBox}>
        <img className={styles.image} src={image} alt={name} />

        {(isNew || isHit) && (
          <div className={styles.labels}>
            {isNew && (
              <span className={`${styles.label} ${styles.labelNew}`}>
                Новинка
              </span>
            )}
            {isHit && (
              <span className={`${styles.label} ${styles.labelHit}`}>Хит</span>
            )}
          </div>
        )}
      </div>

      <h3 className={`h2 ${styles.price}`}>{formatPrice(price)}</h3>
      <p
        className={`${styles.name} ${rating === null ? 'mb-8' : ''}`}
        title={name}
      >
        {name}
      </p>

      {rating !== null && (
        <p className={styles.rating}>
          <img className={styles.star} src={starIcon} alt="star-icon" />
          {formatRating(rating)}
        </p>
      )}

      {children && (
        <div
          className={styles.actions}
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      )}
    </article>
  );
}
