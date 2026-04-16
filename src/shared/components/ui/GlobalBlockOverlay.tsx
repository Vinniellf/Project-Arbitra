import { Loader2 } from 'lucide-react'
import { useUiBlock } from '../../hooks/useUiBlock'

export const GlobalBlockOverlay = () => {
  const { isBlocked, blockMessage } = useUiBlock()

  if (!isBlocked) return null

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg">
        <Loader2 className="h-5 w-5 animate-spin text-sky-600" />

        <div>
          <p className="text-sm font-semibold text-slate-800">
            {blockMessage || 'Procesando...'}
          </p>
          <p className="text-xs text-slate-500">
            Por favor espera un momento
          </p>
        </div>
      </div>
    </div>
  )
}
