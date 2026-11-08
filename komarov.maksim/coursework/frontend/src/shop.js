export const PAGE_SIZE = 9;
export const MAX_QUANTITY = 99;
export const money = (value) =>
  `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
export const productWord = (n) => {
  const last = n % 10;
  const tens = n % 100;
  return tens >= 11 && tens <= 14
    ? 'товаров'
    : last === 1
      ? 'товар'
      : last >= 2 && last <= 4
        ? 'товара'
        : 'товаров';
};
export const cartKey = (user) => `gadget-hub:cart:${user}`;

export function parseCart(value) {
  try {
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {};
    }
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, qty]) =>
          /^[1-9]\d*$/.test(id) &&
          Number.isInteger(qty) &&
          qty >= 1 &&
          qty <= MAX_QUANTITY,
      ),
    );
  } catch {
    return {};
  }
}

export function selectProducts(products, filters, sort) {
  const lower = filters.min === '' ? -Infinity : Number(filters.min);
  const upper = filters.max === '' ? Infinity : Number(filters.max);
  const result = products.filter(
    (p) =>
      p.price >= lower &&
      p.price <= upper &&
      (!filters.categories.length || filters.categories.includes(p.category)) &&
      (!filters.colors.length || filters.colors.includes(p.color)),
  );
  return result.sort((a, b) => {
    switch (sort) {
      case 'cheap':
        return a.price - b.price || a.catalogOrder - b.catalogOrder;
      case 'expensive':
        return b.price - a.price || a.catalogOrder - b.catalogOrder;
      case 'popular':
        return b.popularity - a.popularity || a.catalogOrder - b.catalogOrder;
      case 'unpopular':
        return a.popularity - b.popularity || a.catalogOrder - b.catalogOrder;
      case 'old':
        return (
          a.releaseDate.localeCompare(b.releaseDate) ||
          a.catalogOrder - b.catalogOrder
        );
      default:
        return (
          Number(b.isNew) - Number(a.isNew) ||
          b.releaseDate.localeCompare(a.releaseDate) ||
          a.catalogOrder - b.catalogOrder
        );
    }
  });
}

export function validateCheckout(form) {
  const errors = {};
  const digits = form.phone.replace(/\D/g, '');
  if (!form.phone.trim()) {
    errors.phone = 'Заполните обязательное поле';
  } else if (
    !/^[\d+()\s-]+$/.test(form.phone) ||
    digits.length < 10 ||
    digits.length > 15
  ) {
    errors.phone = 'Укажите телефон: от 10 до 15 цифр';
  }
  if (
    form.email.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  ) {
    errors.email = 'Проверьте адрес электронной почты';
  }
  if (form.delivery === 'delivery' && !form.address.trim()) {
    errors.address = 'Заполните обязательное поле';
  }
  if (!['card', 'cash'].includes(form.payment)) {
    errors.payment = 'Выберите способ оплаты';
  }
  return errors;
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Gadget-Request': 'true',
        ...options.headers,
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    throw new ApiError(
      'Не удалось связаться с сервером. Проверьте, что бэкенд запущен.',
      0,
    );
  }
  let body;
  try {
    body = await response.json();
  } catch {
    throw new ApiError('Сервер вернул некорректный ответ', response.status);
  }
  if (!response.ok) {
    throw new ApiError(
      body.error || 'Не удалось выполнить запрос',
      response.status,
    );
  }
  return body;
}
