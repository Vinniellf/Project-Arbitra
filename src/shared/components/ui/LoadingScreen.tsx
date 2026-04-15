import { useEffect, useRef, useState } from 'react'
import icon from '@/assets/icon.webp'

type LoadingVariant = 'login' | 'logout' | 'welcome'

type Props = {
  onFinish: () => void | Promise<void>
  variant?: LoadingVariant
}

const contentByVariant: Record<
  LoadingVariant,
  { title: string; subtitle: string }
> = {
  login: {
    title: 'Preparando tu experiencia',
    subtitle: 'Conectando con PEPE AI',
  },
  logout: {
    title: 'Cerrando sesión',
    subtitle: 'Desconectando de PEPE AI',
  },
  welcome: {
    title: 'Bienvenido a PEPE',
    subtitle: 'Estamos preparando tu espacio por primera vez',
  },
}

export default function LoadingScreen({
  onFinish,
  variant = 'login',
}: Props) {
  const [progress, setProgress] = useState(0)
  const onFinishRef = useRef(onFinish)

  const content = contentByVariant[variant]

  // Mantiene actualizada la referencia sin reiniciar la animación
  useEffect(() => {
    onFinishRef.current = onFinish
  }, [onFinish])

  useEffect(() => {
    let value = 0
    let finished = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const interval = setInterval(() => {
      if (finished) return

      if (value < 80) {
        value += 5
      } else if (value < 95) {
        value += 1
      } else if (value < 99) {
        value += 0.5
      } else {
        value = 100
      }

      if (value >= 100) {
        value = 100
        finished = true
        clearInterval(interval)

        setProgress(100)

        timeoutId = setTimeout(() => {
          void onFinishRef.current()
        }, 120)

        return
      }

      // Evita que retroceda
      setProgress((prev) => (value > prev ? value : prev))
    }, 50)

    return () => {
      clearInterval(interval)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#eef6fb] via-white to-[#e3edf7] overflow-hidden relative">
      <div className="absolute w-150 h-150 bg-[#5aa9e6]/15 blur-[150px] rounded-full animate-pulse" />
      <div className="absolute w-100 h-100 bg-[#4a8fd9]/10 blur-[120px] rounded-full -top-20 -left-20 animate-pulse" />
      <div className="absolute w-100 h-100 bg-[#5aa9e6]/10 blur-[120px] rounded-full -bottom-20 -right-20 animate-pulse" />

      <div className="relative flex flex-col items-center gap-10">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-96 h-96 bg-[#5aa9e6]/25 blur-[100px] rounded-full animate-pulse" />
          <div className="absolute w-72 h-72 bg-[#4a8fd9]/20 blur-[80px] rounded-full" />

          <img
            src={icon}
            alt="Pepe AI"
            className="
              w-72 h-72
              object-contain
              relative z-10
              animate-float
              drop-shadow-[0_20px_50px_rgba(0,0,0,0.25)]
            "
          />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-gray-700">
            {content.title}
          </h2>

          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            {content.subtitle}
          </p>
        </div>

        <div className="w-72 space-y-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-[#5aa9e6] to-[#4a8fd9] transition-all duration-200 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/30 blur-sm animate-pulse" />
            </div>
          </div>

          <div className="text-xs text-gray-500 text-right">
            {Math.floor(progress)}%
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-14px); }
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  )
}
