export class Order {
  constructor(orderId, items = [], status) {
    this.orderId = orderId;
    this.items = [...items];
    this.status = status;
  }

  addItem(item) {
    this.items.push(item);
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
  }

  getTotal() {
    return this.items.reduce((total, item) => total + Number(item.price), 0);
  }
}

export function groupOrdersByStatus(orders) {
  return orders.reduce((groups, order) => {
    const status = order.status;
    groups[status] ??= [];
    groups[status].push(order);
    return groups;
  }, {});
}

export function getUniqueItems(orders) {
  return [
    ...new Set(orders.flatMap((order) => order.items.map((item) => item.name))),
  ];
}

export function groupOrdersByTotal(orders) {
  return orders.reduce((groups, order) => {
    const total = order.getTotal();
    const range =
      total <= 1000
        ? 'до 1000'
        : total <= 5000
          ? 'от 1001 до 5000'
          : 'свыше 5000';
    groups[range] ??= [];
    groups[range].push(order);
    return groups;
  }, {});
}

export function findOrdersByItem(orders, name) {
  return orders.filter((order) =>
    order.items.some((item) => item.name === name),
  );
}

export function findOrdersByStatus(orders, status) {
  return orders.filter((order) => order.status === status);
}
