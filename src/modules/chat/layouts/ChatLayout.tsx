import { AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
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

type ChatState = {
  messages: Message[]
  loading: boolean
  sendMessage: (msg: string) => void
  resetChat: () => void
}

type UIState = {
  isSidebarOpen: boolean
  isFullscreen: boolean
  toggleSidebar: () => void
  closeSidebar: () => void
  toggleFullscreen: () => void
}

type Props = {
  chat: ChatState
  ui: UIState
}

export const ChatLayout = ({ chat, ui }: Props) => {
  const inputRef = useRef<HTMLDivElement | null>(null)
  const bottomSpacer = useBottomSpacer(inputRef)

  const { containerRef, bottomRef } = useAutoScroll(
    chat.messages,
    chat.loading
  )

  const containerClasses = `
    ${
      ui.isFullscreen
        ? 'fixed inset-0 z-[9999] w-screen h-screen rounded-none'
        : 'relative w-full h-screen sm:h-[85vh] md:h-[80vh] rounded-none sm:rounded-2xl'
    }
    bg-white backdrop-blur-xl shadow-xl overflow-hidden flex
  `

  return (
    <div className={containerClasses}>
      <div className="flex-1 flex flex-col relative h-full">
        
        {/* HEADER */}
        <ChatHeader
          onToggleMenu={ui.toggleSidebar}
          onReset={chat.resetChat}
          onExpand={ui.toggleFullscreen}
          isFullscreen={ui.isFullscreen}
        />

        {/* CONTENIDO */}
        <div className="relative flex-1 min-h-0">
          
          {/* SIDEBAR */}
          <AnimatePresence mode="wait">
            {ui.isSidebarOpen && <ChatSidebar onClose={ui.closeSidebar} />}
          </AnimatePresence>

          {/* MENSAJES */}
          <div className="flex flex-col h-full min-h-0">
            <div
              ref={containerRef}
              className="flex-1 overflow-y-auto scroll-smooth px-1 sm:px-0"
            >
              {chat.messages.length === 0 ? (
                <ChatWelcome />
              ) : (
                <ChatMessages
                  messages={chat.messages}
                  loading={chat.loading}
                  bottomRef={bottomRef}
                  bottomSpacer={bottomSpacer}
                />
              )}
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div
          ref={inputRef}
          className="absolute bottom-0 left-0 w-full px-2 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6"
        >
          <ChatInput onSend={chat.sendMessage} />
        </div>
      </div>
    </div>
  )
}
