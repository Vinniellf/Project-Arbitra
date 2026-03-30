import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChatHeader } from '../ChatHeader/ChatHeader'
import { ChatWelcome } from '../ChatWelcome/ChatWelcome'
import { ChatSidebar } from '../ChatSidebar/ChatSidebar'
import { ChatInput } from '../ChatInput/ChatInput'

export const ChatContainer = () => {
  const messages = [] // Aquí irían los mensajes reales, por ahora es un array vacío para mostrar el mensaje de bienvenida
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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
      {/* 🔥 SIDEBAR */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <ChatSidebar
            key="chat-sidebar"
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* 💬 CHAT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <ChatHeader onToggleMenu={() => setIsSidebarOpen((prev) => !prev)} />

        {/* MENSAJES */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <ChatWelcome />
          ) : (
            <div className="p-4 text-gray-400 text-sm">
              Aquí irán los mensajes...
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-6">
          <ChatInput />
        </div>
      </div>
    </div>
  )
}
