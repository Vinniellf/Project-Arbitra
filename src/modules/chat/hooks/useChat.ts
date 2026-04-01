import { useState } from 'react'
import type { Message } from '../types/chat.types'
import { getPepeResponse } from '../services/pepe.service'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (
    chatId: string,
    text: string,
    onMessagesChange?: (messages: Message[]) => void
  ) => {
    if (!text.trim()) return

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

    const delay = Math.min(2000, 600 + text.length * 20)

    setTimeout(() => {
      const response = getPepeResponse(chatId, text) 

      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
      }

      setMessages((prev) => {
        const updated = [...prev, botMessage]
        onMessagesChange?.(updated)
        return updated
      })

      setLoading(false)
    }, delay)
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
