import type { Message } from '../types/chat.types'

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: string
}

const KEY = 'pepe_chats'
const MAX_CHATS = 50 // 🔥 límite opcional

// obtener chats (seguro)
export const getChats = (): Chat[] => {
  try {
    const data = localStorage.getItem(KEY)
    if (!data) return []

    const parsed = JSON.parse(data)

    // validar estructura básica
    if (!Array.isArray(parsed)) return []

    return parsed
  } catch (error) {
    console.error('Error leyendo chats:', error)
    return []
  }
}

// guardar todos
const saveChats = (chats: Chat[]) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(chats))
  } catch (error) {
    console.error('Error guardando chats:', error)
  }
}

// generar título inteligente
const generateTitle = (messages: Message[]) => {
  const firstUserMsg = messages.find(m => m.role === 'user')

  if (!firstUserMsg || !firstUserMsg.content.trim()) {
    return 'Nuevo chat'
  }

  return firstUserMsg.content.slice(0, 30)
}

// guardar nuevo chat
export const saveNewChat = (messages: Message[]) => {
  if (!messages || messages.length === 0) return

  const chats = getChats()

  const newChat: Chat = {
    id: `chat-${Date.now()}`,
    title: generateTitle(messages),
    messages,
    createdAt: new Date().toISOString(),
  }

  const updatedChats = [newChat, ...chats].slice(0, MAX_CHATS)

  saveChats(updatedChats)
}

// actualizar chat existente
export const updateChat = (id: string, messages: Message[]) => {
  if (!id || !messages) return

  const chats = getChats()

  const exists = chats.some(chat => chat.id === id)
  if (!exists) {
    console.warn('Chat no encontrado:', id)
    return
  }

  const updatedChats = chats.map(chat =>
    chat.id === id
      ? {
          ...chat,
          messages,
          title: generateTitle(messages), // 🔥 actualiza título
        }
      : chat
  )

  saveChats(updatedChats)
}

// eliminar
export const deleteChat = (id: string) => {
  const chats = getChats()

  const updatedChats = chats.filter(c => c.id !== id)

  saveChats(updatedChats)
}

// 🔥 extra útil
export const clearChats = () => {
  localStorage.removeItem(KEY)
}
