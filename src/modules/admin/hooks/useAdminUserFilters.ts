import { useMemo, useState } from 'react'
import type { AdminUser } from '../types/user'
import { filterAdminUsers } from '../utils/admin-users.utils'
import {
  ADMIN_USER_ENABLED_FILTER,
  type AdminUserEnabledFilter,
} from '../constants/admin-user.constants'

export function useAdminUserFilters(users: AdminUser[]) {
  const [search, setSearch] = useState('')
  const [enabledFilter, setEnabledFilter] = useState<AdminUserEnabledFilter>(
    ADMIN_USER_ENABLED_FILTER.ENABLED
  )

  const filteredUsers = useMemo(() => {
    return filterAdminUsers(users, search, enabledFilter)
  }, [users, search, enabledFilter])

  const resetFilters = () => {
    setSearch('')
    setEnabledFilter(ADMIN_USER_ENABLED_FILTER.ENABLED)
  }

  return {
    search,
    enabledFilter,
    filteredUsers,
    setSearch,
    setEnabledFilter,
    resetFilters,
  }
}
