import {useEffect, useState} from 'react';
import {api} from '@/api/client';
import {formatPrice} from '@/utils/format';
import styles from './OrderHistory.module.scss';

const DELIVERY_LABELS = {pickup: 'Самовывоз', delivery: 'Доставка'};
const PAYMENT_LABELS = {card: 'Картой', cash: 'Наличными'};

function formatDate(value) {
  return new Date(value).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    api
      .getOrders()
      .then((data) => {
        if (!ignore) {
          setOrders(data);
        }
      })
      .catch(() => {
        if (!ignore) {
          setError(
            'Не удалось загрузить историю заказов. Попробуйте обновить страницу.',
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  if (isLoading) {
    return <p className={styles.message}>Загрузка…</p>;
  }

  if (error) {
    return <p className={styles.message}>{error}</p>;
  }

  if (orders.length === 0) {
    return <p className={styles.message}>Вы ещё ничего не заказывали</p>;
  }

  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order.id} className={styles.order}>
          <div className={styles.header}>
            <h3 className={styles.number}>Заказ № {order.id}</h3>
            <span className={styles.date}>{formatDate(order.createdAt)}</span>
          </div>

          <ul className={styles.items}>
            {order.items.map((item) => (
              <li key={item.id} className={styles.item}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.quantity}>{item.quantity} шт.</span>
                <span className={styles.price}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className={styles.footer}>
            <span className={styles.meta}>
              {DELIVERY_LABELS[order.delivery]}
              {order.address && `, ${order.address}`} ·{' '}
              {PAYMENT_LABELS[order.payment]}
              {order.packaging && ' · С упаковкой'}
            </span>
            <span className={styles.total}>
              Итого: {formatPrice(order.total)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
