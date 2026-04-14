import { Loader2, ShieldCheck } from 'lucide-react'

export const SessionLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eef6fb] via-white to-[#e3edf7]">

      <div className="flex flex-col items-center gap-6">

        {/* Icono principal */}
        <div className="relative">
          <div className="absolute inset-0 bg-[#5aa9e6]/20 blur-2xl rounded-full"></div>

          <ShieldCheck
            size={56}
            className="text-[#5aa9e6] relative z-10"
          />
        </div>

        {/* Texto */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-gray-700">
            Verificando sesión
          </p>

          <p className="text-xs text-gray-500">
            Validando credenciales...
          </p>
        </div>

        {/* Spinner */}
        <Loader2
          size={24}
          className="animate-spin text-[#5aa9e6]"
        />

      </div>
    </div>
  )
}
