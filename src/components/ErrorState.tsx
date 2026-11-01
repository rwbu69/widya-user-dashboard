interface ErrorStateProps {
  onRetry: () => void
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-red-800">Data pengguna gagal dimuat</h2>
      <p className="mt-1 text-sm text-red-700">
        Sepertinya ada masalah dengan koneksi atau server. Silakan coba lagi.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Coba lagi
      </button>
    </div>
  )
}