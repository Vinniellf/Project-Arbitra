export type CreateTicketInput = {
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
  sessionId: string
  source?: string
}

export type CreateTicketResponse = {
  ok: boolean
  ticketId: string
  status: string
  message: string
  ticket: {
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
  meta: {
    userId: string
    sessionId: string
    source: string
  }
}
