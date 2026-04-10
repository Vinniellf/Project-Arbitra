import {
 
 // Download,
 // Printer,
  Maximize,
  Minimize,
  RotateCcw,
  Menu,
} from 'lucide-react'

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
    'p-2 rounded-xl bg-white/70 backdrop-blur-md border border-gray-200/60 hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200'

  return (
    <header className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
      
      {/* IZQUIERDA */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button onClick={onToggleMenu} className={btn}>
          <Menu size={18} />
        </button>

        <div className="leading-tight truncate">
          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">
            PEPE AI
          </h1>

          {/* Oculto en móvil */}
          <p className="hidden sm:block text-xs text-gray-400">
            Asistente técnico inteligente
          </p>
        </div>

        {/* Solo en md+ */}
        <span className="hidden md:flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50/80 px-2.5 py-1 rounded-full border border-green-200/60 ml-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Activo
        </span>
      </div>

      {/* CENTRO */}
      <div className="flex-1 flex justify-center px-1 sm:px-2 md:px-4" />

      {/* DERECHA */}
      <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
        
        {/* Siempre visible */}
        <button
          className={btn}
          onClick={onExpand}
          title={isFullscreen ? 'Reducir' : 'Expandir'}
        >
          {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
        </button>

        <button className={btn} onClick={onReset} title="Reiniciar chat">
          <RotateCcw size={15} />
        </button>

        {/* Ocultos en móvil */}
        {/* <button className="hidden sm:flex " title="Descargar">
          <span className={btn}>
            <Download size={16} />
          </span>
        </button>

        <button className="hidden sm:flex " title="Imprimir">
          <span className={btn}>
            <Printer size={16} />
          </span>
        </button> */}
      </div>
    </header>
  )
}
