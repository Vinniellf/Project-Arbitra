import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api.config'
import type {
  InviteUserRequest,
  InviteUserResponse,
  ListUsersResponse,
} from '../types/user'

type ApiErrorResponse = {
  message?: string
  error?: string
  detail?: string
}

export type ToggleAdminUserResponse = {
  message: string
  username: string
  executedBy?: string
  requesterRole?: 'admin' | 'superadmin'
  targetGroups?: string[]
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
    message = errorData.message || errorData.error || errorData.detail || message
  } catch {
    // ignorar si no viene json
  }

  if (response.status === 400) {
    throw new Error(message || 'Solicitud inválida.')
  }

  if (response.status === 401) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  if (response.status === 403) {
    throw new Error(message || 'No tienes permisos para realizar esta acción.')
  }

  if (response.status === 404) {
    throw new Error(message || 'El usuario no fue encontrado.')
  }

  if (response.status === 409) {
    throw new Error(message || 'El usuario ya existe.')
  }

  if (response.status === 429) {
    throw new Error(
      message || 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.'
    )
  }

  throw new Error(message)
}

async function postAdminUserAction(
  endpoint: typeof API.admin.disableUser | typeof API.admin.enableUser,
  username: string,
  networkErrorMessage: string
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

export async function listAdminUsers(): Promise<ListUsersResponse> {
  const accessToken = await getAccessToken()

  try {
    const response = await fetch(API.admin.users, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      await parseErrorResponse(response)
    }

    return (await response.json()) as ListUsersResponse
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
          .filter(Boolean)
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
        'No se pudo conectar con la API de invitación. Revisa CORS, la URL del endpoint y que API Gateway esté activo.'
      )
    }

    throw error
  }
}

export async function disableAdminUser(
  username: string
): Promise<ToggleAdminUserResponse> {
  return postAdminUserAction(
    API.admin.disableUser,
    username,
    'No se pudo conectar con la API de deshabilitación. Revisa CORS, la URL de la API y que API Gateway esté activo.'
  )
}

export async function enableAdminUser(
  username: string
): Promise<ToggleAdminUserResponse> {
  return postAdminUserAction(
    API.admin.enableUser,
    username,
    'No se pudo conectar con la API de habilitación. Revisa CORS, la URL de la API y que API Gateway esté activo.'
  )
}
