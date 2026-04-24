import { AnimatePresence } from 'framer-motion'
import { useRef, useState } from 'react'
import clsx from 'clsx'
import type { Chat, Message, TicketFormData } from '../types/chat.types'

import { ChatHeader } from '@/modules/chat/components/ChatHeader/ChatHeader'
import { ChatSidebar } from '@/modules/chat/components/ChatSidebar/ChatSidebar'
import { ChatMessages } from '@/modules/chat/components/ChatMessages/ChatMessages'
import { ChatWelcome } from '@/modules/chat/components/ChatWelcome/ChatWelcome'
import { ChatInput } from '@/modules/chat/components/ChatInput/ChatInput'

import { useAutoScroll } from '@/modules/chat/hooks/useAutoScroll'
import { useBottomSpacer } from '@/modules/chat/hooks/useBottomSpacer'

type Props = {
  messages: Message[]
  loading: boolean
  savingDraft: boolean
  submittingTicket: boolean
  sendMessage: (msg: string) => void
  resetChat: () => void
  isSidebarOpen: boolean
  isFullscreen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  toggleFullscreen: () => void
  chats: Chat[]
  onSelectChat: (id: string) => void
  activeChatId: string | null
  onDeleteChat: (id: string) => void
  onNewChat: () => void
  onGenerateTicket: () => void
  onSaveTicketDraft: (data: TicketFormData) => void
  onSubmitTicketForm: (data: TicketFormData) => void
}

export const ChatLayout = ({
  messages,
  loading,
  savingDraft,
  submittingTicket,
  sendMessage,
  resetChat,
  isSidebarOpen,
  isFullscreen,
  toggleSidebar,
  closeSidebar,
  toggleFullscreen,
  chats,
  onSelectChat,
  activeChatId,
  onDeleteChat,
  onNewChat,
  onGenerateTicket,
  onSaveTicketDraft,
  onSubmitTicketForm,
}: Props) => {
  const inputRef = useRef<HTMLDivElement | null>(null)
  const bottomSpacer = useBottomSpacer(inputRef)

  const [shouldScrollToNextAssistant, setShouldScrollToNextAssistant] =
    useState(false)

  const { containerRef, lastAssistantRef } = useAutoScroll(messages, {
    loading,
    shouldScrollToNextAssistant,
    onScrolledToNextAssistant: () => setShouldScrollToNextAssistant(false),
  })

  const handleSendMessage = (msg: string) => {
    if (loading || savingDraft || submittingTicket) return

    setShouldScrollToNextAssistant(true)
    sendMessage(msg)
  }

  const handleGenerateTicket = () => {
    if (loading || savingDraft || submittingTicket) return

    setShouldScrollToNextAssistant(true)
    onGenerateTicket()
  }

  const containerClasses = clsx(
    'bg-white backdrop-blur-xl shadow-xl overflow-hidden flex',
    isFullscreen
      ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none'
      : 'relative w-full h-screen sm:h-[85vh] md:h-[90vh] rounded-none sm:rounded-2xl',
  )

  return (
    <div className={containerClasses}>
      <div className="flex-1 flex flex-col h-full min-w-0">
        <ChatHeader
          onToggleMenu={toggleSidebar}
          onReset={resetChat}
          onExpand={toggleFullscreen}
          isFullscreen={isFullscreen}
        />

        <div className="relative flex-1 min-h-0 flex">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <ChatSidebar
                key="sidebar"
                onClose={closeSidebar}
                chats={chats}
                onSelectChat={onSelectChat}
                activeChatId={activeChatId}
                onDeleteChat={onDeleteChat}
                onNewChat={onNewChat}
              />
            )}
          </AnimatePresence>

          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto scroll-smooth"
            >
              {messages.length === 0 ? (
                <ChatWelcome />
              ) : (
                <ChatMessages
                  messages={messages}
                  loading={loading}
                  lastAssistantRef={lastAssistantRef}
                  bottomSpacer={bottomSpacer}
                  onGenerateTicket={handleGenerateTicket}
                  onSaveTicketDraft={onSaveTicketDraft}
                  onSubmitTicketForm={onSubmitTicketForm}
                  savingDraft={savingDraft}
                  submittingTicket={submittingTicket}
                />
              )}
            </div>

            <div
              ref={inputRef}
              className="sticky bottom-0 w-full px-2.5 sm:px-3 md:px-4 pb-2 sm:pb-3 bg-white"
            >
              <ChatInput
                onSend={handleSendMessage}
                loading={loading || savingDraft || submittingTicket}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
