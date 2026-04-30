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

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="my-1 leading-5 text-slate-700">{children}</p>
  ),

  strong: ({ children }: { children?: ReactNode }) => (
    <strong className="font-medium text-slate-800">{children}</strong>
  ),

  em: ({ children }: { children?: ReactNode }) => (
    <em className="italic text-slate-600">{children}</em>
  ),

  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[11px] marker:font-semibold marker:text-blue-600">
      {children}
    </ol>
  ),

  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="my-2 list-disc space-y-1 pl-5 marker:text-blue-500">
      {children}
    </ul>
  ),

  li: ({ children }: { children?: ReactNode }) => (
    <li className="pl-0.5 leading-5 text-slate-700">{children}</li>
  ),

  code: ({ children }: { children?: ReactNode }) => (
    <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] font-medium text-slate-800">
      {children}
    </code>
  ),

  pre: ({ children }: { children?: ReactNode }) => (
    <pre className="my-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-2 text-[11px] leading-5 text-slate-800">
      {children}
    </pre>
  ),

  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
    >
      {children}
    </a>
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
    <div
      className={`
        flex items-end gap-2
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center">
          <img
            src={pepeIcon}
            className="h-10 w-10 object-contain"
            alt="Pepe AI"
          />
        </div>
      )}

      <div
        className={`
          rounded-xl px-3 py-2
          text-[12px] leading-5 sm:text-[13px]
          shadow-sm transition-colors

          ${
            isWide
              ? 'w-full max-w-[95%] sm:max-w-[90%] md:max-w-2xl'
              : 'max-w-[85%] sm:max-w-[75%]'
          }

          ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'border border-slate-200 bg-white/90 text-slate-800'
          }
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
          <span className="whitespace-pre-wrap wrap-break-word leading-5">
            {content}
          </span>
        ) : (
          <div className="max-w-full wrap-break-word">
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
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200">
          <User size={12} className="text-slate-600" />
        </div>
      )}
    </div>
  )
}
