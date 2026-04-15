import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { TicketPriority } from '../../types/chat.types'

type Props = {
  onSubmit: (data: {
    subject: string
    description: string
    priority: TicketPriority
  }) => void
}

type PriorityOption = {
  value: TicketPriority
  label: string
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Media' },
  { value: 'baja', label: 'Baja' },
]

export const TicketFormCard = ({ onSubmit }: Props) => {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('media')
  const [isPriorityOpen, setIsPriorityOpen] = useState(false)

  const priorityRef = useRef<HTMLDivElement>(null)

  const selectedPriority = useMemo(() => {
    return (
      PRIORITY_OPTIONS.find((option) => option.value === priority) ??
      PRIORITY_OPTIONS[1]
    )
  }, [priority])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!priorityRef.current) return

      if (!priorityRef.current.contains(event.target as Node)) {
        setIsPriorityOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPriorityOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const trimmedSubject = subject.trim()
    const trimmedDescription = description.trim()

    if (!trimmedSubject || !trimmedDescription) return

    onSubmit({
      subject: trimmedSubject,
      description: trimmedDescription,
      priority,
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
          rows={3}
          className="
            w-full rounded-lg border border-slate-200 bg-white
            px-3 py-2 text-sm text-slate-700 outline-none resize-none
            transition
            focus:border-blue-300 focus:ring-2 focus:ring-blue-100
          "
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-700">
          Prioridad
        </label>

        <div ref={priorityRef} className="relative">
          <button
            type="button"
            onClick={() => setIsPriorityOpen((prev) => !prev)}
            className="
              flex h-10 w-full items-center justify-between
              rounded-lg border border-slate-200 bg-white
              px-3 text-left
              transition
              hover:border-slate-300
              focus:outline-none focus:ring-2 focus:ring-blue-100
            "
          >
            <span className="text-sm text-slate-700">
              {selectedPriority.label}
            </span>

            <ChevronDown
              size={15}
              className={`shrink-0 text-slate-400 transition-transform ${
                isPriorityOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isPriorityOpen && (
            <div
              className="
                absolute left-0 right-0 top-[calc(100%+6px)] z-30
                overflow-hidden rounded-lg border border-slate-200
                bg-white shadow-lg
              "
            >
              <div className="py-1">
                {PRIORITY_OPTIONS.map((option) => {
                  const isSelected = option.value === priority

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPriority(option.value)
                        setIsPriorityOpen(false)
                      }}
                      className="
                        flex h-9 w-full items-center justify-between
                        px-3 text-left
                        transition hover:bg-slate-50
                      "
                    >
                      <span className="text-sm text-slate-700">
                        {option.label}
                      </span>

                      {isSelected && (
                        <Check size={15} className="text-blue-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
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
