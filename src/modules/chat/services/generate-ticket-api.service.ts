import { fetchAuthSession } from 'aws-amplify/auth'
import { API } from '@/shared/config/api'
import type { PepeAgentApiResponse } from '../types/pepe-agent.types'

type SendPepeAgentMessageInput = {
  message: string
  sessionId: string
}

const EMPTY_TICKET_DRAFT = {
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

const getCognitoIdToken = async (): Promise<string | null> => {
  const session = await fetchAuthSession()
  return session.tokens?.idToken?.toString() ?? null
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const normalizeString = (value: unknown): string =>
  typeof value === 'string' ? value : ''

const normalizeStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const normalizeDraft = (value: unknown) => {
  const source = isObject(value) ? value : {}
  const rawTicketDraft = isObject(source.ticketDraft) ? source.ticketDraft : {}

  return {
    status: normalizeString(source.status) || 'draft_empty',
    missingFields: normalizeStringArray(source.missingFields),
    ticketDraft: {
      subject: normalizeString(rawTicketDraft.subject) || EMPTY_TICKET_DRAFT.subject,
      category: normalizeString(rawTicketDraft.category) || EMPTY_TICKET_DRAFT.category,
      subcategory: normalizeString(rawTicketDraft.subcategory) || EMPTY_TICKET_DRAFT.subcategory,
      requester: normalizeString(rawTicketDraft.requester) || EMPTY_TICKET_DRAFT.requester,
      userCompany: normalizeString(rawTicketDraft.userCompany) || EMPTY_TICKET_DRAFT.userCompany,
      businessUnit: normalizeString(rawTicketDraft.businessUnit) || EMPTY_TICKET_DRAFT.businessUnit,
      site: normalizeString(rawTicketDraft.site) || EMPTY_TICKET_DRAFT.site,
      equipmentModel:
        normalizeString(rawTicketDraft.equipmentModel) || EMPTY_TICKET_DRAFT.equipmentModel,
      serial: normalizeString(rawTicketDraft.serial) || EMPTY_TICKET_DRAFT.serial,
      description: normalizeString(rawTicketDraft.description) || EMPTY_TICKET_DRAFT.description,
    },
    updatedAt: normalizeString(source.updatedAt) || undefined,
  }
}

export const sendPepeAgentMessage = async ({
  message,
  sessionId,
}: SendPepeAgentMessageInput): Promise<PepeAgentApiResponse> => {
  const token = await getCognitoIdToken()

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
      isObject(data) && typeof data.message === 'string'
        ? data.message
        : 'Error al comunicarse con el agente.'

    throw new Error(errorMessage)
  }

  if (!isObject(data)) {
    throw new Error('La respuesta del agente no tiene un formato válido.')
  }

  const normalizedResponse: PepeAgentApiResponse = {
    ok: Boolean(data.ok),
    sessionId: normalizeString(data.sessionId),
    userId: normalizeString(data.userId) || undefined,
    reply: normalizeString(data.reply),
    draft: normalizeDraft(data.draft),
    debug: isObject(data.debug)
      ? {
          seenEvents: Array.isArray(data.debug.seenEvents)
            ? data.debug.seenEvents.filter(
                (row): row is string[] =>
                  Array.isArray(row) && row.every((cell) => typeof cell === 'string'),
              )
            : undefined,
          rawAgentText:
            typeof data.debug.rawAgentText === 'string' ? data.debug.rawAgentText : undefined,
        }
      : undefined,
  }

  if (!normalizedResponse.ok) {
    throw new Error('El agente devolvió una respuesta no exitosa.')
  }

  if (!normalizedResponse.sessionId) {
    throw new Error('La respuesta del agente no incluye sessionId.')
  }

  return normalizedResponse
}
