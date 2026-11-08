import {Checkbox} from '@/components/Checkbox/Checkbox';
import {QuantityCounter} from '@/components/QuantityCounter/QuantityCounter';
import {formatPrice} from '@/utils/format';
import styles from './CartItem.module.scss';

export function CartItem({
  item,
  isSelected,
  onToggle,
  onIncrement,
  onDecrement,
  onRemove,
}) {
  return (
    <div className={styles.item}>
      <Checkbox
        className={styles.checkbox}
        checked={isSelected}
        onChange={onToggle}
        aria-label={`Выбрать ${item.name}`}
      />

      <div className={styles.imageBox}>
        <img className={styles.image} src={item.image} alt={item.name} />
      </div>

      <p className={styles.name}>{item.name}</p>

      <QuantityCounter
        value={item.quantity}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
      />

      <p className={styles.price}>{formatPrice(item.price * item.quantity)}</p>

      <button type="button" className={styles.remove} onClick={onRemove}>
        Удалить
      </button>
    </div>
  );
}
