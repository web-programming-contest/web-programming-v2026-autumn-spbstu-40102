import {Link} from 'react-router-dom';
import {useCart} from '@/context/CartContext';
import {Button} from '@/components/Button/Button';
import {QuantityCounter} from '@/components/QuantityCounter/QuantityCounter';
import cartIcon from '@/assets/icons/cart.svg';
import styles from './CartControl.module.scss';

export function CartControl({product, layout = 'card', onAdded}) {
  const {getQuantity, add, decrement} = useCart();
  const quantity = getQuantity(product.id);

  const handleAdd = () => {
    add(product);
    onAdded?.();
  };

  if (quantity === 0) {
    return (
      <Button icon={cartIcon} onClick={handleAdd}>
        В корзину
      </Button>
    );
  }

  const isModal = layout === 'modal';

  return (
    <div className={`${styles.control} ${isModal ? styles.modal : ''}`}>
      <Button as={Link} to="/cart" variant="secondary" icon={cartIcon}>
        {isModal ? `В корзине ${quantity} шт.` : `${quantity} шт.`}
      </Button>
      <QuantityCounter
        value={quantity}
        onDecrement={() => decrement(product.id)}
        onIncrement={() => add(product)}
      />
    </div>
  );
}
