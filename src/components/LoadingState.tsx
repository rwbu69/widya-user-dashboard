export function LoadingState() {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Memuat data pengguna...</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex animate-pulse items-center gap-4 rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="size-12 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}