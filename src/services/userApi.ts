import type { User } from '../types/user'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

export async function fetchUsers(signal?: AbortSignal): Promise<User[]> {
    const response = await fetch(API_URL, { signal })

    if (!response.ok) {
        throw new Error('Request gagal dengan status: ' + response.status)
    }
    return response.json()
}