interface UserSummaryProps {
    totalUsers: number
    visibleUsers: number
}

export function UserSummary({ totalUsers, visibleUsers }: UserSummaryProps) {
    return (
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">Total pengguna</p>
            <p className="mt-2 text-3xl font-semibold">{totalUsers}</p>
            <p className="mt-1 text-sm text-neutral-500">
                Menampilkan {visibleUsers} pengguna
            </p>
        </div>
    )
}
