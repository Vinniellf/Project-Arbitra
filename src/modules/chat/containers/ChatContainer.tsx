import { useState } from 'react'
import { useChat } from '@/modules/chat/hooks/useChat'
import { useChatUI } from '@/modules/chat/hooks/useChatUI'
import { useChatHistory } from '@/modules/chat/hooks/useChatHistory'
import { ChatLayout } from '@/modules/chat/layouts/ChatLayout'
import type { Chat, Message, TicketPriority } from '@/modules/chat/types/chat.types'
import { resetFailureAttempts } from '@/modules/chat/utils/chat-ticket-attempts.utils'
import { createChat } from '@/modules/chat/services/chat.service'

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

  const syncMessagesToHistory = (chatId: string, updatedMessages: Message[]) => {
    const chatExists = history.chats.some((chatItem) => chatItem.id === chatId)

    if (!chatExists) {
      const newChat: Chat = createChat(updatedMessages, chatId)
      history.addChat(newChat)
      setActiveChat(chatId)
      return
    }

    history.updateChat(chatId, updatedMessages)
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
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleGenerateTicket = () => {
    const currentChatId = activeChatId ?? crypto.randomUUID()

    chat.insertTicketFormMessage((updatedMessages: Message[]) => {
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleSubmitTicketForm = (data: {
    subject: string
    description: string
    priority: TicketPriority
  }) => {
    const currentChatId = activeChatId ?? crypto.randomUUID()

    chat.submitTicketForm(data, (updatedMessages: Message[]) => {
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleResetChat = () => {
    if (activeChatId) {
      resetFailureAttempts(activeChatId)
    }

    setActiveChat(null)
    chat.resetChat(activeChatId ?? undefined)
  }

  const handleDeleteChat = (chatId: string) => {
    resetFailureAttempts(chatId)
    history.deleteChat(chatId)

    if (chatId === activeChatId) {
      setActiveChat(null)
      chat.resetChat(chatId)
    }
  }

  const handleNewChat = () => {
    if (activeChatId) {
      resetFailureAttempts(activeChatId)
    }

    setActiveChat(null)
    chat.resetChat(activeChatId ?? undefined)
    ui.closeSidebar()
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
      onSubmitTicketForm={handleSubmitTicketForm}
    />
  )
}
