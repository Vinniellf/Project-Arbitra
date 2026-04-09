import type { ReactNode } from 'react'

type EntityGridProps = {
  children: ReactNode
}

export default function EntityGrid({ children }: EntityGridProps) {
  return <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{children}</div>
}
