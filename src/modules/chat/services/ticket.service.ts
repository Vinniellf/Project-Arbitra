import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'

type CreateTicketInput = {
  sessionId: string
  userId: string
}

type CreateTicketResponse = {
  message: string
  ticketId: string
  sessionId?: string
  externalTicketId: string
  externalStatus: string
}

const getToken = async () => {
  const session = await fetchAuthSession()
  return session.tokens?.idToken?.toString() ?? null
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

export const createTicket = async ({
  sessionId,
  userId,
}: CreateTicketInput): Promise<CreateTicketResponse> => {
  const token = await getToken()

  if (!token) {
    throw new Error('No autenticado')
  }

  const response = await fetch(API.ticketera.create, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sessionId,
      userId,
    }),
  })

  let data: unknown

  try {
    data = await response.json()
  } catch {
    throw new Error('La respuesta del servidor no es un JSON válido.')
  }

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Ya existe un ticket creado para esta conversación.')
    }

    const errorMessage =
      isObject(data) && typeof data.error === 'string'
        ? data.error
        : 'Error creando ticket'

    throw new Error(errorMessage)
  }

  if (!isObject(data)) {
    throw new Error('Respuesta inválida al crear ticket.')
  }

  return {
    message: String(data.message ?? ''),
    ticketId: String(data.ticketId ?? ''),
    sessionId: typeof data.sessionId === 'string' ? data.sessionId : undefined,
    externalTicketId: String(data.externalTicketId ?? ''),
    externalStatus: String(data.externalStatus ?? ''),
  }
}
