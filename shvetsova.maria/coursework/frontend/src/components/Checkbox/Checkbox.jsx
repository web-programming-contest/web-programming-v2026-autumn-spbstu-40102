import styles from './Checkbox.module.scss';

export function Checkbox({label, className = '', ...inputProps}) {
  return (
    <label className={`${styles.checkbox} ${className}`}>
      <input type="checkbox" className={styles.input} {...inputProps} />
      <span className={styles.box} area-hidden="true"></span>
      <span className={styles.label}>{label}</span>
    </label>
  );
}
