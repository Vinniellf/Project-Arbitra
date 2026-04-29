export type MessageRole = 'user' | 'assistant'

export type MessageAction = 'generate_ticket'

export type MessageKind =
  | 'text'
  | 'ticket_form'
  | 'ticket_confirmation'
  | 'ticket_success'

export interface TicketFormData {
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

export interface TicketSuccessData extends Partial<TicketFormData> {
  ticketCode?: string
}

export interface Message {
  id: string
  content: string
  role: MessageRole
  action?: MessageAction
  kind?: MessageKind
  ticketFormData?: Partial<TicketFormData> | TicketSuccessData
}

export interface Chat {
  id: string
  date: string
  messages: Message[]
}
