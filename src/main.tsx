import { createRoot } from 'react-dom/client'
import './index.css'
import './hotfix.css'
import App from './App'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL ?? '/'
    navigator.serviceWorker
      .register(`${base}sw.js`, { scope: base })
      .catch(() => undefined)
  })
}

const root = document.getElementById('root')
if (!root) throw new Error('Root element #root not found in document')
createRoot(root).render(<App />)
