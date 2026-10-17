import type {Product} from "../../../../../dtos/Product.ts";

export function sortNew(products: Product[]): Product[] {
    return [...products].sort((a, b) => Number(b.labels.includes("new")) - Number(a.labels.includes("new")))
}

export function sortBestseller(products: Product[]): Product[] {
    return [...products].sort((a, b) => Number(b.labels.includes("bestseller")) - Number(a.labels.includes("bestseller")))
}

export function sortAsc(products: Product[]): Product[] {
    return [...products].sort((a, b) => a.price - b.price)
}

export function sortDesc(products: Product[]): Product[] {
    return [...products].sort((a, b) => b.price - a.price)
}