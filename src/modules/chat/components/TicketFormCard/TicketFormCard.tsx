import { useMemo, useState } from 'react'
import type { TicketFormData } from '../../types/chat.types'

type Props = {
  onSubmit: (data: TicketFormData) => void
  onSaveDraft?: (data: TicketFormData) => void
  initialData?: Partial<TicketFormData>
  savingDraft?: boolean
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
  onSaveDraft,
  initialData,
  savingDraft,
  submitting,
}: Props) => {
  const initialFormData = useMemo(
    () => buildInitialFormData(initialData),
    [initialData],
  )

  const [formData, setFormData] = useState<TicketFormData>(initialFormData)

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

  const handleSaveDraft = () => {
    onSaveDraft?.(getPayload())
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
    <form onSubmit={handleSubmit} className="mt-2.5 space-y-2.5">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-[11px] sm:text-xs text-slate-600 leading-5">
          Revisa y edita la información antes de enviar el ticket.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-700">Asunto</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.category}
          onChange={(e) => updateField('category', e.target.value)}
          placeholder="Categoría"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
        <input
          type="text"
          value={formData.subcategory}
          onChange={(e) => updateField('subcategory', e.target.value)}
          placeholder="Subcategoría"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.requester}
          onChange={(e) => updateField('requester', e.target.value)}
          placeholder="Solicitante"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
        <input
          type="text"
          value={formData.userCompany}
          onChange={(e) => updateField('userCompany', e.target.value)}
          placeholder="Empresa"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.businessUnit}
          onChange={(e) => updateField('businessUnit', e.target.value)}
          placeholder="Unidad de negocio"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
        <input
          type="text"
          value={formData.site}
          onChange={(e) => updateField('site', e.target.value)}
          placeholder="Sede"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          type="text"
          value={formData.equipmentModel}
          onChange={(e) => updateField('equipmentModel', e.target.value)}
          placeholder="Modelo del equipo"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
        <input
          type="text"
          value={formData.serial}
          onChange={(e) => updateField('serial', e.target.value)}
          placeholder="Serie"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        />
      </div>

      <textarea
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
        rows={5}
        placeholder="Describe el problema"
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none resize-none"
      />

      <div className="flex justify-end gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={Boolean(savingDraft) || Boolean(submitting)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700"
        >
          {savingDraft ? 'Guardando...' : 'Guardar borrador'}
        </button>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white"
        >
          {submitting ? 'Enviando...' : 'Enviar ticket'}
        </button>
      </div>
    </form>
  )
}
