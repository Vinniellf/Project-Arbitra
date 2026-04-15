export type MessageRole = 'user' | 'assistant'
export type MessageAction = 'generate_ticket'

export interface Message {
  id: string
  content: string
  role: MessageRole
  action?: MessageAction
}

export interface Chat {
  id: string
  date: string
  messages: Message[]
}
