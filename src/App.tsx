import { useDeferredValue, useMemo, useState } from 'react'
import { UserErrorState } from './components/UserErrorState'
import { UserModal } from './components/UserModal'
import { UserSummary } from './components/UserSummary'
import { UserTable } from './components/UserTable'
import { UserTableSkeleton } from './components/UserTableSkeleton'
import { useUsers } from './hooks/useUsers'
import type { User } from './types/user'

export default function App() {
  const { users, status, retry } = useUsers()
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const deferredQuery = useDeferredValue(query)

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
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <p className="text-sm font-semibold tracking-wide">USER DASHBOARD</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">Overview</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Pengguna</h1>
          </div>

          <label className="w-full text-sm sm:max-w-xs">
            <span className="sr-only">Cari pengguna</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              aria-label="Cari pengguna"
              placeholder="Cari nama atau email"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            />
          </label>
        </div>

        {status === 'success' && (
          <UserSummary totalUsers={users.length} visibleUsers={filteredUsers.length} />
        )}

        {status === 'loading' && <UserTableSkeleton />}

        {status === 'error' && <UserErrorState onRetry={retry} />}

        {status === 'success' && (
          <section className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col gap-1 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-medium">Daftar pengguna</h2>
                <p className="text-sm text-neutral-500">Pilih pengguna untuk melihat detail.</p>
              </div>
              <p className="text-sm text-neutral-500">
                {filteredUsers.length} dari {users.length}
              </p>
            </div>
            <div className="overflow-x-auto px-5 pb-2">
              <UserTable users={filteredUsers} onSelect={setSelectedUser} />
            </div>
          </section>
        )}

        {selectedUser && <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </main>
    </div>
  )
}