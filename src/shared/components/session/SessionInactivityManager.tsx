import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import LoadingScreen from '@/shared/components/ui/LoadingScreen'
import { ROUTES } from '@/shared/constants/routes'
import { useInactivityLogout } from '@/shared/hooks/useInactivityLogout'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'

export const SessionInactivityManager = () => {
  const [showInactivityLoading, setShowInactivityLoading] = useState(false)

  const { isAuthenticated, initialLoading, requiresNewPassword, logout } =
    useAuthContext()

  const navigate = useNavigate()
  const location = useLocation()

  const isPublicRoute =
    location.pathname === ROUTES.LOGIN ||
    location.pathname === ROUTES.FORGOT_PASSWORD

  useEffect(() => {
    if (isPublicRoute && showInactivityLoading) {
      setShowInactivityLoading(false)
    }
  }, [isPublicRoute, showInactivityLoading])

  const enabled =
    !initialLoading &&
    isAuthenticated &&
    !requiresNewPassword &&
    !isPublicRoute &&
    !showInactivityLoading

  const handleTimeout = useCallback(() => {
    if (isPublicRoute) return
    setShowInactivityLoading(true)
  }, [isPublicRoute])

  useInactivityLogout({
    enabled,
    onTimeout: handleTimeout,
  })

  if (showInactivityLoading) {
    return (
      <LoadingScreen
        variant="inactivity"
        onFinish={async () => {
          try {
            await logout()
          } finally {
            setShowInactivityLoading(false)

            navigate(ROUTES.LOGIN, {
              replace: true,
              state: {
                successMessage:
                  'Tu sesión se cerró automáticamente por inactividad.',
              },
            })
          }
        }}
      />
    )
  }

  return null
}
