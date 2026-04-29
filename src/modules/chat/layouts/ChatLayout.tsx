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
  generatingTicket: boolean
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
  onSubmitTicketForm: (data: TicketFormData) => void
  onConfirmTicketCreation: (data: TicketFormData) => void
  onEditTicket: (data: TicketFormData) => void
}

export const ChatLayout = ({
  messages,
  loading,
  generatingTicket,
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
  onSubmitTicketForm,
  onConfirmTicketCreation,
  onEditTicket,
}: Props) => {
  const inputRef = useRef<HTMLDivElement | null>(null)
  const bottomSpacer = useBottomSpacer(inputRef)

  const [shouldScrollToNextAssistant, setShouldScrollToNextAssistant] =
    useState(false)

  const isBusy = loading || generatingTicket || submittingTicket

  const { containerRef, lastAssistantRef } = useAutoScroll(messages, {
    loading: isBusy,
    shouldScrollToNextAssistant,
    onScrolledToNextAssistant: () => setShouldScrollToNextAssistant(false),
  })

  const handleSendMessage = (msg: string) => {
    if (isBusy) return

    setShouldScrollToNextAssistant(true)
    sendMessage(msg)
  }

  const handleGenerateTicket = () => {
    if (isBusy) return

    setShouldScrollToNextAssistant(true)
    onGenerateTicket()
  }

  const handleConfirmTicketCreation = (data: TicketFormData) => {
    if (isBusy) return

    setShouldScrollToNextAssistant(true)
    onConfirmTicketCreation(data)
  }

  const handleEditTicket = (data: TicketFormData) => {
    if (isBusy) return

    setShouldScrollToNextAssistant(true)
    onEditTicket(data)
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
                  loading={loading || generatingTicket || submittingTicket}
                  generatingTicket={generatingTicket}
                  lastAssistantRef={lastAssistantRef}
                  bottomSpacer={bottomSpacer}
                  onGenerateTicket={handleGenerateTicket}
                  onSubmitTicketForm={onSubmitTicketForm}
                  onConfirmTicketCreation={handleConfirmTicketCreation}
                  onEditTicket={handleEditTicket}
                  submittingTicket={submittingTicket}
                />
              )}
            </div>

            <div
              ref={inputRef}
              className="sticky bottom-0 w-full px-2.5 sm:px-3 md:px-4 pb-2 sm:pb-3 bg-white"
            >
              <ChatInput onSend={handleSendMessage} loading={isBusy} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
