import { useState } from 'react'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Sidebar from '../components/layout/Sidebar'
import UsuariosView from '../views/UsuariosView'
import EmpresasView from '../views/EmpresasView'

import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import LoadingScreen from '@/shared/components/ui/LoadingScreen'

type AdminView = 'dashboard' | 'usuarios' | 'empresas'

export default function Admin() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<AdminView>('dashboard')
  const [showLogoutLoading, setShowLogoutLoading] = useState(false)

  const { logout } = useAuthContext()
  const navigate = useNavigate()

  const renderView = () => {
    switch (view) {
      case 'usuarios':
        return <UsuariosView />
      case 'empresas':
        return <EmpresasView />
      default:
        return <UsuariosView />
    }
  }

  if (showLogoutLoading) {
    return (
      <LoadingScreen
        variant="logout"
        onFinish={async () => {
          try {
            await logout()
          } finally {
            navigate('/login', { replace: true })
          }
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        open={open}
        setOpen={setOpen}
        setView={(value) => setView(value as AdminView)}
        currentView={view}
        onLogout={() => setShowLogoutLoading(true)}
      />

      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[1px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-h-screen flex-col md:ml-68">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl md:hidden">
          <div className="flex h-14 items-center px-4">
            <button
              onClick={() => setOpen(true)}
              className="
                rounded-xl p-2 text-slate-600
                transition hover:bg-slate-100 hover:text-slate-900
              "
              aria-label="Abrir menú"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-345 px-3 py-4 md:px-4 md:py-5">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}
