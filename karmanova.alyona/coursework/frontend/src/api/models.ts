import { API_ORIGIN } from "./client";
export type Product = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  type: string;
  color: string;
  rating: number;
  isNew: boolean;
  isHit: boolean;
  description: string;
  characteristics: { name: string; value: string }[];
};
export type CartCalculation = {
  items: { product: Product; quantity: number; totalPrice: number }[];
  totalQuantity: number;
  totalPrice: number;
};
export type OrderSummary = {
  number: number;
  createdAt: string;
  totalQuantity: number;
  totalPrice: number;
};
export const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";
export const imageUrl = (path: string) => API_ORIGIN + path;
export function units(quantity: number): string {
  const lastTwo = quantity % 100;
  const last = quantity % 10;
  let word = "товаров";
  if (lastTwo < 11 || lastTwo > 14) {
    if (last === 1) word = "товар";
    else if (last >= 2 && last <= 4) word = "товара";
  }
  return `${quantity} ${word}`;
}
