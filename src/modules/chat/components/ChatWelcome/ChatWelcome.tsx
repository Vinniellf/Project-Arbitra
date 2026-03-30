import icon from '@/assets/icon1.webp'
import { motion } from 'framer-motion'
import { Hand, Bot } from 'lucide-react'

export const ChatWelcome = () => {
  return (
    <div className="flex flex-col h-full justify-center items-center text-center px-4">

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
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white/80 flex items-center justify-center shadow-xl shadow-blue-500/10 border border-white/40">
          
          <div className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-blue-400/10 rounded-full"></div>

          <img
            src={icon}
            alt="Bot"
            className="w-24 sm:w-36 object-contain relative z-10 drop-shadow-xl"
          />
        </div>

        {/* Título */}
        <h2 className="mt-6 text-base sm:text-lg font-semibold text-[#0f172a] flex items-center gap-2">
          Hola <Hand size={16} className="text-blue-500" />
          soy Pepe
          <Bot size={16} className="text-blue-500" />
        </h2>

        {/* Contexto */}
        <p className="text-sm text-gray-600 mt-1">
          Asistente inteligente de Misión Tecnológica
        </p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-blue-600 font-medium text-sm"
        >
          Escríbeme y te ayudaré al instante
        </motion.div>

      </motion.div>
    </div>
  )
}
