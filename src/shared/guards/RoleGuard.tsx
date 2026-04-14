import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { SessionLoader } from '@/shared/components/ui/SessionLoader'
import { hasRole } from '@/modules/auth/utils/role.utils'

type Props = {
  children: ReactNode
  allowedRoles: string[]
}

export const RoleGuard = ({ children, allowedRoles }: Props) => {
  const { user, isAuthenticated, initialLoading } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const allowed = hasRole(user?.groups ?? [], allowedRoles)

  if (!allowed) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
