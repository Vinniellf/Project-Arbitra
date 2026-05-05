import { CheckCircle2, Hash } from 'lucide-react'

type Props = {
  ticketCode?: string
}

export const TicketSuccessCard = ({ ticketCode }: Props) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="
          flex items-center gap-2
          rounded-lg border border-emerald-200
          bg-emerald-50 px-2.5 py-1.5
        "
      >
        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />

        <p className="text-xs text-emerald-900">
          <span className="font-semibold">Ticket creado</span>

          {ticketCode && (
            <>
              {' · '}
              <span className="inline-flex items-center gap-1 font-medium">
                <Hash size={11} />
                {ticketCode}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
