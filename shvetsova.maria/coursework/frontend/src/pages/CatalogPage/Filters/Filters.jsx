import {useEffect, useState} from 'react';
import {api} from '@/api/client';
import {Checkbox} from '@/components/Checkbox/Checkbox';
import {Button} from '@/components/Button/Button';
import styles from './Filters.module.scss';
import {PriceRange} from '../PriceRange/PriceRange';

const EMPTY_FILTERS = {type: [], color: [], price_min: '', price_max: ''};

export function Filters({onApply, onReset}) {
  const [options, setOptions] = useState(null);
  const [draft, setDraft] = useState(EMPTY_FILTERS);

  useEffect(() => {
    api
      .getGoodsFilters()
      .then(setOptions)
      .catch(() => setOptions(null));
  }, []);

  const toggle = (key, value) => {
    setDraft((current) => {
      const list = current[key];
      const nextList = list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value];
      return {...current, [key]: nextList};
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onApply(draft);
  };

  const handleReset = () => {
    setDraft(EMPTY_FILTERS);
    onReset();
  };

  if (!options) {
    return null;
  }

  return (
    <form className={styles.filters} onSubmit={handleSubmit}>
      <fieldset className={styles.group}>
        <legend className={styles.title}>Цена, ₽</legend>

        <PriceRange
          min={options.minPrice}
          max={options.maxPrice}
          from={draft.price_min}
          to={draft.price_max}
          onFromChange={(value) =>
            setDraft((current) => ({...current, price_min: value}))
          }
          onToChange={(value) =>
            setDraft((current) => ({...current, price_max: value}))
          }
        />
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.title}>Тип товара</legend>
        <ul className={styles.list}>
          {options.types.map((type) => (
            <li key={type}>
              <Checkbox
                label={type}
                checked={draft.type.includes(type)}
                onChange={() => toggle('type', type)}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.title}>Цвет</legend>
        <ul className={styles.list}>
          {options.colors.map((color) => (
            <li key={color}>
              <Checkbox
                label={color}
                checked={draft.color.includes(color)}
                onChange={() => toggle('color', color)}
              />
            </li>
          ))}
        </ul>
      </fieldset>

      <div className={styles.actions}>
        <Button type="submit">Показать</Button>
        <Button type="button" className={styles.reset} onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </form>
  );
}
