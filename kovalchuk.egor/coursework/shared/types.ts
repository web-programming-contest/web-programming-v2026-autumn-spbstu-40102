export interface Good {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  rating: number;
  isNew: boolean;
  isHit: boolean;
  releasedAt: string;
  popularity: number;
  description: string;
  specifications: Record<string, string>;
}
export interface User {
  id: string;
  username: string;
}
export interface CartItem {
  id: number;
  quantity: number;
}
export interface Customer {
  phone: string;
  email: string;
  delivery: 'pickup' | 'delivery';
  address: string;
  payment: 'card' | 'cash';
  packaging: boolean;
}
export interface OrderItem extends CartItem {
  name: string;
  price: number;
}
export interface NewOrder {
  requestId: string;
  userId: string;
  items: OrderItem[];
  customer: Customer;
  total: number;
  quantity: number;
}
export interface Order extends NewOrder {
  id: number;
  createdAt: string;
}
export type FieldErrors = Record<string, string>;
