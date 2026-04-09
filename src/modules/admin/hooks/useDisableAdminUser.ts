import { useState } from 'react'
import { disableAdminUser } from '../services/admin-users.service'

export function useDisableAdminUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (username: string) => {
    try {
      setLoading(true)
      setError(null)

      const result = await disableAdminUser(username)
      return result
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo deshabilitar el usuario'

      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    disableUser: execute,
    loading,
    error,
    clearError: () => setError(null),
  }
}
