import { motion } from 'framer-motion'
import {
  Mail,
  UserRound,
  CalendarDays,
  Power,
  Loader2,
  ShieldCheck,
} from 'lucide-react'

import TableContainer from '../common/table/TableContainer'
import TableHead from '../common/table/TableHead'
import TableEmptyState from '../common/table/TableEmptyState'
import TableSkeleton from '../common/table/TableSkeleton'

import type { AdminUser } from '../../types/admin-user'

type UserTableVariant = 'enabled' | 'disabled'

type UserTableProps = {
  users: AdminUser[]
  loading?: boolean
  variant: UserTableVariant
  formatDate: (date?: string | null) => string
  getStatusBadge: (status?: string | null) => string
  getStatusLabel: (status?: string | null) => string
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
    { key: 'status', label: 'Estado de cuenta' },
    { key: 'created', label: 'Creado' },
    { key: 'action', label: 'Acceso', align: 'right' as const },
  ]

  const isEnabledVariant = variant === 'enabled'

  const emptyMessage = isEnabledVariant
    ? 'No hay usuarios habilitados.'
    : 'No hay usuarios deshabilitados.'

  return (
    <TableContainer>
      <table className="min-w-full divide-y divide-slate-200">
        <TableHead columns={columns} />

        {loading ? (
          <TableSkeleton rows={5} columns={columns.length} />
        ) : users.length === 0 ? (
          <TableEmptyState colSpan={columns.length} message={emptyMessage} />
        ) : (
          <motion.tbody
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.04,
                },
              },
            }}
            className="divide-y divide-slate-100 bg-white"
          >
            {users.map((user) => {
              const userKey = user.username
              const isEnabled = user.enabled
              const rowLoading = actionLoadingUserId === userKey

              return (
                <motion.tr
                  key={userKey}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.22 }}
                  whileHover={{ y: -1 }}
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

                      <motion.span
                        layout
                        className={`rounded-md px-2 py-1 text-[10px] font-semibold ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {getStatusLabel(user.status)}
                      </motion.span>
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex items-center justify-between gap-2 rounded-md bg-slate-50 px-2.5 py-2">
                      <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Creado
                      </span>

                      <span className="text-[11px] font-medium text-slate-800">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </td>

                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end gap-1">
                      <motion.span
                        layout
                        className={`text-[11px] font-medium ${
                          isEnabled ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {isEnabled ? 'Activo' : 'Suspendido'}
                      </motion.span>

                      <motion.button
                        type="button"
                        onClick={() => onToggleEnabled(user)}
                        disabled={rowLoading}
                        whileTap={rowLoading ? undefined : { scale: 0.97 }}
                        whileHover={rowLoading ? undefined : { scale: 1.02 }}
                        className={`relative inline-flex min-w-29.5 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
                          rowLoading
                            ? 'scale-[0.98] shadow-inner'
                            : 'hover:shadow-sm'
                        } ${
                          isEnabled
                            ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {rowLoading ? (
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
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )
            })}
          </motion.tbody>
        )}
      </table>
    </TableContainer>
  )
}
