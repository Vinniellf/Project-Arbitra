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

export interface PepeDraft {
  status: string
  missingFields: string[]
  ticketDraft: PepeTicketDraft
  updatedAt?: string
}

export interface PepeAgentApiResponse {
  ok: boolean
  sessionId: string
  userId?: string
  reply: string
  draft: PepeDraft
  debug?: {
    seenEvents?: string[][]
    rawAgentText?: string
  }
}
