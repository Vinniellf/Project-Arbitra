import { useState } from 'react'
import type { Message, TicketFormData } from '../types/chat.types'
import { sendPepeAgentMessage } from '../services/generate-ticket-api.service'
import { createSupportTicket } from '../services/send-ticket-api.service'
import type { PepeTicketDraft } from '../types/pepe-agent.types'

const EMPTY_TICKET_DRAFT: PepeTicketDraft = {
  subject: '',
  category: '',
  subcategory: '',
  requester: '',
  userCompany: '',
  businessUnit: '',
  site: '',
  equipmentModel: '',
  serial: '',
  description: '',
}

const normalizeTicketFormData = (
  ticketDraft?: Partial<PepeTicketDraft>,
): Partial<TicketFormData> => ({
  subject: ticketDraft?.subject ?? '',
  category: ticketDraft?.category ?? '',
  subcategory: ticketDraft?.subcategory ?? '',
  requester: ticketDraft?.requester ?? '',
  userCompany: ticketDraft?.userCompany ?? '',
  businessUnit: ticketDraft?.businessUnit ?? '',
  site: ticketDraft?.site ?? '',
  equipmentModel: ticketDraft?.equipmentModel ?? '',
  serial: ticketDraft?.serial ?? '',
  description: ticketDraft?.description ?? '',
})

const hasMeaningfulDraftData = (ticketDraft?: Partial<PepeTicketDraft>) => {
  if (!ticketDraft) return false

  return Object.values(ticketDraft).some(
    (value) => typeof value === 'string' && value.trim().length > 0,
  )
}

const shouldSuggestTicket = (reply: string, missingFields: string[]) => {
  const normalizedReply = reply.toLowerCase()

  const containsTicketIntent =
    normalizedReply.includes('ticket') ||
    normalizedReply.includes('crear ticket') ||
    normalizedReply.includes('generar ticket') ||
    normalizedReply.includes('abrir ticket')

  return containsTicketIntent || missingFields.length === 0
}

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

      const assistantReply = response.reply.trim()
      const draft = response.draft
      const ticketDraft = draft?.ticketDraft ?? EMPTY_TICKET_DRAFT
      const hasDraftData = hasMeaningfulDraftData(ticketDraft)

      const normalizedReply =
        assistantReply || 'Recibí tu mensaje y estoy listo para seguir ayudándote.'

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: normalizedReply,
        kind: 'text',
        action: shouldSuggestTicket(normalizedReply, draft.missingFields)
          ? 'generate_ticket'
          : undefined,
      }

      updateMessages((prev) => [...prev, assistantMessage], onMessagesChange)

      const userExplicitlyAskedForTicket =
        trimmedText.toLowerCase().includes('generar ticket') ||
        trimmedText.toLowerCase().includes('crear ticket') ||
        trimmedText.toLowerCase().includes('abrir ticket')

      const shouldShowTicketForm =
        userExplicitlyAskedForTicket ||
        draft.status === 'draft_ready' ||
        (draft.missingFields.length === 0 && hasDraftData)

      if (shouldShowTicketForm) {
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
            ticketFormData: normalizeTicketFormData(ticketDraft),
          }

          return [...prev, formMessage]
        }, onMessagesChange)
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
