import type { Message, Chat } from '../types/chat.types'

export const saveNewChat = (messages: Message[]) => {
  try {
    const stored = localStorage.getItem('chats')
    const chats = stored ? JSON.parse(stored) : []

    const newChat = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      messages,
    }

    const updatedChats = [newChat, ...chats].slice(0, 20) // 🔥 límite

    localStorage.setItem('chats', JSON.stringify(updatedChats))
  } catch (error) {
    console.error('Error saving chat:', error)
  }
}

const STORAGE_KEY = 'chats'

export const getChats = (): Chat[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const saveChats = (chats: Chat[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
}

export const createChat = (messages: Message[]): Chat => ({
  id: crypto.randomUUID(),
  date: new Date().toISOString(),
  messages,
})
