import { useDeferredValue, useMemo, useState } from 'react'
import { ErrorState } from './components/ErrorState'
import { LoadingState } from './components/LoadingState'
import { SearchInput } from './components/SearchInput'
import { UserList } from './components/UserList'
import { UserModal } from './components/UserModal'
import { useUsers } from './hooks/useUsers'
import type { User } from './types/user'

export default function App() {
  const { users, status, retry } = useUsers()
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const deferredQuery = useDeferredValue(query)
  const isFiltering = query !== deferredQuery

  const filteredUsers = useMemo(() => {
    const keyword = deferredQuery.trim().toLowerCase()
    if (!keyword) return users

    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword),
    )
  }, [users, deferredQuery])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            {status === 'success' && (
              <p className="mt-1 text-sm text-slate-500">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </p>
            )}
          </div>
          <SearchInput value={query} onChange={setQuery} />
        </header>

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState onRetry={retry} />}
        {status === 'success' && (
          <div className={isFiltering ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <UserList users={filteredUsers} query={deferredQuery} onSelect={setSelectedUser} />
          </div>
        )}
      </main>

      {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  )
}