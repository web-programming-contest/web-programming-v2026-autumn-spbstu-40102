import {Checkbox} from '@/components/Checkbox/Checkbox';
import {formatPrice, pluralize} from '@/utils/format';
import {CartItem} from '../CartItem/CartItem';
import styles from './CartList.module.scss';

export function CartList({
  items,
  selectedItems,
  isAllSelected,
  onToggleAll,
  onToggle,
  onIncrement,
  onDecrement,
  onRemove,
  onRemoveSelected,
}) {
  const totalCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className={styles.list}>
      <div className={styles.toolbar}>
        <Checkbox
          label="Выбрать все"
          checked={isAllSelected}
          onChange={onToggleAll}
        />
        <button
          type="button"
          className={styles.removeSelected}
          onClick={onRemoveSelected}
          disabled={selectedItems.length === 0}
        >
          Удалить выбранные
        </button>
      </div>

      <ul className={styles.items}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <CartItem
              item={item}
              isSelected={selectedItems.some(
                (selected) => selected.id === item.id,
              )}
              onToggle={() => onToggle(item.id)}
              onIncrement={() => onIncrement(item)}
              onDecrement={() => onDecrement(item.id)}
              onRemove={() => onRemove(item)}
            />
          </li>
        ))}
      </ul>

      <p className={styles.summary}>
        {totalCount} {pluralize(totalCount, ['товар', 'товара', 'товаров'])} на{' '}
        {formatPrice(totalPrice)}
      </p>
    </div>
  );
}
