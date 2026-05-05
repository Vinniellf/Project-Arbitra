import {
  AlertCircle,
  AlignLeft,
  CheckCircle2,
  Cpu,
  FileText,
  Hash,
  Pencil,
} from 'lucide-react'
import type { ReactNode } from 'react'
import type { TicketFormData } from '../../types/chat.types'

type Props = {
  data: TicketFormData
  submitting?: boolean
  onCancel: () => void
  onConfirm: () => void
}

type FieldIconProps = {
  children: ReactNode
}

const FieldIcon = ({ children }: FieldIconProps) => (
  <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center text-slate-400">
    {children}
  </span>
)

export const TicketConfirmationCard = ({
  data,
  submitting,
  onCancel,
  onConfirm,
}: Props) => {
  const labelClass =
    'mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600'

  // 🔥 estilo read-only
  const valueBoxClass =
    'w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 cursor-not-allowed'

  return (
    <div className="mt-2 space-y-3">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <p className="text-xs font-semibold text-amber-900">
              Confirma la creación del ticket
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-amber-700">
              Revisa los datos principales antes de registrar la solicitud.
            </p>
          </div>
        </div>
      </div>

      {/* Asunto */}
      <div className="space-y-1">
        <p className={labelClass}>
          <FieldIcon>
            <FileText size={14} />
          </FieldIcon>
          Asunto
        </p>

        <div className={valueBoxClass}>
          <p className="leading-5">{data.subject || 'Sin asunto'}</p>
        </div>
      </div>

      {/* Modelo / Serie */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className={labelClass}>
            <FieldIcon>
              <Cpu size={14} />
            </FieldIcon>
            Modelo
          </p>

          <div className={valueBoxClass}>
            <p className="leading-5">{data.equipmentModel || 'Sin modelo'}</p>
          </div>
        </div>

        <div>
          <p className={labelClass}>
            <FieldIcon>
              <Hash size={14} />
            </FieldIcon>
            Serie
          </p>

          <div className={valueBoxClass}>
            <p className="leading-5">{data.serial || 'Sin serie'}</p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <p className={labelClass}>
          <FieldIcon>
            <AlignLeft size={14} />
          </FieldIcon>
          Descripción
        </p>

        <div className={`${valueBoxClass} min-h-20 max-h-40 overflow-y-auto`}>
          <p className="whitespace-pre-wrap leading-5">
            {data.description || 'Sin descripción'}
          </p>
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col-reverse gap-2 pt-1.5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="
            inline-flex items-center justify-center gap-1.5
            rounded-lg border border-slate-200 bg-white
            px-3.5 py-1.5 text-xs font-semibold text-slate-600
            shadow-sm transition hover:bg-slate-50 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-60
          "
        >
          <Pencil size={14} />
          Volver a editar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="
            inline-flex items-center justify-center gap-1.5
            rounded-lg bg-blue-600
            px-3.5 py-1.5 text-xs font-semibold text-white
            shadow-sm transition hover:bg-blue-700 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:bg-slate-300
          "
        >
          <CheckCircle2 size={14} />
          {submitting ? 'Creando ticket...' : 'Confirmar creación'}
        </button>
      </div>
    </div>
  )
}
