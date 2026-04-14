import { fetchAuthSession } from 'aws-amplify/auth'
import type { UpdateProfileData } from '../types/auth.types'

const UPDATE_PROFILE_URL = import.meta.env.VITE_UPDATE_PROFILE_API_URL

export async function updateBackendProfile(data: UpdateProfileData) {
  const firstName = data.firstName.trim()
  const lastName = data.lastName.trim()
  const fullName = `${firstName} ${lastName}`.trim()

  if (!UPDATE_PROFILE_URL) {
    throw new Error('Falta VITE_UPDATE_PROFILE_API_URL')
  }

  const session = await fetchAuthSession()
  const idToken = session.tokens?.idToken?.toString()

  if (!idToken) {
    throw new Error('No se pudo obtener el token del usuario')
  }

  const response = await fetch(UPDATE_PROFILE_URL, {
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

  let apiResult: unknown = null

  try {
    apiResult = await response.json()
  } catch {
    apiResult = null
  }

  if (!response.ok) {
    const message =
      typeof apiResult === 'object' &&
      apiResult !== null &&
      'message' in apiResult &&
      typeof apiResult.message === 'string'
        ? apiResult.message
        : 'Error actualizando perfil'

    throw new Error(message)
  }

  return apiResult
}
