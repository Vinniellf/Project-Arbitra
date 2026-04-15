import { useState } from 'react'
import { enableAdminUser } from '../../services/users/admin-user-actions.service'
import type { ToggleAdminUserResponse } from '../../types/admin-user'

export function useEnableAdminUser() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const enableUser = async (
    username: string,
  ): Promise<ToggleAdminUserResponse> => {
    try {
      setLoading(true)
      setError(null)

      return await enableAdminUser(username)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo habilitar el usuario'

      setError(message)
      throw new Error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    enableUser,
    loading,
    error,
    clearError: () => setError(null),
  }
}
