import {useId} from 'react';
import styles from './TextField.module.scss';

export function TextField({
  label,
  required = false,
  error,
  className = '',
  ...InputProps
}) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={`${styles.field} ${className}`}>
      <label className={`body-s ${styles.label}`} htmlFor={id}>
        {label}
      </label>

      <div className={styles.control}>
        <input id={id} className={styles.input} {...InputProps} />
        {required && <span className={styles.required}>*</span>}
      </div>

      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
