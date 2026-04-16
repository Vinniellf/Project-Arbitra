import { Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'

import { Header } from '@/shared/components/layout/Header'
import LoadingScreen from '@/shared/components/ui/LoadingScreen'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { ROUTES } from '@/shared/constants/routes'

export const MainLayout = () => {
  const [showLogoutLoading, setShowLogoutLoading] = useState(false)
  const { logout } = useAuthContext()
  const navigate = useNavigate()

  const handleLogout = () => {
    setShowLogoutLoading(true)
  }

  if (showLogoutLoading) {
    return (
      <LoadingScreen
        variant="logout"
        onFinish={async () => {
          try {
            await logout()
          } finally {
            navigate(ROUTES.LOGIN, { replace: true })
          }
        }}
      />
    )
  }

  return (
    <div
      className="
        min-h-screen flex flex-col
        bg-linear-to-br
        from-[#aae0e9]
        via-[#6db8f5]
        to-[#b7abec]
      "
    >
      <Header onLogout={handleLogout} />

      <main className="flex-1 flex justify-center p-4">
        <div className="w-full max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
