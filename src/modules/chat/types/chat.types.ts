export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  content: string
  role: MessageRole
}

export interface Chat {
  id: string
  date: string
  messages: Message[]
}
