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

const FieldIcon = ({ children }: FieldIconProps) => {
  return (
    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-slate-400">
      {children}
    </span>
  )
}

export const TicketConfirmationCard = ({
  data,
  submitting,
  onCancel,
  onConfirm,
}: Props) => {
  const labelClass =
    'mb-1 flex items-center gap-2 text-xs font-semibold text-slate-600'

  const valueBoxClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700'

  return (
    <div className="mt-3 space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-600" />

          <div>
            <p className="text-sm font-semibold text-amber-900">
              Confirma la creación del ticket
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              Revisa los datos principales antes de registrar la solicitud.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <p className={labelClass}>
          <FieldIcon>
            <FileText size={16} />
          </FieldIcon>
          Asunto
        </p>

        <div className={valueBoxClass}>
          <p className="leading-6">{data.subject || 'Sin asunto'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className={labelClass}>
            <FieldIcon>
              <Cpu size={16} />
            </FieldIcon>
            Modelo
          </p>

          <div className={valueBoxClass}>
            <p className="leading-6">{data.equipmentModel || 'Sin modelo'}</p>
          </div>
        </div>

        <div>
          <p className={labelClass}>
            <FieldIcon>
              <Hash size={16} />
            </FieldIcon>
            Serie
          </p>

          <div className={valueBoxClass}>
            <p className="leading-6">{data.serial || 'Sin serie'}</p>
          </div>
        </div>
      </div>

      <div>
        <p className={labelClass}>
          <FieldIcon>
            <AlignLeft size={16} />
          </FieldIcon>
          Descripción
        </p>

        <div
          className={`${valueBoxClass} min-h-26 max-h-40 overflow-y-auto`}
        >
          <p className="whitespace-pre-wrap leading-6">
            {data.description || 'Sin descripción'}
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg border border-slate-200 bg-white
            px-4 py-2 text-sm font-semibold text-slate-600
            shadow-sm transition hover:bg-slate-50 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:opacity-60
            disabled:shadow-none disabled:active:scale-100
          "
        >
          <Pencil size={16} />
          Volver a editar
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={submitting}
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-blue-600
            px-4 py-2 text-sm font-semibold text-white
            shadow-sm transition hover:bg-blue-700 active:scale-[0.98]
            disabled:cursor-not-allowed disabled:bg-slate-300
            disabled:shadow-none disabled:active:scale-100
          "
        >
          <CheckCircle2 size={16} />
          {submitting ? 'Creando ticket...' : 'Confirmar creación'}
        </button>
      </div>
    </div>
  )
}
