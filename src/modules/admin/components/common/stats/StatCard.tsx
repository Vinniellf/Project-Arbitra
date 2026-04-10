import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: number | string
  icon: ReactNode
  valueClassName?: string
  iconWrapperClassName?: string
}

export default function StatCard({
  label,
  value,
  icon,
  valueClassName = 'text-slate-900',
  iconWrapperClassName = 'bg-violet-100',
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm min-h-22">
      <div className="flex items-center justify-between gap-3">
        
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>

          <p
            className={`mt-1 text-xl sm:text-2xl font-bold leading-none ${valueClassName}`}
          >
            {value}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl ${iconWrapperClassName}`}
        >
          {icon}
        </div>

      </div>
    </div>
  )
}
