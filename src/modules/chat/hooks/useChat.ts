import { useState } from 'react'
import type { Message, TicketFormData } from '../types/chat.types'
import {
  streamPepeResponse,
  clearPepeSession,
  getPepeSessionId,
} from '../services/pepe.service'
import { getMemoryBySession } from '../services/memory-api.service'

const normalizeTicketFormData = (
  ticketDraft?: Partial<TicketFormData>,
): TicketFormData => ({
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

const isEmptyTicketData = (data: TicketFormData): boolean => {
  return Object.values(data).every((value) => !value.trim())
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submittingTicket, setSubmittingTicket] = useState(false)

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

    if (!trimmedText || loading || savingDraft || submittingTicket) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmedText,
      kind: 'text',
    }

    const assistantMessageId = crypto.randomUUID()

    updateMessages(
      (prev) => [
        ...prev,
        userMessage,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          kind: 'text',
        },
      ],
      onMessagesChange,
    )

    setLoading(true)

    await streamPepeResponse(
      chatId,
      trimmedText,
      (chunk, action) => {
        updateMessages(
          (prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? {
                    ...msg,
                    content: msg.content + chunk,
                    action: action ?? msg.action,
                  }
                : msg,
            ),
          onMessagesChange,
        )
      },
      () => {
        setLoading(false)
      },
    )
  }

  const openTicketForm = async (
    chatId: string,
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (loading || savingDraft || submittingTicket) return

    try {
      const sessionId = getPepeSessionId(chatId)
      const data = await getMemoryBySession(sessionId)
      const ticketFormData = normalizeTicketFormData(data.memory)

      if (isEmptyTicketData(ticketFormData)) {
        throw new Error(
          'Aún no hay información suficiente para mostrar el formulario. Continúa describiendo el caso.',
        )
      }

      const formMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'ticket_form',
        content:
          'Puedes revisar la información detectada antes de enviar la solicitud.',
        ticketFormData,
      }

      updateMessages(
        (prev) => {
          const filtered = prev.filter((msg) => msg.kind !== 'ticket_form')
          return [...filtered, formMessage]
        },
        onMessagesChange,
      )
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'text',
        content:
          error instanceof Error
            ? `⚠️ ${error.message}`
            : '⚠️ No se pudo cargar la información del formulario.',
      }

      updateMessages((prev) => [...prev, errorMessage], onMessagesChange)
    }
  }

  const saveTicketDraft = async (
    _chatId: string,
    data: TicketFormData,
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (savingDraft || loading || submittingTicket) return

    setSavingDraft(true)

    try {
      const formMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'ticket_form',
        content: 'Cambios actualizados localmente.',
        ticketFormData: data,
      }

      updateMessages(
        (prev) => {
          const filtered = prev.filter((msg) => msg.kind !== 'ticket_form')
          return [...filtered, formMessage]
        },
        onMessagesChange,
      )
    } finally {
      setSavingDraft(false)
    }
  }

  const submitTicketForm = async (
    _chatId: string,
    _data: TicketFormData,
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (loading || savingDraft || submittingTicket) return

    setSubmittingTicket(true)

    try {
      const warningMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'text',
        content:
          'El formulario está listo. Falta conectar el nuevo endpoint final para crear la solicitud.',
      }

      updateMessages((prev) => [...prev, warningMessage], onMessagesChange)
    } finally {
      setSubmittingTicket(false)
    }
  }

  const resetChat = (chatId?: string) => {
    if (chatId) {
      clearPepeSession(chatId)
    }

    setMessages([])
    setLoading(false)
    setSavingDraft(false)
    setSubmittingTicket(false)
  }

  const loadMessages = (newMessages: Message[]) => {
    setMessages(newMessages)
  }

  return {
    messages,
    sendMessage,
    loading,
    savingDraft,
    submittingTicket,
    resetChat,
    loadMessages,
    submitTicketForm,
    saveTicketDraft,
    openTicketForm,
  }
}
