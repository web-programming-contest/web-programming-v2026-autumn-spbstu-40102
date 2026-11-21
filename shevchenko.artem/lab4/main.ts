import {Order} from './model';
import type {OrderItem, SerializedOrder} from './model';

const STORAGE_KEY = 'lab4-orders';
const ASYNC_DELAY = 300;

interface StatusOption {
  value: string;
  label: string;
}

const STATUS_OPTIONS: readonly StatusOption[] = [
  {value: 'new', label: 'Новый'},
  {value: 'processing', label: 'В обработке'},
  {value: 'completed', label: 'Выполнен'},
  {value: 'cancelled', label: 'Отменён'},
];

let orders: Order[] = loadOrders();

const list = getElement<HTMLElement>('[data-testid="entity-list"]');
const form = getElement<HTMLFormElement>('form[data-testid="entity-form"]');
const orderIdInput = getElement<HTMLInputElement>('[name="orderId"]');
const statusSelect = getElement<HTMLSelectElement>('[name="status"]');
const message = getElement<HTMLElement>('[data-testid="form-message"]');

fillStatusOptions(statusSelect);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const orderId = Number(orderIdInput.value);
  const status = statusSelect.value;

  if (!Number.isInteger(orderId) || orderId <= 0) {
    setMessage('ID заказа должен быть положительным целым числом.');
    return;
  }

  if (orders.some((order) => order.orderId === orderId)) {
    setMessage(`Заказ с ID ${orderId} уже существует.`);
    return;
  }

  setMessage('');
  void runAsync(() => {
    orders.push(new Order(orderId, [], status));
  }).then(() => {
    form.reset();
    statusSelect.value = STATUS_OPTIONS[0].value;
    orderIdInput.focus();
  });
});

list.addEventListener('submit', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) {
    return;
  }
  if (!target.classList.contains('item-form')) {
    return;
  }
  event.preventDefault();

  const orderId = Number(target.dataset.orderId);
  const nameInput = target.querySelector<HTMLInputElement>('[name="name"]');
  const priceInput = target.querySelector<HTMLInputElement>('[name="price"]');
  const name = nameInput?.value.trim() ?? '';
  const price = Number(priceInput?.value);

  if (!name) {
    setMessage('Укажите название товара.');
    return;
  }
  if (!Number.isFinite(price) || price < 0) {
    setMessage('Укажите корректную цену товара.');
    return;
  }

  setMessage('');
  void runAsync(() => {
    const order = orders.find((item) => item.orderId === orderId);
    order?.addItem({name, price});
  }).then(() => {
    const activeForm = list.querySelector<HTMLFormElement>(
      `.item-form[data-order-id="${orderId}"]`,
    );
    activeForm?.reset();
  });
});

list.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const deleteButton = target.closest<HTMLElement>(
    '[data-testid="delete-entity"]',
  );
  if (deleteButton) {
    const orderId = Number(deleteButton.dataset.orderId);
    void runAsync(() => {
      orders = orders.filter((order) => order.orderId !== orderId);
    });
    return;
  }

  const removeItemButton = target.closest<HTMLElement>(
    '[data-action="remove-item"]',
  );
  if (removeItemButton) {
    const orderId = Number(removeItemButton.dataset.orderId);
    const itemName = removeItemButton.dataset.itemName ?? '';
    void runAsync(() => {
      const order = orders.find((item) => item.orderId === orderId);
      order?.removeItem(itemName);
    });
  }
});

render();

function render(): void {
  list.replaceChildren(...orders.map(renderOrder));
}

