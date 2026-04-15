export type MessageRole = 'user' | 'assistant'
export type MessageAction = 'generate_ticket'
export type MessageKind = 'text' | 'ticket_form' | 'ticket_summary'

export type TicketPriority = 'alta' | 'media' | 'baja'

export interface TicketFormData {
  subject: string
  description: string
  priority: TicketPriority
}

export interface Message {
  id: string
  content: string
  role: MessageRole
  action?: MessageAction
  kind?: MessageKind
  ticketFormData?: Partial<TicketFormData>
}

export interface Chat {
  id: string
  date: string
  messages: Message[]
}
