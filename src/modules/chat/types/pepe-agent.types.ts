import type { TicketPriority } from './chat.types'

export interface PepeTicketDraft {
  subject: string
  description: string
  priority: TicketPriority
}

export interface PepeParsedResponse {
  reply: string
  suggestTicket: boolean
  ticketDraft?: PepeTicketDraft
}

export interface PepeAgentApiResponse {
  ok: boolean
  sessionId: string
  raw: string
  cleaned?: string
  parsed: PepeParsedResponse | null
}
