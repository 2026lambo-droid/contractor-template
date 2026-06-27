import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Register service worker for PWA / push notifications
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).then((reg) => {
      // Listen for navigation messages from SW (notification clicks)
      navigator.serviceWorker.addEventListener('message', ({ data }) => {
        if (data?.type === 'NAVIGATE' && data.url) {
          window.location.href = data.url
        }
      })
    }).catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
