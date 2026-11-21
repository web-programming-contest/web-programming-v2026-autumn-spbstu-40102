export interface OrderItem {
  name: string;
  price: number;
}

export interface SerializedOrder {
  orderId: number;
  items: OrderItem[];
  status: string;
}

export class Order {
  orderId: number;
  items: OrderItem[];
  status: string;

  constructor(orderId: number, items: OrderItem[] = [], status = 'new') {
    this.orderId = orderId;
    this.items = items.map((item) => ({name: item.name, price: item.price}));
    this.status = status;
  }

  addItem(item: OrderItem): void {
    this.items.push({name: item.name, price: item.price});
  }

  removeItem(name: string): void {
    this.items = this.items.filter((item) => item.name !== name);
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + item.price, 0);
  }
}

const TOTAL_RANGES = [
  {label: 'до 1000', min: 0, max: 1000},
  {label: 'от 1001 до 5000', min: 1001, max: 5000},
  {label: 'от 5001 до 10000', min: 5001, max: 10000},
  {label: 'от 10001', min: 10001, max: Number.POSITIVE_INFINITY},
];

export function groupOrdersByStatus(
  orders: readonly Order[],
): Record<string, Order[]> {
  const groups: Record<string, Order[]> = {};
  for (const order of orders) {
    (groups[order.status] ??= []).push(order);
  }
  return groups;
}

export function getUniqueItems(orders: readonly Order[]): OrderItem[] {
  const items = new Map<string, OrderItem>();
  for (const order of orders) {
    for (const item of order.items) {
      if (!items.has(item.name)) {
        items.set(item.name, {name: item.name, price: item.price});
      }
    }
  }
  return [...items.values()];
}

export function groupOrdersByTotal(
  orders: readonly Order[],
): Record<string, Order[]> {
  const groups: Record<string, Order[]> = {};
  for (const range of TOTAL_RANGES) {
    groups[range.label] = [];
  }
  for (const order of orders) {
    const total = order.getTotal();
    const range =
      TOTAL_RANGES.find((item) => total >= item.min && total <= item.max) ??
      TOTAL_RANGES.at(-1);
    if (range) {
      groups[range.label].push(order);
    }
  }
  return groups;
}

export function findOrdersByItem(
  orders: readonly Order[],
  itemName: string,
): Order[] {
  return orders.filter((order) =>
    order.items.some((item) => item.name === itemName),
  );
}

export function findOrdersByStatus(
  orders: readonly Order[],
  status: string,
): Order[] {
  return orders.filter((order) => order.status === status);
}
