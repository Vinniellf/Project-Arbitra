import { useState } from 'react'
import { disableAdminUser } from '../../services/users/admin-user-actions.service'
import type { ToggleAdminUserResponse } from '../../types/admin-user'

export function useDisableAdminUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (
    username: string,
  ): Promise<ToggleAdminUserResponse> => {
    try {
      setLoading(true)
      setError(null)

      return await disableAdminUser(username)
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
