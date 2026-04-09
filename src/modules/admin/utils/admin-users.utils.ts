import type { AdminUser } from '../types/user'
import {
  ADMIN_USER_ENABLED_FILTER,
  ADMIN_USER_STATUS,
  ADMIN_USER_STATUS_META,
  DEFAULT_ADMIN_USER_STATUS_BADGE_CLASS,
  DEFAULT_ADMIN_USER_STATUS_LABEL,
  type AdminUserStatus,
} from '../constants/admin-user.constants'

export function filterAdminUsers(
  users: AdminUser[],
  search: string,
  statusFilter: string,
  enabledFilter: string,
) {
  const normalizedSearch = search.trim().toLowerCase()

  return users.filter((user) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      (user.email ?? '').toLowerCase().includes(normalizedSearch) ||
      (user.name ?? '').toLowerCase().includes(normalizedSearch) ||
      (user.username ?? '').toLowerCase().includes(normalizedSearch)

    const matchesStatus =
      statusFilter === 'ALL' || (user.status ?? '') === statusFilter

    const matchesEnabled =
      enabledFilter === ADMIN_USER_ENABLED_FILTER.ALL ||
      (enabledFilter === ADMIN_USER_ENABLED_FILTER.ENABLED && user.enabled) ||
      (enabledFilter === ADMIN_USER_ENABLED_FILTER.DISABLED && !user.enabled)

    return matchesSearch && matchesStatus && matchesEnabled
  })
}

export function getAdminUsersStats(users: AdminUser[]) {
  return {
    totalUsers: users.length,
    enabledUsers: users.filter((user) => user.enabled).length,
    disabledUsers: users.filter((user) => !user.enabled).length,
    forceChangePasswordUsers: users.filter(
      (user) => user.status === ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD,
    ).length,
  }
}

export function getAdminUserStatusBadge(status?: string | null) {
  if (!status) return DEFAULT_ADMIN_USER_STATUS_BADGE_CLASS

  return (
    ADMIN_USER_STATUS_META[status as AdminUserStatus]?.badgeClassName ??
    DEFAULT_ADMIN_USER_STATUS_BADGE_CLASS
  )
}

export function getAdminUserStatusLabel(status?: string | null) {
  if (!status) return DEFAULT_ADMIN_USER_STATUS_LABEL

  return (
    ADMIN_USER_STATUS_META[status as AdminUserStatus]?.label ??
    DEFAULT_ADMIN_USER_STATUS_LABEL
  )
}

export function formatAdminUserDate(date?: string) {
  if (!date) return '-'

  return new Date(date).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
