import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'
import type { UpdateProfileData } from '@/modules/auth/types/auth.types'

type ApiResponse = {
  success: boolean
  message: string
  item?: unknown
}

export async function updateBackendProfile(data: UpdateProfileData) {
  const firstName = data.firstName.trim()
  const lastName = data.lastName.trim()

  if (!firstName || !lastName) {
    throw new Error('El nombre y apellido son obligatorios')
  }

  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()

  if (!idToken) {
    throw new Error('No se pudo obtener el token del usuario')
  }

  const response = await fetch(API.user.profile, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      firstName,
      lastName,
    }),
  })

  let result: ApiResponse | null = null

  try {
    result = await response.json()
  } catch {
    result = null
  }

  if (!response.ok) {
    throw new Error(result?.message || 'Error actualizando perfil')
  }

  return result
}
