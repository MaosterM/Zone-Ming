import '@fontsource-variable/big-shoulders-display'
import '@fontsource-variable/archivo'
import '@fontsource/share-tech-mono/latin-400.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
