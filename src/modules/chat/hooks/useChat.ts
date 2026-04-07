import { useState } from 'react'
import type { Message } from '../types/chat.types'
import { streamPepeResponse } from '../services/pepe.service' 

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (
    chatId: string,
    text: string,
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    if (!text.trim() || loading) return

    // 1. Inyectar el mensaje del usuario
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => {
      const updated = [...prev, userMessage]
      onMessagesChange?.(updated)
      return updated
    })

    setLoading(true)

    // 2. Crear una "burbuja" vacía para el asistente
    const botMessageId = crypto.randomUUID()
    const botMessage: Message = {
      id: botMessageId,
      role: 'assistant',
      content: '', 
    }

    setMessages((prev) => {
      const updated = [...prev, botMessage]
      onMessagesChange?.(updated)
      return updated
    })

    // 3. Conectarse a Bedrock e ir llenando la burbuja
    try {
      await streamPepeResponse(
        chatId,
        text,
        (chunk: string) => {
          setMessages((prev) => {
            const updated = prev.map((msg) =>
              msg.id === botMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
            onMessagesChange?.(updated)
            return updated
          })
        },
        () => {
          setLoading(false)
        }
      )
    } catch (error) {
      console.error("Error en la conexión con el Agente:", error)
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