import { Route, Routes } from 'react-router-dom'
import { publicRoutes, privateRoutes } from './links'
import { MainLayout } from '../layouts/MainLayout'
import { AuthGuard } from '@/shared/guards/AuthGuard'

export const RoutesApp = () => {
  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

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
    </Routes>
  )
}
