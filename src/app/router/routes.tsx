import { Route, Routes } from 'react-router-dom'
import { publicRoutes, privateRoutes, adminRoutes } from './links'
import { MainLayout } from '../layouts/MainLayout'
import { AuthGuard } from '@/shared/guards/AuthGuard'

export const RoutesApp = () => {
  return (
    <Routes>

      {/* RUTAS PÚBLICAS */}
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      {/* RUTAS PRIVADAS CON LAYOUT PRINCIPAL */}
      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        {privateRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* RUTAS ADMIN (fuera del MainLayout) */}
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children?.map((child, index) => (
            <Route
              key={child.path ?? `admin-${index}`}
              index={child.index}
              path={child.path}
              element={child.element}
            />
          ))}
        </Route>
      ))}

    </Routes>
  )
}
