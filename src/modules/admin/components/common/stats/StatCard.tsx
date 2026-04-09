import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: number | string
  icon: ReactNode
  valueClassName?: string
  iconWrapperClassName?: string
  delay?: number
}

export default function StatCard({
  label,
  value,
  icon,
  valueClassName = 'text-slate-900',
  iconWrapperClassName = 'bg-violet-100',
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className={`mt-2 text-3xl font-bold ${valueClassName}`}>{value}</p>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconWrapperClassName}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
