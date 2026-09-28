import type {Product} from "./Product.ts";

export type CartItem = {
    product: Product,
    quantity: number
}