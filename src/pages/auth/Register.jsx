import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Store, Truck } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { USER_ROLES } from '../../utils/constants'

const ROLES = [
  { id: USER_ROLES.CUSTOMER, label: 'Customer', desc: 'Order fresh meats delivered to my door', icon: '🛒' },
  { id: USER_ROLES.VENDOR, label: 'Location Manager', desc: 'Manage my El Rincón location and orders', icon: '🏪' },
  { id: USER_ROLES.DRIVER, label: 'Driver', desc: 'Deliver orders and earn money', icon: '🚗' },
]

export function Register() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', vendorName: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { toast('Please fill in all fields', 'error'); return }
    if (form.password.length < 6) { toast('Password must be at least 6 characters', 'error'); return }
    if (role === USER_ROLES.VENDOR && !form.vendorName) { toast('Please enter your business name', 'error'); return }
    setLoading(true)
    try {
      const user = await register({ ...form, role })
      const home = role === 'vendor' ? '/vendor/dashboard' : role === 'driver' ? '/driver/dashboard' : '/home'
      navigate(home, { replace: true })
      toast('Welcome to El Rincón!', 'success')
    } catch (err) {
      toast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-no-nav" style={{ padding: '0 20px 40px' }}>
      {/* Header */}
      <div style={{ padding: '20px 0 16px' }}>
        <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: 14 }}>← Back to Sign In</Link>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Create Account</h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Join the El Rincón family</p>

      {step === 1 ? (
        <>
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>I want to join as a...</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: 16, borderRadius: 'var(--radius)',
                background: role === r.id ? 'rgba(249,156,76,0.1)' : 'var(--bg-card)',
                border: `1.5px solid ${role === r.id ? 'var(--primary)' : 'var(--border)'}`,
                cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
              }}>
                <span style={{ fontSize: 28 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{r.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.desc}</div>
                </div>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-full" disabled={!role} onClick={() => setStep(2)}>
            Continue
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Full Name</label>
            <input className="input" placeholder="Maria García" value={form.name} onChange={e => set('name', e.target.value)} autoComplete="name" />
          </div>
          {role === USER_ROLES.VENDOR && (
            <div className="field">
              <label className="label">Business Name</label>
              <input className="input" placeholder="La Carnicería El Rancho" value={form.vendorName} onChange={e => set('vendorName', e.target.value)} />
            </div>
          )}
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Back</button>
            <button type="submit" className="btn btn-gradient" disabled={loading} style={{ flex: 2 }}>
              {loading ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : 'Create Account'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
