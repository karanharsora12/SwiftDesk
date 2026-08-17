import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { App } from './App'
import { SettingsProvider } from './hooks/use-settings'
import './styles.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('SwiftDesk could not find the application root.')
}

createRoot(rootElement).render(
  <StrictMode>
    <HashRouter>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HashRouter>
  </StrictMode>
)
