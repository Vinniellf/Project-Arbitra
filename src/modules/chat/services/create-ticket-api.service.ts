import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'
import type {
  CreateTicketInput,
  CreateTicketResponse,
} from '../types/ticket.types'

const getCognitoIdToken = async (): Promise<string | null> => {
  const session = await fetchAuthSession()
  return session.tokens?.idToken?.toString() ?? null
}

export const createSupportTicket = async ({
  subject,
  description,
  sessionId,
  source = 'chat-form',
}: CreateTicketInput): Promise<CreateTicketResponse> => {
  const token = await getCognitoIdToken()

  if (!token) {
    throw new Error('No se encontró el token de autenticación.')
  }

  const response = await fetch(API.tickets.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      subject,
      description,
      sessionId,
      source,
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
        : 'Error al crear el ticket.'

    throw new Error(errorMessage)
  }

  return data as CreateTicketResponse
}