function renderOrder(order: Order): HTMLElement {
  const card = document.createElement('article');
  card.className = 'order';
  card.setAttribute('data-testid', 'entity-card');

  const header = document.createElement('header');
  header.className = 'order-header';

  const title = document.createElement('h3');
  title.className = 'order-title';
  title.textContent = `Заказ № ${order.orderId}`;
  header.append(title);

  const status = document.createElement('select');
  status.className = 'order-status';
  status.setAttribute('aria-label', `Статус заказа ${order.orderId}`);
  fillStatusOptions(status);
  status.value = order.status;
  status.addEventListener('change', () => {
    const nextStatus = status.value;
    const current = orders.find((item) => item.orderId === order.orderId);
    if (!current) {
      return;
    }
    current.status = nextStatus;
    persist();
    render();
  });
  header.append(status);

  const items = document.createElement('ul');
  items.className = 'items';

  if (order.items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'В заказе пока нет товаров.';
    items.append(empty);
  } else {
    for (const item of order.items) {
      items.append(renderItem(order.orderId, item));
    }
  }

  const itemForm = document.createElement('form');
  itemForm.className = 'item-form';
  itemForm.dataset.orderId = String(order.orderId);

  const nameLabel = document.createElement('label');
  nameLabel.className = 'field';
  const nameCaption = document.createElement('span');
  nameCaption.textContent = 'Название';
  const nameInput = document.createElement('input');
  nameInput.name = 'name';
  nameInput.type = 'text';
  nameInput.placeholder = 'Клавиатура';
  nameInput.required = true;
  nameLabel.append(nameCaption, nameInput);

  const priceLabel = document.createElement('label');
  priceLabel.className = 'field';
  const priceCaption = document.createElement('span');
  priceCaption.textContent = 'Цена';
  const priceInput = document.createElement('input');
  priceInput.name = 'price';
  priceInput.type = 'number';
  priceInput.min = '0';
  priceInput.step = '0.01';
  priceInput.placeholder = '1200';
  priceInput.required = true;
  priceLabel.append(priceCaption, priceInput);

  const addItemButton = document.createElement('button');
  addItemButton.type = 'submit';
  addItemButton.textContent = 'Добавить товар';
  itemForm.append(nameLabel, priceLabel, addItemButton);

  const footer = document.createElement('footer');
  footer.className = 'order-footer';

  const total = document.createElement('p');
  total.className = 'total';
  total.textContent = `Итого: ${formatPrice(order.getTotal())}`;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-order';
  deleteButton.setAttribute('data-testid', 'delete-entity');
  deleteButton.dataset.orderId = String(order.orderId);
  deleteButton.textContent = 'Удалить заказ';
  footer.append(total, deleteButton);

  card.append(header, items, itemForm, footer);
  return card;
}

function renderItem(orderId: number, item: OrderItem): HTMLElement {
  const row = document.createElement('li');
  row.className = 'item';

  const name = document.createElement('span');
  name.className = 'item-name';
  name.textContent = item.name;

  const price = document.createElement('span');
  price.className = 'item-price';
  price.textContent = formatPrice(item.price);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'item-delete';
  removeButton.setAttribute('data-action', 'remove-item');
  removeButton.dataset.orderId = String(orderId);
  removeButton.dataset.itemName = item.name;
  removeButton.setAttribute('aria-label', `Удалить товар ${item.name}`);
  removeButton.textContent = 'Удалить';

  row.append(name, price, removeButton);
  return row;
}

function fillStatusOptions(select: HTMLSelectElement): void {
  select.replaceChildren(
    ...STATUS_OPTIONS.map((option) => {
      const element = document.createElement('option');
      element.value = option.value;
      element.textContent = option.label;
      return element;
    }),
  );
}

function runAsync(action: () => void): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      persist();
      render();
      resolve();
    }, ASYNC_DELAY);
  });
}

function persist(): void {
  localStorage.setItem(STORAGE_KEY, serialize(orders));
}

function loadOrders(): Order[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = createInitialOrders();
    localStorage.setItem(STORAGE_KEY, serialize(initial));
    return initial;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    const rawItems: unknown[] = parsed;
    return rawItems.flatMap((value) => {
      const order = parseOrder(value);
      return order ? [order] : [];
    });
  } catch {
    return [];
  }
}

function parseOrder(value: unknown): Order | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const orderId = Number(record.orderId);
  if (!Number.isInteger(orderId)) {
    return null;
  }

  const status = typeof record.status === 'string' ? record.status : 'new';
  const items: OrderItem[] = [];
  const rawItems = record.items;
  if (Array.isArray(rawItems)) {
    for (const rawItem of rawItems) {
      if (typeof rawItem !== 'object' || rawItem === null) {
        continue;
      }
      const itemRecord = rawItem as Record<string, unknown>;
      const name = typeof itemRecord.name === 'string' ? itemRecord.name : '';
      const price = Number(itemRecord.price);
      if (name && Number.isFinite(price)) {
        items.push({name, price});
      }
    }
  }

  return new Order(orderId, items, status);
}

function serialize(source: Order[]): string {
  const data: SerializedOrder[] = source.map((order) => ({
    orderId: order.orderId,
    items: order.items.map((item) => ({name: item.name, price: item.price})),
    status: order.status,
  }));
  return JSON.stringify(data);
}

function createInitialOrders(): Order[] {
  return [
    new Order(
      101,
      [
        {name: 'Клавиатура', price: 1200},
        {name: 'Мышка', price: 700},
      ],
      'new',
    ),
    new Order(102, [{name: 'Монитор', price: 15000}], 'processing'),
    new Order(103, [{name: 'Кабель HDMI', price: 450}], 'completed'),
    new Order(104, [{name: 'Кресло', price: 5200}], 'cancelled'),
  ];
}

function setMessage(text: string): void {
  message.textContent = text;
}

function formatPrice(value: number): string {
  return `${value} ₽`;
}

function getElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`Не найден обязательный элемент: ${selector}`);
  }
  return element;
}
