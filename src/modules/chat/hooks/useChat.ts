import { useState } from 'react'
import type { Message } from '../types/chat.types'
import { sendPepeAgentMessage } from '../services/pepe-agent-api.service'
import { createSupportTicket } from '../services/create-ticket-api.service'

type TicketFormSubmitData = {
  subject: string
  description: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // helper para actualizar mensajes y sincronizar con history
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

    // evita envíos vacíos o duplicados
    if (!trimmedText || loading) return

    // agrega mensaje del usuario
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

      // si backend no pudo interpretar respuesta
      if (!parsed) {
        const invalidMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          kind: 'text',
          content:
            '⚠️ El agente devolvió una respuesta inválida. No pude interpretarla.',
        }

        updateMessages((prev) => [...prev, invalidMessage], onMessagesChange)
        return
      }

      // ================================
      // CASO 1: FORMULARIO DE TICKET
      // ================================
      if (parsed.showTicketForm) {
        updateMessages((prev) => {
          // evita duplicar formulario
          const alreadyExists = prev.some(
            (msg) => msg.role === 'assistant' && msg.kind === 'ticket_form'
          )

          if (alreadyExists) return prev

          const formMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            kind: 'ticket_form',
            content:
              'He preparado el borrador del ticket con la información detectada. Revísalo antes de enviarlo.',
            ticketFormData: {
              subject: parsed.ticketDraft?.subject ?? '',
              description: parsed.ticketDraft?.description ?? '',
            },
          }

          return [...prev, formMessage]
        }, onMessagesChange)

        return // importante: no continuar para evitar duplicar mensaje
      }

      // ================================
      // CASO 2: RESPUESTA NORMAL
      // ================================
      const assistantReply = parsed.reply.trim()

      if (assistantReply) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: assistantReply,
          kind: 'text',
          // activa botón de ticket en frontend
          action: parsed.suggestTicket ? 'generate_ticket' : undefined,
        }

        updateMessages((prev) => [...prev, assistantMessage], onMessagesChange)
      }
    } catch (error) {
      console.error('Error en la conexión con el agente:', error)

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'text',
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : '⚠️ Error de conexión con el servidor.',
      }

      updateMessages((prev) => [...prev, errorMessage], onMessagesChange)
    } finally {
      setLoading(false)
    }
  }

  // envío del formulario a backend (/tickets)
  const submitTicketForm = async (
    chatId: string,
    data: TicketFormSubmitData,
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    const subject = data.subject.trim()
    const description = data.description.trim()

    if (!subject || !description || loading) return

    setLoading(true)

    try {
      const response = await createSupportTicket({
        subject,
        description,
        sessionId: chatId,
        source: 'chat-form',
      })

      // mensaje resumen del usuario
      const summaryMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        kind: 'ticket_summary',
        content: '',
        ticketFormData: {
          subject,
          description,
        },
      }

      // mensaje de éxito del sistema
      const successMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'text',
        content: [
          response.message,
          '',
          `**Código de ticket:** ${response.ticketId}`,
        ].join('\n'),
      }

      // elimina el formulario y agrega resultado
      updateMessages((prev) => {
        const filtered = prev.filter((msg) => msg.kind !== 'ticket_form')
        return [...filtered, summaryMessage, successMessage]
      }, onMessagesChange)
    } catch (error) {
      console.error('Error al crear el ticket:', error)

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'text',
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : '⚠️ Error al crear el ticket.',
      }

      updateMessages((prev) => [...prev, errorMessage], onMessagesChange)
    } finally {
      setLoading(false)
    }
  }

  const resetChat = () => {
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
    submitTicketForm,
  }
}
