import { useMemo, useState } from 'react'
import type { AdminUser } from '../types/user'
import { filterAdminUsers } from '../utils/admin-users.utils'

export function useAdminUserFilters(users: AdminUser[]) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [enabledFilter, setEnabledFilter] = useState('ALL')

  const filteredUsers = useMemo(() => {
    return filterAdminUsers(users, search, statusFilter, enabledFilter)
  }, [users, search, statusFilter, enabledFilter])

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('ALL')
    setEnabledFilter('ALL')
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
