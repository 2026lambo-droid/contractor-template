import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, Store, Clock, MapPin, Package } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import { DELIVERY_ZONES } from '../../utils/constants'

const STEPS = [
  { id: 'profile', label: 'Store Profile', icon: Store },
  { id: 'hours', label: 'Business Hours', icon: Clock },
  { id: 'zones', label: 'Delivery Zones', icon: MapPin },
  { id: 'product', label: 'First Product', icon: Package },
]

const DAY_ABBR = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function VendorOnboarding() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [profile, setProfile] = useState({ storeName: user?.vendorName || '', phone: user?.phone || '', address: '', city: 'San Jose', description: '' })
  const [hours, setHours] = useState({ open: '07:00', close: '19:00', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] })
  const [zones, setZones] = useState([])
  const [product, setProduct] = useState({ name: '', category: 'carne-asada', pricePerLb: '', description: '' })

  const toggleDay = (d) => setHours(h => ({ ...h, days: h.days.includes(d) ? h.days.filter(x => x !== d) : [...h.days, d] }))
  const toggleZone = (z) => setZones(prev => prev.includes(z) ? prev.filter(x => x !== z) : [...prev, z])

  const next = async () => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    updateUser({ onboarded: true, storeName: profile.storeName })
    localStorage.setItem('carnemx_onboarded', 'true')
    toast('Location set up! Welcome to El Rincón 🎉', 'success')
    navigate('/vendor/dashboard', { replace: true })
  }

  const canNext = () => {
    if (step === 0) return profile.storeName && profile.phone && profile.address
    if (step === 1) return hours.days.length > 0
    if (step === 2) return zones.length > 0
    if (step === 3) return product.name && product.pricePerLb > 0
    return true
  }

  return (
    <div className="page-no-nav" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '48px 20px 24px', background: 'linear-gradient(180deg, rgba(232,93,4,0.08) 0%, transparent 100%)' }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🥩</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Set Up Your Store</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Step {step + 1} of {STEPS.length} — {STEPS[step].label}</p>
      </div>

      {/* Step dots */}
      <div style={{ display: 'flex', gap: 6, padding: '0 20px 24px' }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ flex: 1, height: 3, borderRadius: 100, background: i <= step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Step content */}
      <div style={{ flex: 1, padding: '0 20px', overflow: 'auto' }}>
        {step === 0 && (
          <>
            <div className="field">
              <label className="label">Store Name *</label>
              <input className="input" placeholder="La Carnicería El Rancho" value={profile.storeName} onChange={e => setProfile(p => ({ ...p, storeName: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Phone *</label>
              <input className="input" type="tel" placeholder="(408) 555-0000" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Street Address *</label>
              <input className="input" placeholder="1420 Story Rd" value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">City</label>
              <select className="select" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))}>
                {DELIVERY_ZONES.map(z => <option key={z.id} value={z.city}>{z.city}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Tell customers what makes your carnicería special..." value={profile.description} onChange={e => setProfile(p => ({ ...p, description: e.target.value }))} style={{ resize: 'none', lineHeight: 1.5 }} />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Select which days you're open</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {DAY_ABBR.map(d => (
                <button key={d} onClick={() => toggleDay(d)} style={{
                  padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  background: hours.days.includes(d) ? 'rgba(232,93,4,0.15)' : 'var(--bg-surface)',
                  border: `1.5px solid ${hours.days.includes(d) ? 'var(--primary)' : 'var(--border)'}`,
                  color: hours.days.includes(d) ? 'var(--primary-light)' : 'var(--text-secondary)',
                }}>
                  {d}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label className="label">Opening Time</label>
                <input className="input" type="time" value={hours.open} onChange={e => setHours(h => ({ ...h, open: e.target.value }))} />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label className="label">Closing Time</label>
                <input className="input" type="time" value={hours.close} onChange={e => setHours(h => ({ ...h, close: e.target.value }))} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Choose the areas you can deliver to</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DELIVERY_ZONES.map(zone => (
                <div key={zone.id} onClick={() => toggleZone(zone.city)} className="list-item" style={{ cursor: 'pointer', background: zones.includes(zone.city) ? 'rgba(232,93,4,0.06)' : 'transparent', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{zone.city}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{zone.region}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${zones.includes(zone.city) ? 'var(--primary)' : 'var(--border)'}`, background: zones.includes(zone.city) ? 'var(--primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {zones.includes(zone.city) && <span style={{ color: 'white', fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Add your first product to get started</p>
            <div className="field">
              <label className="label">Product Name *</label>
              <input className="input" placeholder="Carne Asada Premium" value={product.name} onChange={e => setProduct(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Category</label>
              <select className="select" value={product.category} onChange={e => setProduct(p => ({ ...p, category: e.target.value }))}>
                <option value="carne-asada">Carne Asada</option>
                <option value="chorizo">Chorizo</option>
                <option value="short-ribs">Short Ribs / Costillas</option>
                <option value="al-pastor">Al Pastor</option>
                <option value="carnitas">Carnitas</option>
                <option value="chicken">Chicken / Pollo</option>
                <option value="tripas">Tripas</option>
                <option value="lengua">Lengua</option>
              </select>
            </div>
            <div className="field">
              <label className="label">Price per pound ($) *</label>
              <input className="input" type="number" step="0.50" min="1" placeholder="12.99" value={product.pricePerLb} onChange={e => setProduct(p => ({ ...p, pricePerLb: e.target.value }))} />
            </div>
            <div className="field">
              <label className="label">Description</label>
              <textarea className="input" rows={3} placeholder="Describe your product..." value={product.description} onChange={e => setProduct(p => ({ ...p, description: e.target.value }))} style={{ resize: 'none', lineHeight: 1.5 }} />
            </div>
          </>
        )}
      </div>

      {/* Footer nav */}
      <div style={{ padding: '16px 20px 32px', display: 'flex', gap: 12 }}>
        {step > 0 && (
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>Back</button>
        )}
        <button
          className="btn btn-gradient"
          style={{ flex: 2, opacity: canNext() ? 1 : 0.5 }}
          disabled={!canNext() || saving}
          onClick={next}
        >
          {saving ? (
            <><span className="spinner spinner-sm" style={{ borderTopColor: 'white' }} /> Setting up...</>
          ) : step === STEPS.length - 1 ? (
            <>Launch Store <CheckCircle size={16} /></>
          ) : (
            <>Continue <ChevronRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  )
}
