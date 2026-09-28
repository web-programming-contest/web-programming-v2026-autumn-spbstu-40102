import type {Product} from "../../../dtos/Product.ts";

const BASE_URL = 'http://localhost:8080/api';

export async function getAllProductsRequest(): Promise<Product[]> {
    const path = `/products`

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`)
    }

    return await response.json();
}

export async function getMaxPrice(): Promise<number> {
    const path = `/products/max-price`

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
    })

    if (!response.ok) {
        throw new Error(`Failed to fetch maxPrice: ${response.status}`)
    }

    return await response.json();
}