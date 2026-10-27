import type {FieldErrors} from '../../shared/types';
export class ApiError extends Error {
  constructor(
    message: string,
    public status = 0,
    public fields: FieldErrors = {},
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...options,
      headers: {'Content-Type': 'application/json', ...options.headers},
    });
  } catch {
    throw new ApiError(
      'Нет связи с сервером. Проверьте, что бэкенд запущен, и повторите попытку.',
    );
  }
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError('Сервер временно недоступен. Повторите попытку.');
  }
  if (!response.ok) {
    const body = data as {message?: string; errors?: FieldErrors};
    if (response.status === 401 && path !== '/login') {
      window.dispatchEvent(new Event('session-expired'));
    }
    throw new ApiError(
      body.message || 'Не удалось выполнить запрос.',
      response.status,
      body.errors,
    );
  }
  return data as T;
}
export const errorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : 'Не удалось выполнить операцию.';
export const money = (value: number): string =>
  `${value.toLocaleString('ru-RU')} ₽`;
export function productWord(value: number): string {
  if (value % 100 >= 11 && value % 100 <= 14) {
    return 'товаров';
  }
  if (value % 10 === 1) {
    return 'товар';
  }
  if (value % 10 >= 2 && value % 10 <= 4) {
    return 'товара';
  }
  return 'товаров';
}
