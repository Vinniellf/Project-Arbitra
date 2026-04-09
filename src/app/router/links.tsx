import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import AuthPage from '@/modules/auth/pages/auth-page'
import NewPasswordPage from '@/modules/auth/pages/new-password-page'
import { HomePage } from '@/modules/home/pages/home-page'
import Admin from '@/modules/admin/pages/Admin'

import { PublicGuard } from '@/shared/guards/PublicGuard'
import { RoleGuard } from '@/shared/guards/RoleGuard'

// RUTAS PÚBLICAS (login, reset, etc.)
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

// RUTAS PRIVADAS GENERALES (usan MainLayout)
export const privateRoutes: RouteObject[] = [
  {
    path: '/home',
    element: <HomePage />,
  },
]

// RUTAS ADMIN (con control de roles)
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['admin', 'superadmin']}>
        <Admin />
      </RoleGuard>
    ),
    children: [
      // futuras rutas internas del admin
      // { index: true, element: <DashboardView /> },
      // { path: 'usuarios', element: <UsuariosView /> },
    ],
  },
]
