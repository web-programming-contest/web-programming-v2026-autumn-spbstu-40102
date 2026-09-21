const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(status, payload) {
    super(payload?.error?.message || 'Произошла ошибка запроса');
    this.name = 'ApiError';
    this.status = status;
    this.code = payload?.error?.code;
    this.details = payload?.error?.details;
  }
}

export const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, payload);
  }

  return payload;
};

export const formatPrice = (kopecks) =>
  `${Math.round(kopecks / 100).toLocaleString('ru-RU')} ₽`;

export const formatDate = (value) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
