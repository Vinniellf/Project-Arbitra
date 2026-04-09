import { useState } from 'react'
import { inviteAdminUser } from '../services/admin-users.service'
import type { InviteUserRequest, InviteUserResponse } from '../types/user'

type UseInviteAdminUserReturn = {
  inviteUser: (payload: InviteUserRequest) => Promise<InviteUserResponse>
  loading: boolean
  error: string | null
  successMessage: string | null
  resetState: () => void
}

export function useInviteAdminUser(): UseInviteAdminUserReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const inviteUser = async (
    payload: InviteUserRequest
  ): Promise<InviteUserResponse> => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      const response = await inviteAdminUser(payload)

      setSuccessMessage(response.message || 'Usuario invitado correctamente.')
      return response
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudo invitar al usuario.'

      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetState = () => {
    setError(null)
    setSuccessMessage(null)
  }

  return {
    inviteUser,
    loading,
    error,
    successMessage,
    resetState,
  }
}
