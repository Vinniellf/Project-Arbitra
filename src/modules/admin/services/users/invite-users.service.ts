import { API } from '@/shared/config/api'
import { getAccessToken } from '@/shared/api/api-auth'
import { parseErrorResponse } from '@/shared/api/api-errors'
import type {
  InviteUserRequest,
  InviteUserResponse,
} from '../../types/admin-user'

export async function inviteAdminUser(
  payload: InviteUserRequest,
): Promise<InviteUserResponse> {
  const accessToken = await getAccessToken()

  const normalizedPayload: InviteUserRequest = {}

  if (payload.role) {
    normalizedPayload.role = payload.role
  }

  if (payload.name?.trim()) {
    normalizedPayload.name = payload.name.trim()
  }

  if (payload.companyId?.trim()) {
    normalizedPayload.companyId = payload.companyId.trim()
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

  const response = await fetch(API.admin.inviteUsers, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(normalizedPayload),
  })

  if (!response.ok && response.status !== 207) {
    await parseErrorResponse(response)
  }

  return (await response.json()) as InviteUserResponse
}
