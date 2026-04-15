import { User } from 'lucide-react'
import pepeIcon from '@/assets/icon.webp'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { GenerateTicketButton } from '@/modules/chat/components/GenerateTicketButton/GenerateTicketButton'
import type { MessageAction } from '../../types/chat.types'

type Props = {
  role: 'user' | 'assistant'
  content: string
  action?: MessageAction
  onGenerateTicket?: () => void
}

export const MessageBubble = ({
  role,
  content,
  action,
  onGenerateTicket,
}: Props) => {
  const isUser = role === 'user'

  return (
    <div
      className={`
        flex items-end gap-2
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
          <img
            src={pepeIcon}
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            alt="Bot avatar"
          />
        </div>
      )}

      <div
        className={`
          px-3
          py-2
          rounded-xl
          text-[13px] sm:text-sm
          max-w-[88%] sm:max-w-[78%]
          leading-6
          wrap-break-word
          ${
            isUser
              ? 'bg-blue-600 text-white shadow-sm whitespace-pre-wrap'
              : 'bg-white/80 border border-slate-200 text-slate-800'
          }
        `}
      >
        {isUser ? (
          <span className="whitespace-pre-wrap wrap-break-word">{content}</span>
        ) : (
          <div className="max-w-full text-[13px] sm:text-sm leading-6 wrap-break-word">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 mb-2 leading-tight">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900 mt-3 mb-1.5 leading-tight">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mt-2.5 mb-1.5 leading-snug">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="my-1.5 whitespace-pre-wrap leading-6 text-slate-800">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-slate-700">{children}</em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 my-1.5 space-y-0.5">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 my-1.5 space-y-0.5">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-6 text-slate-800">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 pl-3 my-2 italic text-slate-700">
                    {children}
                  </blockquote>
                ),
                code(props) {
                  const { inline, children } = props as {
                    inline?: boolean
                    children?: ReactNode
                  }

                  if (inline) {
                    return (
                      <code className="px-1 py-0.5 rounded bg-slate-100 text-slate-900 text-[12px] font-mono wrap-break-word">
                        {children}
                      </code>
                    )
                  }

                  return (
                    <code className="block w-full overflow-x-auto rounded-lg bg-slate-900 text-slate-100 p-2.5 text-[12px] font-mono leading-5 my-2">
                      {children}
                    </code>
                  )
                },
                pre: ({ children }) => (
                  <pre className="my-2 overflow-x-auto">{children}</pre>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-3 border-slate-300" />,
                br: () => <br />,
              }}
            >
              {content}
            </ReactMarkdown>

            {action === 'generate_ticket' && onGenerateTicket && (
              <GenerateTicketButton onClick={onGenerateTicket} />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User size={13} className="sm:w-3.5 sm:h-3.5 text-slate-600" />
        </div>
      )}
    </div>
  )
}
