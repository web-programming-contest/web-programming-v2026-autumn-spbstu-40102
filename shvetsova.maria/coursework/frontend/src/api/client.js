export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function getErrorMessage(data) {
  if (typeof data?.detail === 'string') {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    return 'Проверьте введенные данные';
  }

  return 'Ошибка сервера, попробуйте позже';
}

async function request(path, {method = 'GET', body} = {}) {
  const response = await fetch(`/api${path}`, {
    method,
    headers: body ? {'Content-Type': 'application/json'} : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, getErrorMessage(data));
  }

  return data;
}

function buildQuery(params) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else {
      query.append(key, value);
    }
  });

  const string = query.toString();
  return string ? `?${string}` : '';
}

export const api = {
  login: (credentials) =>
    request('/login', {method: 'POST', body: credentials}),
  logout: () => request('/logout', {method: 'POST'}),
  me: () => request('/me'),
  getGoods: (params = {}) => request(`/goods${buildQuery(params)}`),
  getGoodsFilters: () => request('/goods/filters'),
  createOrder: (order) => request('/orders', {method: 'POST', body: order}),
  getOrders: () => request('/orders'),
};
