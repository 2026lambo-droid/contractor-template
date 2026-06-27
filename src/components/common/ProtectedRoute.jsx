import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: 'var(--bg)' }}>
      <div className="spinner spinner-lg" />
    </div>
  )

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) {
    const home = user.role === 'vendor' ? '/vendor/dashboard'
      : user.role === 'driver' ? '/driver/dashboard'
      : user.role === 'admin' ? '/admin'
      : '/home'
    return <Navigate to={home} replace />
  }
  return children
}
