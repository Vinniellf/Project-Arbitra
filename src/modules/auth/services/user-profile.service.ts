import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'
import type { UpdateProfileData } from '../types/auth.types'

type ApiErrorResponse = {
  message?: string
}

export async function updateBackendProfile(data: UpdateProfileData) {
  const firstName = data.firstName.trim()
  const lastName = data.lastName.trim()
  const fullName = `${firstName} ${lastName}`.trim()

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
      name: fullName,
      firstName,
      lastName,
    }),
  })

  let apiResult: ApiErrorResponse | null = null

  try {
    apiResult = await response.json()
  } catch {
    apiResult = null
  }

  if (!response.ok) {
    throw new Error(apiResult?.message || 'Error actualizando perfil')
  }

  return apiResult
}
