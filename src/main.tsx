import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import './index.css'

import { Amplify } from 'aws-amplify'
import amplifyConfig from './shared/config/amplify.config'

Amplify.configure(amplifyConfig)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
