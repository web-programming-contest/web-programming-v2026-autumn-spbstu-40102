import {ApiError} from "../types.ts";

const BASE_URL = 'http://localhost:8080/api/auth';

export async function checkCredentials(login: string, password: string): Promise<number> {
    const path = `/login`

    const response = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ login, password }),
    })

    if (!response.ok) {
        const data = await response.json()
        throw new ApiError(response.status, data.message)
    }

    return await response.json()
}