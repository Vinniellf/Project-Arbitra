import { useState } from 'react'
import { Users, RefreshCw } from 'lucide-react'

import PageHeader from '../components/layout/PageHeader'
import PageErrorState from '../components/common/feedback/PageErrorState'
import StatsSkeleton from '../components/common/stats/StatsSkeleton'
import CardsSkeleton from '../components/common/listing/CardsSkeleton'
import TableContainer from '../components/common/table/TableContainer'
import TableHead from '../components/common/table/TableHead'
import TableSkeleton from '../components/common/table/TableSkeleton'

import UserStats from '../components/users/UserStats'
import UserFilters from '../components/users/UserFilters'
import UsersGrid from '../components/users/UsersGrid'
import UsersEmptyState from '../components/users/UsersEmptyState'
import InviteUserButton from '../components/users/InviteUserButton'
import UserTable from '../components/users/UserTable'

import { useAdminSystemUsers } from '../hooks/users/useAdminUsers'
import { useAdminUserFilters } from '../hooks/users/useAdminUserFilters'
import { useDisableAdminUser } from '../hooks/users/useDisableAdminUser'
import { useEnableAdminUser } from '../hooks/users/useEnableAdminUser'
import type { AdminUser } from '../types/admin-user'
import {
  formatAdminUserDate,
  getAdminUserStatusBadge,
  getAdminUserStatusLabel,
} from '../utils/admin-users.utils'
import { ADMIN_USER_ENABLED_FILTER } from '../constants/admin-user.constants'

type ViewMode = 'cards' | 'table'

export default function UsuariosView() {
  const { users, loading, error, reloadUsers } = useAdminSystemUsers()
  const { disableUser } = useDisableAdminUser()
  const { enableUser } = useEnableAdminUser()

  const [actionLoadingUserId, setActionLoadingUserId] = useState<string | null>(
    null,
  )
  const [viewMode, setViewMode] = useState<ViewMode>('table')

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
    const username = user.username?.trim()

    if (!username) return

    try {
      setActionLoadingUserId(username)

      if (user.enabled) {
        await disableUser(username)
      } else {
        await enableUser(username)
      }

      await reloadUsers()
    } catch (toggleError) {
      console.error('Error al cambiar estado del usuario:', toggleError)
    } finally {
      setActionLoadingUserId(null)
    }
  }

  const handleRefresh = async () => {
    if (loading) return
    await reloadUsers()
  }

  const headerIcon = loading ? (
    <RefreshCw className="h-7 w-7 animate-spin text-white" />
  ) : (
    <Users className="h-7 w-7 text-white" />
  )

  const currentTableVariant =
    enabledFilter === ADMIN_USER_ENABLED_FILTER.DISABLED
      ? 'disabled'
      : 'enabled'

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
            <UserFilters
              search={search}
              statusFilter={statusFilter}
              enabledFilter={enabledFilter}
              resultsCount={loading ? 0 : filteredUsers.length}
              loading={loading}
              viewMode={viewMode}
              onSearchChange={setSearch}
              onStatusFilterChange={setStatusFilter}
              onEnabledFilterChange={setEnabledFilter}
              onViewModeChange={setViewMode}
              onRefresh={handleRefresh}
            />

            {loading ? (
              <>
                <StatsSkeleton />

                {viewMode === 'table' ? (
                  <TableContainer>
                    <table className="min-w-full divide-y divide-slate-200">
                      <TableHead
                        columns={[
                          { key: 'user', label: 'Usuario' },
                          { key: 'status', label: 'Estado Cognito' },
                          { key: 'created', label: 'Creado' },
                          { key: 'action', label: 'Acción', align: 'right' },
                        ]}
                      />
                      <TableSkeleton rows={5} columns={4} />
                    </table>
                  </TableContainer>
                ) : (
                  <CardsSkeleton />
                )}
              </>
            ) : (
              <>
                <UserStats users={users} />

                {filteredUsers.length === 0 ? (
                  <UsersEmptyState />
                ) : viewMode === 'table' ? (
                  <UserTable
                    users={filteredUsers}
                    loading={false}
                    variant={currentTableVariant}
                    formatDate={formatAdminUserDate}
                    getStatusBadge={getAdminUserStatusBadge}
                    getStatusLabel={getAdminUserStatusLabel}
                    onToggleEnabled={handleToggleEnabled}
                    actionLoadingUserId={actionLoadingUserId}
                  />
                ) : (
                  <UsersGrid
                    users={filteredUsers}
                    variant={currentTableVariant}
                    formatDate={formatAdminUserDate}
                    getStatusBadge={getAdminUserStatusBadge}
                    getStatusLabel={getAdminUserStatusLabel}
                    onToggleEnabled={handleToggleEnabled}
                    actionLoadingUserId={actionLoadingUserId}
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
