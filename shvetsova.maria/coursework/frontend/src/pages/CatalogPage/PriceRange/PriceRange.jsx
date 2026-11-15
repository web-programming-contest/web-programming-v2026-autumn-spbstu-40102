import styles from './PriceRange.module.scss';

const STEP = 10;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function PriceRange({min, max, from, to, onFromChange, onToChange}) {
  const fromValue = from === '' ? min : from;
  const toValue = to === '' ? max : to;

  const toPercent = (value) => ((value - min) / (max - min)) * 100;

  const handleInput = (setValue) => (event) => {
    const {value} = event.target;
    setValue(value === '' ? '' : Number(value));
  };

  const handleFromBlur = () => {
    if (from !== '') {
      onFromChange(clamp(from, min, toValue));
    }
  };

  const handleToBlur = () => {
    if (to !== '') {
      onToChange(clamp(to, fromValue, max));
    }
  };

  const handleFromSlider = (event) =>
    onFromChange(Math.min(Number(event.target.value), toValue));
  const handleToSlider = (event) =>
    onToChange(Math.max(Number(event.target.value), fromValue));

  const left = toPercent(clamp(fromValue, min, max));
  const right = toPercent(clamp(toValue, min, max));

  return (
    <div className={styles.range}>
      <div className={styles.fields}>
        <label className={styles.field}>
          <span className={styles.label}>От</span>
          <input
            className={styles.input}
            type="number"
            inputMode="numeric"
            placeholder={min}
            value={from}
            onChange={handleInput(onFromChange)}
            onBlur={handleFromBlur}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>До</span>
          <input
            className={styles.input}
            type="number"
            inputMode="numeric"
            placeholder={max}
            value={to}
            onChange={handleInput(onToChange)}
            onBlur={handleToBlur}
          />
        </label>
      </div>

      <div className={styles.slider}>
        <div className={styles.track} />
        <div
          className={styles.fill}
          style={{left: `${left}%`, width: `${right - left}%`}}
        />

        <input
          className={`${styles.thumb} ${left > 90 ? styles.thumbTop : ''}`}
          type="range"
          min={min}
          max={max}
          step={STEP}
          value={fromValue}
          onChange={handleFromSlider}
          aria-label="Цена от"
        />

        <input
          className={styles.thumb}
          type="range"
          min={min}
          max={max}
          step={STEP}
          value={toValue}
          onChange={handleToSlider}
          aria-label="Цена до"
        />
      </div>
    </div>
  );
}
