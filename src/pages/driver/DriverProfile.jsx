import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, CreditCard, Star, Shield, LogOut, Save, Zap, X, CheckCircle } from 'lucide-react'
import { AppHeader } from '../../components/common/AppHeader'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { formatPrice } from '../../utils/formatters'

export function DriverProfile() {
  const { user, logout, updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [payoutModal, setPayoutModal] = useState(false)
  const [payoutStep, setPayoutStep] = useState('confirm') // confirm | processing | done
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

  const startInstantPayout = async () => {
    setPayoutStep('processing')
    await new Promise(r => setTimeout(r, 1800))
    setPayoutStep('done')
  }

  const closePayoutModal = () => {
    setPayoutModal(false)
    setPayoutStep('confirm')
    if (payoutStep === 'done') toast('$284.75 deposited to Chase ••••4521', 'success')
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
          <button className="btn btn-primary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => { setPayoutModal(true); setPayoutStep('confirm') }}>
            <Zap size={12} /> Instant Payout
          </button>
          <button className="btn btn-secondary btn-sm" style={{ flex: 1, fontSize: 12 }} onClick={() => toast('Bank change coming soon', 'info')}>Change Bank</button>
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

      {/* Instant Payout Modal */}
      {payoutModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={payoutStep !== 'processing' ? closePayoutModal : undefined}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '20px 20px 0 0', padding: 24, width: '100%', maxWidth: 430, paddingBottom: 'calc(24px + var(--safe-bottom))' }} onClick={e => e.stopPropagation()}>
            {payoutStep === 'confirm' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800 }}>Instant Payout</h3>
                  <button onClick={closePayoutModal} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
                </div>
                <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: 12, marginBottom: 16, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Available Balance</div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--success)' }}>{formatPrice(284.75)}</div>
                </div>
                <div style={{ padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: 10, marginBottom: 20, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>Destination</span>
                  <span style={{ fontWeight: 700 }}>Chase ••••4521</span>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(232,93,4,0.08)', borderRadius: 10, marginBottom: 20, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Instant deposits arrive within 30 minutes. A $0.50 fee applies for same-day transfers.
                </div>
                <button className="btn btn-primary btn-full" onClick={startInstantPayout}>
                  <Zap size={16} /> Confirm — Get {formatPrice(284.25)} Now
                </button>
              </>
            )}

            {payoutStep === 'processing' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className="spinner" style={{ width: 48, height: 48, borderWidth: 4, margin: '0 auto 16px', borderTopColor: 'var(--primary)' }} />
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Processing Transfer</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sending to Chase ••••4521...</div>
              </div>
            )}

            {payoutStep === 'done' && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={52} color="var(--success)" style={{ margin: '0 auto 16px', display: 'block' }} />
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--success)', marginBottom: 6 }}>{formatPrice(284.25)} Sent!</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>Your funds are on the way to Chase ••••4521. Estimated arrival: 15–30 minutes.</div>
                <button className="btn btn-primary btn-full" onClick={closePayoutModal}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
