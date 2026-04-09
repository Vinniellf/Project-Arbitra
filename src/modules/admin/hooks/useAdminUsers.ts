import { useEffect, useState, useCallback } from 'react'
import { listAdminUsers } from '../services/admin-users.service'
import type { AdminUser } from '../types/user'

type UseAdminUsersReturn = {
  users: AdminUser[]
  loading: boolean
  error: string | null
  reloadUsers: () => Promise<void>
}

export function useAdminUsers(): UseAdminUsersReturn {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await listAdminUsers()
      setUsers(data.users)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al cargar usuarios'

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
    reloadUsers: fetchUsers, // 👈 clave
  }
}
