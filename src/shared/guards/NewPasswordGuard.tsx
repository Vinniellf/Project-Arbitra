import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { SessionLoader } from '@/shared/components/ui/SessionLoader'
import { ROUTES } from '@/shared/constants/routes'

type Props = {
  children: ReactNode
}

export const NewPasswordGuard = ({ children }: Props) => {
  const { isAuthenticated, initialLoading, requiresNewPassword } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  // Caso especial:
  // si no hay sesión normal, pero sí existe reto pendiente,
  // se permite entrar a /new-password.
  if (requiresNewPassword) {
    return <>{children}</>
  }

  // Si ya no necesita cambiar contraseña pero sí está autenticado,
  // lo enviamos al home.
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  // Si no está autenticado ni tiene reto pendiente,
  // vuelve al login.
  return <Navigate to={ROUTES.LOGIN} replace />
}
