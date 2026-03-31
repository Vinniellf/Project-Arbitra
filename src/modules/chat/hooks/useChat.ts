import { useState } from 'react'
import type { Message } from '../types/chat.types'
import { getPepeResponse } from '../services/pepe.service'
import { saveNewChat } from '../services/chat.service'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    
    const delay = Math.min(2000, 600 + text.length * 20)

    setTimeout(() => {
      const response = getPepeResponse(text)

      const botMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
      }

      setMessages((prev) => [...prev, botMessage])
      setLoading(false)
    }, delay)
  }

  // 🔥 NUEVO → reset chat
  const resetChat = () => {
    if (messages.length > 0) {
      saveNewChat(messages) // guarda antes de limpiar
    }

    setMessages([])
  }

  return {
    messages,
    sendMessage,
    loading,
    resetChat,
  }
}
