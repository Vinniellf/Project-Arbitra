import { fetchAuthSession } from 'aws-amplify/auth'
import type {
  InviteUserRequest,
  InviteUserResponse,
  ListUsersResponse,
} from '../types/user'

const ADMIN_USERS_API_URL = import.meta.env.VITE_ADMIN_USERS_API_URL
const INVITE_USER_API_URL = import.meta.env.VITE_INVITE_USER_API_URL

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
  endpoint: '/admin/users/disable' | '/admin/users/enable',
  username: string,
  networkErrorMessage: string
): Promise<ToggleAdminUserResponse> {
  if (!ADMIN_USERS_API_URL) {
    throw new Error('Falta configurar VITE_ADMIN_USERS_API_URL')
  }

  const normalizedUsername = username.trim()

  if (!normalizedUsername) {
    throw new Error('El username es obligatorio')
  }

  const accessToken = await getAccessToken()

  try {
    const response = await fetch(`${ADMIN_USERS_API_URL}${endpoint}`, {
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
  if (!ADMIN_USERS_API_URL) {
    throw new Error('Falta configurar VITE_ADMIN_USERS_API_URL')
  }

  const accessToken = await getAccessToken()

  try {
    const response = await fetch(`${ADMIN_USERS_API_URL}/admin/users`, {
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
  if (!INVITE_USER_API_URL) {
    throw new Error('Falta configurar VITE_INVITE_USER_API_URL')
  }

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
    const response = await fetch(INVITE_USER_API_URL, {
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
    '/admin/users/disable',
    username,
    'No se pudo conectar con la API de deshabilitación. Revisa CORS, la URL de la API y que API Gateway esté activo.'
  )
}

export async function enableAdminUser(
  username: string
): Promise<ToggleAdminUserResponse> {
  return postAdminUserAction(
    '/admin/users/enable',
    username,
    'No se pudo conectar con la API de habilitación. Revisa CORS, la URL de la API y que API Gateway esté activo.'
  )
}
