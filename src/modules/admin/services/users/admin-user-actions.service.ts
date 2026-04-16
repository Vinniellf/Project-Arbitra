import { API } from '@/shared/config/api'
import { getAccessToken } from '@/shared/api/api-auth'
import { parseErrorResponse } from '@/shared/api/api-errors'
import type { ToggleAdminUserResponse } from '../../types/admin-user'

async function postAdminUserAction(
  endpoint: string,
  username: string,
  networkErrorMessage: string,
): Promise<ToggleAdminUserResponse> {
  const normalizedUsername = username.trim()

  if (!normalizedUsername) {
    throw new Error('El username es obligatorio')
  }

  const accessToken = await getAccessToken()

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ username: normalizedUsername }),
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    return (await response.json()) as ToggleAdminUserResponse
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(networkErrorMessage)
    }

    throw error
  }
}

export async function disableAdminUser(
  username: string,
): Promise<ToggleAdminUserResponse> {
  return postAdminUserAction(
    API.admin.disableUser,
    username,
    'No se pudo conectar con la API de deshabilitación. Revisa CORS, la URL de la API y que API Gateway esté activo.',
  )
}

export async function enableAdminUser(
  username: string,
): Promise<ToggleAdminUserResponse> {
  return postAdminUserAction(
    API.admin.enableUser,
    username,
    'No se pudo conectar con la API de habilitación. Revisa CORS, la URL de la API y que API Gateway esté activo.',
  )
}
