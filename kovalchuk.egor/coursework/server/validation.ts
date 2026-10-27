import type {Customer, FieldErrors, Good, OrderItem} from '../shared/types.js';

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
export function validateOrder(
  body: unknown,
  goods: Good[],
):
  | {errors: FieldErrors}
  | {requestId: string; customer: Customer; items: OrderItem[]} {
  const data = isRecord(body) ? body : {};
  const customer = isRecord(data.customer) ? data.customer : {};
  const errors: FieldErrors = {};
  const phone = typeof customer.phone === 'string' ? customer.phone.trim() : '';
  const email = typeof customer.email === 'string' ? customer.email.trim() : '';
  const address =
    typeof customer.address === 'string' ? customer.address.trim() : '';
  if (
    !/^\+?[\d\s()-]{7,25}$/.test(phone) ||
    phone.replace(/\D/g, '').length < 7
  ) {
    errors.phone = 'Введите корректный номер телефона.';
  }
  if (
    (customer.email && typeof customer.email !== 'string') ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  ) {
    errors.email = 'Введите корректный e-mail.';
  }
  if (customer.delivery !== 'pickup' && customer.delivery !== 'delivery') {
    errors.delivery = 'Выберите способ получения.';
  }
  if (customer.delivery === 'delivery' && !address) {
    errors.address = 'Заполните обязательное поле.';
  }
  if (customer.payment !== 'card' && customer.payment !== 'cash') {
    errors.payment = 'Выберите способ оплаты.';
  }
  if (typeof customer.packaging !== 'boolean') {
    errors.packaging = 'Некорректное значение упаковки.';
  }
  const requestId = typeof data.requestId === 'string' ? data.requestId : '';
  if (!/^[\w-]{10,100}$/.test(requestId)) {
    errors.requestId = 'Некорректный идентификатор заказа.';
  }
  const items: OrderItem[] = [];
  const seen = new Set<number>();
  if (
    !Array.isArray(data.items) ||
    data.items.length === 0 ||
    data.items.length > goods.length
  ) {
    errors.items = 'Корзина пуста или содержит некорректные товары.';
  } else {
    for (const raw of data.items) {
      const item = isRecord(raw) ? raw : {};
      const good = goods.find((entry) => entry.id === item.id);
      if (
        !good ||
        seen.has(good.id) ||
        typeof item.quantity !== 'number' ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      ) {
        errors.items = 'Некорректный товар или количество.';
        break;
      }
      seen.add(good.id);
      items.push({
        id: good.id,
        name: good.name,
        price: good.price,
        quantity: item.quantity,
      });
    }
  }
  if (Object.keys(errors).length > 0) {
    return {errors};
  }
  return {
    requestId,
    items,
    customer: {
      phone,
      email,
      address: customer.delivery === 'delivery' ? address : '',
      delivery: customer.delivery as Customer['delivery'],
      payment: customer.payment as Customer['payment'],
      packaging: customer.packaging as boolean,
    },
  };
}
