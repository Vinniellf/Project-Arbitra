import type { AdminUser } from '../../../types/user'
import EntityGrid from '../../common/listing/EntityGrid'
import UserCard from './UserCard'

type UsersGridProps = {
  users: AdminUser[]
  formatDate: (date?: string) => string
  getStatusBadge: (status?: string) => string
  getStatusLabel: (status?: string) => string
  onToggleEnabled: (user: AdminUser) => void
  loadingUsername?: string | null
}

export default function UsersGrid({
  users,
  formatDate,
  getStatusBadge,
  getStatusLabel,
  onToggleEnabled,
  loadingUsername = null,
}: UsersGridProps) {
  return (
    <EntityGrid>
      {users.map((user, index) => (
        <UserCard
          key={user.username ?? user.email ?? `${index}`}
          user={user}
          index={index}
          formatDate={formatDate}
          getStatusBadge={getStatusBadge}
          getStatusLabel={getStatusLabel}
          onToggleEnabled={onToggleEnabled}
          actionLoading={loadingUsername === user.username}
        />
      ))}
    </EntityGrid>
  )
}
