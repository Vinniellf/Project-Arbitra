import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { SessionLoader } from '@/shared/components/ui/SessionLoader'
import { hasRole } from '@/modules/auth/utils/role.utils'
import { ROUTES } from '@/shared/constants/routes'

type Props = {
  children: ReactNode
  allowedRoles: string[]
}

export const RoleGuard = ({ children, allowedRoles }: Props) => {
  const { user, isAuthenticated, initialLoading, requiresNewPassword } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (requiresNewPassword) {
    return <Navigate to={ROUTES.NEW_PASSWORD} replace />
  }

  const allowed = hasRole(user?.groups ?? [], allowedRoles)

  if (!allowed) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <>{children}</>
}
