import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type FiltersCardProps = {
  children: ReactNode
}

export default function FiltersCard({ children }: FiltersCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {children}
      </div>
    </motion.div>
  )
}
