import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  AlignLeft,
  Building2,
  Cpu,
  FileText,
  Hash,
  MapPin,
  Send,
  Tag,
  User,
} from 'lucide-react'
import type { TicketFormData } from '../../types/chat.types'

type Props = {
  onSubmit: (data: TicketFormData) => void
  initialData?: Partial<TicketFormData>
  submitting?: boolean
}

type FieldIconProps = {
  children: ReactNode
}

const FieldIcon = ({ children }: FieldIconProps) => (
  <span className="flex h-4 w-4 items-center justify-center text-slate-400">
    {children}
  </span>
)

const buildInitialFormData = (
  initialData?: Partial<TicketFormData>,
): TicketFormData => ({
  subject: initialData?.subject ?? '',
  category: initialData?.category ?? '',
  subcategory: initialData?.subcategory ?? '',
  requester: initialData?.requester ?? '',
  userCompany: initialData?.userCompany ?? '',
  businessUnit: initialData?.businessUnit ?? '',
  site: initialData?.site ?? '',
  equipmentModel: initialData?.equipmentModel ?? '',
  serial: initialData?.serial ?? '',
  description: initialData?.description ?? '',
})

export const TicketFormCard = ({
  onSubmit,
  initialData,
  submitting,
}: Props) => {
  const initialFormData = useMemo(
    () => buildInitialFormData(initialData),
    [initialData],
  )

  const [formData, setFormData] = useState<TicketFormData>(initialFormData)

  const input =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'

  const readOnly =
    'w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed'

  const label =
    'mb-1 flex items-center gap-2 text-xs font-semibold text-slate-600'

  const updateField = <K extends keyof TicketFormData>(
    field: K,
    value: TicketFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const isDisabled =
    Object.values(formData).some((v) => !v.trim()) || Boolean(submitting)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({
          ...formData,
          subject: formData.subject.trim(),
          description: formData.description.trim(),
        })
      }}
      className="mt-3 w-full max-w-2xl mx-auto space-y-4"
    >
      {/* HEADER */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-base font-semibold text-slate-800">
          Completa la información del ticket
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Puedes editar los datos antes de enviar.
        </p>
      </div>

      {/* ASUNTO */}
      <div>
        <label className={label}>
          <FieldIcon>
            <FileText size={16} />
          </FieldIcon>
          Asunto
        </label>
        <input
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          className={input}
        />
      </div>

      {/* CATEGORÍA */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>
            <FieldIcon>
              <Tag size={16} />
            </FieldIcon>
            Categoría
          </label>
          <input value={formData.category} readOnly className={readOnly} />
        </div>

        <div>
          <label className={label}>
            <FieldIcon>
              <Tag size={16} />
            </FieldIcon>
            Subcategoría
          </label>
          <input value={formData.subcategory} readOnly className={readOnly} />
        </div>
      </div>

      {/* USUARIO */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>
            <FieldIcon>
              <User size={16} />
            </FieldIcon>
            Usuario
          </label>
          <input value={formData.requester} readOnly className={readOnly} />
        </div>

        <div>
          <label className={label}>
            <FieldIcon>
              <Building2 size={16} />
            </FieldIcon>
            Empresa
          </label>
          <input value={formData.userCompany} readOnly className={readOnly} />
        </div>
      </div>

      {/* UBICACIÓN */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>
            <FieldIcon>
              <Building2 size={16} />
            </FieldIcon>
            Unidad
          </label>
          <input value={formData.businessUnit} readOnly className={readOnly} />
        </div>

        <div>
          <label className={label}>
            <FieldIcon>
              <MapPin size={16} />
            </FieldIcon>
            Sede
          </label>
          <input value={formData.site} readOnly className={readOnly} />
        </div>
      </div>

      {/* EQUIPO */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>
            <FieldIcon>
              <Cpu size={16} />
            </FieldIcon>
            Modelo
          </label>
          <input
            value={formData.equipmentModel}
            onChange={(e) =>
              updateField('equipmentModel', e.target.value)
            }
            className={input}
          />
        </div>

        <div>
          <label className={label}>
            <FieldIcon>
              <Hash size={16} />
            </FieldIcon>
            Serie
          </label>
          <input
            value={formData.serial}
            onChange={(e) => updateField('serial', e.target.value)}
            className={input}
          />
        </div>
      </div>

      {/* DESCRIPCIÓN */}
      <div>
        <label className={label}>
          <FieldIcon>
            <AlignLeft size={16} />
          </FieldIcon>
          Descripción
        </label>
        <textarea
          rows={5}
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          className={`${input} resize-none`}
        />
      </div>

      {/* CTA */}
      <div className="flex justify-end pt-3">
        <button
          type="submit"
          disabled={isDisabled}
          className="
            inline-flex items-center gap-2
            rounded-lg bg-blue-600 px-5 py-2.5
            text-sm font-semibold text-white
            shadow-sm transition hover:bg-blue-700
            disabled:bg-slate-300 disabled:cursor-not-allowed
          "
        >
          <Send size={16} />
          {submitting ? 'Enviando...' : 'Enviar ticket'}
        </button>
      </div>
    </form>
  )
}
