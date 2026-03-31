import icon from '@/assets/icon1.webp'
import { motion } from 'framer-motion'
import { Hand, Bot } from 'lucide-react'

export const ChatWelcome = () => {
  return (
    <div className="flex flex-col h-full justify-center items-center text-center px-3 sm:px-4 pt-12 sm:pb-32">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="flex flex-col items-center"
      >

        {/* Avatar */}
        <div className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-white/80 flex items-center justify-center shadow-xl shadow-blue-500/10 border border-white/40">
          
          <div className="absolute w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-blue-400/20 rounded-full"></div>

          <img
            src={icon}
            alt="Bot"
            className="w-20 sm:w-32 md:w-40 object-contain relative z-10 drop-shadow-xl"
          />
        </div>

        {/* Título */}
        <h2 className="mt-5 sm:mt-6 text-sm sm:text-base md:text-lg font-semibold text-[#0f172a] flex items-center gap-1.5 sm:gap-2">
          Hola <Hand size={14} className="text-blue-500 sm:w-4 sm:h-4" />
          soy Pepe
          <Bot size={14} className="text-blue-500 sm:w-4 sm:h-4" />
        </h2>

        {/* Contexto */}
        <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-65 sm:max-w-sm">
          Asistente inteligente de Misión Tecnológica
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-2 sm:mt-3 text-blue-600 font-medium text-xs sm:text-sm"
        >
          Escríbeme y te ayudaré al instante
        </motion.div>
      </motion.div>
    </div>
  )
}
