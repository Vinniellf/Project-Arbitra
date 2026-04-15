import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { SessionLoader } from '@/shared/components/ui/SessionLoader'

type Props = {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const { isAuthenticated, initialLoading, requiresNewPassword } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si tiene contraseña temporal pendiente,
  // lo forzamos a completar el cambio primero
  if (requiresNewPassword) {
    return <Navigate to="/new-password" replace />
  }

  return <>{children}</>
}
