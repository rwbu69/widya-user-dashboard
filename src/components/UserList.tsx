import type { User } from '../types/user'
import { UserCard } from './UserCard'

interface UserListProps {
    users: User[]
    query: string
    onSelect: (user: User) => void
}

export function UserList({ users, query, onSelect }: UserListProps) {
    if (users.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                Tidak ada pengguna yang cocok dengan “{query}”.
            </p>
        )
    }

    return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
                <li key={user.id}>
                    <UserCard user={user} onSelect={onSelect} />
                </li>
            ))}
        </ul>
    )
}