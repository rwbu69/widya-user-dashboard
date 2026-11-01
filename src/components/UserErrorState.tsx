interface UserErrorStateProps {
    onRetry: () => void
}

export function UserErrorState({ onRetry }: UserErrorStateProps) {
    return (
        <div role="alert" className="mt-8 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
            <p>Data gagal dimuat. Periksa koneksi internet, lalu coba lagi.</p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-md border border-neutral-300 px-3 py-2 text-sm underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
            >
                Coba lagi
            </button>
        </div>
    )
}
