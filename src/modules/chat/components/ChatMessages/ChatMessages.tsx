import type { Message } from '../../types/chat.types'
import { MessageBubble } from './MessageBubble'
import pepeIcon from '@/assets/icon.webp'

type Props = {
  messages: Message[]
  loading?: boolean
}

export const ChatMessages = ({ messages, loading }: Props) => {
  return (
    <div className="w-full px-4 sm:px-6 pt-10 pb-32">
      <div className="max-w-3xl mx-auto space-y-6">

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
          />
        ))}

        {/* 🤖 TYPING INDICATOR */}
        {loading && (
          <div className="flex items-end gap-3">
            
            {/* BOT ICON */}
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={pepeIcon} className="w-12 h-12 object-contain" />
            </div>

            {/* DOTS */}
            <div className="bg-white/80 border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
