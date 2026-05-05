import { Loader2, TicketPlus } from 'lucide-react'

type Props = {
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

export const GenerateTicketButton = ({
  onClick,
  loading,
  disabled,
}: Props) => {
  const isDisabled = Boolean(disabled || loading)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className="
        mt-3 inline-flex items-center gap-2
        rounded-xl border border-blue-200
        bg-blue-50 px-3 py-2
        text-sm font-medium text-blue-700
        transition hover:bg-blue-100 active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100
      "
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <TicketPlus size={16} />
      )}

      {loading ? 'Generando...' : 'Generar ticket'}
    </button>
  )
}
