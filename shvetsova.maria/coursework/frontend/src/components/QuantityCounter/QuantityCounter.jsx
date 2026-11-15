import styles from './QuantityCounter.module.scss';

export function QuantityCounter({
  value,
  onDecrement,
  onIncrement,
  className = '',
}) {
  return (
    <div className={`${styles.counter} ${className}`}>
      <button
        type="button"
        className={styles.button}
        onClick={onDecrement}
        aria-label="Уменьшить количество"
      >
        -
      </button>
      <span className={styles.value}>{value}</span>
      <button
        type="button"
        className={styles.button}
        onClick={onIncrement}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  );
}
