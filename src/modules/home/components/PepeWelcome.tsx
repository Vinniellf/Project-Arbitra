import { useState } from 'react'
import avatar from '@/assets/avatar.webp'

export const PepeWelcome = () => {
  // 🔥 Controla si la imagen ya cargó (para animación suave)
  const [loaded, setLoaded] = useState(
    sessionStorage.getItem('pepe_loaded') === 'true'
  )

  const handleLoad = () => {
    setLoaded(true)
    sessionStorage.setItem('pepe_loaded', 'true')
  }

  return (
    <div className="flex flex-col items-center text-center gap-6 w-full max-w-xs mx-auto">
      
      {/* 📝 Texto */}
      <div>
        <h2 className="text-4xl font-bold text-[#0f172a]">¡Hola!</h2>
        <p className="text-[#334155] mt-2 text-sm leading-relaxed">
          Soy Pepe, tu agente inteligente de <strong>Misión Tecnológica</strong>. Estoy aquí para ayudarte con cualquier problema de tus equipos.        </p>
      </div>

      {/* 🧑 Avatar */}
      <div className="relative mt-4 flex justify-center items-center">
        
        {/* 🔷 Fondo inclinado */}
        <div
          className="
            absolute
            w-52 h-52
            bg-linear-to-br
            from-[#5aa9e6]/70
            to-[#4e24b1]/70
            rounded-2xl
            rotate-6
            blur-md
          "
        ></div>

        {/* ✨ Glow */}
        <div
          className="
            absolute
            w-56 h-56
            bg-[#5aa9e6]/20
            rounded-full
            blur-2xl
          "
        ></div>

        {/* 🧑 Avatar con animación */}
        <img
          src={avatar}
          alt="Pepe AI"
          onLoad={handleLoad}
          className={`
            relative
            w-52
            md:w-60
            object-contain
            drop-shadow-[0_25px_50px_rgba(0,0,0,0.2)]
            transition-all duration-700 ease-out
            ${
              loaded
                ? 'opacity-100 translate-y-0 scale-100 rotate-0'
                : 'opacity-0 translate-y-10 scale-90 rotate-3'
            }
          `}
        />
      </div>
    </div>
  )
}
