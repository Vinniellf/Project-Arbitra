import { API } from '@/shared/config/api'
import { getAccessToken } from '@/shared/services/api-auth'
import { parseErrorResponse } from '@/shared/services/api-errors'
import type { InviteUserRequest, InviteUserResponse } from '../../types/admin-user'

export async function inviteAdminUser(
  payload: InviteUserRequest,
): Promise<InviteUserResponse> {
  const accessToken = await getAccessToken()

  const normalizedPayload: InviteUserRequest = {
    role: payload.role,
  }

  if (payload.name?.trim()) {
    normalizedPayload.name = payload.name.trim()
  }

  if (payload.email?.trim()) {
    normalizedPayload.email = payload.email.trim().toLowerCase()
  }

  if (payload.emails?.length) {
    normalizedPayload.emails = [
      ...new Set(
        payload.emails
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean),
      ),
    ]
  }

  try {
    const response = await fetch(API.invite.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(normalizedPayload),
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    return (await response.json()) as InviteUserResponse
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con la API de invitación. Revisa CORS, la URL del endpoint y que API Gateway esté activo.',
      )
    }

    throw error
  }
}
