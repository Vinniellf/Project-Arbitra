import { useState } from 'react'

type Props = {
  onSubmit: (data: {
    subject: string
    description: string
  }) => void
  initialData?: Partial<{
    subject: string
    description: string
  }>
}

export const TicketFormCard = ({ onSubmit, initialData }: Props) => {
  const [subject, setSubject] = useState(initialData?.subject ?? '')
  const [description, setDescription] = useState(
    initialData?.description ?? ''
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedSubject = subject.trim()
    const trimmedDescription = description.trim()

    if (!trimmedSubject || !trimmedDescription) return

    onSubmit({
      subject: trimmedSubject,
      description: trimmedDescription,
    })
  }

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
          placeholder="Ej. La impresora no responde"
          className="
            w-full rounded-lg border border-slate-200 bg-white
            px-3 py-2 text-sm text-slate-700 outline-none
            transition
            focus:border-blue-300 focus:ring-2 focus:ring-blue-100
          "
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-700">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe brevemente el problema."
          rows={4}
          className="
            w-full rounded-lg border border-slate-200 bg-white
            px-3 py-2 text-sm text-slate-700 outline-none resize-none
            transition
            focus:border-blue-300 focus:ring-2 focus:ring-blue-100
          "
        />
      </div>

      <div className="flex justify-end pt-0.5">
        <button
          type="submit"
          disabled={!subject.trim() || !description.trim()}
          className="
            inline-flex items-center justify-center
            rounded-lg bg-blue-600 px-3.5 py-2
            text-sm font-medium text-white shadow-sm
            transition hover:bg-blue-700
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          Enviar ticket
        </button>
      </div>
    </form>
  )
}
