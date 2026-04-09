import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type EmptyStateCardProps = {
  icon: ReactNode
  title: string
  description: string
}

export default function EmptyStateCard({
  icon,
  title,
  description,
}: EmptyStateCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        {icon}
      </div>

      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </motion.div>
  )
}
