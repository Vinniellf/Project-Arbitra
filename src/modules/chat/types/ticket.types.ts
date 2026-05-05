export type TicketFormData = {
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
  ticketCode?: string
  status?: string
}

export type SaveTicketDraftInput = TicketFormData & {
  sessionId: string
}

export type SaveTicketDraftResponse = {
  ok: boolean
  sessionId: string
  userId: string
  draftStatus: string
  missingFields: string[]
  ticketDraft: TicketFormData
  updatedAt?: string
}

export type CreateTicketInput = TicketFormData & {
  sessionId: string
  source?: string
}

export type CreateTicketResponse = {
  ok: boolean
  ticketId: string
  status: string
  message: string
  ticket: {
    ticketId: string
    userId: string
    companyId: string
    sessionId: string
    status: string
    subject: string
    description: string
    category: string
    subcategory: string
    requester: string
    userCompany: string
    businessUnit: string
    site: string
    equipmentModel: string
    serial: string
    source: string
    createdAt: string
    submittedAt: string
    createdBy?: {
      userId: string
      name: string
      email: string
    }
  }
}
