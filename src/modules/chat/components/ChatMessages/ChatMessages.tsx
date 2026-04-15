import type React from 'react'
import type { Message } from '../../types/chat.types'
import { MessageBubble } from './MessageBubble'
import pepeIcon from '@/assets/icon.webp'

type Props = {
  messages: Message[]
  loading?: boolean
  lastAssistantRef?: React.RefObject<HTMLDivElement | null>
  bottomSpacer?: number
  onGenerateTicket?: () => void
}

export const ChatMessages = ({
  messages,
  loading,
  lastAssistantRef,
  bottomSpacer,
  onGenerateTicket,
}: Props) => {
  const visibleMessages = messages.filter(
    (msg) => !(msg.role === 'assistant' && !msg.content?.trim())
  )

  const lastAssistantIndex = [...visibleMessages]
    .map((msg, index) => ({ msg, index }))
    .filter(({ msg }) => msg.role === 'assistant')
    .pop()?.index

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 pb-3 sm:pb-4">
      <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
        {visibleMessages.map((msg, index) => {
          const isLastAssistant = index === lastAssistantIndex

          return (
            <div
              key={msg.id}
              ref={isLastAssistant ? lastAssistantRef : undefined}
            >
              <MessageBubble
                role={msg.role}
                content={msg.content}
                action={msg.action}
                onGenerateTicket={onGenerateTicket}
              />
            </div>
          )
        })}

        {loading && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <img
                src={pepeIcon}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                alt="Bot avatar"
              />
            </div>

            <div className="bg-white/80 border border-slate-200 rounded-xl px-2.5 sm:px-3 py-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div style={{ height: bottomSpacer ?? 0 }} />
      </div>
    </div>
  )
}
