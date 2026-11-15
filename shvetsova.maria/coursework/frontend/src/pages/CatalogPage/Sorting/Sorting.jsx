import styles from './Sorting.module.scss';

const SORT_OPTIONS = [
  {value: 'new', label: 'Новые'},
  {value: 'popular', label: 'Популярные'},
  {value: 'cheap', label: 'Подешевле'},
  {value: 'expensive', label: 'Подороже'},
];

export function Sorting({value, onChange}) {
  return (
    <div className={styles.sorting}>
      {SORT_OPTIONS.map(({value: optionValue, label}) => (
        <button
          key={optionValue}
          type="button"
          className={`${styles.chip} ${optionValue === value ? styles.active : ''}`}
          aria-pressed={optionValue === value}
          onClick={() => onChange(optionValue)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
