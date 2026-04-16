import { BrowserRouter } from 'react-router-dom'
import { RoutesApp } from './router/routes'
import { AuthProvider } from '@/modules/auth/context/AuthProvider'
import { SessionInactivityManager } from '@/shared/components/session/SessionInactivityManager'
import { UiBlockProvider } from '@/shared/context/ui-block-provider'
import { GlobalBlockOverlay } from '@/shared/components/ui/GlobalBlockOverlay'

function App() {
  return (
    <AuthProvider>
      <UiBlockProvider>
        <BrowserRouter>
          <SessionInactivityManager />
          <RoutesApp />
          <GlobalBlockOverlay />
        </BrowserRouter>
      </UiBlockProvider>
    </AuthProvider>
  )
}

export default App
