import { useState } from 'react'
import { useChat } from '@/modules/chat/hooks/useChat'
import { useChatUI } from '@/modules/chat/hooks/useChatUI'
import { useChatHistory } from '@/modules/chat/hooks/useChatHistory'
import { ChatLayout } from '@/modules/chat/layouts/ChatLayout'
import type { Message } from '@/modules/chat/types/chat.types'
import { resetFailureAttempts } from '@/modules/chat/utils/chat-ticket-attempts.utils'

const ACTIVE_CHAT_KEY = 'active_chat_id'

export const ChatContainer = () => {
  const chat = useChat()
  const ui = useChatUI()
  const history = useChatHistory()

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_CHAT_KEY)
  })

  const setActiveChat = (id: string | null) => {
    setActiveChatId(id)

    if (id) {
      localStorage.setItem(ACTIVE_CHAT_KEY, id)
    } else {
      localStorage.removeItem(ACTIVE_CHAT_KEY)
    }
  }

  const handleSelectChat = (chatId: string) => {
    const selected = history.chats.find((c) => c.id === chatId)
    if (!selected) return

    setActiveChat(chatId)
    chat.loadMessages(selected.messages)
    ui.closeSidebar()
  }

  const handleSendMessage = (text: string) => {
    const currentChatId = activeChatId ?? crypto.randomUUID()

    chat.sendMessage(currentChatId, text, (updatedMessages: Message[]) => {
      if (!activeChatId) {
        const newChat = history.addChat(updatedMessages)
        setActiveChat(newChat.id)
      } else {
        history.updateChat(currentChatId, updatedMessages)
      }
    })
  }

  const handleResetChat = () => {
    if (activeChatId) {
      resetFailureAttempts(activeChatId)
    }

    setActiveChat(null)
    chat.resetChat()
  }

  const handleDeleteChat = (chatId: string) => {
    resetFailureAttempts(chatId)
    history.deleteChat(chatId)

    if (chatId === activeChatId) {
      setActiveChat(null)
      chat.resetChat()
    }
  }

  const handleNewChat = () => {
    if (activeChatId) {
      resetFailureAttempts(activeChatId)
    }

    setActiveChat(null)
    chat.resetChat()
    ui.closeSidebar()
  }

  const handleGenerateTicket = () => {
    console.log('Abrir flujo para generar ticket')
    // Aquí luego conectas:
    // - un modal
    // - una ruta como /tickets/new
    // - o un POST a tu API
  }

  return (
    <ChatLayout
      messages={chat.messages}
      loading={chat.loading}
      sendMessage={handleSendMessage}
      resetChat={handleResetChat}
      isSidebarOpen={ui.isSidebarOpen}
      isFullscreen={ui.isFullscreen}
      toggleSidebar={ui.toggleSidebar}
      closeSidebar={ui.closeSidebar}
      toggleFullscreen={ui.toggleFullscreen}
      chats={history.chats}
      onSelectChat={handleSelectChat}
      activeChatId={activeChatId}
      onDeleteChat={handleDeleteChat}
      onNewChat={handleNewChat}
      onGenerateTicket={handleGenerateTicket}
    />
  )
}
