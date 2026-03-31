import type { Message } from '../../types/chat.types'
import { MessageBubble } from './MessageBubble'
import pepeIcon from '@/assets/icon.webp'

type Props = {
  messages: Message[]
  loading?: boolean
  bottomRef?: React.RefObject<HTMLDivElement | null>
  bottomSpacer?: number
}

export const ChatMessages = ({
  messages,
  loading,
  bottomRef,
  bottomSpacer,
}: Props) => {
  return (
    <div className="w-full px-3 sm:px-4 md:px-6 pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-6">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5 md:space-y-6">

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
          />
        ))}

        {/* 🤖 TYPING INDICATOR */}
        {loading && (
          <div className="flex items-end gap-2 sm:gap-3">
            
            {/* Avatar */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img
                src={pepeIcon}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>

            {/* Burbujas */}
            <div className="bg-white/80 border border-slate-200 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        {/* 🔥 ESPACIO DINÁMICO */}
        <div style={{ height: bottomSpacer }} />

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
