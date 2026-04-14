import { API } from '@/shared/config/api.config'
import { getAccessToken } from '@/shared/services/api-auth'
import { parseErrorResponse } from '@/shared/services/api-errors'
import type { ListSystemUsersResponse } from '../types/system-user'

export async function listSystemUsers(
  limit = 20,
  nextToken?: string
): Promise<ListSystemUsersResponse> {
  const accessToken = await getAccessToken()

  const url = new URL(API.admin.systemUsers)
  url.searchParams.set('limit', String(limit))

  if (nextToken) {
    url.searchParams.set('nextToken', nextToken)
  }

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    return (await response.json()) as ListSystemUsersResponse
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con la API de usuarios del sistema. Revisa CORS, la URL de la API y que API Gateway esté activo.'
      )
    }

    throw error
  }
}
