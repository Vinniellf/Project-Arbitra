import { User } from 'lucide-react'
import pepeIcon from '@/assets/icon.webp'

type Props = {
  role: 'user' | 'assistant'
  content: string
}

export const MessageBubble = ({ role, content }: Props) => {
  const isUser = role === 'user'

  return (
    <div
      className={`
        flex items-end gap-2 sm:gap-3
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {/* BOT AVATAR */}
      {!isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
          <img
            src={pepeIcon}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
        </div>
      )}

      {/* BURBUJA */}
      <div
        className={`
          px-3 sm:px-4
          py-2 sm:py-2.5
          rounded-xl sm:rounded-2xl
          text-sm sm:text-[15px]
          max-w-[85%] sm:max-w-[75%]
          leading-relaxed
          whitespace-pre-wrap wrap-break-word
          ${
            isUser
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white/80 border border-slate-200 text-slate-800'
          }
        `}
      >
        {content}
      </div>

      {/* USER AVATAR */}
      {isUser && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User size={14} className="sm:w-4 sm:h-4 text-slate-600" />
        </div>
      )}
    </div>
  )
}
