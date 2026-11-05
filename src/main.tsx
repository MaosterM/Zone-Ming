import '@fontsource-variable/big-shoulders-display'
import '@fontsource-variable/archivo'
import '@fontsource/share-tech-mono/latin-400.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const FONT_WAIT_MS = 800
const FONTS = ['900 1em "Big Shoulders Display Variable"', '400 1em "Archivo Variable"', '400 1em "Share Tech Mono"']

function render() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Rendering once the fonts have arrived stops the text reflowing when they swap in. They are
// preloaded in index.html, and the timeout means a slow font can never hold the page back.
Promise.race([
  Promise.all(FONTS.map((font) => document.fonts.load(font))),
  new Promise((resolve) => setTimeout(resolve, FONT_WAIT_MS)),
]).finally(render)
