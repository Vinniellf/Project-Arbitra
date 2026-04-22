import { useState } from 'react'
import type { Message } from '../types/chat.types'
import { sendPepeAgentMessage } from '../services/pepe-agent-api.service'
import { createSupportTicket } from '../services/create-ticket-api.service'

type TicketFormSubmitData = {
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

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  // actualiza mensajes y sincroniza con history si aplica
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

    // evita envíos vacíos o mientras ya se está procesando uno
    if (!trimmedText || loading) return

    // agrega el mensaje del usuario al chat
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

      // si el backend no pudo interpretar la respuesta del agente
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

      // si el agente pide mostrar formulario, solo se muestra el formulario
      // y no se agrega además un mensaje de texto normal
      if (parsed.showTicketForm) {
        updateMessages((prev) => {
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
              category: parsed.ticketDraft?.category ?? '',
              subcategory: parsed.ticketDraft?.subcategory ?? '',
              requester: parsed.ticketDraft?.requester ?? '',
              userCompany: parsed.ticketDraft?.userCompany ?? '',
              businessUnit: parsed.ticketDraft?.businessUnit ?? '',
              site: parsed.ticketDraft?.site ?? '',
              equipmentModel: parsed.ticketDraft?.equipmentModel ?? '',
              serial: parsed.ticketDraft?.serial ?? '',
              description: parsed.ticketDraft?.description ?? '',
            },
          }

          return [...prev, formMessage]
        }, onMessagesChange)

        return
      }

      // respuesta conversacional normal
      const assistantReply = parsed.reply.trim()

      if (assistantReply) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: assistantReply,
          kind: 'text',
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

  // envía el formulario final al backend /tickets
  const submitTicketForm = async (
    chatId: string,
    data: TicketFormSubmitData,
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    const subject = data.subject.trim()
    const category = data.category.trim()
    const subcategory = data.subcategory.trim()
    const requester = data.requester.trim()
    const userCompany = data.userCompany.trim()
    const businessUnit = data.businessUnit.trim()
    const site = data.site.trim()
    const equipmentModel = data.equipmentModel.trim()
    const serial = data.serial.trim()
    const description = data.description.trim()

    if (
      !subject ||
      !category ||
      !subcategory ||
      !requester ||
      !userCompany ||
      !businessUnit ||
      !site ||
      !equipmentModel ||
      !serial ||
      !description ||
      loading
    ) {
      return
    }

    setLoading(true)

    try {
      const response = await createSupportTicket({
        subject,
        category,
        subcategory,
        requester,
        userCompany,
        businessUnit,
        site,
        equipmentModel,
        serial,
        description,
        sessionId: chatId,
        source: 'chat-form',
      })

      // resumen visible en el lado del usuario
      const summaryMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        kind: 'ticket_summary',
        content: '',
        ticketFormData: {
          subject,
          category,
          subcategory,
          requester,
          userCompany,
          businessUnit,
          site,
          equipmentModel,
          serial,
          description,
        },
      }

      // confirmación del sistema
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

      // elimina el formulario del chat y agrega el resumen + éxito
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
