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

const containsTicketIntentInReply = (reply: string) => {
  const normalizedReply = reply.toLowerCase()

  return (
    normalizedReply.includes('ticket') ||
    normalizedReply.includes('crear ticket') ||
    normalizedReply.includes('generar ticket') ||
    normalizedReply.includes('abrir ticket')
  )
}

const containsUserTicketIntent = (text: string) => {
  const normalizedText = text.toLowerCase()

  return (
    normalizedText.includes('ticket') ||
    normalizedText.includes('crear ticket') ||
    normalizedText.includes('generar ticket') ||
    normalizedText.includes('abrir ticket')
  )
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [currentTicketDraft, setCurrentTicketDraft] =
    useState<PepeTicketDraft>(EMPTY_TICKET_DRAFT)

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

      setCurrentTicketDraft(ticketDraft)

      const normalizedReply =
        assistantReply || 'Recibí tu mensaje y estoy listo para seguir ayudándote.'

      const userExplicitlyAskedForTicket = containsUserTicketIntent(trimmedText)

      const shouldShowGenerateTicketButton =
        userExplicitlyAskedForTicket ||
        containsTicketIntentInReply(normalizedReply) ||
        draft.status === 'draft_ready' ||
        (draft.missingFields.length === 0 && hasDraftData)

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: normalizedReply,
        kind: 'text',
        action: shouldShowGenerateTicketButton ? 'generate_ticket' : undefined,
      }

      updateMessages((prev) => [...prev, assistantMessage], onMessagesChange)
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

  const openTicketForm = (
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (loading) return

    const formMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      kind: 'ticket_form',
      content:
        'He preparado el formulario del ticket con la información detectada. Revísalo antes de enviarlo.',
      ticketFormData: normalizeTicketFormData(currentTicketDraft),
    }

    updateMessages((prev) => {
      const filtered = prev.filter((msg) => msg.kind !== 'ticket_form')
      return [...filtered, formMessage]
    }, onMessagesChange)
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
    setCurrentTicketDraft(EMPTY_TICKET_DRAFT)
  }

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages)

    const latestDraftSource = [...newMessages]
      .reverse()
      .find(
        (msg) =>
          (msg.kind === 'ticket_form' || msg.kind === 'ticket_summary') &&
          msg.ticketFormData,
      )

    if (latestDraftSource?.ticketFormData) {
      setCurrentTicketDraft({
        subject: latestDraftSource.ticketFormData.subject ?? '',
        category: latestDraftSource.ticketFormData.category ?? '',
        subcategory: latestDraftSource.ticketFormData.subcategory ?? '',
        requester: latestDraftSource.ticketFormData.requester ?? '',
        userCompany: latestDraftSource.ticketFormData.userCompany ?? '',
        businessUnit: latestDraftSource.ticketFormData.businessUnit ?? '',
        site: latestDraftSource.ticketFormData.site ?? '',
        equipmentModel: latestDraftSource.ticketFormData.equipmentModel ?? '',
        serial: latestDraftSource.ticketFormData.serial ?? '',
        description: latestDraftSource.ticketFormData.description ?? '',
      })
      return
    }

    setCurrentTicketDraft(EMPTY_TICKET_DRAFT)
  }

  return {
    messages,
    sendMessage,
    loading,
    resetChat,
    loadMessages,
    submitTicketForm,
    openTicketForm,
  }
}
