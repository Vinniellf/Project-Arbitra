import { useState } from 'react'
import type { Message, TicketFormData } from '../types/chat.types'
import { sendPepeAgentMessage } from '../services/generate-ticket-api.service'
import { createSupportTicket } from '../services/send-ticket-api.service'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const updateMessages = (
    updater: (prev: Message[]) => Message[],
    onMessagesChange?: (messages: Message[]) => void,
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
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    const trimmedText = text.trim()

    if (!trimmedText || loading) return

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

      if (parsed.showTicketForm) {
        updateMessages((prev) => {
          const alreadyExists = prev.some(
            (msg) => msg.role === 'assistant' && msg.kind === 'ticket_form',
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

  const submitTicketForm = async (
    chatId: string,
    data: TicketFormData,
    onMessagesChange?: (messages: Message[]) => void,
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
