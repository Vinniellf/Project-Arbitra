import { MessageSquare, Search, Trash2, X } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {
  onClose: () => void
}

export const ChatSidebar = ({ onClose }: Props) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute inset-0 z-20"
    >
      {/* 🔥 OVERLAY */}
      <motion.div
        onClick={onClose}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 },
        }}
        transition={{ duration: 0.25 }}
        className="
          absolute inset-0
          bg-black/30
          backdrop-blur-[1px]
          z-10
        "
      />

      {/* 🔥 SIDEBAR */}
      <motion.div
        variants={{
          hidden: { x: '-100%' },
          visible: { x: 0 },
          exit: { x: '-100%' },
        }}
        transition={{
          type: 'spring',
          stiffness: 280,
          damping: 30,
        }}
        className="
          absolute top-0 left-0 h-full
          w-[85%] max-w-xs sm:max-w-sm
          bg-white/95 backdrop-blur-xl
          border-r border-gray-200/60
          shadow-xl
          z-20
          p-4
          flex flex-col
        "
      >
        {/* 🔷 HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Conversaciones
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔷 ACCIONES */}
        <div className="p-2 border-gray-200 space-y-2">
          <button className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
            <MessageSquare size={16} />
            <span>Nuevo chat</span>
          </button>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              placeholder="Buscar conversaciones..."
              className="
      w-full pl-9 pr-3 py-2
      rounded-lg
      bg-gray-100/70
      text-sm
      outline-none
      focus:ring-2 focus:ring-blue-200
      transition
    "
            />
          </div>
        </div>

        {/* 🔷 LISTA */}
        <div className="mt-4 border-t border-gray-200 pt-3 flex-1 overflow-y-auto pr-1">
          <p className="text-xs text-gray-400 font-semibold tracking-wide mb-2">
            CONVERSACIONES
          </p>

          <div className="space-y-1">
            <div
              className="
                flex justify-between items-start
                px-3 py-2
                rounded-lg
                group cursor-pointer
                transition
                hover:bg-gray-100
              "
            >
              <div className="flex flex-col flex-1">
                <span className="text-sm text-gray-700 line-clamp-2">
                  Problema con impresora HP
                </span>

                <span className="text-[11px] text-gray-400 mt-1">
                  Hoy, 10:30
                </span>
              </div>

              <button
                className="
                  opacity-0 group-hover:opacity-100
                  text-gray-400 hover:text-red-500
                  transition ml-2 mt-1
                "
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
