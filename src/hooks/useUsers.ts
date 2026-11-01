import { useEffect, useState } from 'react'
import { fetchUsers } from '../services/userApi'
import type { User } from '../types/user'

type Status = 'loading' | 'success' | 'error'

export function useUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [status, setStatus] = useState<Status>('loading')
    const [attempt, setAttempt] = useState(0)

    useEffect(() => {
        const controller = new AbortController()

        fetchUsers(controller.signal)
            .then((data) => {
                setUsers(data)
                setStatus('success')
            })
            .catch((error: unknown) => {
                if (error instanceof DOMException && error.name === 'AbortError')
                    return setStatus('error')
            })
        return () => controller.abort()
    }, [attempt])

    function retry() {
        setStatus('loading')
        setAttempt((current) => current + 1)
    }

    return { users, status, retry }
}