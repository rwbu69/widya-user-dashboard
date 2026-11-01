export function UserTableSkeleton() {
    return (
        <div
            role="status"
            aria-label="Memuat data pengguna"
            className="mt-8 animate-pulse space-y-6"
        >
            <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="h-3 w-24 rounded bg-neutral-200" />
                <div className="mt-3 h-9 w-16 rounded bg-neutral-200" />
                <div className="mt-2 h-4 w-40 rounded bg-neutral-200" />
            </div>

            <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
                <div className="border-b border-neutral-200 px-5 py-4">
                    <div className="h-5 w-36 rounded bg-neutral-200" />
                    <div className="mt-2 h-4 w-56 rounded bg-neutral-200" />
                </div>
                <div className="space-y-4 px-5 py-5">
                    {Array.from({ length: 4 }, (_, index) => (
                        <div
                            key={index}
                            className="grid gap-3 border-b border-neutral-100 pb-4 sm:grid-cols-3"
                        >
                            <div className="h-4 w-32 rounded bg-neutral-200" />
                            <div className="h-4 w-44 rounded bg-neutral-200" />
                            <div className="hidden h-4 w-28 rounded bg-neutral-200 sm:block" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
