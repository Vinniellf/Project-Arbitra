import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api.config'

export type SystemUser = {
  userId: string
  email: string
  name: string
  companyId: string
  role: string
  status: string
  profileCompleted: boolean
  createdAt: string
}

export type ListSystemUsersResponse = {
  users: SystemUser[]
  pagination?: {
    limit: number
    nextToken: string | null
  }
}

type ApiErrorResponse = {
  message?: string
  error?: string
  detail?: string
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
    // ignorar si no viene JSON
  }

  if (response.status === 400) {
    throw new Error(message || 'Solicitud inválida.')
  }

  if (response.status === 401) {
    throw new Error('No autorizado. Inicia sesión nuevamente.')
  }

  if (response.status === 403) {
    throw new Error(message || 'No tienes permisos para listar usuarios.')
  }

  if (response.status === 404) {
    throw new Error(message || 'No se encontraron usuarios.')
  }

  if (response.status === 429) {
    throw new Error(
      message || 'Demasiadas solicitudes. Intenta nuevamente en unos segundos.'
    )
  }

  throw new Error(message)
}

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
