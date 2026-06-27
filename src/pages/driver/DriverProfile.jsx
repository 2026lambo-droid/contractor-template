import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, CreditCard, Star, Shield, LogOut, Save } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatters'

export function DriverProfile() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    vehicle: user?.vehicle || 'Toyota Corolla — Silver',
    licensePlate: user?.licensePlate || '7ABC123',
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    updateUser(form)
    setSaving(false)
    setEditing(false)
    toast('Profile updated', 'success')
  }

  const STATS = [
    { label: 'Total Earned', value: formatPrice(1847.50), color: 'var(--success)' },
    { label: 'Deliveries', value: '148', color: 'var(--primary)' },
    { label: 'Rating', value: '4.97 ⭐', color: 'var(--warning)' },
    { label: 'Miles', value: '1,204', color: 'var(--primary-light)' },
  ]

  return (
    <div className="page animate-fadeIn">
      <AppHeader title="Driver Profile" />

      {/* Avatar */}
      <div style={{ padding: '20px 16px 12px', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--bg-surface)', border: '3px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 32 }}>
          {user?.name?.[0]?.toUpperCase() || '?'}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>{user?.name}</h2>
        <div className={`online-indicator ${user?.isOnline ? 'online' : 'offline'}`} style={{ display: 'inline-flex', marginTop: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: user?.isOnline ? 'var(--success)' : 'var(--text-muted)' }} />
          {user?.isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 16px 16px' }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Vehicle info / edit */}
      {editing ? (
        <div style={{ padding: '0 16px 16px' }}>
          <div className="field">
            <label className="label">Full Name</label>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Phone</label>
            <input className="input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Vehicle (Year, Make, Model, Color)</label>
            <input className="input" value={form.vehicle} onChange={e => set('vehicle', e.target.value)} placeholder="2020 Toyota Corolla — Silver" />
          </div>
          <div className="field">
            <label className="label">License Plate</label>
            <input className="input" value={form.licensePlate} onChange={e => set('licensePlate', e.target.value)} placeholder="7ABC123" style={{ textTransform: 'uppercase' }} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditing(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={save} disabled={saving}>
              {saving ? <span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> : <><Save size={14} /> Save</>}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="card" style={{ margin: '0 16px 12px' }}>
            <div className="list-item">
              <Car size={18} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Vehicle</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.vehicle || 'Toyota Corolla — Silver'}</div>
              </div>
            </div>
            <div className="list-item">
              <Shield size={18} color="var(--text-muted)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>License Plate</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{user?.licensePlate || '7ABC123'}</div>
              </div>
            </div>
          </div>
          <button className="btn btn-secondary" style={{ margin: '0 16px 16px', width: 'calc(100% - 32px)' }} onClick={() => setEditing(true)}>
            Edit Profile & Vehicle
          </button>
        </>
      )}

      {/* Payout settings */}
      <div style={{ margin: '0 16px 16px', padding: 16, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <CreditCard size={16} color="var(--primary)" />
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Payout Account</h3>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🏦</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Chase ••••4521</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Instant deposit available</div>
          </div>
          <span className="chip chip-success" style={{ fontSize: 11 }}>Active</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }}>Instant Payout</button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }}>Change Bank</button>
        </div>
      </div>

      {/* Next payout */}
      <div style={{ margin: '0 16px 16px', padding: '12px 14px', background: 'rgba(34,197,94,0.08)', borderRadius: 'var(--radius)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 600, marginBottom: 2 }}>Next Payout</div>
        <div style={{ fontSize: 20, fontWeight: 800 }}>{formatPrice(284.75)}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Deposits every Monday · Next: Jun 30</div>
      </div>

      {/* Sign out */}
      <div style={{ padding: '0 16px' }}>
        <button className="btn btn-danger btn-full" onClick={() => { logout(); navigate('/login', { replace: true }) }}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', padding: '14px 0' }}>CarneMX Driver App v1.0.0</p>
    </div>
  )
}
