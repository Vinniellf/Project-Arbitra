export type PepeTicketDraft = {
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

export type PepeDraftResponse = {
  status: string
  missingFields: string[]
  ticketDraft: PepeTicketDraft
  updatedAt?: string
}

export type PepeConversationState = {
  attemptCount: number
  pendingAttempt: boolean
  ticketRequestedByUser: boolean
  ticketOfferAllowed: boolean
}

export type PepeAgentApiResponse = {
  ok: boolean
  sessionId: string
  userId?: string
  reply: string
  draft: PepeDraftResponse
  conversationState: PepeConversationState
  debug?: {
    seenEvents?: string[][]
    rawAgentText?: string
  }
}
