import type { AdminUser } from '../../../types/user'
import EntityGrid from '../../common/listing/EntityGrid'
import UserCard from './UserCard'

type UsersGridVariant = 'enabled' | 'disabled'

type UsersGridProps = {
  users: AdminUser[]
  variant: UsersGridVariant
  formatDate: (date?: string) => string
  getStatusBadge: (status?: string) => string
  getStatusLabel: (status?: string) => string
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
        const userKey = user.email ?? user.username ?? `${index}`

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
