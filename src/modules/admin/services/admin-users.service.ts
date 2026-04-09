import { fetchAuthSession } from 'aws-amplify/auth'
import type {
  InviteUserRequest,
  InviteUserResponse,
  ListUsersResponse,
} from '../types/user'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const INVITE_USER_API_URL = import.meta.env.VITE_INVITE_USER_API_URL

type ApiErrorResponse = {
  message?: string
  error?: string
}

async function getAccessToken(): Promise<string> {
  const session = await fetchAuthSession()
  const accessToken = session.tokens?.accessToken?.toString()

  if (!accessToken) {
    throw new Error('No se pudo obtener el access token')
  }

  return accessToken
}

async function parseErrorResponse(response: Response): Promise<never> {
  let message = `Error HTTP ${response.status}`

  try {
    const errorData = (await response.json()) as ApiErrorResponse
    message = errorData.message || errorData.error || message
  } catch {
    // ignorar si no viene json
  }

  if (response.status === 401) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos para realizar esta acción.')
  }

  if (response.status === 409) {
    throw new Error(message || 'El usuario ya existe.')
  }

  throw new Error(message)
}

export async function listAdminUsers(): Promise<ListUsersResponse> {
  if (!API_BASE_URL) {
    throw new Error('Falta configurar VITE_API_BASE_URL')
  }

  const accessToken = await getAccessToken()

  try {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    const data = (await response.json()) as ListUsersResponse
    return data
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con la API. Revisa CORS, la URL de la API y que API Gateway esté activo.'
      )
    }

    throw error
  }
}

export async function inviteAdminUser(
  payload: InviteUserRequest
): Promise<InviteUserResponse> {
  if (!INVITE_USER_API_URL) {
    throw new Error('Falta configurar VITE_INVITE_USER_API_URL')
  }

  const accessToken = await getAccessToken()

  try {
    const response = await fetch(INVITE_USER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    const data = (await response.json()) as InviteUserResponse
    return data
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'No se pudo conectar con la API de invitación. Revisa CORS, la URL del endpoint y que API Gateway esté activo.'
      )
    }

    throw error
  }
}
