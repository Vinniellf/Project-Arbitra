import { AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import clsx from 'clsx'
import type { Chat } from '../types/chat.types'

import { ChatHeader } from '@/modules/chat/components/ChatHeader/ChatHeader'
import { ChatSidebar } from '@/modules/chat/components/ChatSidebar/ChatSidebar'
import { ChatMessages } from '@/modules/chat/components/ChatMessages/ChatMessages'
import { ChatWelcome } from '@/modules/chat/components/ChatWelcome/ChatWelcome'
import { ChatInput } from '@/modules/chat/components/ChatInput/ChatInput'

import { useAutoScroll } from '@/modules/chat/hooks/useAutoScroll'
import { useBottomSpacer } from '@/modules/chat/hooks/useBottomSpacer'

type Message = {
  id: string
  content: string
  role: 'user' | 'assistant'
}

type Props = {
  messages: Message[]
  loading: boolean
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
}

export const ChatLayout = ({
  messages,
  loading,
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
}: Props) => {
  const inputRef = useRef<HTMLDivElement | null>(null)
  const bottomSpacer = useBottomSpacer(inputRef)

  const { containerRef, bottomRef } = useAutoScroll(messages, loading)

  const containerClasses = clsx(
    'bg-white backdrop-blur-xl shadow-xl overflow-hidden flex',
    isFullscreen
      ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none'
      : 'relative w-full h-screen sm:h-[85vh] md:h-[90vh] rounded-none sm:rounded-2xl',
  )

  return (
    <div className={containerClasses}>
      <div className="flex-1 flex flex-col h-full">
        {/* HEADER */}
        <ChatHeader
          onToggleMenu={toggleSidebar}
          onReset={resetChat}
          onExpand={toggleFullscreen}
          isFullscreen={isFullscreen}
        />

        {/* CONTENIDO */}
        <div className="relative flex-1 min-h-0 flex">
          {/* SIDEBAR */}
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

          {/* MENSAJES + INPUT */}
          <div className="flex flex-col flex-1 min-h-0">
            {/* MENSAJES */}
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto scroll-smooth px-1 sm:px-0"
            >
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <ChatWelcome key="welcome" />
                ) : (
                  <ChatMessages
                    key="messages"
                    messages={messages}
                    loading={loading}
                    bottomRef={bottomRef}
                    bottomSpacer={bottomSpacer}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* INPUT (STICKY PRO) */}
            <div
              ref={inputRef}
              className="sticky bottom-0 w-full px-2 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6 bg-white"
            >
              <ChatInput onSend={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
