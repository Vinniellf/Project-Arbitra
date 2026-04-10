import { motion } from 'framer-motion'
import {
  Mail,
  Shield,
  UserRound,
  CalendarDays,
  Power,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import type { AdminUser } from '../../../types/user'

type Variant = 'enabled' | 'disabled'

type UserCardProps = {
  user: AdminUser
  index: number
  variant: Variant
  formatDate: (date?: string) => string
  getStatusBadge: (status?: string) => string
  getStatusLabel: (status?: string) => string
  onToggleEnabled: (user: AdminUser) => void
  actionLoading?: boolean
}

export default function UserCard({
  user,
  index,
  variant,
  formatDate,
  getStatusBadge,
  getStatusLabel,
  onToggleEnabled,
  actionLoading = false,
}: UserCardProps) {
  const isEnabled = Boolean(user.enabled)

  const borderColor =
    variant === 'enabled'
      ? 'hover:border-emerald-200'
      : 'hover:border-red-200'

  const badgeColor = isEnabled
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-red-100 text-red-700'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025 }}
      whileHover={{ y: -2 }}
      className={`group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition ${borderColor} hover:shadow-md`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
            <UserRound className="h-5 w-5 text-violet-600" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900">
              {user.name || 'Sin nombre'}
            </h2>

            <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{user.email ?? '-'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-violet-50 p-1.5">
          <Shield className="h-4 w-4 text-violet-600" />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5" />
            Estado en Cognito
          </span>

          <span
            className={`rounded-md px-2 py-1 text-[11px] font-semibold ${getStatusBadge(
              user.status ?? undefined
            )}`}
          >
            {getStatusLabel(user.status ?? undefined)}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
          <span className="flex items-center gap-1.5 text-xs text-slate-500">
            <CalendarDays className="h-3.5 w-3.5" />
            Creado
          </span>

          <span className="max-w-[62%] text-right text-xs font-medium text-slate-800">
            {formatDate(user.createdAt ?? undefined)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
        <span
          className={`rounded-md px-2 py-1 text-[11px] font-semibold ${badgeColor}`}
        >
          {isEnabled ? 'Activo' : 'Suspendido'}
        </span>

        <button
          type="button"
          onClick={() => onToggleEnabled(user)}
          disabled={actionLoading}
          className={`relative inline-flex min-w-29.5 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
            actionLoading
              ? 'scale-[0.98] shadow-inner'
              : 'hover:scale-[1.02]'
          } ${
            isEnabled
              ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          {actionLoading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1.5"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Procesando...
            </motion.span>
          ) : (
            <>
              <Power className="h-3.5 w-3.5" />
              {isEnabled ? 'Suspender' : 'Activar'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}
