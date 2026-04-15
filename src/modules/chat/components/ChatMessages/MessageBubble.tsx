import { User } from 'lucide-react'
import pepeIcon from '@/assets/icon.webp'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'
import { GenerateTicketButton } from '@/modules/chat/components/GenerateTicketButton/GenerateTicketButton'
import { TicketFormCard } from '@/modules/chat/components/TicketFormCard/TicketFormCard'
import { TicketSummaryCard } from '@/modules/chat/components/TicketSummaryCard/TicketSummaryCard'
import type {
  MessageAction,
  MessageKind,
  TicketPriority,
  TicketFormData,
} from '../../types/chat.types'

type Props = {
  role: 'user' | 'assistant'
  content: string
  action?: MessageAction
  kind?: MessageKind
  ticketFormData?: Partial<TicketFormData>
  onGenerateTicket?: () => void
  onSubmitTicketForm?: (data: {
    subject: string
    description: string
    priority: TicketPriority
  }) => void
}

const markdownComponents = {
  h1: ({ children }: { children?: ReactNode }) => (
    <h1 className="text-lg sm:text-xl font-bold text-inherit mt-1 mb-2 leading-tight">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h2 className="text-base sm:text-lg font-semibold text-inherit mt-3 mb-1.5 leading-tight">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h3 className="text-sm sm:text-base font-semibold text-inherit mt-2.5 mb-1.5 leading-snug">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-1.5 whitespace-pre-wrap leading-6 text-inherit">
      {children}
    </p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-inherit">{children}</strong>
  ),
  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-inherit">{children}</em>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="list-disc pl-4 my-1.5 space-y-0.5">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="list-decimal pl-4 my-1.5 space-y-0.5">{children}</ol>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-6 text-inherit">{children}</li>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="border-l-4 border-white/40 pl-3 my-2 italic text-inherit">
      {children}
    </blockquote>
  ),
  code(props: { inline?: boolean; children?: ReactNode }) {
    const { inline, children } = props

    if (inline) {
      return (
        <code className="px-1 py-0.5 rounded bg-black/10 text-inherit text-[12px] font-mono wrap-break-word">
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
  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="my-2 overflow-x-auto">{children}</pre>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string
    children?: ReactNode
  }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 text-inherit"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 border-white/30" />,
  br: () => <br />,
}

export const MessageBubble = ({
  role,
  content,
  action,
  kind = 'text',
  ticketFormData,
  onGenerateTicket,
  onSubmitTicketForm,
}: Props) => {
  const isUser = role === 'user'
  const isTicketForm = kind === 'ticket_form'
  const isTicketSummary = kind === 'ticket_summary'

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
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white/80 border border-slate-200 text-slate-800'
          }
        `}
      >
        {isTicketSummary ? (
          <TicketSummaryCard data={ticketFormData ?? {}} />
        ) : isUser ? (
          <span className="whitespace-pre-wrap wrap-break-word">{content}</span>
        ) : (
          <div className="max-w-full text-[13px] sm:text-sm leading-6 wrap-break-word text-slate-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>

            {action === 'generate_ticket' && onGenerateTicket && (
              <GenerateTicketButton onClick={onGenerateTicket} />
            )}

            {isTicketForm && onSubmitTicketForm && (
              <TicketFormCard onSubmit={onSubmitTicketForm} />
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
