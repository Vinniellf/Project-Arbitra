import type { TicketFormData } from '../../types/chat.types'

type Props = {
  data: Partial<TicketFormData>
}

const priorityLabelMap = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
} as const

export const TicketSummaryCard = ({ data }: Props) => {
  const priorityLabel = data.priority
    ? priorityLabelMap[data.priority]
    : 'No definida'

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-white">
          Solicitud de ticket
        </h3>
      </div>

      <div className="space-y-2 text-white">
        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Asunto
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6 wrap-break-word">
            {data.subject || 'Sin asunto'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Prioridad
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {priorityLabel}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Descripción
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6 whitespace-pre-wrap wrap-break-word">
            {data.description || 'Sin descripción'}
          </p>
        </div>
      </div>
    </div>
  )
}
