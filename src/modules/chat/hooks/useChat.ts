import { useState } from 'react'
import type { Message } from '../types/chat.types'
import { streamPepeResponse } from '../services/pepe.service'
import { isFailureFeedback } from '../utils/ticket-feedback.utils'
import { registerFailureAttempt } from '../utils/chat-ticket-attempts.utils'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (
    chatId: string,
    text: string,
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    if (!text.trim() || loading) return

    const isFailureMessage = isFailureFeedback(text)
    const failureCount = isFailureMessage ? registerFailureAttempt(chatId) : 0
    const shouldOfferTicket = failureCount >= 2

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => {
      const updated: Message[] = [...prev, userMessage]
      onMessagesChange?.(updated)
      return updated
    })

    setLoading(true)

    const botMessageId = crypto.randomUUID()
    const botMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '',
    }

    setMessages((prev) => {
      const updated: Message[] = [...prev, botMessage]
      onMessagesChange?.(updated)
      return updated
    })

    try {
      await streamPepeResponse(
        chatId,
        text,
        (chunk: string) => {
          setMessages((prev) => {
            const updated: Message[] = prev.map((msg) => {
              if (msg.id !== botMessageId) return msg

              const nextMessage: Message = {
                ...msg,
                content: msg.content + chunk,
              }

              return nextMessage
            })

            onMessagesChange?.(updated)
            return updated
          })
        },
        () => {
          setMessages((prev) => {
            const updated: Message[] = prev.map((msg) => {
              if (msg.id !== botMessageId) return msg
              if (!shouldOfferTicket) return msg

              const nextMessage: Message = {
                ...msg,
                action: 'generate_ticket',
              }

              return nextMessage
            })

            onMessagesChange?.(updated)
            return updated
          })

          setLoading(false)
        }
      )
    } catch (error) {
      console.error('Error en la conexión con el Agente:', error)
      setLoading(false)
    }
  }

  const resetChat = () => {
    setMessages([])
  }

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages)
  }

  return {
    messages,
    sendMessage,
    loading,
    resetChat,
    loadMessages,
  }
}
