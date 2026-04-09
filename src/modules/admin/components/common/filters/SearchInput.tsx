import { Search } from 'lucide-react'

type SearchInputProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export default function SearchInput({
  value,
  placeholder = 'Buscar...',
  onChange,
}: SearchInputProps) {
  return (
    <div className="relative w-full lg:max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </div>
  )
}
