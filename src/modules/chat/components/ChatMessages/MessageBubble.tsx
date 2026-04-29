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
    <p className="my-1.5 whitespace-pre-wrap leading-6 text-inherit">
      {children}
    </p>
  ),
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
          leading-6
          wrap-break-word

          ${
            isTicketForm || isTicketConfirmation
              ? 'w-full max-w-[96%] sm:max-w-[92%] md:max-w-xl'
              : 'max-w-[88%] sm:max-w-[78%]'
          }

          ${
            isUser
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white/80 border border-slate-200 text-slate-800'
          }
        `}
      >
        {/* CONFIRMATION */}
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
        ) : 
        /* SUCCESS */
        isTicketSuccess ? (
          <TicketSuccessCard ticketCode={ticketFormData?.ticketCode} />
        ) : 
        /* USER */
        isUser ? (
          <span className="whitespace-pre-wrap wrap-break-word">
            {content}
          </span>
        ) : (
          /* NORMAL + FORM */
          <div className="max-w-full text-[13px] sm:text-sm leading-6 wrap-break-word text-slate-800">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>

            {/* BOTÓN GENERAR */}
            {action === 'generate_ticket' && onGenerateTicket && (
              <GenerateTicketButton
                onClick={onGenerateTicket}
                loading={generatingTicket}
                disabled={submittingTicket}
              />
            )}

            {/* FORMULARIO */}
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
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
          <User size={13} className="sm:w-3.5 sm:h-3.5 text-slate-600" />
        </div>
      )}
    </div>
  )
}
