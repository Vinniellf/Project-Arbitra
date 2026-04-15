import type { Message, Chat } from '../types/chat.types'

const STORAGE_KEY = 'chats'
const MAX_CHATS = 20

export const getChats = (): Chat[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Chat[]) : []
  } catch (error) {
    console.error('Error reading chats from localStorage:', error)
    return []
  }
}

export const saveChats = (chats: Chat[]) => {
  try {
    const limitedChats = chats.slice(0, MAX_CHATS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedChats))
  } catch (error) {
    console.error('Error saving chats to localStorage:', error)
  }
}

export const createChat = (messages: Message[], id?: string): Chat => ({
  id: id ?? crypto.randomUUID(),
  date: new Date().toISOString(),
  messages,
})
