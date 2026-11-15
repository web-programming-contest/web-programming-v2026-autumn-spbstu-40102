import {useState} from 'react';
import {ProductCard} from '@/components/ProductCard/ProductCard';
import arrowIcon from '@/assets/icons/arrow.svg';
import styles from './ProductCarousel.module.scss';

const VISIBLE_COUNT = 3;

export function ProductCarousel({icon, title, description, products}) {
  const [start, setStart] = useState(0);

  const count = products.length;
  const hasArrows = count > VISIBLE_COUNT;

  const visible = Array.from(
    {length: Math.min(VISIBLE_COUNT, count)},
    (_, i) => products[(start + i) % count],
  );

  const showPrev = () => setStart((current) => (current - 1 + count) % count);
  const showNext = () => setStart((current) => (current + 1) % count);

  return (
    <section className={styles.section}>
      <div className={styles.info}>
        <img className={styles.icon} src={icon} alt="" />
        <h2 className={`h1 ${styles.title}`}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>

      <div className={styles.slider}>
        {hasArrows && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowPrev}`}
            onClick={showPrev}
            aria-label="Предыдущий товар"
          >
            <img src={arrowIcon} alt="" />
          </button>
        )}

        <ul className={styles.list}>
          {visible.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>

        {hasArrows && (
          <button
            type="button"
            className={`${styles.arrow} ${styles.arrowNext}`}
            onClick={showNext}
            aria-label="Следующий  товар"
          >
            <img src={arrowIcon} alt="" />
          </button>
        )}
      </div>
    </section>
  );
}
