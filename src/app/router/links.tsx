import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import AuthPage from '@/modules/auth/pages/auth-page'
import NewPasswordPage from '@/modules/auth/pages/new-password-page'
import { HomePage } from '@/modules/home/pages/home-page'
import Admin from '@/modules/admin/pages/Admin'

import { PublicGuard } from '@/shared/guards/PublicGuard'
import { RoleGuard } from '@/shared/guards/RoleGuard'
import { NewPasswordGuard } from '@/shared/guards/NewPasswordGuard'

// RUTAS PÚBLICAS
// Solo accesibles si NO estás autenticado
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
]

// RUTAS PRIVADAS SIN LAYOUT
// Casos especiales como new-password
// NO usan MainLayout
export const standalonePrivateRoutes: RouteObject[] = [
  {
    path: '/new-password',
    element: (
      <NewPasswordGuard>
        <NewPasswordPage />
      </NewPasswordGuard>
    ),
  },
]

// RUTAS PRIVADAS CON LAYOUT
// Estas sí usan MainLayout + AuthGuard
export const privateRoutes: RouteObject[] = [
  {
    path: '/home',
    element: <HomePage />,
  },
]

// RUTAS ADMIN (con roles)
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <RoleGuard allowedRoles={['admin', 'superadmin']}>
        <Admin />
      </RoleGuard>
    ),
    children: [
      // aquí irán subrutas del admin en el futuro
      // { index: true, element: <Dashboard /> },
      // { path: 'usuarios', element: <Usuarios /> },
    ],
  },
]
