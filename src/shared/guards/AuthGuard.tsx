import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'
import { SessionLoader } from '@/modules/auth/components/SessionLoader'

type Props = {
  children: React.ReactNode
}

export const AuthGuard = ({ children }: Props) => {
  const { isAuthenticated, initialLoading } = useAuthContext()

  if (initialLoading) {
    return <SessionLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
