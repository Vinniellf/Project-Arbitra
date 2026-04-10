import { motion } from 'framer-motion'
import {
  Mail,
  UserRound,
  CalendarDays,
  Power,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

import TableContainer from '../../common/table/TableContainer'
import TableHead from '../../common/table/TableHead'
import TableEmptyState from '../../common/table/TableEmptyState'
import TableSkeleton from '../../common/table/TableSkeleton'

import type { AdminUser } from '../../../types/user'

type UserTableVariant = 'enabled' | 'disabled'

type UserTableProps = {
  users: AdminUser[]
  loading?: boolean
  variant: UserTableVariant
  formatDate: (date?: string) => string
  getStatusBadge: (status?: string) => string
  getStatusLabel: (status?: string) => string
  onToggleEnabled: (user: AdminUser) => void
  actionLoadingUserId?: string | null
}

export default function UserTable({
  users,
  loading = false,
  variant,
  formatDate,
  getStatusBadge,
  getStatusLabel,
  onToggleEnabled,
  actionLoadingUserId = null,
}: UserTableProps) {
  const columns = [
    { key: 'user', label: 'Usuario' },
    { key: 'status', label: 'Estado Cognito' },
    { key: 'created', label: 'Creado' },
    { key: 'action', label: 'Acceso', align: 'right' as const },
  ]

  const isEnabledVariant = variant === 'enabled'

  const emptyMessage = isEnabledVariant
    ? 'No hay usuarios habilitados.'
    : 'No hay usuarios deshabilitados.'

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <TableContainer>
        <table className="min-w-full divide-y divide-slate-200">
          <TableHead columns={columns} />

          {loading ? (
            <TableSkeleton rows={5} columns={columns.length} />
          ) : users.length === 0 ? (
            <TableEmptyState colSpan={columns.length} message={emptyMessage} />
          ) : (
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.map((user) => {
                const userKey = user.email ?? user.username ?? ''
                const isEnabled = Boolean(user.enabled)
                const rowLoading = actionLoadingUserId === userKey

                return (
                  <tr
                    key={userKey}
                    className="group transition hover:bg-slate-50/70"
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100">
                          <UserRound className="h-4.5 w-4.5 text-violet-600" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {user.name || 'Sin nombre'}
                          </p>

                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{user.email ?? '-'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-2">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Estado
                        </span>

                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-semibold ${getStatusBadge(
                            user.status ?? undefined
                          )}`}
                        >
                          {getStatusLabel(user.status ?? undefined)}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-2">
                        <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          Creado
                        </span>

                        <span className="text-[11px] font-medium text-slate-800">
                          {formatDate(user.createdAt ?? undefined)}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-3 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[11px] font-medium ${
                            isEnabled ? 'text-emerald-700' : 'text-slate-500'
                          }`}
                        >
                          {isEnabled ? 'Activo' : 'Suspendido'}
                        </span>

                        <button
                          type="button"
                          onClick={() => onToggleEnabled(user)}
                          disabled={rowLoading}
                          className={`inline-flex min-w-29.5 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            isEnabled
                              ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {rowLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Procesando...
                            </>
                          ) : (
                            <>
                              <Power className="h-3.5 w-3.5" />
                              {isEnabled ? 'Suspender' : 'Activar'}
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          )}
        </table>
      </TableContainer>
    </motion.div>
  )
}
