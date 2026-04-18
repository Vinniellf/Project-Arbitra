import { useState } from 'react'
import type { Message, TicketPriority } from '../types/chat.types'
import { isFailureFeedback } from '../utils/ticket-feedback.utils'
import {
  registerFailureAttempt,
  resetFailureAttempts,
} from '../utils/chat-ticket-attempts.utils'
import { buildTicketSuccessMessage } from '../utils/ticket-message.utils'
import { sendPepeAgentMessage } from '../services/pepe-agent-api.service'

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

    if (!trimmedText || loading) return

    const isFailureMessage = isFailureFeedback(trimmedText)
    const failureCount = isFailureMessage
      ? registerFailureAttempt(chatId)
      : 0

    const shouldOfferTicketByFallback = failureCount >= MAX_FAILURE_ATTEMPTS

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedText,
      kind: 'text',
    }

    updateMessages((prev) => [...prev, userMessage], onMessagesChange)
    setLoading(true)

    try {
      const response = await sendPepeAgentMessage({
        message: trimmedText,
        sessionId: chatId,
      })

      const parsed = response.parsed
      const assistantReply =
        parsed?.reply?.trim() || response.cleaned?.trim() || response.raw?.trim()

      let updatedMessagesSnapshot: Message[] = []

      if (assistantReply) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: assistantReply,
          kind: 'text',
        }

        updateMessages((prev) => {
          const updated = [...prev, assistantMessage]
          updatedMessagesSnapshot = updated
          return updated
        }, onMessagesChange)
      } else {
        updatedMessagesSnapshot = messages
      }

      const shouldOfferTicket =
        parsed?.suggestTicket === true || shouldOfferTicketByFallback

      if (shouldOfferTicket) {
        const ticketDraft = parsed?.ticketDraft

        const formAlreadyExists = updatedMessagesSnapshot.some(
          (msg) => msg.role === 'assistant' && msg.kind === 'ticket_form'
        )

        if (!formAlreadyExists) {
          const formMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            kind: 'ticket_form',
            content:
              'He preparado un borrador del ticket con la información detectada. Revísalo antes de enviarlo.',
            ticketFormData: ticketDraft
              ? {
                  subject: ticketDraft.subject,
                  description: ticketDraft.description,
                  priority: ticketDraft.priority,
                }
              : {
                  subject: '',
                  description: trimmedText,
                  priority: 'media',
                },
          }

          updateMessages((prev) => [...prev, formMessage], onMessagesChange)
        }
      }
    } catch (error) {
      console.error('Error en la conexión con el Agente:', error)

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : '⚠️ Lo siento, tuve un problema de conexión con el servidor.',
        kind: 'text',
      }

      updateMessages((prev) => [...prev, errorMessage], onMessagesChange)
    } finally {
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
      const filteredMessages = prev.filter((msg) => msg.kind !== 'ticket_form')
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
