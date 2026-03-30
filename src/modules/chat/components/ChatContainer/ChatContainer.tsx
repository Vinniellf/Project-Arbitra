import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChatHeader } from '../ChatHeader/ChatHeader'
import { ChatWelcome } from '../ChatWelcome/ChatWelcome'
import { ChatSidebar } from '../ChatSidebar/ChatSidebar'
import { ChatInput } from '../ChatInput/ChatInput'
import { ChatMessages } from '../ChatMessages/ChatMessages'
import { useChat } from '@/modules/chat/hooks/useChat'

export const ChatContainer = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { messages, sendMessage, loading } = useChat()

  return (
    <div
      className="
        w-full
        h-[80vh]      
        bg-white/80 backdrop-blur-xl
        rounded-2xl shadow-xl
        overflow-hidden
        flex
        relative
      "
    >
      {/* SIDEBAR */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <ChatSidebar
            key="chat-sidebar"
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* CHAT */}
      <div className="flex-1 flex flex-col relative">
        {/* HEADER */}
        <ChatHeader onToggleMenu={() => setIsSidebarOpen((prev) => !prev)} />

        {/* MENSAJES (SCROLL REAL) */}
        <div className="flex-1 flex flex-col min-h-0">
          <div
            className="
              flex-1
              overflow-y-auto
              pb-32
              scroll-smooth
              will-change-transform
            "
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {messages.length === 0 ? (
              <ChatWelcome />
            ) : (
              <ChatMessages messages={messages} loading={loading} />
            )}
          </div>
        </div>

        {/* INPUT FLOTANTE */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  )
}
