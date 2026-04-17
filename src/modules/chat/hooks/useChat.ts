import { useState } from 'react'
import type { Message, TicketPriority } from '../types/chat.types'
import { streamPepeResponse } from '../services/pepe.service'
import { isFailureFeedback } from '../utils/ticket-feedback.utils'
import {
  registerFailureAttempt,
  resetFailureAttempts,
} from '../utils/chat-ticket-attempts.utils'
import { buildTicketSuccessMessage } from '../utils/ticket-message.utils'

const MAX_FAILURE_ATTEMPTS = 2

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const updateMessages = (
    updater: (prev: Message[]) => Message[],
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    setMessages((prev) => {
      const updated = updater(prev)
      onMessagesChange?.(updated)
      return updated
    })
  }

  const sendMessage = async (
    chatId: string,
    text: string,
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    const trimmedText = text.trim()

    // BLOQUEO TOTAL
    if (!trimmedText || loading) return

    const isFailureMessage = isFailureFeedback(trimmedText)
    const failureCount = isFailureMessage
      ? registerFailureAttempt(chatId)
      : 0

    const shouldOfferTicket = failureCount >= MAX_FAILURE_ATTEMPTS

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedText,
      kind: 'text',
    }

    updateMessages((prev) => [...prev, userMessage], onMessagesChange)

    setLoading(true)

    const botMessageId = crypto.randomUUID()

    const botMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '',
      kind: 'text',
    }

    updateMessages((prev) => [...prev, botMessage], onMessagesChange)

    try {
      await streamPepeResponse(
        chatId,
        trimmedText,
        (chunk: string) => {
          updateMessages(
            (prev) =>
              prev.map((msg) => {
                if (msg.id !== botMessageId) return msg

                return {
                  ...msg,
                  content: msg.content + chunk,
                }
              }),
            onMessagesChange
          )
        },
        () => {
          updateMessages(
            (prev) =>
              prev.map((msg) => {
                if (msg.id !== botMessageId) return msg
                if (!shouldOfferTicket) return msg

                return {
                  ...msg,
                  action: 'generate_ticket',
                }
              }),
            onMessagesChange
          )

          setLoading(false)
        }
      )
    } catch (error) {
      console.error('Error en la conexión con el Agente:', error)

      updateMessages(
        (prev) =>
          prev.map((msg) => {
            if (msg.id !== botMessageId) return msg

            return {
              ...msg,
              content:
                msg.content +
                '\n Lo siento, hubo un problema de conexión con el servidor.',
            }
          }),
        onMessagesChange
      )

      setLoading(false)
    }
  }

  const insertTicketFormMessage = (
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    updateMessages((prev) => {
      const formAlreadyExists = prev.some(
        (msg) => msg.role === 'assistant' && msg.kind === 'ticket_form'
      )

      if (formAlreadyExists) return prev

      const formMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'ticket_form',
        content:
          'Detecté que el problema persiste. Completa este pequeño formulario para generar tu ticket de soporte.',
      }

      return [...prev, formMessage]
    }, onMessagesChange)
  }

  const submitTicketForm = (
    data: {
      subject: string
      description: string
      priority: TicketPriority
    },
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    const userSummaryMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      kind: 'ticket_summary',
      content: '',
      ticketFormData: {
        subject: data.subject,
        description: data.description,
        priority: data.priority,
      },
    }

    const successMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      kind: 'text',
      content: buildTicketSuccessMessage('TK-2026-001'),
    }

    updateMessages((prev) => {
      const filteredMessages = prev.filter(
        (msg) => msg.kind !== 'ticket_form'
      )
      return [...filteredMessages, userSummaryMessage, successMessage]
    }, onMessagesChange)
  }

  const resetChat = (chatId?: string) => {
    if (chatId) {
      resetFailureAttempts(chatId)
    }

    setMessages([])
    setLoading(false) 
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
    insertTicketFormMessage,
    submitTicketForm,
  }
}
