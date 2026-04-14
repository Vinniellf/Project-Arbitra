import { useEffect, useRef, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Building2,
  LogOut,
  MoreVertical,
  Bot,
} from 'lucide-react'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'

type SidebarProps = {
  open: boolean
  setOpen: (value: boolean) => void
  setView: (view: string) => void
  currentView: string
  onLogout: () => void
}

type MenuItem = {
  icon: typeof LayoutDashboard
  label: string
  view: string
}

export default function Sidebar({
  open,
  setOpen,
  setView,
  currentView,
  onLogout,
}: SidebarProps) {
  const { user } = useAuthContext()

  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  const menuItems: MenuItem[] = [
    { icon: Users, label: 'Usuarios', view: 'usuarios' },
    { icon: Building2, label: 'Empresas', view: 'empresas' },
  ]

  const handleLogout = () => {
    setAccountMenuOpen(false)
    onLogout()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <aside
      className={`
        fixed top-0 left-0 z-50
        h-screen w-62.5
        bg-[#f8fafc]
        border-r border-slate-200
        flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      <div className="px-4 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-2xl bg-violet-600 text-white shadow-sm
            "
          >
            <Bot size={20} strokeWidth={2.1} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight text-slate-900">
              PEPE SYSTEM
            </p>
            <p className="text-xs text-slate-500">Panel administrativo</p>
          </div>
        </div>
      </div>

      <div className="px-3 pt-1">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.view

            return (
              <button
                key={item.view}
                onClick={() => {
                  setView(item.view)
                  setOpen(false)
                }}
                className={`
                  group flex w-full items-center gap-3
                  rounded-xl px-3 py-2.5
                  text-sm font-medium transition-all
                  ${
                    isActive
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }
                `}
              >
                <div
                  className={`
                    flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all
                    ${
                      isActive
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-slate-500'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={1.9} />
                </div>

                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-3">
        <div ref={accountMenuRef} className="relative">
          <div
            className="
              flex items-center gap-3
              rounded-2xl bg-slate-100/80
              px-3 py-3
            "
          >
            <div
              className="
                flex h-10 w-10 shrink-0 items-center justify-center
                rounded-full bg-linear-to-br from-sky-500 to-blue-600
                text-sm font-semibold text-white
              "
            >
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || user?.email?.split('@')[0] || 'Usuario'}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email ?? 'Sin correo'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAccountMenuOpen((prev) => !prev)}
              className="
                flex h-8 w-8 shrink-0 items-center justify-center
                rounded-lg text-slate-500
                transition hover:bg-white hover:text-slate-900
              "
              aria-label="Abrir menú de cuenta"
            >
              <MoreVertical size={16} />
            </button>
          </div>

          {accountMenuOpen && (
            <div
              className="
                absolute bottom-[calc(100%+10px)] right-0
                min-w-42.5
                overflow-hidden rounded-xl
                border border-slate-200 bg-white
                shadow-lg shadow-slate-900/10
              "
            >
              <button
                onClick={handleLogout}
                className="
                  flex w-full items-center gap-3 px-3 py-2.5
                  text-sm font-medium text-slate-700
                  transition hover:bg-red-50 hover:text-red-600
                "
              >
                <LogOut size={16} />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
