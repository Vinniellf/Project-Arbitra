import { useState } from 'react'
import type { TicketFormData } from '../../types/chat.types'

type Props = {
  onSubmit: (data: TicketFormData) => void
  initialData?: Partial<TicketFormData>
}

export const TicketFormCard = ({ onSubmit, initialData }: Props) => {
  const [subject, setSubject] = useState(initialData?.subject ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [subcategory, setSubcategory] = useState(
    initialData?.subcategory ?? ''
  )
  const [requester, setRequester] = useState(initialData?.requester ?? '')
  const [userCompany, setUserCompany] = useState(initialData?.userCompany ?? '')
  const [businessUnit, setBusinessUnit] = useState(
    initialData?.businessUnit ?? ''
  )
  const [site, setSite] = useState(initialData?.site ?? '')
  const [equipmentModel, setEquipmentModel] = useState(
    initialData?.equipmentModel ?? ''
  )
  const [serial, setSerial] = useState(initialData?.serial ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload: TicketFormData = {
      subject: subject.trim(),
      category: category.trim(),
      subcategory: subcategory.trim(),
      requester: requester.trim(),
      userCompany: userCompany.trim(),
      businessUnit: businessUnit.trim(),
      site: site.trim(),
      equipmentModel: equipmentModel.trim(),
      serial: serial.trim(),
      description: description.trim(),
    }

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

  const isDisabled =
    !subject.trim() ||
    !category.trim() ||
    !subcategory.trim() ||
    !requester.trim() ||
    !userCompany.trim() ||
    !businessUnit.trim() ||
    !site.trim() ||
    !equipmentModel.trim() ||
    !serial.trim() ||
    !description.trim()

  return (
    <form onSubmit={handleSubmit} className="mt-2.5 space-y-2.5">
      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-[11px] sm:text-xs text-slate-600 leading-5">
          Completa estos datos para generar el ticket.
        </p>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-700">Asunto</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Ej. Impresora no imprime"
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">
            Categoría
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ej. Impresoras"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">
            Subcategoría
          </label>
          <input
            type="text"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            placeholder="Ej. Atasco de papel"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">
            Solicitante
          </label>
          <input
            type="text"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder="Nombre del solicitante"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">
            Empresa del usuario
          </label>
          <input
            type="text"
            value={userCompany}
            onChange={(e) => setUserCompany(e.target.value)}
            placeholder="Empresa"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">
            Compañía / Unidad de negocio
          </label>
          <input
            type="text"
            value={businessUnit}
            onChange={(e) => setBusinessUnit(e.target.value)}
            placeholder="Unidad de negocio"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">Sede</label>
          <input
            type="text"
            value={site}
            onChange={(e) => setSite(e.target.value)}
            placeholder="Sede"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">
            Modelo del equipo
          </label>
          <input
            type="text"
            value={equipmentModel}
            onChange={(e) => setEquipmentModel(e.target.value)}
            placeholder="Ej. HP Laser45"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-700">Serie</label>
          <input
            type="text"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="Número de serie"
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-700">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe el problema."
          rows={5}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none resize-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="flex justify-end pt-0.5">
        <button
          type="submit"
          disabled={isDisabled}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar ticket
        </button>
      </div>
    </form>
  )
}
