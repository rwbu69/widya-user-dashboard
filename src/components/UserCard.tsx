import { memo } from 'react'
import type { User } from '../types/user'
import { getInitials } from '../utils/getInitials'

interface UserCardProps {
    user: User
    onSelect: (user: User) => void
}

export const UserCard = memo(function UserCard({ user, onSelect }: UserCardProps) {
    return (
        <button
            type="button"
            onClick={() => onSelect(user)}
            className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
            <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700"
            >
                {getInitials(user.name)}
            </span>
            <span className="min-w-0">
                <span className="block truncate font-semibold text-slate-900">{user.name}</span>
                <span className="block truncate text-sm text-slate-500">{user.email}</span>
                <span className="block truncate text-xs text-slate-400">{user.company.name}</span>
            </span>
        </button>
    )
})