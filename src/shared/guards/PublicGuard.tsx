import { Navigate } from 'react-router-dom'
import { useAuthContext } from '@/modules/auth/hooks/useAuthContext'

type Props = {
  children: React.ReactNode
}

export const PublicGuard = ({ children }: Props) => {
  const { isAuthenticated, initialLoading } = useAuthContext()

  if (initialLoading) return null

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
