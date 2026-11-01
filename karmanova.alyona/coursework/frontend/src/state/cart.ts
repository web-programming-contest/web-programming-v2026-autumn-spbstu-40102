import { reactive, readonly } from "vue";
import type { CartCalculation } from "../api/models";
import { api, ApiError, NetworkError } from "../api/client.ts";

export const CART_STORAGE_KEY = "gadgetHub.cart";

export type CartItem = {
  productId: number;
  quantity: number;
};

function readItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) throw new Error("Некорректный формат корзины");
  const ids = new Set<number>();
  return value.map((item) => {
    if (
      !item ||
      !Number.isSafeInteger(item.productId) ||
      item.productId <= 0 ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity <= 0 ||
      ids.has(item.productId)
    ) {
      throw new Error("Некорректный состав корзины");
    }
    ids.add(item.productId);
    return { productId: item.productId, quantity: item.quantity };
  });
}

const state = reactive({
  items: [] as CartItem[],
  calculation: null as CartCalculation | null,
  totalQuantity: null as number | null,
  isLoading: false,
  error: null as string | null,
});
let revision = 0;

function reset() {
  revision++;
  state.items = [];
  state.totalQuantity = null;
  state.calculation = null;
  state.isLoading = false;
  state.error = null;
}

async function refresh(): Promise<void> {
  const current = ++revision;
  state.totalQuantity = null;
  state.calculation = null;
  state.error = null;
  state.isLoading = true;
  try {
    const result = await api.post<CartCalculation>("/cart/calculate", {
      items: state.items,
    });
    if (current !== revision) return;
    state.totalQuantity = result.totalQuantity;
    state.calculation = result;
  } catch (error) {
    if (current !== revision) return;
    state.error =
      error instanceof ApiError || error instanceof NetworkError
        ? error.message
        : "Не удалось обновить корзину. Попробуйте позже.";
  } finally {
    if (current === revision) state.isLoading = false;
  }
}

async function restore(): Promise<void> {
  reset();
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    state.items = readItems(stored === null ? [] : JSON.parse(stored));
  } catch {
    state.error =
      "Не удалось прочитать сохранённую корзину. Проверьте доступ к хранилищу и формат данных.";
    return;
  }
  await refresh();
}

async function setItems(items: readonly CartItem[]): Promise<void> {
  const next = readItems(items);
  try {
    if (next.length)
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    state.error =
      "Не удалось сохранить корзину в браузере. Попробуйте ещё раз.";
    throw new Error(state.error);
  }
  state.items = next;
  await refresh();
}

function clear(): Promise<void> {
  return setItems([]);
}

export const cart = {
  state: readonly(state),
  restore,
  refresh,
  setItems,
  clear,
  reset,
};
