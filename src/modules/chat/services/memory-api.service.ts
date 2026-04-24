import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'
import type { TicketFormData } from '../types/chat.types'

export type MemoryResponse = {
  sessionId: string
  memory: TicketFormData
  summary?: string
  lastUpdatedAt?: string
  missingFields: string[]
}

const EMPTY_TICKET_FORM: TicketFormData = {
  subject: '',
  category: '',
  subcategory: '',
  requester: '',
  userCompany: '',
  businessUnit: '',
  site: '',
  equipmentModel: '',
  serial: '',
  description: '',
}

const getToken = async () => {
  const session = await fetchAuthSession()
  return session.tokens?.idToken?.toString() ?? null
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const normalizeString = (value: unknown): string =>
  typeof value === 'string' ? value : ''

const normalizeMemory = (value: unknown): TicketFormData => {
  const memory = isObject(value) ? value : {}

  return {
    subject: normalizeString(memory.subject),
    category: normalizeString(memory.category),
    subcategory: normalizeString(memory.subcategory),
    requester: normalizeString(memory.requester),
    userCompany: normalizeString(memory.userCompany),
    businessUnit: normalizeString(memory.businessUnit),
    site: normalizeString(memory.site),
    equipmentModel: normalizeString(memory.equipmentModel),
    serial: normalizeString(memory.serial),
    description:
      normalizeString(memory.description) || normalizeString(memory.problem),
  }
}

export const getMemoryBySession = async (
  sessionId: string,
): Promise<MemoryResponse> => {
  const token = await getToken()

  if (!token) {
    throw new Error('No autenticado')
  }

  const response = await fetch(API.memory.get(sessionId), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  let data: unknown

  try {
    data = await response.json()
  } catch {
    throw new Error('La respuesta del servidor no es un JSON válido.')
  }

  if (!response.ok) {
    const errorMessage =
      isObject(data) && typeof data.error === 'string'
        ? data.error
        : 'Error obteniendo memoria'

    throw new Error(errorMessage)
  }

  if (!isObject(data)) {
    return {
      sessionId,
      memory: EMPTY_TICKET_FORM,
      missingFields: [],
    }
  }

  return {
    sessionId: normalizeString(data.sessionId) || sessionId,
    memory: normalizeMemory(data.memory),
    summary: normalizeString(data.summary),
    lastUpdatedAt: normalizeString(data.lastUpdatedAt),
    missingFields: Array.isArray(data.missingFields)
      ? data.missingFields.filter((item): item is string => typeof item === 'string')
      : [],
  }
}
