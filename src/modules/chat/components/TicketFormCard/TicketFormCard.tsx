import { useMemo, useState } from 'react'
import type { TicketFormData } from '../../types/chat.types'

type Props = {
  onSubmit: (data: TicketFormData) => void
  initialData?: Partial<TicketFormData>
  submitting?: boolean
}

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

  const editableInputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none'

  const readOnlyInputClass =
    'w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-sm text-slate-600 outline-none cursor-not-allowed'

  const updateField = <K extends keyof TicketFormData>(
    field: K,
    value: TicketFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getPayload = (): TicketFormData => ({
    subject: formData.subject.trim(),
    category: formData.category.trim(),
    subcategory: formData.subcategory.trim(),
    requester: formData.requester.trim(),
    userCompany: formData.userCompany.trim(),
    businessUnit: formData.businessUnit.trim(),
    site: formData.site.trim(),
    equipmentModel: formData.equipmentModel.trim(),
    serial: formData.serial.trim(),
    description: formData.description.trim(),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = getPayload()

    if (
      !payload.subject ||
      !payload.category ||
      !payload.subcategory ||
      !payload.requester ||
      !payload.userCompany ||
      !payload.businessUnit ||
      !payload.site ||
      !payload.equipmentModel ||
      !payload.serial ||
      !payload.description
    ) {
      return
    }

    onSubmit(payload)
  }

  const isSubmitDisabled =
    !formData.subject.trim() ||
    !formData.category.trim() ||
    !formData.subcategory.trim() ||
    !formData.requester.trim() ||
    !formData.userCompany.trim() ||
    !formData.businessUnit.trim() ||
    !formData.site.trim() ||
    !formData.equipmentModel.trim() ||
    !formData.serial.trim() ||
    !formData.description.trim() ||
    Boolean(submitting)

  return (
    <form onSubmit={handleSubmit} className="mt-2 space-y-2">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-xs text-slate-600 leading-4">
          Revisa y edita la información antes de enviar el ticket.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-700">
          Asunto
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          className={editableInputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.category}
          readOnly
          placeholder="Categoría"
          className={readOnlyInputClass}
        />
        <input
          type="text"
          value={formData.subcategory}
          readOnly
          placeholder="Subcategoría"
          className={readOnlyInputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.requester}
          readOnly
          placeholder="Nombre del usuario"
          className={readOnlyInputClass}
        />
        <input
          type="text"
          value={formData.userCompany}
          readOnly
          placeholder="Empresa"
          className={readOnlyInputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.businessUnit}
          readOnly
          placeholder="Unidad de negocio"
          className={readOnlyInputClass}
        />
        <input
          type="text"
          value={formData.site}
          readOnly
          placeholder="Sede"
          className={readOnlyInputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.equipmentModel}
          onChange={(e) => updateField('equipmentModel', e.target.value)}
          placeholder="Modelo del equipo"
          className={editableInputClass}
        />
        <input
          type="text"
          value={formData.serial}
          onChange={(e) => updateField('serial', e.target.value)}
          placeholder="Serie"
          className={editableInputClass}
        />
      </div>

      <textarea
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
        rows={4}
        placeholder="Describe el problema"
        className={`${editableInputClass} resize-none`}
      />

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {submitting ? 'Enviando...' : 'Enviar ticket'}
        </button>
      </div>
    </form>
  )
}
