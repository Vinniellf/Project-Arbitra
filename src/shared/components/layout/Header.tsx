import { useState } from 'react'
import { ChevronDown, LogOut, User, Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import logoEmpresa from '@/assets/logo.webp'
import { useAuthContext } from '@/modules/auth/context/useAuthContext'

export const Header = () => {
  const { user, logout } = useAuthContext()

  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="w-full flex justify-center relative z-50">
      <header
        className="
          mt-4
          w-[95%] max-w-7xl
          bg-white/90 backdrop-blur-2xl
          border border-white/30
          rounded-2xl shadow-lg shadow-black/5
          px-4 sm:px-6 py-3
          flex items-center justify-between
        "
      >
        {/* LOGO */}
        <div
          onClick={() => navigate('/home')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <img
            src={logoEmpresa}
            alt="Misión Tecnológica"
            className="
              h-14 w-auto object-contain
              drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]
            "
          />
        </div>

        {/* MENU MOBILE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            md:hidden
            p-2 rounded-lg
            hover:bg-white/60
            transition
          "
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* USER */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setOpen(!open)}
            className="
              flex items-center gap-2
              bg-white/60 backdrop-blur-md
              border border-white/30
              px-2 py-1.5 pr-3
              rounded-full
              hover:bg-white/80
              transition
              shadow-sm
            "
          >
            {/* Avatar */}
            <div className="
              w-8 h-8
              bg-linear-to-br from-[#5aa9e6] to-[#4a8fd9]
              text-white rounded-full
              flex items-center justify-center
              text-sm font-medium
            ">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <ChevronDown
              size={16}
              className={`transition ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {/* DROPDOWN */}
          <div
            className={`
              absolute right-0 mt-6 w-64
              bg-white backdrop-blur-xl
              border border-white/30
              rounded-2xl
              shadow-xl shadow-black/10
              overflow-hidden
              transition-all duration-200
              ${open
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95 pointer-events-none'
              }
            `}
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-800 truncate">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {user?.email || 'correo@ejemplo.com'}
              </p>
            </div>

            <div className="py-1">
              <button
                onClick={() => navigate('/profile')}
                className="
                  flex items-center gap-2 px-4 py-2.5 w-full
                  text-sm text-gray-700
                  hover:bg-gray-100/60 transition
                "
              >
                <User size={16} />
                Mi perfil
              </button>

              <button
                onClick={handleLogout}
                className="
                  flex items-center gap-2 px-4 py-2.5 w-full
                  text-sm text-red-500
                  hover:bg-red-50 transition
                "
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40">
          <div className="
            absolute top-24 left-1/2 -translate-x-1/2
            w-[90%] max-w-sm
            bg-white rounded-xl shadow-lg p-4
          ">
            <div className="flex flex-col gap-4 text-gray-700">
              <hr />
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <User size={16} /> Mi perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500"
              >
                <LogOut size={16} /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
