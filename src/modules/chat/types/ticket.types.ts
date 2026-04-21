export type CreateTicketInput = {
  subject: string
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
    description: string
  }
  meta: {
    userId: string
    sessionId: string
    source: string
  }
}
