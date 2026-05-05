import { useRef, useState } from 'react'
import type { Message, TicketFormData } from '../types/chat.types'
import {
  streamPepeResponse,
  clearPepeSession,
  getPepeSessionId,
} from '../services/pepe.service'
import { getMemoryBySession } from '../services/memory.service'
import { createTicket } from '../services/ticket.service'

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

const removeTicketFlowMessages = (messages: Message[]) => {
  return messages.filter(
    (msg) =>
      msg.kind !== 'ticket_form' &&
      msg.kind !== 'ticket_confirmation' &&
      msg.kind !== 'ticket_success',
  )
}

const removeTicketErrorMessages = (messages: Message[]) => {
  return messages.filter(
    (msg) => !(msg.kind === 'text' && msg.content.startsWith('⚠️')),
  )
}

const removeGenerateTicketActions = (messages: Message[]) => {
  return messages.map((msg) =>
    msg.action === 'generate_ticket'
      ? {
          ...msg,
          action: undefined,
        }
      : msg,
  )
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [generatingTicket, setGeneratingTicket] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [submittingTicket, setSubmittingTicket] = useState(false)

  const submittingTicketRef = useRef(false)

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

    if (
      !trimmedText ||
      loading ||
      generatingTicket ||
      savingDraft ||
      submittingTicket ||
      submittingTicketRef.current
    ) {
      return
    }

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
    if (
      loading ||
      generatingTicket ||
      savingDraft ||
      submittingTicket ||
      submittingTicketRef.current
    ) {
      return
    }

    const userTicketMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      kind: 'text',
      content: 'Generar ticket',
    }

    updateMessages(
      (prev) => [
        ...removeGenerateTicketActions(
          removeTicketErrorMessages(removeTicketFlowMessages(prev)),
        ),
        userTicketMessage,
      ],
      onMessagesChange,
    )

    setGeneratingTicket(true)

    try {
      const sessionId = getPepeSessionId(chatId)
      const data = await getMemoryBySession(sessionId)
      const ticketFormData = normalizeTicketFormData(data.memory)

      if (isEmptyTicketData(ticketFormData)) {
        throw new Error(
          'Aún no hay información suficiente para mostrar el formulario.',
        )
      }

      const formMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'ticket_form',
        content: '',
        ticketFormData,
      }

      updateMessages(
        (prev) => [
          ...removeTicketErrorMessages(removeTicketFlowMessages(prev)),
          formMessage,
        ],
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
            : '⚠️ Error cargando formulario',
      }

      updateMessages(
        (prev) => [...removeTicketErrorMessages(prev), errorMessage],
        onMessagesChange,
      )
    } finally {
      setGeneratingTicket(false)
    }
  }

  const submitTicketForm = (
    _chatId: string,
    data: TicketFormData,
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (
      loading ||
      generatingTicket ||
      savingDraft ||
      submittingTicket ||
      submittingTicketRef.current
    ) {
      return
    }

    const confirmationMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      kind: 'ticket_confirmation',
      content: '',
      ticketFormData: data,
    }

    updateMessages(
      (prev) => [
        ...removeTicketErrorMessages(removeTicketFlowMessages(prev)),
        confirmationMessage,
      ],
      onMessagesChange,
    )
  }

  const reopenTicketForm = (
    _chatId: string,
    data: TicketFormData,
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (
      loading ||
      generatingTicket ||
      savingDraft ||
      submittingTicket ||
      submittingTicketRef.current
    ) {
      return
    }

    const formMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      kind: 'ticket_form',
      content: '',
      ticketFormData: data,
    }

    updateMessages(
      (prev) => [
        ...removeTicketErrorMessages(removeTicketFlowMessages(prev)),
        formMessage,
      ],
      onMessagesChange,
    )
  }

  const confirmTicketCreation = async (
    chatId: string,
    data: TicketFormData,
    onMessagesChange?: (messages: Message[]) => void,
  ) => {
    if (
      loading ||
      generatingTicket ||
      savingDraft ||
      submittingTicket ||
      submittingTicketRef.current
    ) {
      return
    }

    submittingTicketRef.current = true
    setSubmittingTicket(true)

    try {
      const sessionId = getPepeSessionId(chatId)

      const result = await createTicket({
        sessionId,
      })

      const ticketCode = result.externalTicketId
        ? `TK-${result.externalTicketId}`
        : result.ticketId
          ? `TK-${result.ticketId.replace('ticket-', '')}`
          : 'TK-creado'

      const successMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'ticket_success',
        content: '',
        ticketFormData: {
          ...data,
          ticketCode,
        },
      }

      updateMessages(
        (prev) => [
          ...removeTicketErrorMessages(removeTicketFlowMessages(prev)),
          successMessage,
        ],
        onMessagesChange,
      )
    } catch (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        kind: 'text',
        content:
          error instanceof Error
            ? `⚠️ ${error.message}. Puedes intentar nuevamente.`
            : '⚠️ No se pudo crear el ticket. Puedes intentar nuevamente.',
      }

      updateMessages(
        (prev) => [
          ...prev.filter(
            (msg) =>
              msg.kind !== 'ticket_success' &&
              !(msg.kind === 'text' && msg.content.startsWith('⚠️')),
          ),
          errorMessage,
        ],
        onMessagesChange,
      )
    } finally {
      submittingTicketRef.current = false
      setSubmittingTicket(false)
    }
  }

  const resetChat = (chatId?: string) => {
    if (chatId) clearPepeSession(chatId)

    submittingTicketRef.current = false

    setMessages([])
    setLoading(false)
    setGeneratingTicket(false)
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
    generatingTicket,
    savingDraft,
    submittingTicket,
    resetChat,
    loadMessages,
    submitTicketForm,
    openTicketForm,
    reopenTicketForm,
    confirmTicketCreation,
  }
}
