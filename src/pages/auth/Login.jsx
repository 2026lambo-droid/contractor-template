import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { APP_NAME } from '../../utils/constants'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const demoAccounts = [
    { label: '🛒 Customer Demo', email: 'customer@demo.com', password: 'demo123' },
    { label: '🏪 Vendor Demo', email: 'vendor@demo.com', password: 'demo123' },
    { label: '🚗 Driver Demo', email: 'driver@demo.com', password: 'demo123' },
  ]

  const handleLogin = async (e) => {
    e?.preventDefault()
    if (!email || !password) { toast('Please fill in all fields', 'error'); return }
    setLoading(true)
    try {
      const user = await login(email, password)
      const home = user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'driver' ? '/driver/dashboard' : '/home'
      navigate(home, { replace: true })
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = (acct) => {
    setEmail(acct.email)
    setPassword(acct.password)
    login(acct.email, acct.password).then(user => {
      const home = user.role === 'vendor' ? '/vendor/dashboard' : user.role === 'driver' ? '/driver/dashboard' : '/home'
      navigate(home, { replace: true })
    })
  }

  return (
    <div className="page-no-nav" style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 280, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1558030006-450675393462?w=800&auto=format&fit=crop"
          alt="Grilled meats"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(15,10,8,0.4) 0%, rgba(15,10,8,0.95) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
          <h1 className="display" style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
            <span className="fire-text">{APP_NAME}</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Tu Carnicería, Entregada</p>
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Sign in to order fresh carne asada</p>

        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} autoComplete="email" />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="input" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 44 }} autoComplete="current-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-gradient btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : 'Sign In'}
          </button>
        </form>

        <div className="divider" style={{ margin: '20px 0' }} />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 10 }}>Try a demo account:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {demoAccounts.map(acct => (
            <button key={acct.email} className="btn btn-secondary btn-sm" onClick={() => quickLogin(acct)} style={{ justifyContent: 'flex-start', fontSize: 13 }}>
              {acct.label}
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)', marginTop: 24 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
