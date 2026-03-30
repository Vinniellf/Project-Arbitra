import {
  Download,
  Printer,
  Expand,
  RotateCcw,
  Menu,
} from 'lucide-react'

type Props = {
  onToggleMenu: () => void
}

export const ChatHeader = ({ onToggleMenu }: Props) => {
  const btn =
    'p-2 rounded-xl bg-white/70 backdrop-blur-md border border-gray-200/60 hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200'

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-20">
      
      {/* IZQUIERDA */}
      <div className="flex items-center gap-3 min-w-0">
        
        {/* 🔥 AQUÍ CONECTAS */}
        <button onClick={onToggleMenu} className={btn}>
          <Menu size={18} />
        </button>

        <div className="leading-tight truncate">
          <h1 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
            PEPE AI
          </h1>
          <p className="hidden sm:block text-xs text-gray-400">
            Asistente técnico inteligente
          </p>
        </div>

        <span className="hidden md:flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50/80 px-2.5 py-1 rounded-full border border-green-200/60 ml-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Activo
        </span>
      </div>

      <div className="flex-1 flex justify-center px-2 sm:px-4" />

      {/* DERECHA */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button className={`${btn} hidden md:flex`}>
          <Expand size={16} />
        </button>

        <button className={btn}>
          <RotateCcw size={15} />
        </button>

        <button className={`${btn} hidden sm:flex`}>
          <Download size={16} />
        </button>

        <button className={`${btn} hidden sm:flex`}>
          <Printer size={16} />
        </button>
      </div>
    </header>
  )
}
