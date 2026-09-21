import {computed, ref, watch} from 'vue';

const STORAGE_KEY = 'gadget-hub:cart:v1';

const loadItems = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value)
      ? value.filter(
          (item) =>
            Number.isInteger(item.productId) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
        )
      : [];
  } catch {
    return [];
  }
};

const items = ref(loadItems());

watch(
  items,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  },
  {deep: true},
);

const findItem = (productId) =>
  items.value.find((item) => item.productId === productId);

export const useCart = () => {
  const add = (productId) => {
    const item = findItem(productId);

    if (item) {
      item.quantity += 1;
    } else {
      items.value.push({productId, quantity: 1});
    }
  };

  const setQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      remove(productId);
      return;
    }

    const item = findItem(productId);

    if (item) {
      item.quantity = Math.min(quantity, 99);
    }
  };

  const increment = (productId) =>
    setQuantity(productId, (findItem(productId)?.quantity || 0) + 1);
  const decrement = (productId) =>
    setQuantity(productId, (findItem(productId)?.quantity || 1) - 1);

  const remove = (productId) => {
    items.value = items.value.filter((item) => item.productId !== productId);
  };

  const clear = () => {
    items.value = [];
  };

  return {
    items,
    count: computed(() =>
      items.value.reduce((total, item) => total + item.quantity, 0),
    ),
    add,
    setQuantity,
    increment,
    decrement,
    remove,
    clear,
  };
};
