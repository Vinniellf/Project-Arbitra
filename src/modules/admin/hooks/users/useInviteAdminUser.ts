import { useState } from 'react'
import { inviteAdminUser } from '../../services/users/invite-users.service'
import type {
  InviteUserRequest,
  InviteUserResponse,
} from '../../types/admin-user'

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
    payload: InviteUserRequest,
  ): Promise<InviteUserResponse> => {
    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      const response = await inviteAdminUser(payload)

      setSuccessMessage(
        response.message || 'Invitación procesada correctamente.',
      )

      return response
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo procesar la invitación.'

      setError(message)
      throw new Error(message)
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
