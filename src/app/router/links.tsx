import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import AuthPage from '@/modules/auth/pages/auth-page'
import NewPasswordPage from '@/modules/auth/pages/new-password-page'
import { HomePage } from '@/modules/home/pages/home-page'
import { PublicGuard } from '@/shared/guards/PublicGuard'

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <PublicGuard>
        <AuthPage />
      </PublicGuard>
    ),
  },
  {
    path: '/new-password',
    element: (
      <PublicGuard>
        <NewPasswordPage />
      </PublicGuard>
    ),
  },
]

export const privateRoutes: RouteObject[] = [
  {
    path: '/home',
    element: <HomePage />,
  },
]
