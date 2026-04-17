import { API } from '@/shared/config/api'
import type { PepeAgentApiResponse } from '../types/pepe-agent.types'

const getCognitoToken = (): string | null => {
  let idToken: string | null = null

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (!key || !key.includes('CognitoIdentityServiceProvider')) continue

    if (key.endsWith('.accessToken')) {
      return localStorage.getItem(key)
    }

    if (key.endsWith('.idToken')) {
      idToken = localStorage.getItem(key)
    }
  }

  return idToken
}

type SendPepeAgentMessageInput = {
  message: string
  sessionId: string
}

export const sendPepeAgentMessage = async ({
  message,
  sessionId,
}: SendPepeAgentMessageInput): Promise<PepeAgentApiResponse> => {
  const token = getCognitoToken()

  if (!token) {
    throw new Error('No se encontró el token de autenticación.')
  }

  const response = await fetch(API.chat.send, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      message,
      sessionId,
    }),
  })

  let data: unknown

  try {
    data = await response.json()
  } catch {
    throw new Error('La respuesta del servidor no es un JSON válido.')
  }

  if (!response.ok) {
    const errorMessage =
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string'
        ? data.message
        : 'Error al comunicarse con el agente.'

    throw new Error(errorMessage)
  }

  return data as PepeAgentApiResponse
}
