import { TicketPlus } from 'lucide-react'

type Props = {
  onClick: () => void
}

export const GenerateTicketButton = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        mt-3 inline-flex items-center gap-2
        rounded-xl border border-blue-200
        bg-blue-50 px-3 py-2
        text-sm font-medium text-blue-700
        transition hover:bg-blue-100 active:scale-[0.98]
      "
    >
      <TicketPlus size={16} />
      Generar ticket
    </button>
  )
}
