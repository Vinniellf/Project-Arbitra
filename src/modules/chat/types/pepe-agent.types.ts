export interface PepeTicketDraft {
  subject: string
  category: string
  subcategory: string
  requester: string
  userCompany: string
  businessUnit: string
  site: string
  equipmentModel: string
  serial: string
  description: string
}

export interface PepeParsedResponse {
  reply: string
  suggestTicket: boolean
  showTicketForm: boolean
  ticketDraft?: PepeTicketDraft
}

export interface PepeAgentApiResponse {
  ok: boolean
  sessionId: string
  raw: string
  cleaned?: string
  parsed: PepeParsedResponse | null
}
