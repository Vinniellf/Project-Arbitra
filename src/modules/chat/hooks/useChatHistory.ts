import { useState } from 'react'
import type { Chat, Message } from '../types/chat.types'
import { getChats, saveChats, createChat } from '../services/chat.service'

export const useChatHistory = () => {
  const [chats, setChats] = useState<Chat[]>(() => getChats())

  const persist = (updated: Chat[]) => {
    setChats(updated)
    saveChats(updated)
  }

  const addChat = (messages: Message[]): Chat => {
    const newChat = createChat(messages)
    const updated = [newChat, ...chats].slice(0, 20)
    persist(updated)
    return newChat
  }

  const updateChat = (id: string, messages: Message[]) => {
    const updated = chats.map((chat) =>
      chat.id === id ? { ...chat, messages } : chat
    )

    persist(updated)
  }

  const deleteChat = (id: string) => {
    const updated = chats.filter((c) => c.id !== id)
    persist(updated)
  }

  const clearHistory = () => {
    persist([])
  }

  return {
    chats,
    addChat,
    updateChat,
    deleteChat,
    clearHistory,
  }
}
