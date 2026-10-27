import {computed, reactive} from 'vue';
import type {CartItem, Customer, Good, Order, User} from '../../shared/types';
import {api, errorMessage} from './api';

export const shop = reactive({
  user: null as User | null,
  goods: [] as Good[],
  cart: [] as CartItem[],
  locked: false,
  loading: true,
  loadError: '',
  message: '',
  product: null as Good | null,
});
export const cartCount = computed(() =>
  shop.cart.reduce((sum, item) => sum + item.quantity, 0),
);
export const cartKey = (userId: string): string => `gadget-hub.cart.${userId}`;
function restoreCart(user: User, goods: Good[]): void {
  try {
    const saved = localStorage.getItem(cartKey(user.id));
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid cart');
    }
    const seen = new Set<number>();
    shop.cart = parsed.filter((raw: unknown): raw is CartItem => {
      if (typeof raw !== 'object' || raw === null) {
        return false;
      }
      const item = raw as CartItem;
      if (
        seen.has(item.id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99 ||
        !goods.some((good) => good.id === item.id)
      ) {
        return false;
      }
      seen.add(item.id);
      return true;
    });
  } catch {
    shop.cart = [];
    shop.message = 'Не удалось восстановить корзину. Она открыта пустой.';
  }
}
let initialization: Promise<void> | null = null;
export function initializeShop(retry = false): Promise<void> {
  if (initialization && !retry) {
    return initialization;
  }
  shop.loading = true;
  shop.loadError = '';
  initialization = (async () => {
    try {
      const {user} = await api<{user: User | null}>('/session');
      const {goods} = await api<{goods: Good[]}>(user ? '/goods' : '/featured');
      shop.user = user;
      shop.goods = goods;
      if (user) {
        restoreCart(user, goods);
      }
    } catch (error) {
      shop.loadError = errorMessage(error);
    } finally {
      shop.loading = false;
    }
  })();
  return initialization;
}
export async function login(values: {
  login: string;
  password: string;
}): Promise<void> {
  const {user} = await api<{user: User}>('/login', {
    method: 'POST',
    body: JSON.stringify(values),
  });
  const {goods} = await api<{goods: Good[]}>('/goods');
  shop.goods = goods;
  shop.user = user;
  shop.message = '';
  restoreCart(user, goods);
}
export async function logout(): Promise<boolean> {
  try {
    await api('/logout', {method: 'POST'});
    shop.user = null;
    shop.cart = [];
    shop.product = null;
    shop.message = '';
    return true;
  } catch (error) {
    shop.message = errorMessage(error);
    return false;
  }
}
function writeCart(items: CartItem[]): boolean {
  if (!shop.user || shop.locked) {
    return false;
  }
  try {
    localStorage.setItem(cartKey(shop.user.id), JSON.stringify(items));
    shop.cart = items;
    shop.message = '';
    return true;
  } catch {
    shop.message =
      'Не удалось сохранить корзину. Проверьте доступ к хранилищу браузера.';
    return false;
  }
}
export function changeQuantity(id: number, difference: number): void {
  const item = shop.cart.find((entry) => entry.id === id);
  const quantity = (item?.quantity || 0) + difference;
  if (quantity > 99) {
    return;
  }
  writeCart(
    quantity <= 0
      ? shop.cart.filter((entry) => entry.id !== id)
      : item
        ? shop.cart.map((entry) =>
            entry.id === id ? {...entry, quantity} : entry,
          )
        : [...shop.cart, {id, quantity}],
  );
}
export const removeItems = (ids: number[]): boolean =>
  writeCart(shop.cart.filter((item) => !ids.includes(item.id)));
export async function placeOrder(
  customer: Customer,
  requestId: string,
): Promise<Order> {
  shop.locked = true;
  try {
    const {order} = await api<{order: Order}>('/orders', {
      method: 'POST',
      body: JSON.stringify({items: shop.cart, customer, requestId}),
    });
    return order;
  } finally {
    shop.locked = false;
  }
}
export function clearOrderedCart(): void {
  shop.cart = [];
  try {
    if (shop.user) {
      localStorage.removeItem(cartKey(shop.user.id));
    }
    shop.message = '';
  } catch {
    shop.message = 'Заказ оформлен, но очистить хранилище браузера не удалось.';
  }
}
