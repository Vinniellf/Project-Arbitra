import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { SessionLoader } from '@/shared/components/ui/SessionLoader'

type Props = {
  children: ReactNode
}

export const NewPasswordGuard = ({ children }: Props) => {
  const { isAuthenticated, initialLoading, requiresNewPassword } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  // Caso especial:
  // si no hay usuario autenticado normal, pero sí hay reto pendiente,
  // se permite entrar a /new-password.
  if (!isAuthenticated && !requiresNewPassword) {
    return <Navigate to="/login" replace />
  }

  if (!requiresNewPassword) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
