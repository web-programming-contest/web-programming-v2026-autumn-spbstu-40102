import type {NewOrder} from "../../../dtos/NewOrder.ts";
import type {OrderSummary} from "../../../dtos/OrderSummary.ts";

const BASE_URL = 'http://localhost:8080/api/orders';

export async function postNewOrder(newOrder: NewOrder): Promise<number> {
    const path = `/new`

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(newOrder),
    })

    if (!response.ok) {
        throw new Error(`Failed to post order: ${response.status}`)
    }

    return await response.json();
}

export async function  getClientsOrders(clientId: number): Promise<OrderSummary[]> {
    const path = `/${clientId}`

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json'},
    })

    if (!response.ok) {
        throw new Error(`Failed to post order: ${response.status}`)
    }

    return await response.json();
}