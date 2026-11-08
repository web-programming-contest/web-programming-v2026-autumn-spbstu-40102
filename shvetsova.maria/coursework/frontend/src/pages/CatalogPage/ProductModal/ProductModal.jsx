import {Modal} from '@/components/Modal/Modal';
import {CartControl} from '@/components/CartControl/CartControl';
import starIcon from '@/assets/icons/star.svg';
import {formatPrice, formatRating} from '@/utils/format';
import styles from './ProductModal.module.scss';

export function ProductModal({product, onClose}) {
  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} size="l">
      {product && (
        <div className={styles.content}>
          <div className={styles.imageBox}>
            <img
              className={styles.image}
              src={product.image}
              alt={product.name}
            />

            {(product.isNew || product.isHit) && (
              <div className={styles.labels}>
                {product.isNew && (
                  <span className={`${styles.label} ${styles.labelNew}`}>
                    Новинка
                  </span>
                )}
                {product.isHit && (
                  <span className={`${styles.label} ${styles.labelHit}`}>
                    Хит
                  </span>
                )}
              </div>
            )}
          </div>

          <div className={styles.info}>
            <h2 className={styles.title}>{product.name}</h2>

            {product.rating !== null && (
              <p className={styles.rating}>
                <img className={styles.star} src={starIcon} alt="" />
                {formatRating(product.rating)}
              </p>
            )}

            <p className={styles.description}>{product.description}</p>

            <h3 className={styles.specsTitle}>Характеристики</h3>
            <dl className={styles.specs}>
              {product.specs.map((spec) => (
                <div key={spec.name} className={styles.spec}>
                  <dt className={styles.specName}>{spec.name}</dt>
                  <dd className={styles.specValue}>{spec.value}</dd>
                </div>
              ))}
            </dl>

            <p className={styles.price}>{formatPrice(product.price)}</p>

            <div className={styles.actions}>
              <CartControl product={product} layout="modal" onAdded={onClose} />
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
