import { Maximize, Minimize, RotateCcw, Menu } from 'lucide-react'

type Props = {
  onToggleMenu: () => void
  onReset: () => void
  onExpand: () => void
  isFullscreen: boolean
}

export const ChatHeader = ({
  onToggleMenu,
  onReset,
  onExpand,
  isFullscreen,
}: Props) => {
  const btn =
    'flex items-center justify-center p-2 rounded-xl bg-white/70 backdrop-blur-md border border-gray-200/60 hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200'

  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button onClick={onToggleMenu} className={btn} type="button">
          <Menu size={18} />
        </button>

        <div className="leading-tight min-w-0">
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
            PEPE AI
          </h1>

          <p className="hidden sm:block text-xs text-gray-400">
            Asistente técnico inteligente
          </p>
        </div>

        <span className="hidden md:flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50/80 px-2.5 py-1 rounded-full border border-green-200/60 ml-1 shrink-0">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Activo
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        <button
          className={btn}
          onClick={onExpand}
          title={isFullscreen ? 'Reducir' : 'Expandir'}
          type="button"
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        <button
          className={btn}
          onClick={onReset}
          title="Reiniciar chat"
          type="button"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </header>
  )
}
