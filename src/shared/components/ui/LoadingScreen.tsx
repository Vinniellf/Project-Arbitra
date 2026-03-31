import { useEffect, useState } from 'react'
import icon from '@/assets/icon.webp'

type Props = {
  onFinish: () => void
}

export default function LoadingScreen({ onFinish }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let value = 0

    const interval = setInterval(() => {
      if (value < 80) value += 5
      else if (value < 95) value += 1
      else if (value < 100) value += 0.5

      if (value >= 100) {
        value = 100
        clearInterval(interval)

        setTimeout(() => {
          onFinish()
        }, 400)
      }

      setProgress(value)
    }, 80)

    return () => clearInterval(interval)
  }, [onFinish])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#f8fbff] via-[#eef2ff] to-[#e0e7ff] overflow-hidden relative">

      {/* Fondo decorativo corregido */}
      <div className="absolute w-125 h-125 bg-blue-400/10 blur-3xl rounded-full top-30 left-left-30 animate-pulse"></div>
      <div className="absolute w-100 h-100 bg-indigo-400/10 blur-3xl rounded-full bottom-30 right-30 animate-pulse"></div>

      <div className="relative flex flex-col items-center gap-10 animate-[fadeIn_0.6s_ease-out]">

        {/* Logo PRO */}
        <div className="relative flex items-center justify-center">
          {/* Glow grande */}
          <div className="absolute w-64 h-64 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>

          {/* Logo */}
          <img
            src={icon}
            alt="Pepe AI"
            className="w-84 h-84 object-contain relative z-10 animate-[float_4s_ease-in-out_infinite] drop-shadow-2xl"
          />
        </div>

        {/* Texto */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            Preparando tu experiencia
          </h2>
          <p className="text-sm text-gray-500">
            Conectando con PEPE AI...
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-72">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Animaciones */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
          }

          @keyframes fadeIn {
            0% { opacity: 0; transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  )
}
