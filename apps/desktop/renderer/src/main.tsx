import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { SettingsProvider } from './hooks/use-settings'
import './styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('SwiftDesk could not find the application root.')
}

createRoot(rootElement).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>
)
