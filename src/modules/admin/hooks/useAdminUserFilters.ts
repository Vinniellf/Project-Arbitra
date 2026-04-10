import { useMemo, useState } from 'react'
import type { AdminUser } from '../types/user'
import { filterAdminUsers } from '../utils/admin-users.utils'
import {
  ADMIN_USER_ENABLED_FILTER,
  type AdminUserEnabledFilter,
} from '../constants/admin-user.constants'

export function useAdminUserFilters(users: AdminUser[]) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [enabledFilter, setEnabledFilter] = useState<AdminUserEnabledFilter>(
    ADMIN_USER_ENABLED_FILTER.ENABLED
  )

  const filteredUsers = useMemo(() => {
    return filterAdminUsers(users, search, statusFilter, enabledFilter)
  }, [users, search, statusFilter, enabledFilter])

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('ALL')
    setEnabledFilter(ADMIN_USER_ENABLED_FILTER.ENABLED)
  }

  return {
    search,
    statusFilter,
    enabledFilter,
    filteredUsers,
    setSearch,
    setStatusFilter,
    setEnabledFilter,
    resetFilters,
  }
}
