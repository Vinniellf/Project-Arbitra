import { useEffect, useState, useCallback } from 'react'
import { listUsers } from '../../services/users/users.service'
import type { AdminUser } from '../../types/admin-user'
import type { SystemUser } from '../../types/user'

type UseAdminSystemUsersReturn = {
  users: AdminUser[]
  loading: boolean
  error: string | null
  reloadUsers: () => Promise<void>
}

function mapSystemUserToAdminUser(user: SystemUser): AdminUser {
  return {
    username: user.userId,
    email: user.email ?? null,
    name: user.name ?? null,
    status: user.status ?? null,
    enabled: user.enabled ?? false,
    createdAt: user.createdAt ?? null,
    role: user.role,
  }
}

export function useAdminSystemUsers(): UseAdminSystemUsersReturn {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await listUsers()
      const mappedUsers = data.users.map(mapSystemUserToAdminUser)

      setUsers(mappedUsers)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al cargar usuarios del sistema'

      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  return {
    users,
    loading,
    error,
    reloadUsers: fetchUsers,
  }
}
