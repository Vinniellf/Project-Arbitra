import { CheckCircle2, Hash } from 'lucide-react'

type Props = {
  ticketCode?: string
}

export const TicketSuccessCard = ({ ticketCode }: Props) => {
  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className="
          flex items-center gap-3
          rounded-lg border border-emerald-200
          bg-emerald-50 px-3 py-2
        "
      >
        {/* ICONO */}
        <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />

        {/* TEXTO */}
        <p className="text-sm text-emerald-900">
          <span className="font-semibold">Ticket creado</span>
          {ticketCode && (
            <>
              {' · '}
              <span className="inline-flex items-center gap-1 font-medium">
                <Hash size={12} />
                {ticketCode}
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
