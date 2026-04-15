import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle?: string
  icon?: ReactNode
  badge?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({
  title,
  subtitle,
  icon,
  badge,
  actions,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="relative p-4 md:p-5">
        <div className="absolute inset-0 bg-linear-to-r from-violet-50 via-fuchsia-50 to-white opacity-80" />

        <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-md shadow-violet-200">
                {icon}
              </div>
            )}

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                {title}
              </h1>

              {subtitle && (
                <p className="mt-0.5 text-sm text-slate-600">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {actions}

            {badge && (
              <div className="rounded-xl border border-violet-100 bg-white/80 px-3 py-2 backdrop-blur">
                {badge}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
