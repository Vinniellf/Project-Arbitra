import { useEffect, useState, useCallback } from 'react'
import { listSystemUsers } from '../services/admin-system-users.service'
import type { AdminUser } from '../types/user'

type UseAdminSystemUsersReturn = {
  users: AdminUser[]
  loading: boolean
  error: string | null
  reloadUsers: () => Promise<void>
}

export function useAdminSystemUsers(): UseAdminSystemUsersReturn {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await listSystemUsers()

      const mappedUsers: AdminUser[] = data.users.map((user) => ({
        username: user.userId,
        email: user.email ?? null,
        name: user.name ?? null,
        status: user.status ?? null,
        enabled: user.enabled ?? true,
        createdAt: user.createdAt ?? null,

        // campos extra por compatibilidad y futuro uso
        userId: user.userId,
        companyId: user.companyId,
        role: user.role,
        profileCompleted: user.profileCompleted,
      }))

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
