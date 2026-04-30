import { User } from 'lucide-react'
import pepeIcon from '@/assets/icon.webp'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ReactNode } from 'react'

import { GenerateTicketButton } from '@/modules/chat/components/GenerateTicketButton/GenerateTicketButton'
import { TicketFormCard } from '@/modules/chat/components/TicketFormCard/TicketFormCard'
import { TicketConfirmationCard } from '@/modules/chat/components/TicketConfirmationCard/TicketConfirmationCard'
import { TicketSuccessCard } from '@/modules/chat/components/TicketSuccessCard/TicketSuccessCard'

import type {
  MessageAction,
  MessageKind,
  TicketFormData,
} from '../../types/chat.types'

type Props = {
  role: 'user' | 'assistant'
  content: string
  action?: MessageAction
  kind?: MessageKind
  ticketFormData?: Partial<TicketFormData> & { ticketCode?: string }
  onGenerateTicket?: () => void
  onSubmitTicketForm?: (data: TicketFormData) => void
  onConfirmTicketCreation?: (data: TicketFormData) => void
  onEditTicket?: (data: TicketFormData) => void
  generatingTicket?: boolean
  submittingTicket?: boolean
}

/* 🔥 ESTILO COMPACTO */
const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-1 leading-6 text-slate-700">{children}</p>
  ),

  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-semibold text-slate-900">{children}</strong>
  ),

  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-2 list-decimal pl-5 space-y-1 marker:text-blue-600 marker:font-medium">
      {children}
    </ol>
  ),

  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-2 list-disc pl-5 space-y-1 marker:text-blue-500">
      {children}
    </ul>
  ),

  li: ({ children }: { children?: ReactNode }) => (
    <li className="leading-6 text-slate-700">{children}</li>
  ),

  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-800">
      {children}
    </code>
  ),

  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="my-2 overflow-x-auto rounded-lg bg-slate-50 p-2 text-[11px] leading-5">
      {children}
    </pre>
  ),

  hr: () => null,
}

export const MessageBubble = ({
  role,
  content,
  action,
  kind = 'text',
  ticketFormData,
  onGenerateTicket,
  onSubmitTicketForm,
  onConfirmTicketCreation,
  onEditTicket,
  generatingTicket,
  submittingTicket,
}: Props) => {
  const isUser = role === 'user'
  const isTicketForm = kind === 'ticket_form'
  const isTicketConfirmation = kind === 'ticket_confirmation'
  const isTicketSuccess = kind === 'ticket_success'
  const isWide = isTicketForm || isTicketConfirmation

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-7 w-7 items-center justify-center shrink-0">
          <img
            src={pepeIcon}
            className="h-10 w-10 object-contain"
            alt="Pepe AI"
          />
        </div>
      )}

      <div
        className={`
          px-3 py-2 rounded-xl
          text-[12px] sm:text-[13px] leading-6
          shadow-sm

          ${isWide
            ? 'w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl'
            : 'max-w-[85%] sm:max-w-[75%]'}

          ${isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white/90 border border-slate-200 text-slate-800'}
        `}
      >
        {isTicketConfirmation &&
        ticketFormData &&
        onConfirmTicketCreation &&
        onEditTicket ? (
          <TicketConfirmationCard
            data={ticketFormData as TicketFormData}
            submitting={submittingTicket}
            onCancel={() => onEditTicket(ticketFormData as TicketFormData)}
            onConfirm={() =>
              onConfirmTicketCreation(ticketFormData as TicketFormData)
            }
          />
        ) : isTicketSuccess ? (
          <TicketSuccessCard ticketCode={ticketFormData?.ticketCode} />
        ) : isUser ? (
          <span className="whitespace-pre-wrap">{content}</span>
        ) : (
          <div className="max-w-full">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>

            {action === 'generate_ticket' && onGenerateTicket && (
              <GenerateTicketButton
                onClick={onGenerateTicket}
                loading={generatingTicket}
                disabled={submittingTicket}
              />
            )}

            {isTicketForm && onSubmitTicketForm && (
              <TicketFormCard
                key={JSON.stringify(ticketFormData ?? {})}
                onSubmit={onSubmitTicketForm}
                initialData={ticketFormData}
                submitting={submittingTicket}
              />
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User size={12} className="text-slate-600" />
        </div>
      )}
    </div>
  )
}
