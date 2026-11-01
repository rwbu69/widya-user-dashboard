import { memo } from 'react'
import type { User } from '../types/user'

interface UserTableProps {
    users: User[]
    onSelect: (user: User) => void
}

const UserRow = memo(function UserRow({ user, onSelect }: { user: User; onSelect: (user: User) => void }) {
    return (
        <tr onClick={() => onSelect(user)} className="cursor-pointer border-b border-neutral-200 hover:bg-neutral-50">
            <td className="py-3 pr-4">
                <button type="button" className="text-left font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900">
                    {user.name}
                </button>
            </td>
            <td className="py-3 pr-4 break-words text-neutral-600">{user.email}</td>
            <td className="hidden py-3 text-neutral-600 sm:table-cell">{user.company.name}</td>
        </tr>
    )
})

export function UserTable({ users, onSelect }: UserTableProps) {
    if (users.length === 0) {
        return <p className="mt-6 text-neutral-500">Tidak ada pengguna yang cocok.</p>
    }

    return (
        <table className="mt-4 w-full text-left text-sm">
            <thead>
                <tr className="border-b border-neutral-300 text-neutral-500">
                    <th className="py-2 pr-4 font-normal">Nama</th>
                    <th className="py-2 pr-4 font-normal">Email</th>
                    <th className="hidden py-2 font-normal sm:table-cell">Perusahaan</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <UserRow key={user.id} user={user} onSelect={onSelect} />
                ))}
            </tbody>
        </table>
    )
}