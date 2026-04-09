import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

type FilterOption = {
  label: string
  value: string
}

type FilterSelectProps = {
  value: string
  onChange: (value: string) => void
  options: readonly FilterOption[]
}

export default function FilterSelect({
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative min-w-47.5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 w-full items-center justify-between rounded-xl border px-3 text-sm text-slate-700 shadow-sm transition ${
          open
            ? 'border-violet-400 bg-white ring-4 ring-violet-100'
            : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
        }`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {options.map((option) => {
              const isSelected = option.value === value

              return (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                      isSelected
                        ? 'bg-violet-50 text-violet-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{option.label}</span>

                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
