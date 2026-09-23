import {Order} from './model.js';

const storageKey = 'orders';
const form = document.querySelector('[data-testid="entity-form"]');
const list = document.querySelector('[data-testid="entity-list"]');

let orders = loadOrders();

function createInitialOrders() {
  return [
    new Order(101, [{name: 'Клавиатура', price: 3200}], 'new'),
    new Order(102, [{name: 'Мышь', price: 1500}], 'processing'),
  ];
}

function loadOrders() {
  const savedOrders = localStorage.getItem(storageKey);

  if (!savedOrders) {
    return createInitialOrders();
  }

  return JSON.parse(savedOrders).map(
    (order) => new Order(order.orderId, order.items, order.status),
  );
}

function saveOrders() {
  localStorage.setItem(storageKey, JSON.stringify(orders));
}

function runAsync(action) {
  return new Promise((resolve) => {
    setTimeout(() => {
      action();
      resolve();
    }, 200);
  });
}

function formatPrice(price) {
  return `${Number(price).toLocaleString('ru-RU')} ₽`;
}

function renderOrders() {
  list.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card" data-testid="entity-card" data-order-id="${order.orderId}">
          <div class="order-head">
            <h2>Заказ ${order.orderId}</h2>
            <button type="button" data-testid="delete-entity" data-action="delete-order">Удалить заказ</button>
          </div>
          <div class="order-fields">
            <label>
              ID заказа
              <input type="number" value="${order.orderId}" disabled />
            </label>
            <label>
              Статус
              <select data-action="change-status">
                <option value="new" ${order.status === 'new' ? 'selected' : ''}>Новый</option>
                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>В обработке</option>
                <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Выполнен</option>
              </select>
            </label>
          </div>
          <h3>Товары</h3>
          <ul class="item-list">
            ${order.items
              .map(
                (item) => `
                  <li>
                    <span>${item.name} — ${formatPrice(item.price)}</span>
                    <button type="button" data-action="delete-item" data-name="${item.name}">Удалить</button>
                  </li>
                `,
              )
              .join('')}
          </ul>
          <p class="total">Общая сумма: ${formatPrice(order.getTotal())}</p>
          <div class="item-form">
            <label>
              Название
              <input data-field="item-name" type="text" />
            </label>
            <label>
              Цена
              <input data-field="item-price" type="number" min="0" step="1" />
            </label>
            <button type="button" data-action="add-item">Добавить товар</button>
          </div>
        </article>
      `,
    )
    .join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const orderId = Number(data.get('orderId'));
  const status = data.get('status');

  if (orders.some((order) => order.orderId === orderId)) {
    return;
  }

  await runAsync(() => {
    orders.push(new Order(orderId, [], status));
    saveOrders();
    renderOrders();
    form.reset();
  });
});

list.addEventListener('change', (event) => {
  const card = event.target.closest('[data-order-id]');

  if (!card || event.target.dataset.action !== 'change-status') {
    return;
  }

  const order = orders.find(
    (item) => item.orderId === Number(card.dataset.orderId),
  );
  order.status = event.target.value;
  saveOrders();
  renderOrders();
});

list.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-action]');

  if (!button) {
    return;
  }

  const card = button.closest('[data-order-id]');
  const orderId = Number(card.dataset.orderId);

  if (button.dataset.action === 'delete-order') {
    await runAsync(() => {
      orders = orders.filter((order) => order.orderId !== orderId);
      saveOrders();
      renderOrders();
    });
  }

  if (button.dataset.action === 'add-item') {
    const name = card.querySelector('[data-field="item-name"]').value.trim();
    const price = Number(card.querySelector('[data-field="item-price"]').value);

    if (!name || Number.isNaN(price)) {
      return;
    }

    await runAsync(() => {
      const order = orders.find((item) => item.orderId === orderId);
      order.addItem({name, price});
      saveOrders();
      renderOrders();
    });
  }

  if (button.dataset.action === 'delete-item') {
    await runAsync(() => {
      const order = orders.find((item) => item.orderId === orderId);
      order.removeItem(button.dataset.name);
      saveOrders();
      renderOrders();
    });
  }
});

renderOrders();
