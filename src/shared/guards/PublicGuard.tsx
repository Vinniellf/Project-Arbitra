import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { isAdminUser } from '@/modules/auth/utils/role.utils'

type Props = {
  children: React.ReactNode
}

export const PublicGuard = ({ children }: Props) => {
  const { user, isAuthenticated, initialLoading, requiresNewPassword } = useAuthContext()

  if (initialLoading) return null

  if (requiresNewPassword) {
    return <Navigate to="/new-password" replace />
  }

  if (isAuthenticated) {
    const redirectPath = isAdminUser(user?.groups ?? [])
      ? '/admin'
      : '/home'

    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
