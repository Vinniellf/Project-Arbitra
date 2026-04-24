import { useState } from 'react'
import { useChat } from '@/modules/chat/hooks/useChat'
import { useChatUI } from '@/modules/chat/hooks/useChatUI'
import { useChatHistory } from '@/modules/chat/hooks/useChatHistory'
import { ChatLayout } from '@/modules/chat/layouts/ChatLayout'
import type {
  Chat,
  Message,
  TicketFormData,
} from '@/modules/chat/types/chat.types'
import { createChat } from '@/modules/chat/services/chat.service'

const ACTIVE_CHAT_KEY = 'active_chat_id'

export const ChatContainer = () => {
  const chat = useChat()
  const ui = useChatUI()
  const history = useChatHistory()

  const [activeChatId, setActiveChatId] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_CHAT_KEY),
  )

  const setActiveChat = (id: string | null) => {
    setActiveChatId(id)

    if (id) {
      localStorage.setItem(ACTIVE_CHAT_KEY, id)
      return
    }

    localStorage.removeItem(ACTIVE_CHAT_KEY)
  }

  const getOrCreateActiveChatId = () => {
    if (activeChatId) return activeChatId

    const newChatId = crypto.randomUUID()
    setActiveChat(newChatId)
    return newChatId
  }

  const syncMessagesToHistory = (
    chatId: string,
    updatedMessages: Message[],
  ) => {
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
    const selected = history.chats.find((chatItem) => chatItem.id === chatId)
    if (!selected) return

    setActiveChat(chatId)
    chat.loadMessages(selected.messages)
    ui.closeSidebar()
  }

  const handleSendMessage = (text: string) => {
    const currentChatId = getOrCreateActiveChatId()

    chat.sendMessage(currentChatId, text, (updatedMessages: Message[]) => {
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleGenerateTicket = () => {
    const currentChatId = getOrCreateActiveChatId()

    chat.openTicketForm(currentChatId, (updatedMessages: Message[]) => {
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleSaveTicketDraft = (data: TicketFormData) => {
    const currentChatId = getOrCreateActiveChatId()

    chat.saveTicketDraft(currentChatId, data, (updatedMessages: Message[]) => {
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleSubmitTicketForm = (data: TicketFormData) => {
    const currentChatId = getOrCreateActiveChatId()

    chat.submitTicketForm(currentChatId, data, (updatedMessages: Message[]) => {
      syncMessagesToHistory(currentChatId, updatedMessages)
    })
  }

  const handleResetChat = () => {
    if (activeChatId) {
      chat.resetChat(activeChatId)
    } else {
      chat.resetChat()
    }

    setActiveChat(null)
  }

  const handleDeleteChat = (chatId: string) => {
    history.deleteChat(chatId)

    if (chatId === activeChatId) {
      chat.resetChat(chatId)
      setActiveChat(null)
    }
  }

  const handleNewChat = () => {
    chat.resetChat()
    setActiveChat(null)
    ui.closeSidebar()
  }

  return (
    <ChatLayout
      messages={chat.messages}
      loading={chat.loading}
      savingDraft={chat.savingDraft}
      submittingTicket={chat.submittingTicket}
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
      onSaveTicketDraft={handleSaveTicketDraft}
      onSubmitTicketForm={handleSubmitTicketForm}
    />
  )
}
