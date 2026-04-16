import { Navigate } from 'react-router-dom'

import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { isAdminUser } from '@/modules/auth/utils/role.utils'
import { SessionLoader } from '@/shared/components/ui/SessionLoader'
import { ROUTES } from '@/shared/constants/routes'

type Props = {
  children: React.ReactNode
}

export const PublicGuard = ({ children }: Props) => {
  const { user, isAuthenticated, initialLoading, requiresNewPassword } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  if (requiresNewPassword) {
    return <Navigate to={ROUTES.NEW_PASSWORD} replace />
  }

  if (isAuthenticated) {
    const redirectPath = isAdminUser(user?.groups ?? [])
      ? ROUTES.ADMIN
      : ROUTES.HOME

    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}
