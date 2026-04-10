import type { ReactNode } from 'react'

type FiltersCardProps = {
  children: ReactNode
}

export default function FiltersCard({ children }: FiltersCardProps) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      {children}
    </div>
  )
}
