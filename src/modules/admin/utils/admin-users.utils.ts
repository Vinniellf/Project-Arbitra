import type { AdminUser } from '../types/admin-user'
import {
  ADMIN_USER_ENABLED_FILTER,
  ADMIN_USER_STATUS,
  ADMIN_USER_STATUS_META,
  DEFAULT_ADMIN_USER_STATUS_BADGE_CLASS,
  DEFAULT_ADMIN_USER_STATUS_LABEL,
  type AdminUserEnabledFilter,
  type AdminUserStatus,
} from '../constants/admin-user.constants'

export function filterAdminUsers(
  users: AdminUser[],
  search: string,
  statusFilter: string,
  enabledFilter: AdminUserEnabledFilter
) {
  const normalizedSearch = search.trim().toLowerCase()

  return users.filter((user) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      (user.email ?? '').toLowerCase().includes(normalizedSearch) ||
      (user.name ?? '').toLowerCase().includes(normalizedSearch) ||
      user.username.toLowerCase().includes(normalizedSearch)

    if (!matchesSearch) return false

    const matchesStatus =
      statusFilter === 'ALL' || (user.status ?? '') === statusFilter

    if (!matchesStatus) return false

    if (enabledFilter === ADMIN_USER_ENABLED_FILTER.ALL) return true
    if (enabledFilter === ADMIN_USER_ENABLED_FILTER.ENABLED) return user.enabled
    if (enabledFilter === ADMIN_USER_ENABLED_FILTER.DISABLED) return !user.enabled

    return true
  })
}

export function getAdminUsersStats(users: AdminUser[]) {
  return {
    totalUsers: users.length,
    enabledUsers: users.filter(
      (u) =>
        u.enabled === true &&
        u.status !== ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD
    ).length,
    disabledUsers: users.filter(
      (u) =>
        u.enabled === false &&
        u.status !== ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD
    ).length,
    forceChangePasswordUsers: users.filter(
      (u) => u.status === ADMIN_USER_STATUS.FORCE_CHANGE_PASSWORD
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

export function formatAdminUserDate(date?: string | null) {
  if (!date) return '-'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return parsed.toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
