import type { AdminUser } from '../../../types/admin-user'
import EntityGrid from '../../common/listing/EntityGrid'
import UserCard from './UserCard'

type UsersGridVariant = 'enabled' | 'disabled'

type UsersGridProps = {
  users: AdminUser[]
  variant: UsersGridVariant
  formatDate: (date?: string | null) => string
  getStatusBadge: (status?: string | null) => string
  getStatusLabel: (status?: string | null) => string
  onToggleEnabled: (user: AdminUser) => void
  actionLoadingUserId?: string | null
}

export default function UsersGrid({
  users,
  variant,
  formatDate,
  getStatusBadge,
  getStatusLabel,
  onToggleEnabled,
  actionLoadingUserId = null,
}: UsersGridProps) {
  return (
    <EntityGrid>
      {users.map((user, index) => {
        const userKey = user.username || `${index}`

        return (
          <UserCard
            key={userKey}
            user={user}
            index={index}
            variant={variant}
            formatDate={formatDate}
            getStatusBadge={getStatusBadge}
            getStatusLabel={getStatusLabel}
            onToggleEnabled={onToggleEnabled}
            actionLoading={actionLoadingUserId === userKey}
          />
        )
      })}
    </EntityGrid>
  )
}
