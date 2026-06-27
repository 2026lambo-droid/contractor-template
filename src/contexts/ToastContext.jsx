import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position: 'fixed', bottom: 80, left: 16, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div key={t.id} onClick={() => dismiss(t.id)} style={{
            background: t.type === 'error' ? '#EF4444' : t.type === 'success' ? '#22C55E' : '#1A120B',
            color: '#FFF8F0',
            padding: '12px 16px',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.1)',
            pointerEvents: 'auto',
            cursor: 'pointer',
            animation: 'slideUp 0.3s ease',
          }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
