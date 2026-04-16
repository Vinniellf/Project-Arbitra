import { BrowserRouter } from 'react-router-dom'
import { RoutesApp } from './router/routes'
import { AuthProvider } from '@/modules/auth/context/AuthProvider'
import { SessionInactivityManager } from '@/shared/components/session/SessionInactivityManager'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SessionInactivityManager />
        <RoutesApp />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
