import { User } from 'lucide-react'
import pepeIcon from '@/assets/icon.webp'

type Props = {
  role: 'user' | 'bot'
  content: string
}

export const MessageBubble = ({ role, content }: Props) => {
  const isUser = role === 'user'

  return (
    <div
      className={`
        flex items-end gap-3
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {/* BOT AVATAR */}
      {!isUser && (
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img
            src={pepeIcon}
            className="w-12 h-12 object-contain"
          />
        </div>
      )}

      {/* BURBUJA */}
      <div
        className={`
          px-4 py-2.5
          rounded-2xl
          text-sm
          max-w-[75%]
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
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User size={16} className="text-slate-600" />
        </div>
      )}
    </div>
  )
}
