interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="w-full sm:max-w-sm">
      <label htmlFor="search" className="sr-only">
        Cari pengguna
      </label>
      <input
        id="search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Cari berdasarkan nama atau email..."
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      />
    </div>
  )
}