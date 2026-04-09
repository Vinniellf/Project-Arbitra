import { useState } from 'react'
import { Users, RefreshCw } from 'lucide-react'

import PageHeader from '../components/common/layout/PageHeader'
import PageErrorState from '../components/common/feedback/PageErrorState'
import StatsSkeleton from '../components/common/stats/StatsSkeleton'
import CardsSkeleton from '../components/common/listing/CardsSkeleton'

import UserStats from '../components/ui/users/UserStats'
import UserFilters from '../components/ui/users/UserFilters'
import UsersGrid from '../components/ui/users/UsersGrid'
import UsersEmptyState from '../components/ui/users/UsersEmptyState'
import InviteUserButton from '../components/ui/users/InviteUserButton'

import { useAdminUsers } from '../hooks/useAdminUsers'
import { useAdminUserFilters } from '../hooks/useAdminUserFilters'
import type { AdminUser } from '../types/user'
import {
  formatAdminUserDate,
  getAdminUserStatusBadge,
  getAdminUserStatusLabel,
} from '../utils/admin-users.utils'

export default function UsuariosView() {
  const { users, loading, error, reloadUsers } = useAdminUsers()
  const [loadingUsername, setLoadingUsername] = useState<string | null>(null)

  const {
    search,
    statusFilter,
    enabledFilter,
    filteredUsers,
    setSearch,
    setStatusFilter,
    setEnabledFilter,
  } = useAdminUserFilters(users)

  const handleToggleEnabled = async (user: AdminUser) => {
    try {
      setLoadingUsername(user.username ?? null)

      // TODO:
      // Aquí conecta tu servicio real:
      // await toggleAdminUserEnabled(user.username!, user.enabled)

      console.log('Cambiar estado del usuario:', {
        username: user.username,
        enabled: user.enabled,
      })

      await reloadUsers()
    } catch (toggleError) {
      console.error('Error al cambiar estado del usuario:', toggleError)
    } finally {
      setLoadingUsername(null)
    }
  }

  const headerIcon = loading ? (
    <RefreshCw className="h-7 w-7 animate-spin text-white" />
  ) : (
    <Users className="h-7 w-7 text-white" />
  )

  return (
    <div className="min-h-full bg-slate-50 p-2">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader
          title="Usuarios"
          subtitle="Gestión y visualización de usuarios registrados"
          icon={headerIcon}
          actions={<InviteUserButton onUserInvited={reloadUsers} />}
        />

        {error ? (
          <PageErrorState title="Error al cargar usuarios" message={error} />
        ) : (
          <>
            {loading ? (
              <>
                <StatsSkeleton />
                <CardsSkeleton />
              </>
            ) : (
              <>
                <UserStats users={users} />

                <UserFilters
                  search={search}
                  statusFilter={statusFilter}
                  enabledFilter={enabledFilter}
                  resultsCount={filteredUsers.length}
                  onSearchChange={setSearch}
                  onStatusFilterChange={setStatusFilter}
                  onEnabledFilterChange={setEnabledFilter}
                />

                {filteredUsers.length === 0 ? (
                  <UsersEmptyState />
                ) : (
                  <UsersGrid
                    users={filteredUsers}
                    formatDate={formatAdminUserDate}
                    getStatusBadge={getAdminUserStatusBadge}
                    getStatusLabel={getAdminUserStatusLabel}
                    onToggleEnabled={handleToggleEnabled}
                    loadingUsername={loadingUsername}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
