import type { TicketFormData } from '../../types/chat.types'

type Props = {
  data: Partial<TicketFormData>
}

export const TicketSummaryCard = ({ data }: Props) => {
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
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.subject || 'Sin asunto'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Categoría
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.category || 'Sin categoría'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Subcategoría
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.subcategory || 'Sin subcategoría'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Solicitante
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.requester || 'Sin solicitante'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Empresa del usuario
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.userCompany || 'Sin empresa'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Compañía / Unidad de negocio
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.businessUnit || 'Sin unidad'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Sede
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.site || 'Sin sede'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Modelo del equipo
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.equipmentModel || 'Sin modelo'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Serie
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6">
            {data.serial || 'Sin serie'}
          </p>
        </div>

        <div>
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-white/75">
            Descripción
          </p>
          <p className="mt-1 text-sm sm:text-base leading-6 whitespace-pre-wrap">
            {data.description || 'Sin descripción'}
          </p>
        </div>
      </div>
    </div>
  )
}
