import {useState} from 'react';
import {api} from '@/api/client';
import {useCart} from '@/context/CartContext';
import {Modal} from '@/components/Modal/Modal';
import {Button} from '@/components/Button/Button';
import {CartEmpty} from './CartEmpty/CartEmpty';
import {CartList} from './CartList/CartList';
import {OrderForm} from './OrderForm/OrderForm';
import {OrderHistory} from './OrderHistory/OrderHistory';
import {RemoveModal} from './RemoveModal/RemoveModal';
import styles from './CartPage.module.scss';

const TABS = [
  {id: 'cart', label: 'Корзина'},
  {id: 'history', label: 'История заказов'},
];

export function CartPage() {
  const [tab, setTab] = useState('cart');
  const {items, add, decrement, remove} = useCart();
  const [excludedIds, setExcludedIds] = useState([]);
  const [itemsToRemove, setItemsToRemove] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const selectedItems = items.filter((item) => !excludedIds.includes(item.id));
  const isAllSelected =
    items.length > 0 && selectedItems.length === items.length;
  const totalCount = selectedItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const toggleItem = (id) => {
    setExcludedIds((current) =>
      current.includes(id)
        ? current.filter((excludedId) => excludedId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setExcludedIds(isAllSelected ? items.map((item) => item.id) : []);
  };

  const confirmRemove = () => {
    const ids = itemsToRemove.map((item) => item.id);
    remove(ids);
    setExcludedIds((current) => current.filter((id) => !ids.includes(id)));
    setItemsToRemove([]);
  };

  const handleOrderSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const order = await api.createOrder({
        ...values,
        items: selectedItems.map(({id, quantity}) => ({id, quantity})),
      });
      remove(order.items.map((item) => item.id));
      setCreatedOrder(order);
    } catch (error) {
      setOrderError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className="wrapper">
        <div className={styles.tabs} role="tablist">
          {TABS.map(({id, label}) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`${styles.tab} ${tab === id ? styles.activeTab : ''}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === 'cart' &&
          (items.length === 0 ? (
            <CartEmpty />
          ) : (
            <>
              <CartList
                items={items}
                selectedItems={selectedItems}
                isAllSelected={isAllSelected}
                onToggleAll={toggleAll}
                onToggle={toggleItem}
                onIncrement={add}
                onDecrement={decrement}
                onRemove={(item) => setItemsToRemove([item])}
                onRemoveSelected={() => setItemsToRemove(selectedItems)}
              />
              <OrderForm
                totalCount={totalCount}
                totalPrice={totalPrice}
                isSubmitting={isSubmitting}
                onSubmit={handleOrderSubmit}
              />
            </>
          ))}

        {tab === 'history' && <OrderHistory />}
      </div>

      <RemoveModal
        items={itemsToRemove}
        onConfirm={confirmRemove}
        onClose={() => setItemsToRemove([])}
      />

      <Modal
        isOpen={Boolean(createdOrder)}
        onClose={() => setCreatedOrder(null)}
      >
        <h2>Спасибо, ваш заказ успешно оформлен.</h2>
        <p>Номер заказа: {createdOrder?.id}.</p>
        <Button
          onClick={() => {
            setCreatedOrder(null);
            setTab('history');
          }}
        >
          Мои заказы
        </Button>
      </Modal>

      <Modal isOpen={Boolean(orderError)} onClose={() => setOrderError('')}>
        <p>{orderError}</p>
        <Button onClick={() => setOrderError('')}>Ок</Button>
      </Modal>
    </section>
  );
}
